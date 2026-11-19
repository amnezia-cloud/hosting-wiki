---
title: Can I Use One Server for Multiple Devices
description: "Yes — how many devices a server handles depends on the plan: from 5 people on Start to 120 on Ultra. How to issue a separate key per device and why sharing one is a bad idea."
head:
  - - meta
    - name: keywords
      content: one server multiple devices, how many devices, share vpn, separate key, qr code, configuration
---

# 👥 One Server for Multiple Devices

**Yes.** Set the VPN up on the server once, then hand out configurations or QR codes to any of your devices — phones, tablets, computers — or share them with family. How many people the server handles comfortably depends on the plan: **from 5 on Start to 120 on Ultra** — see **[Which plan to choose](/en/choose-plan)**.

## How to grant access {#how}

| Method | What to do |
| :--- | :--- |
| **AmneziaVPN app** | Export the configuration or QR code in the server settings and import it on the other device — see **[VPN Setup](/en/vpn-setup)** |
| **3X-UI panel** | Add a separate client (**Operations → Add Client**) and issue its `vless://` link |

## Why one key per device {#separate-keys}

*   Traffic statistics stay separate for each user.
*   Traffic limits and expiry dates are set per client rather than for everyone at once.
*   Access can be revoked per person without affecting anyone else.

Running several devices on one key is technically fine and does not cause drops by itself — the inconvenience is in the statistics, the shared limits, and revoking access.

In the 3X-UI panel a single inbound is enough — it can hold as many clients as you need, each with its own traffic limit and expiry date.

## How many devices the server handles {#limits}

It depends on the plan: Start comfortably handles up to 5 people, Basic up to 8, Advanced up to 15, Pro up to 25, Pro Plus up to 30, Power up to 50, Max up to 80, Ultra up to 120. One person means 2–3 devices, not all connected at the same time. This is a recommendation, not a limit: we do not count users or block anything.

The exact number depends on the load: high-definition video and torrents consume the channel far faster than messaging and browsing. The protocol does not matter — the number is the same on AmneziaWG and XRay. Find a plan for your number of people on **[Which plan to choose](/en/choose-plan#calc)**, and change your current one in a couple of minutes, keeping your data and IP: **[Changing the plan](/en/change-plan)**.
