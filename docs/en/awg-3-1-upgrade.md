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

There is no in-place upgrade: the protocol is removed from the server and installed again, and the app deploys the current version of the container. Everything happens in the **AmneziaVPN** app — no SSH access to the server is needed.

### Step 1. Open the server settings {#step-1}

In the server list, tap the **gear ⚙️** to the right of the server you want. The server's IP address is shown under its name — make sure it is the right one.

### Step 2. Open the protocol {#step-2}

The server page opens with the **Protocols**, **Services** and **Management** tabs. On the **Protocols** tab, tap the **AmneziaWG** row — the **›** arrow on the right.

### Step 3. Remove the protocol {#step-3}

The **AmneziaWG settings** screen has four entries:

*   **AmneziaWG connection settings**
*   **AmneziaWG server settings**
*   **Clear profile**
*   **Remove** (in red)

Tap **Remove**. This deletes the AmneziaWG container from the server.

::: danger Do not confuse this with “Clear profile”
`Clear profile` only clears the connection profile on the device — the container on the server stays at its old version and no upgrade happens. **Remove** is the one you need.
:::

### Step 4. Install the protocol again {#step-4}

Go back to the server list, tap the **gear ⚙️** again and pick **AmneziaWG** on the **Protocols** tab — this time to install it. The app will deploy the current version of the container.

Once it is installed, go straight to the next section: changing the default parameters is not optional.

::: danger Old profiles will stop working
Reinstalling the protocol makes previously issued configurations invalid. Generate and distribute new `.conf` files to your users — the old ones will not work on any device.
:::

## Change the default parameters straight away {#defaults}

::: warning This matters more than the upgrade itself
We strongly recommend not leaving the parameters the container receives by default when deployed through AmneziaVPN 5.0.1.5 (and, most likely, later versions). Defaults are identical for everyone, which makes them recognisable.
:::

Steps:

1.  Generate the parameters at **[architect.vai-rice.space/amneziawg](https://architect.vai-rice.space/amneziawg/)**.
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

The generator assembles the configuration in groups. You do not have to understand all of it — the values are transferred into the app as they are — but it helps to know what each group is responsible for. For a detailed breakdown of every parameter and which of them must match the server, see the reference **[how AmneziaWG works](/en/awg-parameters)**.

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

## Installing 3.1 without losing a working 2.0 {#keep-2-0}

The standard route deletes the old container along with every key issued from it. If 2.0 is serving live users you cannot cut off, do not delete the container — **rename** it. The app will then not see it, will conclude the protocol is absent, and will install a new one alongside.

::: danger What you get and what you don't
The AWG 2.0 container keeps running and **already-issued configurations keep working**. But you can no longer manage it from the app: issuing a new user from 2.0 is not possible without further renaming. This is a way to carry existing clients until they migrate, not a permanent arrangement.
:::

Connect to the server over SSH (see **[Server Management](/en/server-management#ssh)**) and rename the container:

```bash
docker rename amnezia-awg2 amnezia-awg2-old
```

You can confirm the result like this — the container is still running, only its name changed:

```bash
docker ps | grep amnezia
```

Then install the AmneziaWG protocol from **AmneziaVPN 5.0.1.5** the usual way (step 4 above). It will come up as **AWG 3.1** and take the freed `amnezia-awg2` name.

The server then holds three containers: the new `amnezia-awg2` (3.1), the old `amnezia-awg` (1.x, if you had one) and the renamed `amnezia-awg2-old` (2.0). Only **1.x and 3.1** are manageable from the app — the renamed 2.0 is invisible to it.

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

::: warning Protocol tuning is outside hosting support
We sell a server, not a VPN service. Upgrading the protocol and choosing parameters are on your side — see the **[scope of responsibility](/en/support#scope)**. This guide shares what we and the community have collected, but we cannot debug individual configurations.

*   Questions about the protocol and its parameters belong in the Amnezia community: **[Russian chat](https://t.me/amnezia_vpn)**, **[English](https://t.me/amnezia_vpn_en)**.
*   Write to **[hosting support](/en/support)** when the server itself is the problem: it will not power on, is unreachable, or shows Bad State.
:::

## Sources {#sources}

The upgrade procedure, the rollback and the container-renaming trick come from **[Shidla's AmneziaWG instructions](https://gitlab.com/ShidlaSGC/amn-instructions/-/blob/main/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB%20AmneziaWG.md)** — thank you for collecting and verifying this material. For the generator's parameters, see the reference **[how AmneziaWG works](/en/awg-parameters#source)**.
