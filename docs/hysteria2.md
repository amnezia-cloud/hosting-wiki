# Настройка протокола Hysteria 2

Данное руководство поможет вам самостоятельно развернуть и настроить быстрый VPN-сервер на протоколе **Hysteria 2**. Инструкция рассчитана на новичков: глубокие знания Linux или сетевых технологий не требуются — достаточно внимательно выполнять шаги по порядку.

## Шаг 1. Подключение к серверу по SSH

Откройте терминал на вашем компьютере и введите команду для подключения. Замените `<USER>` на имя пользователя (например, `root`), а `<SERVER_IP>` — на IP-адрес вашего VPS:

```bash
ssh <USER>@<SERVER_IP>
```

## Шаг 2. Обновление системы и установка утилит

После успешного входа обновите список пакетов и установите необходимые для работы инструменты (`curl`, текстовый редактор `micro` и генератор паролей `pwgen`):

```bash
apt update && apt install curl micro pwgen -y
```

## Шаг 3. Установка Hysteria 2

Скачайте и запустите официальный скрипт автоматической установки актуальной версии Hysteria 2:

```bash
bash <(curl -fsSL https://get.hy2.sh/)
```

## Шаг 4. Настройка маскировки (Masquerade)

Для защиты от блокировок создадим фейковый веб-сайт. Если цензоры попытаются проверить ваш IP через браузер, они увидят обычную страницу ожидания.

Создаем директорию и генерируем заглушку:

```bash
mkdir -p /var/www/masq
tee /var/www/masq/index.html >/dev/null <<'HTML'
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Please wait</title><style>body{background:#080808;height:100vh;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif}.dots{display:flex;gap:15px;margin-bottom:30px}.d{width:20px;height:20px;background:#fff;border-radius:50%;animation:b 1.4s infinite ease-in-out both}.d:nth-child(1){animation-delay:-0.32s}.d:nth-child(2){animation-delay:-0.16s}@keyframes b{0%,80%,100%{transform:scale(0);opacity:0.2}40%{transform:scale(1);opacity:1}}.t{color:#555;font-size:14px;letter-spacing:2px;font-weight:600}</style></head><body><div class="dots"><div class="d"></div><div class="d"></div><div class="d"></div></div><div class="t">RETRYING CONNECTION</div></body></html>
HTML
```

## Шаг 5. Генерация пароля для VPN

Создайте надежный случайный пароль, который потребуется указать в файле конфигурации:

```bash
openssl rand -hex 16
```

*Скопируйте полученную строку в блокнот.*

## Шаг 6. Создание конфигурационного файла

Откройте встроенный редактор для настройки сервера:

```bash
micro /etc/hysteria/config.yaml
```

Вставьте следующий шаблон конфигурации, заменив тестовые данные (`ваш_домен`, `ваш_email` и `ваш_пароль`) на свои реальные значения:

```yaml
listen: :443

acme:
  type: http
  domains:
    - тут_ваш_домен
  email: тут_ваш_емеил

auth:
  type: userpass
  userpass:
    Admin: тут_ваш_пароль

masquerade:
  type: file
  file:
    dir: /var/www/masq
  listenHTTP: :80
  forceHTTPS: true
```

*Для сохранения изменений в редакторе `micro` нажмите `Ctrl + S`, затем для выхода — `Ctrl + Q`.*

## Шаг 7. Настройка брандмауэра (UFW)

Разрешите подключение к необходимым портам, чтобы сервер был доступен из сети:

```bash
ufw allow 22/tcp      # Доступ к SSH (измените 22, если используете нестандартный порт)
ufw allow 80/tcp      # Выпуск SSL-сертификата (HTTP)
ufw allow 443/tcp     # Маскировка под HTTPS
ufw allow 443/udp     # Основной рабочий порт Hysteria 2 (UDP)
ufw --force enable    # Включение брандмауэра
ufw status verbose    # Проверка статуса портов
```

## Шаг 8. Запуск и проверка службы

Перезапустите менеджер служб, добавьте Hysteria в автозагрузку и запустите процесс:

```bash
systemctl daemon-reload
systemctl enable --now hysteria-server.service
```

Чтобы убедиться, что сервер работает без ошибок, проверьте его статус:

```bash
systemctl status hysteria-server.service
```

Поздравляем! Ваш сервер Hysteria 2 готов к работе. Теперь вы можете использовать полученные данные (домен, логин `Admin` и сгенерированный пароль) для настройки клиентских приложений (например, Nekobox, v2rayN или Shadowrocket).
