---
title: "Ошибки 20x в AmneziaVPN (202, 203)"
description: "Ошибка 202 ServerContainerMissingError и 203 ServerDockerFailedError: зеркала Docker Hub, обход сломанного bridge-networking, нестабильный Alpine CDN и восстановление после wrapper."
head:
  - - meta
    - name: keywords
      content: "ошибка 202, ServerContainerMissingError, ошибка 203, ServerDockerFailedError, docker, registry-mirrors, hostvds, openstack, wrapper, alpine cdn, masquerade, ip_forward"
---

# 🐳 Ошибки 20x в AmneziaVPN (202, 203)

Ошибка **202** (`ServerContainerMissingError`) означает, что Amnezia не смогла собрать или запустить Docker-контейнер с протоколом. Ошибка **203** (`ServerDockerFailedError`) — что на сервере нет самого Docker. Оба случая лечатся из консоли, и ниже всё по шагам.

::: tip Как читать эту страницу
Не нужно делать всё подряд. Пройдите по порядку действий в конце страницы — он подскажет, какой раздел ваш. Команды выполняются по SSH на сервере.
:::

## Раздел 1. Зеркала Docker Hub {#mirrors}

Подходит для большинства хостингов. Если у вас **HostVDS** — этот раздел может не помочь, переходите к [Разделу 2](#hostvds).

### Шаг 1. Проверить доступность Docker Hub

```bash
docker pull hello-world
```

Ошибки нет — переходите к разделу **[нестабильный Alpine CDN](#alpine)**. Появилась ошибка (`TLS handshake timeout`, `access denied`, `unauthorized`) — продолжайте.

### Шаг 2. Прописать зеркала

```bash
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://dockerhub.timeweb.cloud",
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live",
    "https://hub.rat.dev"
  ],
  "dns": ["8.8.8.8", "1.1.1.1"]
}
EOF

systemctl restart docker
```

Известные зеркала для перебора — стабильны не все, часть может быть недоступна с конкретного хостинга: `docker.1ms.run`, `dockerhub.timeweb.cloud`, `docker.m.daocloud.io`, `docker.1panel.live`, `hub.rat.dev`, `dockerproxy.com`, `docker.nju.edu.cn`.

### Шаг 3. Проверить, какие зеркала отвечают с этого сервера

```bash
for host in dockerhub.timeweb.cloud docker.m.daocloud.io docker.1panel.live hub.rat.dev docker.1ms.run; do
  echo "=== $host ==="
  curl -sI --max-time 5 https://$host/v2/ && echo "OK" || echo "FAILED"
done
```

Смотрите, у каких доменов внизу `OK`, а у каких `FAILED`.

### Шаг 4. Оставить только рабочие зеркала

```bash
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.1panel.live",
    "https://hub.rat.dev"
  ],
  "dns": ["8.8.8.8", "1.1.1.1"]
}
EOF
systemctl restart docker
```

Почему это важно: если в конфиге останутся и рабочие, и мёртвые зеркала, Docker всё равно будет по очереди стучаться в каждое и тратить время на нерабочие. Оставив проверенные, вы ускоряете и стабилизируете сборку.

### Шаг 5. Повторить проверку

```bash
docker pull hello-world
docker pull alpine:latest
```

Прошло успешно — возвращайтесь в приложение AmneziaVPN и устанавливайте протокол.

## Раздел 2. HostVDS и другие OpenStack-хостинги {#hostvds}

Здесь у 202 бывает три причины:

| Причина | Что происходит |
| :--- | :--- |
| **Docker Hub недоступен** | образы не скачиваются, контейнер не собирается — лечится [Разделом 1](#mirrors) |
| **Сломан bridge-networking** | виртуальный мост `docker0` не пропускает трафик наружу (часто на OpenStack Nova: port security на гипервизоре либо слишком широкое правило в systemd-networkd). Контейнеры создаются, но без интернета — бесконечное «подключение» |
| **Конфликт sysctl** | Amnezia пытается задать `net.ipv4.conf.all.src_valid_mark` изнутри контейнера, что запрещено при `--network host` — контейнер не стартует |

::: danger Перед шагом 3 обязательная проверка
```bash
file /usr/bin/docker
```
*   `ELF 64-bit LSB executable` — это настоящий Docker, wrapper не установлен, шаг 3 выполнять можно.
*   `Bourne-Again shell script` — wrapper уже стоит. **Шаг 3 пропустите**, переходите к шагу 4.

Повторное выполнение шага 3 подвешивает сервер — см. **[Раздел 3](#recovery)**.
:::

### 1. Зеркала для Docker Hub

```bash
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://dockerhub.timeweb.cloud",
    "https://docker.m.daocloud.io",
    "https://hub.rat.dev",
    "https://docker.1panel.live"
  ],
  "dns": ["8.8.8.8", "1.1.1.1"]
}
EOF
systemctl restart docker
```

### 2. Sysctl на хосте (нужен для WireGuard)

```bash
sysctl -w net.ipv4.conf.all.src_valid_mark=1
echo "net.ipv4.conf.all.src_valid_mark=1" >> /etc/sysctl.conf
```

### 3. Wrapper поверх Docker — принудительный host-networking

Только если проверка выше показала настоящий Docker.

```bash
mv /usr/bin/docker /usr/bin/docker.real

cat > /usr/bin/docker << 'EOF'
#!/bin/bash
CMD="$1"
if [ "$CMD" = "build" ]; then
    shift
    exec /usr/bin/docker.real build --network=host "$@"
elif [ "$CMD" = "run" ] || [ "$CMD" = "create" ]; then
    shift
    ARGS=()
    SKIP_NEXT=0
    for arg in "$@"; do
        if [ "$SKIP_NEXT" = "1" ]; then SKIP_NEXT=0; continue; fi
        if [ "$arg" = "--sysctl" ]; then SKIP_NEXT=1; continue; fi
        if [[ "$arg" == --sysctl=* ]]; then continue; fi
        ARGS+=("$arg")
    done
    exec /usr/bin/docker.real "$CMD" --network=host "${ARGS[@]}"
else
    exec /usr/bin/docker.real "$@"
fi
EOF
chmod +x /usr/bin/docker
```

### 4. Пересоздать контейнеры Amnezia

```bash
docker rm -f amnezia-xray amnezia-awg2 2>/dev/null
```

Теперь возвращайтесь в приложение и устанавливайте протокол. Если wrapper всё же наложился сам на себя, приложение обычно выдаёт ошибку 302 — переходите к [Разделу 3](#recovery).

## Раздел 3. Восстановление после сбоя wrapper {#recovery}

Симптом: шаг 3 выполнен повторно, сервер подвиснул, `docker ps` и `docker run` не отвечают.

Причина: повторный `mv /usr/bin/docker /usr/bin/docker.real` переименовывает уже сам wrapper — получаются два одинаковых скрипта, вызывающих друг друга по кругу.

Проверка — много процессов `docker.real`, съедающих CPU:

```bash
ps aux | grep -i docker
```

Восстановление:

```bash
pkill -9 -f "docker.real"
ps aux | grep -i docker
rm -f /usr/bin/docker /usr/bin/docker.real
apt install --reinstall -y docker.io
file /usr/bin/docker
docker ps -a
```

После этого вернитесь в [Раздел 2](#hostvds) и пройдите шаги заново, не пропуская проверку `file /usr/bin/docker` перед шагом 3.

## Нестабильный Alpine CDN {#alpine}

Симптом: `docker pull hello-world` работает, wrapper стоит, sysctl в порядке — а 202 всё равно появляется, то воспроизводится, то нет.

Проверка:

```bash
for i in 1 2 3 4 5; do
  docker run --rm alpine:3.19 sh -c "apk update" 2>&1 | tail -3
  sleep 1
done
```

Если хотя бы раз видите `IO ERROR` или `Permission denied` — дело в нестабильной сети до `dl-cdn.alpinelinux.org` (Fastly). MTU и IPv6 тут обычно ни при чём.

**1. Собрать образ вручную**, повторяя попытки (обычно нужно 5–25):

```bash
for i in $(seq 1 30); do
  docker.real build --network=host --no-cache --pull -t amnezia-awg2 /opt/amnezia/amnezia-awg2 && break
done
```

**2. Сохранить как постоянный бэкап:**

```bash
docker.real tag amnezia-awg2:latest amnezia-awg2-backup:latest
```

**3. Прописать обёртку, которая подставляет бэкап вместо реальной сборки:**

```bash
cat > /usr/bin/docker << 'EOF'
#!/bin/bash
CMD="$1"
if [ "$CMD" = "build" ]; then
    shift
    TAG=""; prev=""
    for arg in "$@"; do [ "$prev" = "-t" ] && TAG="$arg"; prev="$arg"; done
    if [ -n "$TAG" ] && /usr/bin/docker.real image inspect "${TAG}-backup" >/dev/null 2>&1; then
        /usr/bin/docker.real tag "${TAG}-backup" "$TAG"
        exit 0
    fi
    for i in $(seq 1 30); do
        /usr/bin/docker.real build --network=host "$@" && /usr/bin/docker.real tag "$TAG" "${TAG}-backup" 2>/dev/null && exit 0
    done
    exit 1
elif [ "$CMD" = "run" ] || [ "$CMD" = "create" ]; then
    shift
    ARGS=(); SKIP=0
    for arg in "$@"; do
        [ "$SKIP" = "1" ] && { SKIP=0; continue; }
        [ "$arg" = "--sysctl" ] && { SKIP=1; continue; }
        [[ "$arg" == --sysctl=* ]] && continue
        ARGS+=("$arg")
    done
    exec /usr/bin/docker.real "$CMD" --network=host "${ARGS[@]}"
else
    exec /usr/bin/docker.real "$@"
fi
EOF
chmod +x /usr/bin/docker
```

Проверка: `time docker build -t amnezia-awg2 /opt/amnezia/amnezia-awg2` должно выполниться за доли секунды. Дальше устанавливайте протокол в приложении как обычно.

## Протокол установился, но интернета нет {#no-traffic}

Клиент показывает «Подключено», а трафик не идёт. Три проверки:

### Порт

```bash
docker exec <container> cat /opt/amnezia/awg/awg0.conf | grep ListenPort
ss -ulnp | grep amneziawg
```

Если порт в конфиге не совпадает с тем, который реально слушается, конфиг на клиенте устарел: при `--network=host` флаг `-p` в `docker run` игнорируется, а порт задаётся только внутри `awg0.conf`.

**Решение:** удалите протокол или сервер в приложении и установите заново — сгенерируется согласованный конфиг.

### NAT

```bash
iptables -t nat -L POSTROUTING -n -v
```

Если правило `MASQUERADE` висит на `eth0`/`eth1` с нулевым счётчиком пакетов, а реальный интерфейс называется иначе (`ip link show`, например `ens1`), правило никогда не сработает.

```bash
iptables -t nat -A POSTROUTING -s 10.8.1.0/24 -o ens1 -j MASQUERADE
iptables-save > /etc/iptables/rules.v4 2>/dev/null || netfilter-persistent save 2>/dev/null
```

Подставьте свою подсеть и интерфейс.

### Форвардинг

```bash
sysctl net.ipv4.ip_forward   # должно быть 1
```

Если `0`:

```bash
sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
```

## Ошибка 203: Docker не установлен {#error-203}

Диагностика:

```bash
which docker
docker --version
systemctl status docker
```

Если `which docker` пуст или `docker --version` отвечает `command not found`, Docker просто отсутствует:

```bash
curl -fsSL https://get.docker.com | sh
```

## Порядок действий целиком {#order}

1.  `docker pull hello-world` прошёл — [Раздел 1](#mirrors) пропускаем.
2.  `file /usr/bin/docker`: `ELF` — ставим wrapper из [Раздела 2](#hostvds); shell-script — он уже стоит.
3.  Установка падает нестабильно — тест `apk update` в цикле, и если ловите ошибки, ставим кеширующую обёртку из раздела **[Alpine CDN](#alpine)**.
4.  Протокол установился, но нет интернета — проверяем порт в конфиге, NAT на верный интерфейс и `ip_forward`: раздел **[Протокол установился, но интернета нет](#no-traffic)**.

Не получилось — напишите нам, вместе разберёмся: **[Обращение в поддержку](/support)**.
