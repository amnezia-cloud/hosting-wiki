---
title: "AmneziaWG: Upgrading from 2.0 to 3.1"
description: "How to move from AmneziaWG 2.0 to 3.1 by reinstalling the protocol, why you should change the default parameters straight away, what the generator configures, and how to roll back to 2.0."
head:
  - - meta
    - name: keywords
      content: "amneziawg 3.1, awg 3.1, awg upgrade, 2.0 to 3.1, roll back to 2.0, transport protection, headerprotectionkey, contentpaddingaddition, mtu 1280, cps chain, architect, parameter generator"
---

# 🆙 AmneziaWG: Upgrading from 2.0 to 3.1

Version 3.x added **transport protection** to AmneziaWG. Everything before it hid the handshake — the moment the connection is established. Transport protection hides the tunnel that is already running: headers are encrypted, transport packets are padded, and timers stop being constant.

::: tip Not everyone needs to upgrade
If AmneziaWG 2.0 connects and works for you, there is no need to touch anything. This page is for the case where your ISP has started throttling the connection and you want more resilience without leaving AWG. For the versions and obfuscation parameters themselves, see **[AmneziaWG: versions and tuning](/en/amneziawg-tuning)**.
:::

## How to move to 3.1 {#upgrade}

There is no in-place upgrade: the container on the server is deployed from scratch. In the **AmneziaVPN** app:

1.  Open **“Server settings” → “AmneziaWG”**.
2.  **Remove the protocol** from the server.
3.  **Install it again** — the app will deploy the current version of the container.

::: danger Old profiles will stop working
Reinstalling the protocol makes previously issued configurations invalid. Generate and distribute new `.conf` files to your users — the old ones will not work on any device.
:::

## Change the default parameters straight away {#defaults}

::: warning This matters more than the upgrade itself
We strongly recommend not leaving the parameters the container receives by default when deployed through AmneziaVPN 5.0.1.5 (and, most likely, later versions). Defaults are identical for everyone, which makes them recognisable.
:::

Steps:

1.  Generate the parameters at **[architect.vai-rice.space/amneziawg](https://architect.vai-rice.space/amneziawg)**.
2.  In the AmneziaVPN app open **“Server settings” → “AmneziaWG” → “AmneziaWG server settings”**.
3.  Transfer every generated value into the matching field manually.
4.  Save the changes.

Two settings worth choosing deliberately:

*   ⚠️ **MTU = 1280.** The recommended value for 3.1. An MTU that is too large fragments packets, and on some routes the connection falls apart.
*   ⚠️ **`ContentPaddingAddition` = 2–10** — if the speed turns out to be low. Padding adds volume to every packet, so pick the smallest value that does the job.

::: danger Profiles again
Changing the server parameters also invalidates every issued configuration. Re-issue the files to your users after editing the settings.
:::

## What the generator configures {#parameters}

The generator assembles the configuration in groups. You do not have to understand all of it — the values are transferred into the app as they are — but it helps to know what each group is responsible for.

| Group | What it controls |
| :--- | :--- |
| **Protocol (version)** | Decides which parameters exist at all. 1.0 has no `S3`, `S4` or CPS chain; header ranges arrived in 2.0; transport protection in 3.0 |
| **Target client** | Sets the ceilings: different clients have different limits, and the generator calculates for the build the config is going to |
| **Network** | The tunnel interface `MTU` and the server address `host:port` |
| **Modes** | Router mode keeps the load low for weak hardware; extreme mode lifts the limits and takes the maximum values |
| **Junk train** | Empty packets sent before the handshake so it is not the first thing an observer sees: `Jc` — how many, `Jmin` and `Jmax` — what size |
| **Packet sizes** | `S1`–`S4`: random padding before each packet type, changing lengths so the protocol cannot be identified by them |
| **Headers** | `H1`–`H4`: four magic numbers the receiving side uses to recognise the packet type |
| **Mimicry profile** | What the junk packets resemble; you pick an HTTP/3 host and a region |
| **Browser fingerprint** | Packet sizes are taken from a real browser so the lengths match what usually leaves the device |
| **CPS chain** | `I1`–`I5`: fake packets sent before the handshake that the receiver never parses — they exist only for an observer |
| **Transport protection** | `HeaderProtectionKey`, `ContentPaddingAddition`, timer randomisation, `RandomTrailers`, `DisableCookies` |

::: warning Header ranges must not overlap
`H1`–`H4` must match the server and must not overlap each other. The generator shows overlaps visually — if there are any, the configuration will not work.
:::

## Client limitations {#clients}

Which tags are available depends on the engine the client runs on. The generator accounts for this itself, but it is worth knowing.

Clients for **Android, iOS, Windows, macOS and Linux** use `amneziawg-go`. Its tag vocabulary is `<b>`, `<t>`, `<r>`, `<rc>`, `<rd>`, `<d>`, `<ds>`, `<dz>`.

*   The `<c>` tag does not exist in `amneziawg-go` at all. If it ends up in the CPS chain, the client will reject the whole configuration.
*   The packet counter is implemented only in the Linux kernel module.

## Rolling back from 3.1 to 2.0 {#rollback}

If the server already runs AmneziaWG 3.1 and you need to return to 2.0:

1.  **Remove the AmneziaWG container** from the server.
2.  **Install AmneziaVPN version 4.8.21.0** — the app version is what determines which protocol version it deploys.
3.  **Install AmneziaWG on the server again** through the app.

::: danger Configurations have to be re-issued again
A rollback is also a container reinstall. Every `.conf` file issued earlier will stop working.
:::

## If something goes wrong {#next}

*   First confirm the protocol is at fault rather than the server: **[step-by-step troubleshooting](/en/vpn-troubleshooting)**.
*   Your ISP may be throttling UDP entirely — no obfuscation helps there, so a TCP-based protocol is the sturdier answer: **[AmneziaWG → XRay](/en/awg-to-xray)**.
*   Still stuck? Write to us and we will work through it together: **[Contacting Support](/en/support)**.
