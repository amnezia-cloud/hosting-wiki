---
title: "Moving from Amnezia Premium to Amnezia Hosting"
description: "How to carry the remainder of a Premium subscription over to your own VPS: account, transfer ticket, what to include, and when the subscription is switched off."
head:
  - - meta
    - name: keywords
      content: "amnezia premium, move from premium, subscription transfer, own server, vps, subscription key, migration, my.amnezia.host"
---

# Moving from Amnezia Premium to Amnezia Hosting

If you use **Amnezia Premium** and would like your own server, the remainder of your subscription is not lost — we carry it over to a VPS. Just write to us and we will walk through it together; it usually takes a couple of messages in a ticket.

::: tip What changes after the move
Premium is a ready-made VPN on shared infrastructure. Your own VPS is a separate server where you choose the protocol, port, and masking domain, and hand out keys to whomever you like. Setting it up is easier than it sounds — every step is covered in **[Quick Start](/en/commands)** and **[VPN Setup](/en/vpn-setup)**.
:::

## Step 1. Create an account {#account}

Sign up in the client area at **[my.amnezia.host](https://my.amnezia.host)** — this is the separate hosting client area, and a Premium account does not work there.

## Step 2. Open a subscription transfer ticket {#ticket}

You can reach us two ways:

*   a **ticket in the client area** at [my.amnezia.host](https://my.amnezia.host) — the main route;
*   the **support Telegram bot**, if that is more convenient.

Mention that you are moving from Amnezia Premium and include three things:

| What to include | Where to find it |
| :--- | :--- |
| **Premium subscription key** | in the AmneziaVPN app or in your purchase email |
| **Subscription expiry date** | the date Premium is paid up to |
| **The email the subscription is registered to** | the address used when buying Premium |

We need these to verify the subscription and calculate the remaining time — the transfer cannot be processed without them.

## Step 3. We activate the server {#activation}

Support checks the details and issues a VPS that accounts for the remaining subscription time. The server card will show the IP address, the `root` username, and the password — see **[Connection Details](/en/server-management#credentials)**.

## Step 4. Premium is switched off {#premium-off}

We disable Premium **after** the server is active, so you are never left without a VPN for a day. The order is deliberate: a working VPS first, then the subscription ends.

::: warning Please do not cancel Premium yourself in advance
If the subscription is switched off before the transfer, calculating the remainder gets harder. Just mention it in the ticket — we will handle it at the right moment.
:::

## What to do right after activation {#next-steps}

1.  Connect to the server over SSH — **[Quick Start](/en/commands)** explains it from scratch.
2.  Set up the VPN in three steps from the app — **[VPN Setup](/en/vpn-setup)**.
3.  Need separate keys for family or your own devices? The panel makes it easy: **[3X-UI](/en/3x-ui)**.
4.  A couple of minutes on basic hardening — **[Server Security](/en/security)**.

## Common questions about the move {#faq}

::: details What if less than a month of my subscription is left?
Mention it in the ticket and support will suggest the best option for your case. We would rather the move worked out in your favour than against it.
:::

::: details Will my Premium keys and settings carry over?
No — your own server is a fresh installation, so keys and configurations are generated anew. On the plus side, you can issue as many as you need for any device — see **[Multiple devices](/en/multiple-devices)**.
:::

::: details I have never worked with a server. Will I manage?
Yes. The VPN installs from the app in a few taps and the console is rarely needed. If something does not work out, write to us and we will tell you exactly what to press: **[Contacting Support](/en/support)**.
:::
