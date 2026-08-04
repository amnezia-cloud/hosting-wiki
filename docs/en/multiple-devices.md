---
title: Can I Use One Server for Multiple Devices
description: Yes — a single VPS serves up to 10 devices at once. How to issue a separate key per device and why sharing one is a bad idea.
head:
  - - meta
    - name: keywords
      content: one server multiple devices, how many devices, share vpn, separate key, qr code, configuration
---

# One Server for Multiple Devices

**Yes.** Set the VPN up on the server once, then hand out configurations or QR codes to any of your devices — phones, tablets, computers — or share them with family. The plans are tuned for smooth performance with **up to 10 devices** connected at the same time.

## How to grant access {#how}

| Method | What to do |
| :--- | :--- |
| **AmneziaVPN app** | Export the configuration or QR code in the server settings and import it on the other device — see **[VPN Setup](/en/vpn-setup)** |
| **3X-UI panel** | Add a separate client (**Operations → Add Client**) and issue its `vless://` link — see **[Issuing a client key](/en/3x-ui#client-key)** |

## Why one key per device {#separate-keys}

*   Traffic statistics stay separate for each user.
*   Traffic limits and expiry dates are set per client rather than for everyone at once.
*   Access can be revoked per person without affecting anyone else.

Running several devices on one key is technically fine and does not cause drops by itself — the inconvenience is in the statistics, the shared limits, and revoking access.

In the 3X-UI panel a single inbound is enough — it can hold as many clients as you need, each with its own traffic limit and expiry date.

## How many devices the server handles {#limits}

The dedicated resources — 1 CPU core, 1 GB RAM, up to 100 MB/s — comfortably cover around 10 active devices. The exact number depends on the load: high-definition video and torrents consume the channel far faster than messaging and browsing.
