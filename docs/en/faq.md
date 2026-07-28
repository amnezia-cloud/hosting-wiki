---
title: Frequently Asked Questions
description: "An index of every topic: connection and VPN, server and access, billing and plans. Each question has its own article."
head:
  - - meta
    - name: keywords
      content: faq, frequently asked questions, help, troubleshooting, amnezia hosting, support
---

# ❓ Frequently Asked Questions

An index of every walkthrough. Each question has its own article — open the one you need, and if your question is not listed, write to us: **[Contacting Support](/en/support)**.

## 🔌 Connection and VPN {#connection}

| Question | In short |
| :--- | :--- |
| **[VPN not connecting: step-by-step troubleshooting](/en/vpn-troubleshooting)** | The overall order of checks: server status, error 305, ISP blocking |
| **[The app says “Server connection error”](/en/connection-error)** | Typos in credentials, the OS is still installing, port 22 is closed |
| **[VPN connects but there is no internet](/en/no-internet)** | Two VPNs, antivirus, blocking rules in 3X-UI |
| **[Ping to the server does not work](/en/ping)** | ICMP is blocked on purpose — check over SSH |
| **[AmneziaWG stopped working](/en/awg-to-xray)** | Switching to XRay: port 443, SNI `ya.ru`, fallbacks |
| **[20x errors during installation](/en/error-20x)** | Docker: mirrors, HostVDS, an unstable Alpine CDN |
| **[30x errors during installation](/en/error-30x)** | SSH: the port, installing behind another VPN, key format |
| **[No access on mobile internet](/en/mobile-restrictions)** | Carrier “whitelists”, no way around them |
| **[Google Gemini does not work](/en/gemini)** | Requests from data-center addresses are filtered |
| **[YouTube ads](/en/youtube-ads)** | YouTube decides by IP; where ads are absent and what helps |

## 🎛️ Protocols and traffic {#protocols}

| Question | In short |
| :--- | :--- |
| **[Which protocol to choose](/en/protocols)** | AmneziaWG for speed, XRay / VLESS to defeat blocking |
| **[XRay: masking and tuning](/en/xray-tuning)** | A domain in your subnet, verification, fingerprint, BBR |
| **[AmneziaWG: versions and tuning](/en/amneziawg-tuning)** | Versions 1.0 / 1.5 / 2.0, obfuscation parameters, subnet |
| **[One server for multiple devices](/en/multiple-devices)** | Yes, up to 10 devices; one key each |
| **[How much traffic the VPN uses](/en/traffic-usage)** | Every gigabyte passes through the server twice |

## 🖥️ Server and access {#server}

| Question | In short |
| :--- | :--- |
| **[How to change the root password](/en/root-password)** | `passwd` over SSH; `Reset Password` only on servers from 20 July 2026 |
| **[Reinstalling the OS](/en/reinstall)** | Works on servers issued on or after 20 July 2026 |
| **[The server is in Bad State](/en/broken-state)** | Do not press the buttons again — open a ticket |
| **[Server geolocation mismatch](/en/geolocation)** | Third-party GeoIP databases lag behind |
| **[How to protect the server from hacking](/en/security)** | UFW, changing the SSH port, fail2ban |

## 💳 Billing and plans {#billing}

| Question | In short |
| :--- | :--- |
| **[How to pay for the hosting](/en/payment)** | FreeKassa, YooKassa, Stripe |
| **[How to get a refund](/en/refund)** | Terms depend on the ordered period |
| **[How to change my plan](/en/change-plan)** | There are no other plans right now |
| **[How to change the billing period](/en/billing-period)** | Through support: Telegram or a ticket |
| **[Moving from Amnezia Premium](/en/premium-migration)** | We carry the remaining subscription over to your own server |

## 🔧 Support {#support}

If your question is not listed, collect the checklist details and write to us: **[Contacting Support](/en/support)**. That page also has a ready-to-fill template and the split of responsibilities.

*   💻 A ticket in your client area at **[my.amnezia.host](https://my.amnezia.host)** — the main channel.
*   💬 The official Amnezia user community on Telegram.
*   📂 Self-diagnosis of the OS — **[Server Management](/en/server-management)**.
