---
title: The App Says “Server Connection Error”
description: "Three common causes of the connection error in AmneziaVPN: typos in credentials, the OS is still installing, port 22 is closed."
head:
  - - meta
    - name: keywords
      content: server connection error, amneziavpn error, cannot connect, port 22, firewall, os installation
---

# ⚠️ The App Says “Server Connection Error”

The message looks alarming, but usually nothing is broken: the app simply could not log in to the server over SSH to install or read the configuration. In most cases it is one of the three causes below, and it takes a minute to fix.

## 1. Typos in the credentials {#credentials}

Check the IP address, username, and password for stray spaces — a space usually sneaks in while copying. The default username is `root`. The password must be the **server's (SSH) password**, not your hosting account password.

Current details are on the server card at **[my.amnezia.host](https://my.amnezia.host)**, see **[Connection Details](/en/server-management#credentials)**.

## 2. The server is not ready yet {#not-ready}

After payment the operating system takes 2 to 10 minutes to install. Make sure the server status in the panel is **Active (Running)** and try again.

## 3. Port 22 is closed {#port-22}

Check that no firewall in your hosting control panel blocks incoming SSH connections. If you changed the SSH port on the server yourself, specify it in the app or connect with the `-p` flag.

## Credentials are correct but the error persists {#next}

Check the server manually:

```bash
ssh root@YOUR_SERVER_IP
```

A password prompt means the server is reachable and the app is at fault. A timeout means your network is blocking traffic to the server. Full walkthrough: **[VPN not connecting](/en/vpn-troubleshooting)**.
