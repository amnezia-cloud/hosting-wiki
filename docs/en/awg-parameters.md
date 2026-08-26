---
title: "AmneziaWG: How It Works and What Each Parameter Means"
description: "How AmneziaWG differs from WireGuard, what each version from 1.0 to 3.1 added, which parameters must match the server and which are client-side only, and how to pick an MTU."
head:
  - - meta
    - name: keywords
      content: "amneziawg, awg, wireguard, obfuscation, dpi, jc jmin jmax, s1 s2 s3 s4, h1 h2 h3 h4, i1 i5, headerprotectionkey, contentpaddingaddition, mtu, awg 3.0, amneziawg-go, chain tags"
---

# 🔬 AmneziaWG: How It Works and What Each Parameter Means

A reference for anyone configuring obfuscation by hand who wants to know what every field does. If your task is simpler — upgrading or fixing a connection — start with the practical pages: **[upgrading from 2.0 to 3.1](/en/awg-3-1-upgrade)** and **[versions and fine-tuning](/en/amneziawg-tuning)**.

## How AmneziaWG differs from WireGuard {#vs-wireguard}

AmneziaWG is a WireGuard fork that solves one specific problem: **plain WireGuard is far too easy to identify**.

Its packets have a fixed first byte for the message type and predictable sizes — 148 bytes for the handshake initiation and 92 for the response. DPI therefore recognises the protocol from the very first packet and blocks it outright.

AmneziaWG adds a layer of obfuscation on top of the same cryptography: random headers instead of fixed ones, variable-length padding, junk packets before the session, and mimicry of other protocols.

::: tip The cryptography does not change
Noise itself is untouched — only how the connection looks from the outside changes. Obfuscation does not make the tunnel more or less secure; it makes it unrecognisable.
:::

## What each version added {#versions}

| Version | What arrived |
| :--- | :--- |
| **1.0** | Basic obfuscation: junk packets (`Jc`, `Jmin`, `Jmax`), `S1` and `S2` padding, fixed magic headers `H1`–`H4` |
| **1.5** | CPS chains `I1`–`I5` — client-side only |
| **2.0** | `S3` and `S4` (cookie and transport packet padding); `H1`–`H4` are ranges rather than single numbers — each packet's header is picked from the range at random |
| **3.0** | `HeaderProtectionKey` (ChaCha20 header encryption), `ContentPaddingAddition` (random transport padding) and randomisation of the protocol timers |
| **3.1** | `RandomTrailers` — pads packets up to the MTU with random values; `DisableCookies` — disables `cookiereply` responses on the WireGuard port |

To identify the version from your own `.conf`, see **[How to tell the version](/en/amneziawg-tuning#version)**.

## Which parameters must match the server {#matching}

Not all of them, and the split is worth getting exactly right. It follows from how the receiving side parses a packet: in `amneziawg-go` the `DeterminePacketTypeAndPadding` function (`device/receive.go`) tries to identify an incoming packet by two properties — its length must equal its own `S` plus the known message size, and the four bytes at offset `S` must fall inside its own `H` range. No match, and the packet is typed `Unknown` and silently dropped.

Hence three groups.

### Shared — must match {#common}

`S1`–`S4`, `H1`–`H4` and `HeaderProtectionKey`.

The receiver parses incoming packets using its own values, so a mismatch means the packet is dropped **silently, with no error**. The header protection key belongs here too: the cipher is built from your own key and a nonce taken from the `S` padding of the arriving packet.

::: warning Silently means without diagnostics
This is the nastiest class of failure: the connection simply never comes up, and neither the logs nor the app show a clear reason. If the tunnel stopped working after you edited parameters by hand, check this group first.
:::

### Client-side — need not match {#client-side}

`Jc`, `Jmin`, `Jmax`, the `I1`–`I5` chain and `ContentPaddingAddition`.

Junk packets and the `I` chain are sent before the handshake initiation and are not parsed on receipt at all — landing in the `Unknown` branch is exactly what they are for. `ContentPaddingAddition` adds padding inside the encrypted payload, and the receiver trims the excess using the length from the IP header, so it does not need to know the value.

::: tip Practical takeaway
It is useful to give different devices **different** `Jc`, `Jmin`, `Jmax` and `I1`–`I5`. An identical junk train across a hundred clients is a ready-made pattern for DPI; varied ones give no such pattern.
:::

### Local — each side has its own {#local}

The 3.0 timers: `RekeyAfterTime`, `RekeyTimeout`, `RejectAfterTime`, `KeepaliveTimeout`, `MaxHandshakeAttempts`.

They require no agreement, but do not push them to extremes either: otherwise one side will start re-establishing a session the other still considers alive.

## The parameters one by one {#parameters}

### Jc, Jmin, Jmax — junk packets {#junk}

Before the session starts, the client sends `Jc` junk UDP packets of random length between `Jmin` and `Jmax` bytes.

The point is to smear the timing and size profile of the connection start: instead of a clean “148 bytes, then 92”, DPI sees a queue of differently sized packets in which the real handshake does not stand out.

The price is traffic and start-up time — every junk packet really does go out on the wire. **A `Jc` of 3 to 7 is usually enough**; larger values noticeably slow the connection down, especially on mobile networks.

### S1–S4 — packet padding {#padding}

The number of random bytes prepended to a packet to break up its characteristic size:

| Parameter | Which packet |
| :--- | :--- |
| `S1` | handshake initiation |
| `S2` | handshake response |
| `S3` | cookie reply |
| `S4` | transport packets |

The resulting sizes become `148 + S1` and `92 + S2` instead of fixed ones.

::: danger The trap: S1 + 56 = S2
If `S1 + 56` happens to equal `S2`, the initiation and the response become the same size again — reproducing exactly the fingerprint you were trying to escape. The generator watches for such collisions and will not emit them.
:::

`S4` is capped at 32 bytes by the protocol.

### H1–H4 — headers {#headers}

`H1`–`H4` replace WireGuard's predictable message type identifiers (1, 2, 3, 4) with arbitrary 32-bit values: `H1` for initiation, `H2` for response, `H3` for cookie reply, `H4` for transport. From version 2.0 on these are ranges, and each packet's value is drawn from the range at random.

**They must not overlap**, for a simple reason: the receiver determines the packet type from precisely this number. If the `H1` and `H4` ranges overlap, a packet from the overlapping zone cannot be classified unambiguously and will be dropped. The generator spreads all four ranges apart and checks this before emitting.

### I1–I5 — the CPS chain {#cps}

Up to five packets the client sends before the handshake so that the start of the session looks like a different protocol. The contents are described with tags:

| Tag | What it inserts |
| :--- | :--- |
| `<b hex>` | static bytes — a QUIC Initial header, for example |
| `<t>` | a 32-bit timestamp in network byte order |
| `<r N>` | `N` cryptographically random bytes |
| `<rc N>` | `N` random Latin letters |
| `<rd N>` | `N` random digits |

Typically `I1` carries a recognisable signature of a real protocol, while `I2`–`I5` add entropy so the batch does not look identical from session to session.

**Which tags are available is decided by the engine, not the app.** The five above are understood by both engines: `amneziawg-go` and the Linux kernel module. Beyond them, `amneziawg-go` has `d`, `ds`, `dz`, while the kernel module has `<c>`, a packet counter that does not exist in go at all.

::: warning An unknown tag rejects the whole packet
That is why the generator disables a tag when the chosen client's engine does not know it. Clients for Android, iOS, Windows, macOS and Linux run on `amneziawg-go`, which has no `<c>` tag.
:::

### Why some tags are unavailable {#disabled-tags}

Because in the current release they do nothing. In `amneziawg-go` v3.0.1 these tags are indeed handled by the parser, but the `I1`–`I5` chains are only invoked in the sending code with an empty payload — so tags that operate on packet data receive nothing.

Judging by the `feature/awg4` branch in `amneziawg-tools`, where the seven 3.0 keys are replaced with `DI`, `DR`, `DC` and `DT`, this is groundwork for transport packet masking in AmneziaWG 4.0. Until the feature is complete, emitting it in a config means emitting a config that does not work.

## How to pick an MTU {#mtu}

| Value | When it fits |
| :--- | :--- |
| **1500** | Standard Ethernet — most wired connections |
| **1420** | PPPoE and mobile networks, where encapsulation eats part of the packet |
| **1280** | The minimum MTU guaranteed by IPv6 — for when the connection establishes but large packets are lost |

::: tip The symptom of too large an MTU is recognisable
Ping goes through, light pages open, but heavy sites and downloads hang. If that is the picture, lower the MTU.
:::

For AmneziaWG 3.1 the recommendation is to set **MTU = 1280** straight away — see **[upgrading from 2.0 to 3.1](/en/awg-3-1-upgrade#defaults)**.

## Sources {#source}

This page is assembled from community material rather than written by us from scratch:

*   **[The ARCHITECT generator FAQ](https://architect.vai-rice.space/faq)** — how the protocol works, the parameter breakdown, and citations to the places in the code the behaviour follows from.
*   **[Shidla's AmneziaWG instructions](https://gitlab.com/ShidlaSGC/amn-instructions/-/blob/main/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB%20AmneziaWG.md)** — version identification, the 3.1 markers and practical procedures.

Thank you to the authors for putting any of this in writing at all.
