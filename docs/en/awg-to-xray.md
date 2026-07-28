---
title: What to Do if AmneziaWG Stops Working
description: "Your ISP started blocking AWG — switch to XRay with masking: port 443, SNI ya.ru, fallbacks 8443 and 2gis.ru."
head:
  - - meta
    - name: keywords
      content: amneziawg not working, awg not connecting, xray, ya.ru, sni, port 443, 8443, isp blocking, wireguard, amnezia
---

# 🔁 AmneziaWG Stopped Working — Switch to XRay

If AWG no longer connects or the connection hangs, your ISP has most likely started blocking this type of traffic. AWG runs over **UDP**, and on heavily filtered networks that traffic is throttled entirely. The fix is to move the server to **XRay**, which runs over TCP and disguises itself as ordinary HTTPS.

## Symptoms {#symptoms}

*   The connection spins endlessly and drops on timeout.
*   AWG used to work and stopped with no configuration changes.
*   The same AWG connects on a different network (another carrier, wired internet).

If the server does not answer over SSH either, the protocol is not the problem — start with the **[step-by-step troubleshooting](/en/vpn-troubleshooting#error-305)**.

## Step-by-step fix {#fix}

1.  **Update the app.** Download the latest AmneziaVPN client from GitHub — mandatory, because older versions handle XRay incorrectly.
2.  **Remove the old protocol.** In the server settings inside the app, delete AWG completely.
3.  **Install XRay.** Click **“Add protocol”** → **XRay** and set the masking parameters exactly:

| Setting | Value |
| :--- | :--- |
| **Port** | `443` |
| **SNI** | `ya.ru` |

4.  Wait for the installation to finish (up to a minute) and connect with XRay selected.

## If 443 with ya.ru did not work {#fallback}

Change one thing at a time:

| What to change | Options | When to try it |
| :--- | :--- | :--- |
| **Port** | `8443`, then `80` | 443 is taken on the server or throttled by the ISP |
| **SNI** | `2gis.ru`, `pochta.ru` | masking as `ya.ru` does not pass DPI |
| **Network** | another carrier, wired internet | to find out whose network filters traffic |

For manual setup with full control over ports, keys, and the masking domain, use the web panel: **[3X-UI Panel](/en/3x-ui)** and its **[alternative ports](/en/3x-ui#inbound)** section.

## Why XRay is more resilient {#why}

| | AmneziaWG | XRay / VLESS + Reality |
| :--- | :--- | :--- |
| Transport | UDP | TCP + TLS |
| How the ISP sees it | obfuscated VPN traffic | an ordinary HTTPS connection to an allowed site |
| Speed and ping | higher | slightly lower |
| DPI resistance | high | maximum |

Full protocol comparison — **[Protocols](/en/protocols)**. Ideally keep both on the server: AWG for speed, XRay as the fallback.
