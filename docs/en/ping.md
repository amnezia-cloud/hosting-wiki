---
title: Ping to the Server Does Not Work
description: ICMP is blocked on our servers, so ping always times out. Availability is checked over SSH instead.
head:
  - - meta
    - name: keywords
      content: ping not working, request timed out, 100% loss, icmp, server availability check, vps ping
---

# 📡 Ping to the Server Does Not Work

`Request timed out` or `100% packet loss` in response to `ping` is **normal and does not mean the server is down**.

## Why ping stays silent {#why}

ICMP traffic is blocked on our servers deliberately: the server does not answer mass network scans and draws less attention from automated scanners. Checking availability with `ping` is therefore pointless — even a perfectly healthy server will not reply.

## How to check the server is alive {#how-to-check}

```bash
ssh root@YOUR_SERVER_IP
```

A password prompt means the server works and the network reaches it. If the connection hangs or drops, move on to the walkthrough: **[VPN not connecting](/en/vpn-troubleshooting#error-305)**.

The server status is also visible in your client area at **[my.amnezia.host](https://my.amnezia.host)** — it should be **Active (Running)**.
