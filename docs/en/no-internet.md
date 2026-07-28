---
title: VPN Connects but There Is No Internet
description: The button turns green but sites do not open — two VPNs conflicting, antivirus, blocking rules in 3X-UI, or an outdated client.
head:
  - - meta
    - name: keywords
      content: vpn connected but no internet, sites not opening through vpn, adguard conflict, two vpns, ru domain blocking, dns
---

# 🚫 VPN Connects but There Is No Internet

The connect button turned green, so the server is reachable and the tunnel is up. The problem is where traffic goes inside the tunnel. Check in order.

## 1. Two VPNs at once {#two-vpns}

If a second VPN client is installed on the device (even inactive) or a system profile from another service remains, it can hijack the routes. Disable and remove the extra VPN profiles, then reconnect.

## 2. Antivirus and blockers {#security-software}

Antivirus suites, firewalls, and ad blockers (AdGuard and similar) often filter traffic at the system level and conflict with the VPN client. Turn them off while testing.

## 3. Blocking rules on the server {#server-rules}

If you configured the server through the 3X-UI panel and enabled blocking for the `.ru`, `.su`, `.рф` zones or the `RU Russia` list, Russian sites will not open through the VPN — that is the rules working as intended. Review the list in **Xray Configs → Basic Routing**: **[Blocking ads and RU domains](/en/3x-ui#routing)**.

## 4. Outdated client or broken configuration {#reinstall-protocol}

Update the AmneziaVPN app to the latest version, delete the protocol in the server settings, and install it again. Keys issued before the protocol was reinstalled stop working — hand out new ones.

## 5. The service itself rejects data-center traffic {#service-blocks}

If only a specific service fails rather than everything, its own filters may be the cause: **[Gemini](/en/gemini)**, for example, rejects requests from hosting addresses. Check whether other sites open.

## Nothing helped {#next}

Run the **[step-by-step troubleshooting](/en/vpn-troubleshooting)**, and if the cause is still unclear, collect the checklist details and write to us: **[Contacting Support](/en/support)**.
