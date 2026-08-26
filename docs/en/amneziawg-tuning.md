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

Version 3.x added transport protection, which hides not just the handshake but the running tunnel as well. For the move and the rollback, see **[upgrading from 2.0 to 3.1](/en/awg-3-1-upgrade)**. For what each version added and what every parameter means, see the reference **[how AmneziaWG works](/en/awg-parameters)**.

## Parameter generators {#generators}

Obfuscation values are easier to generate than to invent:

*   [architect.vai-rice.space](https://architect.vai-rice.space/)
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

1.  Generate the parameters at [architect.vai-rice.space](https://architect.vai-rice.space/).
2.  In the AmneziaVPN app open **“Server settings” → “AmneziaWG” → “AmneziaWG server settings”**.
3.  Transfer the generated values into the matching fields manually.
4.  Save the changes.

::: danger Old profiles will stop working
Once the server parameters change, previously issued configurations become invalid. Generate and distribute new files to your users.
:::

## Changing the port: trial and error {#port}

Try switching the protocol port in the app to anything **below 1000**. This is not a cure-all but a hunch worth testing: if your ISP throttles high ports, it may help — or it may not.

## Changing the virtual subnet {#subnet}

The subnet is usually changed when the default `10.8.1.0/24` clashes with your home router's addressing — for example to `10.8.2.0/24`.

After the change, previously issued client configurations become invalid: **regenerate all `.conf` files** and re-import them on your devices.

## If AWG still will not connect {#next}

*   First confirm the protocol is at fault rather than the server: **[step-by-step troubleshooting](/en/vpn-troubleshooting)**.
*   Your ISP may be throttling UDP entirely — obfuscation cannot help there, so a TCP-based protocol is the sturdier answer: **[AmneziaWG → XRay](/en/awg-to-xray)**.
*   Still stuck? Write to us and we will work through it together: **[Contacting Support](/en/support)**.
