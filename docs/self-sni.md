---
title: "Self-SNI для VLESS + Reality: свой домен вместо чужого"
description: "Пошаговый гайд для новичков: бесплатный домен на DuckDNS, сайт-прикрытие на nginx, сертификат Let's Encrypt и настройка Reality в 3X-UI так, чтобы IP, домен и сертификат совпадали."
head:
  - - meta
    - name: keywords
      content: "self-sni, selfsteal, vless, reality, 3x-ui, duckdns, nginx, acme.sh, lets encrypt, домен маскировки, sni, decoy, xtls-rprx-vision"
---

# 🔐 Self-SNI для VLESS + Reality: свой домен вместо чужого

## Что это и зачем {#why}

**Self-SNI** — это когда вместо чужого сайта (вроде `rolex.com`) для маскировки используется **ваш собственный домен и ваш сайт**.

Тогда IP сервера, домен и сертификат совпадают друг с другом, и снаружи это выглядит максимально естественно: наблюдатель видит домен, который действительно живёт на этом IP и действительно отдаёт свой сертификат.

::: tip Чем это лучше чужого домена
При маскировке под чужой сайт всегда остаётся несоответствие: домен указывает на один IP, а трафик идёт на другой. Здесь такого расхождения нет по определению. Про подбор чужого домена — **[XRay: домен маскировки](/xray-tuning#domain)**.
:::

## Шаг 1. Регистрируем бесплатный домен {#domain}

1.  Откройте **[duckdns.org](https://www.duckdns.org)** и войдите через GitHub или Google.
2.  В поле создания домена введите любое имя — например `mysite`. Получится `mysite.duckdns.org`.
3.  В поле **IP** впишите внешний IP вашего VPS и нажмите **update ip**.

Проверьте, что домен указывает на сервер:

```bash
ping mysite.duckdns.org
```

Должен ответить IP вашего сервера.

## Шаг 2. Готовим сайт-прикрытие {#decoy}

Подключитесь к серверу по SSH (см. **[Управление сервером](/server-management#ssh)**) и создайте папку с сайтом:

```bash
mkdir -p /var/www/decoy
nano /var/www/decoy/index.html
```

Вставьте любой HTML-код сайта и сохраните: `Ctrl+O` → `Enter` → `Ctrl+X`.

::: tip Нет своего сайта
Готовую HTML-страницу под любую нейтральную тематику — личный блог, портфолио, документация проекта — можно сгенерировать нейросетью: опишите, какая атмосфера ближе, и вставьте полученный код сюда. Страница должна выглядеть как обычный маленький сайт, а не как заглушка.
:::

## Шаг 3. Ставим nginx и выпускаем сертификат {#cert}

```bash
apt install -y nginx
curl https://get.acme.sh | sh -s email=ваш@email.com
source ~/.bashrc
```

Выпускаем сертификат Let's Encrypt. Порт 80 должен быть свободен, поэтому на минуту останавливаем nginx:

```bash
systemctl stop nginx
~/.acme.sh/acme.sh --issue -d mysite.duckdns.org --standalone --httpport 80
systemctl start nginx
```

Копируем сертификат в удобное место:

```bash
mkdir -p /root/cert/mysite.duckdns.org
~/.acme.sh/acme.sh --install-cert -d mysite.duckdns.org \
  --key-file /root/cert/mysite.duckdns.org/privkey.pem \
  --fullchain-file /root/cert/mysite.duckdns.org/fullchain.pem \
  --reloadcmd "systemctl reload nginx"
```

::: info Продление произойдёт само
Сертификаты Let's Encrypt живут 90 дней. `acme.sh` при установке заводит задание в cron и продлевает их автоматически, а `--reloadcmd` перезагружает nginx с новым сертификатом. Отдельно ничего делать не нужно.
:::

## Шаг 4. Настраиваем nginx {#nginx}

Сайт должен слушать **только внутри сервера**:

```bash
cat > /etc/nginx/sites-available/decoy << 'EOF'
server {
    listen 127.0.0.1:8443 ssl http2;
    server_name mysite.duckdns.org;
    ssl_certificate /root/cert/mysite.duckdns.org/fullchain.pem;
    ssl_certificate_key /root/cert/mysite.duckdns.org/privkey.pem;
    ssl_protocols TLSv1.3;
    root /var/www/decoy;
    index index.html;
}
EOF
ln -sf /etc/nginx/sites-available/decoy /etc/nginx/sites-enabled/decoy
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

Проверяем, что сайт действительно отдаётся:

```bash
curl -H "Host: mysite.duckdns.org" https://127.0.0.1:8443 -k
```

Должен вернуться ваш HTML.

## Почему 443 и сайт не конфликтуют {#ports}

Это самый частый источник путаницы, поэтому разберём отдельно.

**Наружу порт 443 торчит ровно один раз, и слушает его Xray, а не сайт.**

```text
443  — виден из интернета            8443 — только 127.0.0.1
 │                                    │
 ▼                                    ▼
Xray (Reality)                      nginx  →  decoy-сайт
 │
 ├─ клиент со своим ключом  →  туннель наружу, в интернет
 └─ любой другой клиент     →  127.0.0.1:8443  →  nginx отдаёт сайт
```

| Порт | Кто слушает | Доступен снаружи |
| :--- | :--- | :--- |
| **443** | Xray (Reality) | ✅ Да — единственная внешняя точка входа |
| **8443** | nginx | ❌ Нет — слушает строго `127.0.0.1`, снаружи порт не виден |

Именно поэтому в конфиге написано `listen 127.0.0.1:8443`, а не просто `listen 8443`. Разница критична:

*   `127.0.0.1:8443` — «слушай только запросы от самого себя»;
*   `8443` или `0.0.0.0:8443` — «слушай откуда угодно», и вот тогда наружу торчали бы два разных сервиса.

Сайт физически никогда не занимает 443 и не спорит за него с Xray — он вообще не смотрит наружу. Xray сам, изнутри сервера, стучится на `127.0.0.1:8443`, когда нужно «одолжить» у сайта TLS-хендшейк для невалидного клиента.

## Шаг 5. Настраиваем Reality в 3X-UI {#reality}

Панель → **Inbounds** → **Add Inbound** (или редактируем существующий → вкладка «Безопасность»). Про саму панель — **[Панель 3X-UI](/3x-ui)**.

| Поле | Значение |
| :--- | :--- |
| **Protocol** | `VLESS` |
| **Port** | `443` |
| **Network** | `tcp` |
| **Security** | `reality` |
| **Target (Dest)** | `127.0.0.1:8443` |
| **SNI (Server Names)** | `mysite.duckdns.org` |
| **Private Key** | генерируется кнопкой в панели |
| **Short IDs** | генерируется кнопкой в панели |
| **Flow** (у клиента) | `xtls-rprx-vision` |

Сохраните и включите inbound.

## Шаг 6. Перезапускаем и проверяем {#verify}

```bash
systemctl restart x-ui
curl -v https://mysite.duckdns.org
```

В выводе ищите три строки:

```text
SSL certificate verify ok.
issuer: ... Let's Encrypt ...
HTTP/2 200
```

Если они есть — self-SNI настроен и работает.

## Шаг 7. Собираем ссылку для клиента {#link}

```text
vless://<UUID>@mysite.duckdns.org:443?security=reality&pbk=<PublicKey>&sni=mysite.duckdns.org&sid=<ShortId>&fp=firefox&flow=xtls-rprx-vision&type=tcp#mysite-selfsteal
```

*   `<UUID>` — из вкладки «Клиенты» вашего inbound в 3X-UI.
*   `<PublicKey>` — тот, что сгенерировала панель на шаге 5.
*   `<ShortId>` — тоже из панели.

Готовую ссылку вставьте в любой VLESS-клиент — v2rayNG, NekoBox, Throne — и подключайтесь.

## Частые ошибки {#errors}

| Что видно | Причина |
| :--- | :--- |
| `wrong version number` при `curl` | decoy-сайт не отдаёт TLS — забыли `ssl` в директиве `listen` |
| `self-signed certificate` | сертификат ещё не от Let's Encrypt, а самодельный |
| Соединение не открывается вообще | порт 443 занят чем-то другим — проверьте `ss -tlnp \| grep :443` |
| Xray не подхватывает новый конфиг | не перезапустили `systemctl restart x-ui` после правок |

::: warning Настройка протокола — не зона хостинга
Мы продаём сервер, а не VPN-сервис. Всё описанное здесь вы делаете на своём VPS сами — см. **[зону ответственности](/support#scope)**. Этим гайдом мы делимся тем, что собрали сами и что прислало сообщество, но разбирать чужие конфигурации мы не сможем.

*   Вопросы по протоколу и параметрам — в сообщество Amnezia: **[русский чат](https://t.me/amnezia_vpn)**, **[English](https://t.me/amnezia_vpn_en)**.
*   В **[поддержку хостинга](/support)** пишите, если дело в самом сервере: не включается, недоступен, статус Bad State.
:::
