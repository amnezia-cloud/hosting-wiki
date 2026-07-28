---
title: Reinstalling the Server OS
description: OS reinstallation works on servers issued on or after 20 July 2026. On older VPS it leads to Bad State, and the server has to be replaced by support.
head:
  - - meta
    - name: keywords
      content: reinstall os, reinstall server, bad state, broken state, reset password, server replacement, vps
---

# 🔄 Reinstalling the Server OS

A reinstall returns the server to a clean operating system — handy if the configuration got tangled, you want to set the VPN up from scratch, or you are switching protocols.

::: danger Only works on servers issued on or after 20 July 2026
Servers issued **on 20 July 2026 or later** support OS reinstallation from the client area.

On servers issued **before that date**, a reinstall puts the machine into **Bad State**: it stops booting and cannot be recovered in place — it has to be replaced by support.

**The same applies to the `Reset Password` button** — on older servers it leads to the same outcome.
:::

## First check when your server was issued {#check}

The service activation date is shown on the server card in your client area at **[my.amnezia.host](https://my.amnezia.host)**.

| Issue date | What is available |
| :--- | :--- |
| **20 July 2026 or later** | OS reinstall and password reset work normally |
| **Before 20 July 2026** | Do not press `Reinstall OS` or `Reset Password`. If you need a clean OS or lost the password, open a ticket — support will replace the server |

## What a reinstall does {#what-happens}

*   The disk is wiped completely: VPN settings, keys, the 3X-UI panel, and all installed software are gone.
*   A new root password is issued — collect it from the client area once the process finishes.
*   The server's IP address stays the same.
*   The whole process takes a few minutes.

::: warning Client connections stop working
Every issued key and configuration becomes invalid: after the reinstall the protocols are installed again and new keys are issued. Warn anyone you shared access with.
:::

## Before you reinstall {#before}

Save whatever you will want to restore:

*   `vless://` links and QR codes from the 3X-UI panel, if you plan to recreate the same inbounds;
*   AmneziaWG configurations exported from the app;
*   3X-UI panel credentials (port, username, password, Base URI Path) — they will all be new afterwards;
*   a list of manually installed software and firewall rules.

## Step by step {#how}

1.  Open the server card in your **[client area](https://my.amnezia.host)**.
2.  Click **Reinstall OS** and confirm the operation.
3.  Wait for it to finish — the status returns to **Active (Running)**.
4.  Copy the new root password from the server card.
5.  Connect over SSH and update the system:

    ```bash
    apt update && apt upgrade -y
    ```
6.  Set up the VPN again — **[VPN Setup](/en/vpn-setup)** or the **[3X-UI panel](/en/3x-ui)**.

## Older servers: replacement through support {#legacy}

If your server was issued before 20 July 2026 and you need a clean OS or lost the password:

1.  Open a ticket in your client area describing what you need — a reinstall or access recovery. Details checklist: **[Contacting Support](/en/support)**.
2.  Support will replace the server with a new one, where reinstall and password reset work.
3.  **The IP address may change with the replacement** — issued keys and configurations will need to be reissued.

::: tip The server is already in Bad State
Do not press the control buttons repeatedly — it only complicates diagnostics. Open a ticket right away and engineers will check the node manually. Details — **[Server Management](/en/server-management#security)**.
:::

## After the reinstall {#after}

*   Update the system and reinstall the protocols: **[Quick Start](/en/commands)**, **[VPN Setup](/en/vpn-setup)**.
*   Basic hardening for the fresh server: **[Server Security](/en/security)**.
*   Hand out new keys to your users — the old ones no longer work.
