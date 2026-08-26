---
title: "AmneziaWG: Versions and Fine-Tuning"
description: "How to tell the AWG version from the config, what differs between 1.0, 1.5 and 2.0, where to get obfuscation parameters, and what to watch when changing the port or subnet."
head:
  - - meta
    - name: keywords
      content: "amneziawg, awg, obfuscation, junk packets, h1 h2 h3 h4, i1 i5, s3 s4, awg 2.0, mimicry, quic, dns, parameter generator, subnet"
---

# 🛡️ AmneziaWG: Versions and Fine-Tuning

**AmneziaWG** is a WireGuard fork with obfuscation: it alters traffic signatures so DPI systems do not recognise a VPN. If the default settings are not enough and your ISP has started throttling the connection, the parameters can be tuned by hand.

::: tip If you would rather not touch anything, you don't have to
A plain installation from the app works for most users. This page is for those whose AWG stopped connecting and who want to fight for it before switching to XRay: **[AmneziaWG → XRay](/en/awg-to-xray)**.
:::

## How to tell the version {#version}

Open the `.conf` file in any text editor and look at the parameters:

| Version | What the config shows |
| :--- | :--- |
| **AWG Legacy 1.0** | `H1`–`H4` are single numbers, e.g. `H1 = 666067622` |
| **AWG Legacy 1.5** | everything from 1.0 plus the `I1`–`I5` parameters |
| **AWG 2.0** | `H1`–`H4` are ranges, e.g. `H1 = 666067622-666092814`, plus the new `S3` and `S4` |
| **AWG 3.1** | everything from 2.0 plus the transport protection parameters: `HeaderProtectionKey` (ChaCha20 header encryption), `ContentPaddingAddition` (random transport padding), `RandomTrailers` (pads packets up to the MTU with random values), `DisableCookies` (disables `cookiereply` responses on the WireGuard port), plus randomised protocol timers |

Version 3.x added transport protection, which hides not just the handshake but the running tunnel as well. For the move and the rollback, see **[upgrading from 2.0 to 3.1](/en/awg-3-1-upgrade)**. For what each version added and what every parameter means, see the reference **[how AmneziaWG works](/en/awg-parameters)**.

## Parameter generators {#generators}

Obfuscation values are easier to generate than to invent:

*   [architect.vai-rice.space](https://architect.vai-rice.space/amneziawg/)
*   [voidwaifu.github.io/Special-Junk-Packet-List](https://voidwaifu.github.io/Special-Junk-Packet-List/) — the site has a button with filling instructions
*   [spatiumstas.github.io/junker](https://spatiumstas.github.io/junker/)
*   [sageptr.github.io/mini_quic_generator](https://sageptr.github.io/mini_quic_generator/)

## AWG 1.0 and 1.5: client-side only {#legacy}

There is no full mimicry of other protocols here. The goal is simpler: change the standard signatures — packet sizes and headers — so DPI does not recognise a VPN and lets the traffic through as unknown.

The configuration is **client-side only**: parameters go into the connection in the AmneziaVPN app or straight into the `.conf` file on the device. Nothing changes on the server.

```text
I1 = <b 0xc000...>
I2 = <b 0xd300...>
```

## AWG 2.0: mimicry and server settings {#awg2}

In 2.0 there is full mimicry of specific protocols — QUIC, DNS, TLS. This configuration changes the **server's** parameters.

::: warning The port must match the disguise
If you mimic DNS, use port `53`. For web traffic (QUIC / HTTP3), use port `443`. DNS mimicry on a random high port looks implausible to DPI.
:::

Steps:

1.  Generate the parameters at [architect.vai-rice.space](https://architect.vai-rice.space/amneziawg/).
2.  In the AmneziaVPN app open **“Server settings” → “AmneziaWG” → “AmneziaWG server settings”**.
3.  Transfer the generated values into the matching fields manually.
4.  Save the changes.

::: danger Old profiles will stop working
Once the server parameters change, previously issued configurations become invalid. Generate and distribute new files to your users.
:::

## Installing the legacy 1.0 and 1.5 versions {#legacy-install}

If you need an older version of the protocol — one predating the 2.0 spec — you have to roll the **client** back temporarily: the protocol version deployed on the server is decided by the app you install it from.

The order matters:

1.  **Fully uninstall** the current AmneziaVPN app from your device.
2.  Download and install client version **4.8.11.4** — the last build without the AWG 2.0 logic.
3.  Connect to the server with 4.8.11.4 and **install the AWG protocol**. The legacy version (AWG 1.0) will be deployed to the server.
4.  **Update AmneziaVPN** to the current version. The app will keep working correctly with a server running the older protocol.

## Backing up the containers {#backup}

The protocol settings live inside a docker container on the server. If you plan to experiment with versions, take a copy first — reinstalling the protocol takes every issued key with it.

There is a community script for this, [amnezia-backup](https://github.com/nastyagrifon/amnezia-backup). It has been verified at least on AWG containers.

::: warning This is a third-party script
It is neither ours nor Amnezia's — it is a third party's work, and it runs on your server as `root`. Open it and read it before running: the command below downloads the file rather than executing it straight away, precisely so that you can.
:::

Download it to the server and make it executable:

```bash
curl -O https://raw.githubusercontent.com/nastyagrifon/amnezia-backup/refs/heads/main/amnezia-backup.sh && chmod +x amnezia-backup.sh
```

Back up into `~/amnezia-backups/`:

```bash
./amnezia-backup.sh amnezia-backups
```

Restoring takes two steps. First install a container of the version you need — simply install the protocol through the matching AmneziaVPN version with any settings — then restore the data into it:

```bash
./amnezia-backup.sh -r amnezia-backups
```

## Changing the port: trial and error {#port}

Try switching the protocol port in the app to anything **below 1000**. This is not a cure-all but a hunch worth testing: if your ISP throttles high ports, it may help — or it may not.

## Changing the virtual subnet {#subnet}

The subnet is usually changed when the default `10.8.1.0/24` clashes with your home router's addressing — for example to `10.8.2.0/24`.

After the change, previously issued client configurations become invalid: **regenerate all `.conf` files** and re-import them on your devices.

## If AWG still will not connect {#next}

*   First confirm the protocol is at fault rather than the server: **[step-by-step troubleshooting](/en/vpn-troubleshooting)**.
*   Your ISP may be throttling UDP entirely — obfuscation cannot help there, so a TCP-based protocol is the sturdier answer: **[AmneziaWG → XRay](/en/awg-to-xray)**.

::: warning Protocol tuning is outside hosting support
We sell a server, not a VPN service. Choosing obfuscation parameters and configuring the client are on your side — see the **[scope of responsibility](/en/support#scope)**. This page shares what we and the community have collected, but we cannot debug individual configurations.

*   Questions about the protocol and its parameters belong in the Amnezia community: **[Russian chat](https://t.me/amnezia_vpn)**, **[English](https://t.me/amnezia_vpn_en)**.
*   Write to **[hosting support](/en/support)** when the server itself is the problem: it will not power on, is unreachable, or shows Bad State.
:::

## Sources {#sources}

The practical procedures on this page come from **[Shidla's AmneziaWG instructions](https://gitlab.com/ShidlaSGC/amn-instructions/-/blob/main/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB%20AmneziaWG.md)** — thank you for collecting and verifying this material. For the parameters themselves, see the reference **[how AmneziaWG works](/en/awg-parameters#source)**.
