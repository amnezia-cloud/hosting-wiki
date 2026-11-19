---
title: Which Plan to Choose
description: How many people each Amnezia Hosting plan handles on AmneziaWG and XRay, how neighbouring plans differ, and which one to pick for a VPN, a bot, a website or CI.
head:
  - - meta
    - name: keywords
      content: which plan to choose, how many vpn users, vps plans, start, basic, advanced, pro, power, max, ultra, amneziawg, xray, plan comparison
---

# Which Plan to Choose

Renting a server for your own VPN is a popular choice among our customers.<br>
Below is how many people each plan handles comfortably and what that depends on. Browse the plans in the tabs below or find the right one in two steps.

<PlanCta />

::: info This is a recommendation, not a limit
We do not count users or block anything. The numbers are the point up to which the server runs without speed drops or lag. One person means 2–3 devices, not all connected at the same time.
:::

<PlanGuide />

## How to tell the server is not coping {#signs}

- In the evening speed is noticeably lower than during the day, and ping goes up.
- Video buffers for several people at once.
- SSH and the Amnezia app respond with a delay.

Over SSH: `htop` shows core load, `free -h` shows free memory. CPU above 80% or almost no free memory — time to move to a bigger plan.

::: info Picked the wrong plan? No problem
Changing the plan takes a couple of minutes, and your data and IP address are kept. More in [📦 Changing the plan](/en/change-plan).
:::
