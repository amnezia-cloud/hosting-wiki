---
title: "Self-SNI for VLESS + Reality: Your Own Domain Instead of Someone Else's"
description: "A step-by-step guide for beginners: a free DuckDNS domain, a decoy site on nginx, a Let's Encrypt certificate, and Reality configured in 3X-UI so the IP, the domain and the certificate all match."
head:
  - - meta
    - name: keywords
      content: "self-sni, selfsteal, vless, reality, 3x-ui, duckdns, nginx, acme.sh, lets encrypt, masking domain, sni, decoy, xtls-rprx-vision"
---

# 🔐 Self-SNI for VLESS + Reality: Your Own Domain Instead of Someone Else's

## What it is and why {#why}

**Self-SNI** means using **your own domain and your own site** for masking instead of somebody else's site (something like `rolex.com`).

The server IP, the domain and the certificate then all match each other, which looks entirely natural from the outside: an observer sees a domain that really does live on this IP and really does serve its own certificate.

::: tip Why this beats someone else's domain
Masking behind a foreign site always leaves a mismatch: the domain points at one IP while the traffic goes to another. Here that discrepancy cannot exist by construction. For picking a foreign domain instead, see **[XRay: masking domain](/en/xray-tuning#domain)**.
:::

## Step 1. Register a free domain {#domain}

1.  Open **[duckdns.org](https://www.duckdns.org)** and sign in with GitHub or Google.
2.  Enter any name in the domain field — `mysite`, for example. You get `mysite.duckdns.org`.
3.  Put your VPS's external IP in the **IP** field and press **update ip**.

Check that the domain points at the server:

```bash
ping mysite.duckdns.org
```

It should answer with your server's IP.

## Step 2. Prepare the decoy site {#decoy}

Connect to the server over SSH (see **[Server Management](/en/server-management#ssh)**) and create the site folder:

```bash
mkdir -p /var/www/decoy
nano /var/www/decoy/index.html
```

Paste any site HTML and save: `Ctrl+O` → `Enter` → `Ctrl+X`.

::: tip No site of your own
You can have a neutral page generated for you — a personal blog, a portfolio, project documentation — by an AI assistant: describe the mood you want and paste the resulting code here. The page should look like an ordinary small site rather than a placeholder.
:::

## Step 3. Install nginx and issue a certificate {#cert}

```bash
apt install -y nginx
curl https://get.acme.sh | sh -s email=your@email.com
source ~/.bashrc
```

Issue the Let's Encrypt certificate. Port 80 must be free, so stop nginx for a minute:

```bash
systemctl stop nginx
~/.acme.sh/acme.sh --issue -d mysite.duckdns.org --standalone --httpport 80
systemctl start nginx
```

Copy the certificate somewhere convenient:

```bash
mkdir -p /root/cert/mysite.duckdns.org
~/.acme.sh/acme.sh --install-cert -d mysite.duckdns.org \
  --key-file /root/cert/mysite.duckdns.org/privkey.pem \
  --fullchain-file /root/cert/mysite.duckdns.org/fullchain.pem \
  --reloadcmd "systemctl reload nginx"
```

::: info Renewal happens on its own
Let's Encrypt certificates last 90 days. On installation `acme.sh` adds a cron job and renews them automatically, and `--reloadcmd` reloads nginx with the new certificate. Nothing extra to do.
:::

## Step 4. Configure nginx {#nginx}

The site must listen **inside the server only**:

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

Check that the site really is being served:

```bash
curl -H "Host: mysite.duckdns.org" https://127.0.0.1:8443 -k
```

Your HTML should come back.

## Why 443 and the site do not clash {#ports}

This is the most common source of confusion, so it gets its own section.

**Port 443 faces the internet exactly once, and Xray listens on it — not the site.**

```text
443  — visible from the internet     8443 — 127.0.0.1 only
 │                                    │
 ▼                                    ▼
Xray (Reality)                      nginx  →  decoy site
 │
 ├─ a client with your key   →  tunnel out to the internet
 └─ any other client         →  127.0.0.1:8443  →  nginx serves the site
```

| Port | Who listens | Reachable from outside |
| :--- | :--- | :--- |
| **443** | Xray (Reality) | ✅ Yes — the single external entry point |
| **8443** | nginx | ❌ No — bound strictly to `127.0.0.1`, invisible from outside |

That is exactly why the config says `listen 127.0.0.1:8443` rather than just `listen 8443`. The difference matters:

*   `127.0.0.1:8443` — “listen only to requests from myself”;
*   `8443` or `0.0.0.0:8443` — “listen from anywhere”, and *then* two different services really would face the internet.

The site never occupies 443 and never competes with Xray for it — it does not face outward at all. Xray itself, from inside the server, reaches `127.0.0.1:8443` when it needs to borrow the site's TLS handshake for an invalid client.

## Step 5. Configure Reality in 3X-UI {#reality}

Panel → **Inbounds** → **Add Inbound** (or edit an existing one → the “Security” tab). For the panel itself, see **[3X-UI Panel](/en/3x-ui)**.

| Field | Value |
| :--- | :--- |
| **Protocol** | `VLESS` |
| **Port** | `443` |
| **Network** | `tcp` |
| **Security** | `reality` |
| **Target (Dest)** | `127.0.0.1:8443` |
| **SNI (Server Names)** | `mysite.duckdns.org` |
| **Private Key** | generated by the panel's button |
| **Short IDs** | generated by the panel's button |
| **Flow** (on the client) | `xtls-rprx-vision` |

Save and enable the inbound.

## Step 6. Restart and verify {#verify}

```bash
systemctl restart x-ui
curl -v https://mysite.duckdns.org
```

Look for three lines in the output:

```text
SSL certificate verify ok.
issuer: ... Let's Encrypt ...
HTTP/2 200
```

If they are there, self-SNI is configured and working.

## Step 7. Assemble the client link {#link}

```text
vless://<UUID>@mysite.duckdns.org:443?security=reality&pbk=<PublicKey>&sni=mysite.duckdns.org&sid=<ShortId>&fp=firefox&flow=xtls-rprx-vision&type=tcp#mysite-selfsteal
```

*   `<UUID>` — from the “Clients” tab of your inbound in 3X-UI.
*   `<PublicKey>` — the one the panel generated in step 5.
*   `<ShortId>` — also from the panel.

Paste the finished link into any VLESS client — v2rayNG, NekoBox, Throne — and connect.

## Common mistakes {#errors}

| What you see | Cause |
| :--- | :--- |
| `wrong version number` from `curl` | the decoy site is not serving TLS — `ssl` is missing from the `listen` directive |
| `self-signed certificate` | the certificate is still self-made rather than from Let's Encrypt |
| Nothing connects at all | port 443 is taken by something else — check with `ss -tlnp \| grep :443` |
| Xray does not pick up the new config | you did not run `systemctl restart x-ui` after the changes |

::: warning Protocol tuning is outside hosting support
We sell a server, not a VPN service. Everything described here is something you do on your own VPS — see the **[scope of responsibility](/en/support#scope)**. This guide shares what we and the community have collected, but we cannot debug individual configurations.

*   Questions about the protocol and its parameters belong in the Amnezia community: **[Russian chat](https://t.me/amnezia_vpn)**, **[English](https://t.me/amnezia_vpn_en)**.
*   Write to **[hosting support](/en/support)** when the server itself is the problem: it will not power on, is unreachable, or shows Bad State.
:::
