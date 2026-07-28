---
title: Contacting Support — What to Include
description: A checklist of details for your ticket, a ready-to-fill template, the split of responsibilities, and security rules.
head:
  - - meta
    - name: keywords
      content: support, ticket, help, whmcs, vpn not working, support template, amnezia hosting support
---

# 💬 Contacting Support

Please write to us — that is what we are here for. No “read the whole documentation first”: if something does not work, or is simply unclear, get in touch.

One request: the more complete your first message, the faster the answer. With the checklist filled in the cause is usually obvious straight away, which saves you several rounds of questions. Keep it **short but cover every point** — and if you do not know something, just say so, that is perfectly fine.

## Where to write {#where}

*   **A ticket in your client area** — the main channel for server, billing, and refund questions.
*   **The support Telegram bot** — for quick questions.

## Before you write: a quick self-check {#before}

Three checks resolve most tickets and take a couple of minutes:

| Check | If it fails |
| :--- | :--- |
| Server status in the panel is **Active (Running)** | [Server Management](/en/server-management#security) |
| The server answers `ssh root@YOUR_SERVER_IP` | [Connection troubleshooting](/en/vpn-troubleshooting#error-305) |
| It works on another network (wired internet / another carrier) | [ISP blocking](/en/vpn-troubleshooting#isp-blocks), [mobile restrictions](/en/mobile-restrictions) |

## What to include in the ticket {#checklist}

| Item | Example |
| :--- | :--- |
| **Device** | iPhone 14, Android, Windows 11 laptop |
| **Internet at the time of the problem** | mobile carrier / home Wi-Fi |
| **Protocol** | AmneziaWG, XRay, or another — shown on the app's main screen under the connect button |
| **Connect button behaviour** | spins on “Connecting” forever **or** turns green but there is no internet |
| **Other VPN services** | do they work right now on the same device and network |
| **Security software** | antivirus, blockers (AdGuard), other VPNs — these can conflict with Amnezia |
| **Error text** | the exact wording or a screenshot if the app shows an error |

## Ready-to-fill template {#template}

Copy and fill it in — that is enough for a first message:

```text
Device:
Internet at the time of the problem:
Protocol:
Connect button behaviour:
Other VPNs on this device and network:
Antivirus / blockers / other VPNs:
Error text (or screenshot):
What I already tried:
```

## Split of responsibilities {#scope}

| Our side | Your side |
| :--- | :--- |
| Hardware stability and network availability up to the server | Installing and configuring protocols (AmneziaWG, XRay, Hysteria2) |
| VPS state in the panel and server replacement after **Bad State** — including after `Reinstall OS` or `Reset Password` on servers issued before 20 July 2026 ([details](/en/reinstall)) | Client app settings and the keys you issue |
| IP address replacement on a justified request | Choice of port, masking domain, and routing rules |

What we physically cannot do — and why:

*   **Lift blocking by your ISP or carrier** — the filtering happens inside their network: [details](/en/vpn-troubleshooting#isp-blocks).
*   **Add your server to state “whitelists”** — [mobile restrictions](/en/mobile-restrictions).
*   **Correct the country shown by third-party GeoIP databases** — [geolocation](/en/geolocation).
*   **Bypass services that reject data-center traffic** — for example [Gemini](/en/gemini).

## Security {#security}

::: danger Never send passwords
Support staff **never ask** for your root password or client-area password. Do not paste passwords, private keys, or configuration contents into a ticket or chat. If a password has already been sent, change it immediately with `passwd` or the **Reset Password** button.
:::
