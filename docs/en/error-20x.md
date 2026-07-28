---
title: "20x Errors in AmneziaVPN (202, 203)"
description: "Error 202 ServerContainerMissingError and 203 ServerDockerFailedError: Docker Hub mirrors, working around broken bridge networking, an unstable Alpine CDN, and wrapper recovery."
head:
  - - meta
    - name: keywords
      content: "error 202, ServerContainerMissingError, error 203, ServerDockerFailedError, docker, registry-mirrors, hostvds, openstack, wrapper, alpine cdn, masquerade, ip_forward"
---

# 🐳 20x Errors in AmneziaVPN (202, 203)

Error **202** (`ServerContainerMissingError`) means Amnezia could not build or start the Docker container with the protocol. Error **203** (`ServerDockerFailedError`) means Docker itself is missing on the server. Both are fixed from the console, and everything below is step by step.

::: tip How to read this page
You do not need to do all of it. Follow the order of operations at the end of the page — it tells you which section is yours. Commands run over SSH on the server.
:::

## Section 1. Docker Hub mirrors {#mirrors}

This suits most hosting providers. On **HostVDS** it may not help — go to [Section 2](#hostvds).

### Step 1. Check Docker Hub availability

```bash
docker pull hello-world
```

No error — go to the **[unstable Alpine CDN](#alpine)** section. An error (`TLS handshake timeout`, `access denied`, `unauthorized`) — carry on.

### Step 2. Configure mirrors

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

Known mirrors worth trying — not all are stable, and some may be unreachable from a given host: `docker.1ms.run`, `dockerhub.timeweb.cloud`, `docker.m.daocloud.io`, `docker.1panel.live`, `hub.rat.dev`, `dockerproxy.com`, `docker.nju.edu.cn`.

### Step 3. See which mirrors answer from this server

```bash
for host in dockerhub.timeweb.cloud docker.m.daocloud.io docker.1panel.live hub.rat.dev docker.1ms.run; do
  echo "=== $host ==="
  curl -sI --max-time 5 https://$host/v2/ && echo "OK" || echo "FAILED"
done
```

Note which domains end in `OK` and which in `FAILED`.

### Step 4. Keep only the working mirrors

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

Why this matters: if both working and dead mirrors stay in the config, Docker still tries each in turn and wastes time on the dead ones. Keeping only the verified ones makes builds faster and steadier.

### Step 5. Re-check the pull

```bash
docker pull hello-world
docker pull alpine:latest
```

If it succeeds, go back to the AmneziaVPN app and install the protocol.

## Section 2. HostVDS and other OpenStack hosts {#hostvds}

Here error 202 has three possible causes:

| Cause | What happens |
| :--- | :--- |
| **Docker Hub unreachable** | images do not download, the container is not built — fixed by [Section 1](#mirrors) |
| **Broken bridge networking** | the `docker0` bridge does not pass traffic outward (common on OpenStack Nova: port security on the hypervisor, or an overly broad systemd-networkd rule). Containers are created but have no internet — endless “connecting” |
| **sysctl conflict** | Amnezia tries to set `net.ipv4.conf.all.src_valid_mark` from inside the container, which is forbidden with `--network host` — so the container never starts |

::: danger Mandatory check before step 3
```bash
file /usr/bin/docker
```
*   `ELF 64-bit LSB executable` — the real Docker, no wrapper installed, step 3 is safe to run.
*   `Bourne-Again shell script` — a wrapper is already in place. **Skip step 3** and go to step 4.

Running step 3 twice hangs the server — see **[Section 3](#recovery)**.
:::

### 1. Docker Hub mirrors

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

### 2. Host sysctl (required for WireGuard)

```bash
sysctl -w net.ipv4.conf.all.src_valid_mark=1
echo "net.ipv4.conf.all.src_valid_mark=1" >> /etc/sysctl.conf
```

### 3. A wrapper over Docker — forced host networking

Only if the check above showed the real Docker.

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

### 4. Recreate the Amnezia containers

```bash
docker rm -f amnezia-xray amnezia-awg2 2>/dev/null
```

Now go back to the app and install the protocol. If the wrapper did end up layered over itself, the app usually reports error 302 — go to [Section 3](#recovery).

## Section 3. Recovering from a wrapper failure {#recovery}

Symptom: step 3 was run twice, the server hangs, `docker ps` and `docker run` do not respond.

Cause: a second `mv /usr/bin/docker /usr/bin/docker.real` renames the wrapper itself, leaving two identical scripts calling each other in a loop.

Check — many `docker.real` processes eating CPU:

```bash
ps aux | grep -i docker
```

Recovery:

```bash
pkill -9 -f "docker.real"
ps aux | grep -i docker
rm -f /usr/bin/docker /usr/bin/docker.real
apt install --reinstall -y docker.io
file /usr/bin/docker
docker ps -a
```

Then return to [Section 2](#hostvds) and redo the steps, this time without skipping the `file /usr/bin/docker` check before step 3.

## Unstable Alpine CDN {#alpine}

Symptom: `docker pull hello-world` works, the wrapper is in place, sysctl is fine — yet 202 still appears, sometimes reproducing and sometimes not.

Check:

```bash
for i in 1 2 3 4 5; do
  docker run --rm alpine:3.19 sh -c "apk update" 2>&1 | tail -3
  sleep 1
done
```

If you see `IO ERROR` or `Permission denied` even once, the network path to `dl-cdn.alpinelinux.org` (Fastly) is unstable. MTU and IPv6 are usually not involved.

**1. Build the image manually**, retrying until it succeeds (usually 5–25 attempts):

```bash
for i in $(seq 1 30); do
  docker.real build --network=host --no-cache --pull -t amnezia-awg2 /opt/amnezia/amnezia-awg2 && break
done
```

**2. Save it as a permanent backup:**

```bash
docker.real tag amnezia-awg2:latest amnezia-awg2-backup:latest
```

**3. Install a wrapper that substitutes the backup instead of building:**

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

Check: `time docker build -t amnezia-awg2 /opt/amnezia/amnezia-awg2` should finish in a fraction of a second. Then install the protocol from the app as usual.

## The protocol installed, but there is no internet {#no-traffic}

The client says “Connected” while no traffic flows. Three checks:

### Port

```bash
docker exec <container> cat /opt/amnezia/awg/awg0.conf | grep ListenPort
ss -ulnp | grep amneziawg
```

If the port in the config differs from the one actually being listened on, the client config is stale: with `--network=host` the `-p` flag in `docker run` is ignored and the port is set only inside `awg0.conf`.

**Fix:** remove the protocol or the server in the app and install again — a consistent config will be generated.

### NAT

```bash
iptables -t nat -L POSTROUTING -n -v
```

If the `MASQUERADE` rule sits on `eth0`/`eth1` with a zero packet counter while the real interface has another name (`ip link show`, e.g. `ens1`), the rule will never fire.

```bash
iptables -t nat -A POSTROUTING -s 10.8.1.0/24 -o ens1 -j MASQUERADE
iptables-save > /etc/iptables/rules.v4 2>/dev/null || netfilter-persistent save 2>/dev/null
```

Substitute your own subnet and interface.

### Forwarding

```bash
sysctl net.ipv4.ip_forward   # should be 1
```

If it is `0`:

```bash
sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
```

## Error 203: Docker is not installed {#error-203}

Diagnostics:

```bash
which docker
docker --version
systemctl status docker
```

If `which docker` is empty or `docker --version` says `command not found`, Docker is simply absent:

```bash
curl -fsSL https://get.docker.com | sh
```

## The whole order of operations {#order}

1.  `docker pull hello-world` succeeded — skip [Section 1](#mirrors).
2.  `file /usr/bin/docker`: `ELF` — install the wrapper from [Section 2](#hostvds); a shell script means it is already there.
3.  Installation fails intermittently — run the `apk update` loop, and if you catch errors, install the caching wrapper from the **[Alpine CDN](#alpine)** section.
4.  The protocol installed but there is no internet — check the port in the config, the NAT rule on the correct interface, and `ip_forward`: see **[The protocol installed, but there is no internet](#no-traffic)**.

Still no luck? Write to us and we will work it out together: **[Contacting Support](/en/support)**.
