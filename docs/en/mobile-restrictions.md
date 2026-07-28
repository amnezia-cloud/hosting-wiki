---
title: No Server Access on Mobile Internet (Whitelists)
description: During drone-threat alerts carriers switch networks to state whitelists — VPS and VPN become unreachable. Why it cannot be bypassed and what to do.
head:
  - - meta
    - name: keywords
      content: mobile whitelist, carrier restriction, drone threat internet, cellular block vps, ssh connection failed mobile, tspu, vpn block 4g
---

# 📵 No Server Access on Mobile Internet (“Whitelists”)

If your server is active but access from a smartphone or modem disappears completely — especially while a drone-attack threat is declared in the region — that is the result of enforced security measures. During such periods mobile carriers switch their networks to state “whitelist” mode.

## Why it happens {#why}

| What the carrier does | What it means for you |
| :--- | :--- |
| Passes traffic only to a limited list of essential platforms (Yandex services, VKontakte, Gosuslugi, maps, some banks) | Everything else, including your VPS, is unreachable |
| Blocks technical protocols at the DPI (TSPU) and carrier equipment level | SSH, RDP, WireGuard, VLESS, and any VPN connection stop working |
| Leaves only standard web browsing to approved sites | The VPN app fails to connect and `ssh` times out |

## Why hosting cannot bypass it {#no-workaround}

*   The restrictions are enabled remotely by the carriers under direct orders — hosting support has no influence over cellular towers.
*   Adding a personal server's IP address to state exception lists is not possible.
*   Changing the protocol, port, or masking domain does not help: the filtering works off an allowed list of destinations, not off traffic type.

## What to do {#what-to-do}

1.  **Switch to wired internet.** The restrictions apply to mobile networks only (3G/4G/5G). Home wired connections (FTTB, xDSL) and stationary Wi-Fi keep working normally — VPS access returns immediately.
2.  **Wait for the alert to be lifted.** Once the regional threat is cleared, carriers restore normal operation and the connection from your phone comes back automatically.
3.  **Confirm that this is the cause.** If the server answers `ssh root@IP` from a wired connection, the server is fully functional and the restriction is on the mobile network side.

::: tip If there are no regional restrictions
When access fails from wired internet too, the cause is different — run through the **[step-by-step troubleshooting](/en/vpn-troubleshooting)**.
:::
