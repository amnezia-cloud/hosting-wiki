---
title: "30x Errors in AmneziaVPN"
description: "Errors 301, 302 and other 30x during protocol installation: stating the SSH port explicitly, installing from behind another VPN, server diagnostics, and SSH key formats."
head:
  - - meta
    - name: keywords
      content: "error 301, error 302, error 30x, amneziavpn, protocol installation, ssh, port 22, ssh key, pem, ed25519, putty, ppk"
---

# 30x Errors in AmneziaVPN

The **30x** series (301, 302 and similar) almost always means one thing: the app could not reach the server over SSH during installation. The server is usually alive — it is access that fails. Let's work through it, simplest first.

::: tip Start with the official documentation
It is worth checking the Amnezia documentation for your specific error first — it sometimes has case-specific hints. If the basics do not help, come back here.
:::

## 1. State the SSH port explicitly {#explicit-port}

In the AmneziaVPN app, append the port to the IP address with a colon:

```text
15.20.30.40:22
```

If you changed the SSH port in the security settings, use yours.

## 2. Install the protocol from behind another VPN {#other-vpn}

Your ISP may be blocking the installation scripts themselves. Turn on any other working VPN and run the protocol installation in Amnezia again.

::: warning Check split tunneling
In the other VPN, split tunneling must be off — or the AmneziaVPN app must be on the list of apps whose traffic goes through that VPN. Otherwise the installation goes out directly again and hits the same block.
:::

## 3. Check whether the server is reachable {#diagnostics}

For a clean result, run the checks **twice**: first with the VPN off, then with it on (a different, working VPN).

1.  Open a terminal: **macOS / Linux** — Terminal; **Windows** — `Win + R`, `cmd`, Enter.
2.  Check packet flow: `ping SERVER_IP`
3.  Check SSH access: `ssh root@SERVER_IP`
    *   Paste the password with `Ctrl+Shift+V` or a right-click.
    *   Characters do not appear while typing — that is normal, just press Enter.
    *   On the first connection, answer the trust prompt with `yes` and press Enter.

::: info About ping on our servers
ICMP is closed deliberately, so `ping` will not answer even on a perfectly healthy server — judge by the `ssh` result. See **[Ping does not work](/en/ping)**.
:::

What the result means:

| Result | What it means | What to do |
| :--- | :--- | :--- |
| Unreachable both with and without VPN | The server is off or hung | Reboot it in the client area. If that does not help, write to us: **[Contacting Support](/en/support)** |
| Reachable **only** with a VPN on | Your ISP has blocked the server's IP or SSH itself | Install protocols from behind another VPN. Sometimes an ISP only throttles ping and SSH while XRay or AWG work fine once installed |
| Always reachable in the terminal, but the app errors out | DPI recognises the app's traffic during initial setup, or it is an app bug | Install the protocol from behind another VPN |

## 4. Last resort: roll the app back {#rollback}

If the server definitely works but installation will not go through, the new client version may be at fault. Users report that installing the previous stable version from GitHub helps — for example `4.8.11.4` (without AWG 2.0 support). Remove the current AmneziaVPN version and install that one.

## If you connect with an SSH key {#ssh-keys}

A common cause of 30x is the wrong key format. The app expects a PEM key or an OpenSSH ED25519 key:

| Key | First line of the file | Works |
| :--- | :--- | :--- |
| RSA in PEM format | `-----BEGIN RSA PRIVATE KEY-----` | <Icon name="check" tone="ok" /> yes |
| ED25519 | `-----BEGIN OPENSSH PRIVATE KEY-----` | <Icon name="check" tone="ok" /> yes, that header is normal for ED25519 |
| RSA in the new OpenSSH format | `-----BEGIN OPENSSH PRIVATE KEY-----` | <Icon name="x" tone="bad" /> this is what the parser usually complains about |

### RSA in the wrong format

```bash
ssh-keygen -p -m PEM -f /path/to/your/private/key
```

::: warning Copy the key first
The command overwrites the existing file, converting it to PEM. Make a copy beforehand so nothing is lost.
:::

### A PuTTY key (`.ppk`)

1.  Open **PuTTYgen**.
2.  **Conversions → Import key**, pick your `.ppk`.
3.  **Conversions → Export OpenSSH key** — the saved file is the PEM key you need.

### A different algorithm (ECDSA, DSA)

Such keys cannot be converted — the underlying maths differs. Generate a new pair, preferably ED25519, and add the public key to the server:

```bash
ssh-keygen -f id_ed25519 -C "amnezia" -N "" -q -t ed25519
```

| Flag | Meaning |
| :--- | :--- |
| `-f id_ed25519` | save the private key to the file `id_ed25519` |
| `-C "amnezia"` | a label to identify the key |
| `-N ""` | no passphrase |
| `-q` | quiet mode |
| `-t ed25519` | key type ED25519 |

## After changing the password, user, or login method {#credentials-changed}

If you hardened the server — changed the SSH password, moved to keys, or switched from `root` to a regular user — the app will lose its connection: it cannot edit saved connection details.

What to do:

1.  Remove the server from the app and add it again with the current credentials.
2.  If protocols were already installed, **do not install them again** — in the server settings press **“Check the server for previously installed Amnezia services”**.

## What each code means {#codes}

Below is the breakdown of codes 300–305: what the error means and what helps in that particular case.

### 300 — SshRequestDeniedError {#code-300}

*SSH request was denied.* Occurs when the server connection data is incorrect, the server lacks resources, or a newer AmneziaVPN version is required.

1.  Verify that the entered data is correct.
2.  Verify that the server is reachable and healthy: free disk space, available memory, not frozen, and responding over SSH.
3.  Restart the server from the hosting panel, then retry.
4.  Update the app to the latest version from the official download page.

### 301 — SshInterruptedError {#code-301}

*SSH request was interrupted.* Occurs when adding a new server, connecting to an already added one, or changing its settings.

1.  Check the stability of your internet connection and retry.

### 302 — SshInternalError {#code-302}

*SSH internal error.* The causes vary:

*   **Amnezia Premium or Amnezia Free** — the connection is created on an iOS device running an outdated app version 4.8.2.0 or lower.
*   **Self-hosted** — the server IP is blocked by the ISP; the server was shut down by the hosting provider; the connection data was entered incorrectly.

For Premium or Free:

1.  Update the app in the App Store. If it is unavailable — the app is hidden in the Russian App Store, for instance — see **[Installing AmneziaVPN on iOS in Russia](/en/ios-app-store)**.

For a self-hosted server:

1.  Fully restart the application and retry the action.
2.  Try the same action from another network: mobile internet, another provider, or through another VPN if needed.
3.  If the error only occurs on one network while another succeeds, the server IP is blocked by that ISP. Changing the server IP or renting a server with a different IP will help.
4.  If the error occurs for any server action together with errors 300 or 305, additionally check SSH availability and the server status.

### 303 — SshPrivateKeyError {#code-303}

*Invalid private key or invalid passphrase entered.* Occurs when adding a server, connecting to one, or changing its settings.

1.  Verify that the key and its passphrase are correct.

### 304 — SshPrivateKeyFormatError {#code-304}

*The selected private key format is not supported.* Supported types are **openssh ED25519** keys and keys in **PEM** format.

1.  Check the key format — conversion steps are in the **[SSH key format](#ssh-keys)** section above.

### 305 — SshTimeoutError {#code-305}

*Timeout connecting to server.* Occurs when connecting to the server or changing its settings: port 22 may be closed or blocked, or the server may be unreachable for some reason.

1.  Make sure the server is powered on and answers over SSH.
2.  Verify the username, password, IP address, and server port (after a colon).
3.  Make sure you specify the SSH port the server actually accepts connections on: you may have changed it, or the default port 22 may be blocked.
4.  Restart the server from the hosting panel.
5.  Retry the action from another network.

A step-by-step walkthrough of 305 — **[VPN not connecting](/en/vpn-troubleshooting#error-305)**.

## If nothing helped {#contacts}

Write to us and we will sort it out together:

| Channel | Address |
| :--- | :--- |
| **Ticket in the client area** | [my.amnezia.host](https://my.amnezia.host) — the main channel |
| **Email** | [support@amnezia.host](mailto:support@amnezia.host) |
| **Support bot on Telegram** | [@amnezia_hosting_bot](https://t.me/amnezia_hosting_bot) |
| **Community chat (Russian)** | [t.me/amnezia_vpn](https://t.me/amnezia_vpn) |
| **Community chat (English)** | [t.me/amnezia_vpn_en](https://t.me/amnezia_vpn_en) |

What to include so the first reply is already on point — **[details checklist](/en/support#checklist)**.
