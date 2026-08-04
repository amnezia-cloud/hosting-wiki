---
title: The Server Is in Bad State (Broken State)
description: What to do when the server stops booting and ignores Power On — do not press the buttons again, open a ticket right away.
head:
  - - meta
    - name: keywords
      content: bad state, broken state, server not starting, power on not working, server replacement, ticket, node
---

# The Server Is in Bad State

**Bad State** (shown as **Broken State** in the panel) means a failure at the virtual container level: the server does not boot and ignores `Power On` and `Reboot`. Unpleasant, but solvable — and almost always at no cost to you: engineers restore access, and if it cannot be restored, the server is replaced.

## What to do {#what-to-do}

1.  **Do not press the control buttons repeatedly** — it can make the container error worse and complicate recovery.
2.  **Open a ticket** in your client area at **[my.amnezia.host](https://my.amnezia.host)**. Engineers will check the node manually and either restore access or replace the server.
3.  Mention what you did right before the failure — it speeds up diagnosis. Checklist: **[Contacting Support](/en/support)**.

## The most common cause {#cause}

The usual scenario is pressing **Reinstall OS** or **Reset Password** on a server issued **before 20 July 2026**. Those operations are not supported on such VPS and lead to Bad State.

To check the issue date and whether those buttons are available to you: **[Reinstalling the OS](/en/reinstall#check)**.

## What happens to data and the IP {#data}

*   If the server is restored in place, the data and IP address are preserved.
*   If a replacement is needed, the server is issued anew: **the IP address may change**, and settings and keys have to be recreated — **[Reinstalling the OS → replacement](/en/reinstall#legacy)**.

::: tip The server is active but the VPN fails
That is a different situation and unrelated to Bad State. Run the **[step-by-step troubleshooting](/en/vpn-troubleshooting)**.
:::
