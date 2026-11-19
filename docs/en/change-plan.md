---
title: How to Change My Plan
description: "You can change your plan at any time — it takes a couple of minutes and keeps your data and IP address. Which plans exist and how to tell it is time to move up."
head:
  - - meta
    - name: keywords
      content: change plan, upgrade, more resources, plans, server configuration, prices, start, basic, advanced, pro, power, max, ultra
---

# 📦 How to Change My Plan

You can change your plan **at any time**: it takes a couple of minutes, and **your server data and IP address are kept** — nothing needs to be reinstalled and keys do not have to be handed out again.

Not sure which plan you need? Compare them and find the right one in two steps on **[Which plan to choose](/en/choose-plan)**.

## Available plans {#config}

| Plan | Configuration | Bandwidth | Comfortable for | Price |
| :--- | :--- | :--- | :--- | :--- |
| **Start** | 1 vCPU, 1 GB RAM, 20 GB SSD | 100 Mbps | up to 5 people | from $5.25/mo |
| **Basic** | 1 vCPU, 2 GB RAM, 20 GB SSD | 100 Mbps | up to 8 people | from $6.15/mo |
| **Advanced** | 2 vCPU, 4 GB RAM, 40 GB SSD | 200 Mbps | up to 15 people | from $9.45/mo |
| **Pro** | 4 vCPU, 4 GB RAM, 80 GB SSD | 300 Mbps | up to 25 people | from $15.15/mo |
| **Pro Plus** | 4 vCPU, 8 GB RAM, 80 GB SSD | 300 Mbps | up to 30 people | from $18.95/mo |
| **Power** | 8 vCPU, 8 GB RAM, 160 GB SSD | 500 Mbps | up to 50 people | from $30.35/mo |
| **Max** | 8 vCPU, 16 GB RAM, 160 GB SSD | 1 Gbps | up to 80 people | from $37.95/mo |
| **Ultra** | 16 vCPU, 32 GB RAM, 200 GB SSD | 1 Gbps | up to 120 people | from $58.85/mo |

The number of people is a recommendation, not a limit: one person means 2–3 devices, not all connected at the same time. Current prices are always listed on **[amnezia.host](https://amnezia.host)**.

## When to move up {#signs}

*   In the evening speed is noticeably lower than during the day, and ping goes up.
*   Video buffers for several people at once.
*   SSH and the Amnezia app respond with a delay.

Over SSH: `htop` shows core load, `free -h` shows free memory. CPU above 80% or almost no free memory — time to move to a bigger plan. More in **[How to tell the server is not coping](/en/choose-plan#signs)**.

## If you need even more resources {#more}

*   **Order a second server** — in another location or for another group of users, for example. For more than 120 people this is more reliable than a single server.
*   **Write to support** via **[my.amnezia.host](https://my.amnezia.host)**: describe the load you need and we will help pick a configuration.

The billing term can be changed separately: **[How to change the billing period](/en/billing-period)**.
