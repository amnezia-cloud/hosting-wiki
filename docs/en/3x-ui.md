---
title: "3X-UI Panel: VLESS + Reality and Blocking Russian Domains"
description: "Installing 3X-UI on a VPS, a VLESS + Reality inbound on port 443 masked as ya.ru, and blocking ads and Russian domains."
head:
  - - meta
    - name: keywords
      content: "3x-ui, x-ui, vless, reality, xray, ya.ru, port 443, 8443, blocking ru domains, web panel, access keys"
---

# 📊 3X-UI Panel: VLESS + Reality and Blocking Russian Domains

**3X-UI** is a graphical web panel for managing a VPN server powered by **Xray-core**. It lets you set up a **VLESS + Reality** connection in minutes, issue separate keys per user, track traffic, and define routing rules.

This guide covers the full path from a bare VPS to a working key: installing the panel, creating an inbound on port **443** masked as **`ya.ru`**, and blocking ads and Russian domains.

::: tip What you need
Just the server IP and the root password from your hosting control panel — everything else happens over SSH and in the browser. Nothing needs to be installed on your computer.
:::

::: info About the screenshots
Grey boxes in the screenshots hide the IP address, passwords, the panel's secret path, the client UUID, and the Reality keys — you will see your own values there. All addresses and credentials shown in the examples are fictitious.
:::

## 🔑 Step 1. Server Connection Details {#credentials}

Open your server card in the hosting control panel (**Manage** section) and copy:

| Field | Value |
| :--- | :--- |
| **IP Address** | your server address, e.g. `203.0.113.10` |
| **Username** | `root` |
| **Password** | the root password |

![Server card in the hosting control panel: IP address, root username, and password](/img/3x-ui/01-credentials.png)

Make sure the server is running — the status indicator should be green. If the password is lost, the **Reset Password** button reissues it — but only on servers issued on or after 20 July 2026: **[details](/en/reinstall#check)**.

More about connection details in **[Server Management](/en/server-management#credentials)**.

## 💻 Step 2. Connecting via SSH {#ssh}

In **PowerShell** (Windows 10/11) or **Terminal** (macOS/Linux) run:

```bash
ssh root@203.0.113.10
```

Use your own IP. On the first connection confirm the key fingerprint by typing `yes`, then enter the password.

::: warning The password stays invisible
The terminal shows no characters or asterisks while you type the password — that is expected. Paste it (`Ctrl+V` / right-click) and press `Enter`.
:::

A successful login looks like this:

```text
Welcome to Ubuntu 26.04 LTS (GNU/Linux x86_64)
root@vps-4906:/home#
```

![Terminal: SSH login and the Ubuntu 26.04 LTS welcome message](/img/3x-ui/02-ssh.png)

## 🚀 Step 3. Installing the Panel {#install}

Install a specific (verified) panel version:

```bash
VERSION=v2.5.5 && bash <(curl -Ls "https://raw.githubusercontent.com/mhsanaei/3x-ui/$VERSION/install.sh") $VERSION
```

The script detects your OS and architecture, installs dependencies (`wget`, `curl`, `tar`, `tzdata`), downloads `x-ui` together with Xray-core, and registers the systemd service. It takes 1–2 minutes.

![Output of the 3X-UI installer: system detection and Xray-core download](/img/3x-ui/03-install.png)

::: tip Why pin the version
The `$VERSION` form installs a known-good release. If you always want the newest build, use:
`bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)`
:::

## 🔐 Step 4. Port and Login Credentials {#credentials-panel}

During installation the script asks:

```text
Would you like to customize the Panel Port settings? (If not, a random port will be applied) [y/n]:
```

![The installer's panel port prompt](/img/3x-ui/04-port-prompt.png)

**We recommend pressing `Enter`** (or typing `n`) — the panel will generate a random port, a random username, a password, and a secret path (Base URI Path). That is safer than any default value: automated scanners will not find the panel.

When installation finishes, the console prints your credentials:

```text
##############################################
Username: a1B2c3D4e5
Password: Xy7Zq2Lm9P
Port: 6873
WebBasePath: k4TnQ8pVzR2Wd
Access URL: http://203.0.113.10:6873/k4TnQ8pVzR2Wd
##############################################
x-ui v2.5.5 installation finished, it is running now...
```

![Installation summary: generated username, password, port, WebBasePath, and Access URL, plus the x-ui command menu](/img/3x-ui/05-install-done.png)

::: danger Save these credentials
Copy the whole block into a password manager **before closing the terminal**. Without the secret path (`WebBasePath`) the panel will not open — a plain `http://IP:PORT` returns a 404 error.

If you lose them, run `x-ui settings` on the server to display them again.
:::

## 🌐 Step 5. Signing In to the Web Interface {#login}

1. Open the **Access URL** from the previous step in your browser:
   `http://SERVER_IP:PORT/SECRET_PATH`
2. Enter the generated `Username` and `Password`, then click **Log In**.
3. Change the interface language in the dropdown on the login form if needed.

![The 3X-UI login form](/img/3x-ui/06-login.png)

::: warning “Connection is not secure”
The browser warns you because the panel runs over plain `http` without a certificate. That is acceptable for initial setup, but passwords and keys travel unencrypted. Afterwards, change the password to your own and enable an HTTPS certificate in **Panel Settings** — or access the panel through an SSH tunnel.
:::

## 🛡️ Step 6. Creating the Inbound: VLESS + Reality on 443 {#inbound}

**Reality** disguises your traffic as an ordinary visit to a real website: the server borrows the genuine TLS handshake of the chosen domain, so no certificate or domain of your own is required. See **[Protocols](/en/protocols)** for a comparison with the other options.

In the left menu open **Inbounds** and click **+ Add Inbound**.

![The Inbounds section in 3X-UI with the Add Inbound button](/img/3x-ui/07-inbounds.png)

### 6.1. Core Settings

| Setting | Value |
| :--- | :--- |
| **Enabled** | on |
| **Remark** | any label, e.g. `VLESS-Reality` |
| **Protocol** | `vless` |
| **Listen IP** | leave empty (listen on all interfaces) |
| **Port** | `443` (alternatives below) |
| **Total Flow** | `0` — unlimited traffic |
| **Duration** | empty — no expiry |
| **Transmission** | `TCP (RAW)` |

In the **Client** block:

| Setting | Value |
| :--- | :--- |
| **Email** | the user identifier — keep the generated one or set something readable (`ivan-phone`) |
| **ID** | the client UUID, generated automatically (🔄 creates a new one) |
| **Flow** | `xtls-rprx-vision` |
| **Total Flow** / **Duration** | per-client limits; `0`/empty means unlimited |

![The Add Inbound form: vless protocol, port 443, Client block with Flow xtls-rprx-vision and Transmission TCP (RAW)](/img/3x-ui/08-inbound-general.png)

::: tip Why port 443
443 is the standard HTTPS port. Traffic on it raises no suspicion and is almost never blocked on public networks. Make sure no web server occupies it: `ss -ltnp | grep :443`.
:::

#### Alternative Ports

If the connection fails on 443 — the port is taken on the server or throttled by the ISP — use one of the fallbacks:

| Port | When to choose it | What to keep in mind |
| :--- | :--- | :--- |
| **443** | the default | Standard HTTPS, so the masking is as plausible as it gets. Must not be occupied by a web server or the panel itself. |
| **8443** | 443 is taken or blocked | The second most common HTTPS port, open on most networks. A good first fallback. |
| **80** | the network only passes web traffic | An HTTP port carrying TLS traffic looks unusual to DPI, so keep it as a last resort. Often already taken by nginx or Apache. |

Check that a port is free:

```bash
ss -ltnp | grep -E ':(80|443|8443)\s'
```

How to change the port of an existing inbound:

1. **Inbounds** → **Edit** (pencil icon) on the inbound → the **Port** field.
2. Save and confirm the Xray restart.
3. If a firewall is enabled, open the new port: `ufw allow 8443/tcp`.
4. **Re-issue the client links** — the port is part of the `vless://` link, so the old one stops working.

::: tip Keep a second inbound as a fallback
Instead of switching the port back and forth, create a second inbound — say `VLESS-Reality-8443` on port `8443` — and give the user both links. If one fails on a particular network, they switch to the other. Each inbound has its own Reality keys, so click **Get New Cert** again for the second one.
:::

### 6.2. Reality Settings

Scroll to the **Security** block and pick **Reality**. Fill in the fields:

| Setting | Value |
| :--- | :--- |
| **Show** | off |
| **Xver** | `0` |
| **uTLS** | `chrome` |
| **Dest (Target)** | `ya.ru:443` |
| **SNI** | `ya.ru` |
| **Max Time Diff (ms)** | `0` |
| **Short IDs** | keep the generated set (🔄 for a new one) |
| **SpiderX** | `/` |
| **Public Key** / **Private Key** | click **Get New Cert** — the x25519 key pair is created automatically |

![The Security block with Reality selected: uTLS chrome, Dest ya.ru:443, SNI ya.ru, SpiderX and keys, with the Sniffing block below](/img/3x-ui/09-inbound-reality.png)

::: tip Choosing a masking domain
`ya.ru` works well for users in Russia: the site is not blocked, supports TLS 1.3, and requests to it look natural. The only hard requirement is that the domain must be reachable **from the server** and not blocked **for the client**.

Alternatives for users in Russia: `2gis.ru`, `pochta.ru`. International options include `dl.google.com`, `www.microsoft.com`, and `www.cloudflare.com`. Avoid domains that may themselves be blocked in the client's region.

The domain goes into two fields at once: **Dest (Target)** takes it with the port (`2gis.ru:443`), **SNI** without (`2gis.ru`).
:::

### 6.3. Sniffing

In the **Sniffing** block (visible in the screenshot above) turn **Enabled** on and check **HTTP**, **TLS**, **QUIC** (`FAKEDNS` is not needed). This lets Xray recognise domains inside connections — without it the blocking rules from Step 8 will not work.

Click **Create**. The inbound appears in the list as “Enabled”.

## 🔗 Step 7. Issuing a Client Key {#client-key}

1. Expand the new inbound in the list and click the client name (or **Details**).
2. A summary card opens: protocol, address, port, `Security: reality`, `Domain Name: ya.ru`.
3. In the **URL** block click the copy icon next to the client name — or scan the **QR code**.

![The Details card: connection parameters, client data, and the ready-made vless:// link](/img/3x-ui/10-client-details.png)

The link looks like this:

```text
vless://UUID@SERVER_IP:443?type=tcp&security=reality&pbk=PUBLIC_KEY&fp=chrome&sni=ya.ru&sid=SHORT_ID&spx=%2F&flow=xtls-rprx-vision#Client-name
```

Import it into a client app — every parameter is filled in automatically.

::: warning One key per device
Do not share a single link between people: traffic statistics get mixed and simultaneous connections may drop. Add a separate client for each device (**Operations → Add Client**) — a single inbound is enough.
:::

## 🚫 Step 8. Blocking Ads and Russian Domains {#routing}

Russian websites are reachable without a VPN, and some of them restrict access from foreign IP addresses anyway. It therefore makes sense not to route that traffic through your server: it reduces load, saves bandwidth, and lowers the risk of complaints against your IP.

1. Open **Xray Configs** in the left menu.
2. Expand the **Basic Routing** section.
3. Fill in two fields:

| Field | Values |
| :--- | :--- |
| **Block IPs** | `Private IPs`, `RU Russia` |
| **Block Domains** | `Ads All`, `Ads RU`, `RU Russia`, `.ru`, `.su`, `.рф` |

4. Click **Save**, then confirm the Xray core restart (**Restart Xray**).

![Xray Configs → Basic Routing: Block IPs with Private IPs and RU Russia, Block Domains with Ads All, Ads RU, RU Russia, .ru, .su, .рф](/img/3x-ui/11-basic-routing.png)

What each rule does:

*   **Private IPs** — blocks access to the server's internal network (`10.0.0.0/8`, `192.168.0.0/16`, `127.0.0.1`, etc.). A mandatory safety rule: without it a client can reach local services on the server, including the panel itself.
*   **RU Russia** (IPs and domains) — blocks Russian addresses and domains from the geoip/geosite lists.
*   **`.ru`, `.su`, `.рф`** — domain zones that the geosite list does not cover.
*   **Ads All**, **Ads RU** — server-side ad and tracker blocking for every client at once.

::: tip ya.ru masking keeps working
Routing rules apply to **client** traffic. The Reality TLS handshake with `ya.ru` is a separate direct connection made by the server, so blocking the `.ru` zone does not affect it.
:::

::: warning Side effect
Once these rules are active, Russian websites become **unreachable while the VPN is on** — open them with the VPN disabled, or configure split tunneling in your client to exclude `.ru` domains from the tunnel. If that is not acceptable, remove `.ru`, `.su`, `.рф` and `RU Russia` from **Block Domains**, keeping only `Ads All` / `Ads RU` and `Private IPs`.
:::

## 📱 Client Applications {#clients}

Links and QR codes exported by 3X-UI work with all modern clients:

| Platform | Apps |
| :--- | :--- |
| **Android** | Hiddify, v2rayNG, NekoBox |
| **iOS (iPhone)** | Streisand, FoXray, Shadowrocket, V2Box |
| **Windows / macOS** | Hiddify, NekoRay, v2rayN |

## ⚙️ Managing the Panel over SSH {#cli}

All maintenance operations are available through the `x-ui` command:

```bash
x-ui
```

This opens a text menu. Individual subcommands:

| Command | Action |
| :--- | :--- |
| `x-ui start` / `stop` / `restart` | start, stop, restart the panel |
| `x-ui status` | current service state |
| `x-ui settings` | show username, password, port, and Base URI Path |
| `x-ui enable` / `disable` | autostart on system boot |
| `x-ui log` | service logs |
| `x-ui banlog` | Fail2ban ban logs |
| `x-ui update` | update the panel |
| `x-ui uninstall` | complete removal |

## ❗ If Something Does Not Work {#troubleshooting}

*   **The panel does not open in the browser.** Check that the address includes the secret path (`/k4TnQ8pVzR2Wd` from Step 4) and that the service is running: `x-ui status`. If a firewall is enabled, open the ports: `ufw allow 6873/tcp` and `ufw allow 443/tcp` (use your own panel port).
*   **Username and password lost.** Run `x-ui settings` on the server — the credentials are printed to the console.
*   **The client cannot connect.** Make sure port `443` is not taken by another service (`ss -ltnp | grep :443`), the inbound is enabled, and `pbk`, `sid`, and `sni` match in the client — re-importing the link from the panel is the easiest fix. If only that port fails on a given network, try `8443` or `80` — see **[Alternative Ports](#inbound)**.
*   **Websites stop opening after Step 8.** Blocking rules are the likely cause — review the **Block Domains** list in **Xray Configs → Basic Routing**.

More common questions in **[Troubleshooting (FAQ)](/en/faq)**.
