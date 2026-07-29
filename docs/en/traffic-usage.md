---
title: How Much Traffic Does the VPN Use
description: The VPN itself generates no traffic, but every gigabyte passes through the server twice — once inbound, once outbound.
head:
  - - meta
    - name: keywords
      content: vpn traffic usage, how much traffic, traffic limit, unlimited, double traffic, consumption
---

# How Much Traffic Does the VPN Use

The VPN server itself generates no traffic — consumption depends entirely on your activity.

## The doubling rule {#double}

Every gigabyte passes through the server twice: the server downloads the data first, then delivers it to you.

| What you do | Server-side usage |
| :--- | :--- |
| Download a 1 GB file | 2 GB (1 GB in + 1 GB out) |
| Watch a 5 GB movie | 10 GB |
| Messaging, email, web pages | tens to hundreds of MB per day |

## Choosing a plan {#plan}

Our servers come with unlimited traffic and a channel of up to 100 MB/s, so there is no need to count gigabytes. Current specs and prices are on **[amnezia.host](https://amnezia.host)**.

## Checking actual usage {#monitor}

*   **The 3X-UI panel** shows traffic per client in the **Inbounds** section, where you can also set a per-user limit (**Total Flow**).
*   **On the server**, use `vnstat` (install it with `apt install vnstat`) or the statistics section of your client area.
