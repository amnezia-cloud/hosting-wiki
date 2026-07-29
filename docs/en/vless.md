# VLESS + Reality: Detailed Guide

**VLESS** is a modern protocol of the **XRay** core, and **Reality** is a masking technology that makes VPN traffic indistinguishable from a regular visit to an allowed website. This is the most censorship-resistant option in our stack.

## How Reality Works

Common ways of masking as HTTPS use a self-signed certificate that DPI can eventually detect. Reality goes further: on connection, the server **borrows the real TLS handshake** of a legitimate large website on the fly (for example, `dl.google.com`). To an observer, it looks like an ordinary secure connection to a legitimate resource — no separate certificate or domain is required.

## Key Parameters

| Parameter | Purpose |
| :--- | :--- |
| `dest` / `SNI` | The real website the traffic masquerades as (e.g., `dl.google.com:443`) |
| `flow` | Transfer mode, usually `xtls-rprx-vision` |
| `publicKey` (`pbk`) | The server's public key (x25519) for the client |
| `shortId` (`sid`) | A short session identifier |
| `fingerprint` (`fp`) | The uTLS browser to imitate: `chrome`, `firefox`, etc. |
| `spiderX` (`spx`) | Path for extra masking, usually `/` |

## Connection Link Format

A VLESS access key looks like this — it can be imported into a client via a link or QR code:

```text
vless://UUID@YOUR_IP:PORT?type=tcp&security=reality&sni=dl.google.com&fp=chrome&pbk=PUBLIC_KEY&sid=SHORT_ID&spx=%2F&flow=xtls-rprx-vision#Connection-name
```

## Setup

**Option 1. Via the AmneziaVPN app (easier).** Add your server (see **[VPN Setup](/en/vpn-setup)**) and on the protocols tab click **"Install"** next to **XRay**. The Reality parameters are generated automatically.

**Option 2. Via the 3X-UI web panel (more flexible).** Lets you create connections manually and issue separate keys to different users. Step-by-step instructions are in the **[3X-UI Panel](/en/3x-ui)** section.

## Client Applications

The generated `vless://…` links are supported by all modern clients:

| Platform | Apps |
| :--- | :--- |
| **Android** | Hiddify, v2rayNG, NekoBox |
| **iOS (iPhone)** | Streisand, FoXray, Shadowrocket, V2Box |
| **Windows / macOS** | Hiddify, NekoRay, v2rayN |

## When to Choose VLESS + Reality

*   <Icon name="check" tone="ok" /> Regions with strict censorship that block VPN protocols and UDP.
*   <Icon name="check" tone="ok" /> As a reliable **backup** protocol if **[AmneziaWG](/en/awg)** stops connecting.
*   <Icon name="warning" tone="warn" /> Slightly higher CPU load and usually somewhat lower speed than AWG.

::: tip Masking tip
For `SNI`/`dest`, pick a large website that is definitely not blocked in your region and supports TLS 1.3 — this makes the masking as convincing as possible.
:::
