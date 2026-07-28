---
title: VPN Connection Issues — Step-by-Step Troubleshooting
description: Error 305, checking the server over SSH, ISP blocking and state whitelists. What to check yourself and when to open a ticket.
head:
  - - meta
    - name: keywords
      content: vpn not connecting, error 305, xray, amneziawg, blocking, whitelists, troubleshooting, ssh, dpi
---

# 🩺 VPN Connection Issues: Step-by-Step Troubleshooting

Amnezia Hosting provides a VPS with a clean operating system: we are responsible for hardware stability and network availability **up to the server**. Installing, configuring, and troubleshooting the protocols (AmneziaWG, XRay, Hysteria2) is done on your side. The order of checks below covers most cases.

| Symptom | Likely cause | Where to look |
| :--- | :--- | :--- |
| Server is off or in “Broken State” | server-side failure | [Step 1](#status) |
| Error 305 in the app | the app cannot see the server | [Step 2](#error-305) |
| SSH does not respond, times out | ISP blocks traffic to the server | [Step 3](#isp-blocks) |
| Fails on mobile data only | carrier whitelist mode | [Mobile restrictions](/en/mobile-restrictions) |
| Connects, but there is no internet | protocol or routing conflict | [Step 4](#next) |

## Step 1. Server status in the panel {#status}

Sign in to your client area and confirm the VPS is **Active (Running)**. If the status is **Broken State** or the server ignores `Power On` / `Reboot`, do not press the buttons repeatedly — open a ticket right away: see **[Server Management](/en/server-management#security)**.

## Step 2. Error 305 — checking the server over SSH {#error-305}

Error **305** in AmneziaVPN means the app failed to establish a connection with the server. Check manually whether the server answers:

```bash
ssh root@YOUR_SERVER_IP
```

| Result | What it means | What to do |
| :--- | :--- | :--- |
| The server asks for a password | The hosting works fine | The issue is in the app or the credentials. Use the **server's SSH password**, not your hosting account password |
| The connection hangs or drops | Traffic does not reach the server | Go to [Step 3](#isp-blocks) |
| `Permission denied` | Server reachable, password wrong | Reissue it with **Reset Password** — shut the server down first, and only if it was issued on or after 20 July 2026 ([why](/en/reinstall#check)) |

Details on console access — **[Server Management](/en/server-management#ssh)**.

## Step 3. ISP blocking and “whitelists” {#isp-blocks}

If the server is active in the panel but does not respond even over SSH, your ISP or mobile carrier is blocking traffic to its IP address.

*   **How it works.** Russia operates DPI systems (TSPU) that, in certain modes, pass traffic only to approved (“whitelisted”) resources. Foreign VPS hosting is absent from those lists by default.
*   **Hosting does not bypass IP-level blocks.** Our infrastructure runs normally; we cannot affect filtering inside your country or on your carrier's network, nor add your server address to state exception lists.

What to do:

1.  **Change the network** — home Wi-Fi instead of mobile data, a different carrier, a hotspot from another phone. If it works on another network, the first ISP is filtering.
2.  **Switch to a stealthier protocol** — XRay/VLESS disguises itself as ordinary HTTPS traffic: **[AmneziaWG stopped working](/en/awg-to-xray)**.
3.  **Change the port** — if 443 is throttled, try 8443 or 80: **[3X-UI Panel](/en/3x-ui#inbound)**.
4.  **Request an IP change** through support if your server's address is blocked specifically.

If the problem only occurs on mobile data during a drone-threat alert, see **[Mobile restrictions and whitelists](/en/mobile-restrictions)**.

## Step 4. Connected, but no internet {#next}

The button turns green and sites still do not open — the server is reachable, so the tunnel configuration is at fault:

*   check that **two VPNs are not installed at once** (the second one hijacks the routes) and that an antivirus or AdGuard is not blocking traffic;
*   review the blocking rules in 3X-UI: with the `.ru` / `RU Russia` zones enabled, Russian sites will not open through the VPN — **[Blocking Russian domains](/en/3x-ui#routing)**;
*   reinstall the protocol in the app after updating the client to the latest version;
*   a separate case is services that reject data-center traffic themselves: **[Gemini via VPN](/en/gemini)**.

## Still stuck — contacting support {#support}

Collect the details from the checklist so it can be solved in the first reply: **[Contacting Support](/en/support)**.
