---
title: "AmneziaWG: Obfuscation with Architect"
description: "Set up AmneziaWG 3.1, choose parameters in Architect, and transfer them to AmneziaVPN step by step."
---

# AmneziaWG on your own server: setup and obfuscation with Architect

This guide takes you from renting a server to a working connection. Each parameter includes its purpose and an example setting. IP addresses, passwords, and the port are hidden in the screenshots. Keep your own credentials private.

::: warning Check your version and available settings
The example uses **AmneziaWG 3.1** in AmneziaVPN for Windows. Menu names and available fields may differ in your version. Select the installed protocol version in Architect and enable only features you can configure in the app.

These values are a starting point for testing your connection. They do not guarantee that you can bypass blocking. The screenshots below show the Russian interface from the source guide; English labels in this article are translations.
:::

## What you need {#s1}

- A Windows computer with AmneziaVPN installed.
- A Linux VPS. The screenshot shows 1 vCPU, 1 GB RAM, and 20 GB SSD; this is the example configuration, not a plan requirement.
- Server access details: IP address, `root` username, and password.
- The [AmneziaWG Architect](https://architect.vai-rice.space/amneziawg) parameter generator.

## Part 1. Rent a server {#s2}

1. Order a server from [Amnezia Hosting](https://amnezia.host) or use your own VPS. Choose a location with a stable connection from your network.
2. The example uses **Ubuntu Server LTS**. See the [main setup guide](/en/vpn-setup) for installation through the app.
3. After payment, open the service panel. In **Server**, find IP address, Username (`root`), and Password. The eye icon reveals the password; the adjacent icon copies it.
4. **Service Actions** includes Start VM, Stop VM, Soft Reboot, and Hard Reboot VM. If the server freezes, try Soft Reboot first.

![Hosting panel and server credentials in AmneziaVPN](/img/amneziawg-architect/01.jpg)

*AmneziaVPN is on the left; the hosting panel from the original example is on the right. IP, IPv6, password, and service name are hidden. Your account may have different actions and server specifications.*

See [server management](/en/server-management) for credentials and account actions. After setup, you can [change the root password](/en/root-password).

## Part 2. Add the server to AmneziaVPN {#s3}

1. Open AmneziaVPN and choose **VPN on your own server** (Russian: **«VPN на своём сервере»**). The version in the screenshot calls this window **«Настроить ваш сервер»** (Set up your server).
2. Enter the **IP address[:port]**, **SSH username** (`root`), and **password** or private key. Add the SSH port after a colon if it is nonstandard. Use an ED25519 or RSA key in PEM format, including the BEGIN/END lines.
3. Click **Continue** (**«Продолжить»**).

**Purpose:** the app connects to the server over SSH as an administrator and installs and configures the required software. Your credentials stay with you.

## Part 3. Install AmneziaWG {#s4}

1. On the installation type screen, choose **Automatic** (**«Автоматическая»**) to install AmneziaWG. Use **Manual** if you want a different protocol.
2. Click **Continue**.
3. Wait for installation to finish, usually within five minutes.

![Choosing the installation type](/img/amneziawg-architect/02.jpg)

![AmneziaWG installation in progress](/img/amneziawg-architect/03.jpg)

4. The server appears on the main screen. The example shows **AmneziaWG (version 3.1)**. Check your version, click **Connect** (**«Подключиться»**), and confirm that the connection works with the default settings.

![Main screen after installation](/img/amneziawg-architect/04.jpg)

## Part 4. Open AmneziaWG settings {#s5}

The bottom of the main screen has four icons: home, share, settings (a gear), and add server (a plus).

**Path:** gear → **Servers** → your server → **AmneziaWG** → **AmneziaWG connection settings** (**«AmneziaWG настройки подключения»**).

The AmneziaWG settings screen contains connection settings (the obfuscation fields used here), server settings (a different section), Clear profile, and a red Delete button. Do not delete the protocol unless you intend to remove it.

![AmneziaWG settings screen](/img/amneziawg-architect/05.jpg)

Keep the app next to your browser to transfer values from the generator.

## Part 5. Configure parameters in Architect {#s6}

Open [Architect](https://architect.vai-rice.space/amneziawg) and work through its sections from top to bottom.

### 5.1. Protocol version

**Purpose:** the version determines which protection mechanisms are available.

**Details:** the parameter set depends on the protocol version. See [how AmneziaWG works](/en/awg-parameters#versions) for the differences.

**Choose:** **3.1** for the example, because the app shows AmneziaWG version 3.1. The generator version must match the server version.

### 5.2. Target client

**Purpose:** clients support different features. The generator adapts the parameters to the selected client.

**Choose:**

- Client: **Amnezia VPN**.
- Server address `host:port`: leave it **empty** when transferring values manually. Fill it in only if you need a complete `.conf` file.
- Platform: your platform (Android, iOS, Windows, macOS, or Linux).

**Important:** keep the `<c>` tag disabled for this example, as shown in the generator screenshot. Enable **HeaderProtectionKey** using the checkbox in the app; see [part 6](#s7). If you use the standalone AmneziaWG client, select that client in the generator.

![Protocol and target client sections](/img/amneziawg-architect/06.jpg)

### 5.3. Network (MTU)

**Purpose:** MTU is the maximum packet size inside the tunnel. An excessive value can cause fragmentation or packet loss along the route.

**Details:** the right value depends on the route. This example uses `1280`; see [choosing an MTU](/en/awg-parameters#mtu).

**Choose:** **1280**.

### 5.4. Modes

- **Router mode:** reduces the load on limited hardware. Keep it **off** for this computer or phone example.
- **Extreme maximums:** uses extreme values, increasing traffic and the risk of instability. Keep it **off**.

![Network (MTU) and modes](/img/amneziawg-architect/07.jpg)

### 5.5. Junk train (Jc, Jmin, Jmax)

**Purpose:** standard WireGuard starts with a recognisable handshake packet. The client sends random junk packets before it to make identification by deep packet inspection (DPI) harder.

**Details:** **Jc** is the number of junk packets; 0 disables them. The example uses **5**. More packets mean more overhead. **Jmin and Jmax** set packet size limits. In the generator shown, profiles set these to LOW 64–512, **MED 128–1024**, or HIGH 256–1280 bytes.

**Choose:** **Jc = 5, MED**. For a limited server or metered connection, try Jc = 3, LOW. For stronger blocking, try Jc = 7–10, HIGH while monitoring stability. Do not use values above 1280 in this example.

![Junk train section](/img/amneziawg-architect/08.jpg)

### 5.6. Packet sizes (S1–S4)

**Purpose:** extra padding changes control packet sizes and makes recognition by length harder.

**Details:** S1 applies to the handshake initiation packet, S2 to the response, and S3 and S4 to the remaining types. With header protection enabled, the generator keeps these values at 12 bytes or more.

**Choose:** leave automatic generation enabled.

### 5.7. Mimicry profile

**Purpose:** selects the protocol imitated by packets I1–I5. For example, the QUIC profile creates packets resembling the start of a QUIC connection. The tunnel itself does not become QUIC.

| Profile | What it imitates |
| --- | --- |
| QUIC Initial · RFC 9000 | The first packet of a QUIC connection (HTTP/3) |
| QUIC 0-RTT · Early Data | QUIC with early data |
| TLS 1.3 Client Hello · RFC 8446 | The start of an HTTPS connection |
| Noise_IK · standard | A Noise handshake, the basis of WireGuard; a neutral option |
| DTLS 1.2 / 1.3 Handshake | TLS over UDP (calls, WebRTC) |
| HTTP/3 Host Mimicry · RFC 9114 | QUIC for a specific HTTP/3 site |
| SIP · RFC 3261 | IP telephony |
| TLS → QUIC · Alt-Svc | A browser switching from TLS to QUIC |
| QUIC Burst · multi-packet | A sequence of QUIC packets |
| DNS Query · RFC 1035 | A DNS query |
| STUN / TURN · RFC 8489 | Call signalling packets |
| Random selection | A profile selected on each generation |

![Mimicry profile list](/img/amneziawg-architect/09.jpg)

**Choose:** **QUIC Initial** (the default) or **HTTP/3 Host Mimicry**. If these do not help, try DTLS 1.3 or STUN/TURN. Use DNS or SIP only with server ports 53 or 5060 respectively; a mismatched port makes the imitation less plausible.

Additional fields:

- **Mimicry host:** use the generator's search. The source example lists `do.co`, `ya.ru`, and `dns.sb`; check their suitability before use. This field is mainly for HTTP/3 Host Mimicry. If unsure, leave it empty.
- **Host region:** **Any** (**«Любой»**).
- **Apply profile to I2–I5:** **off** by default.

### 5.8. Browser fingerprint

**Purpose:** uses browser packet sizes to resemble normal traffic from the device.

**Choose:** keep **Imitate packet sizes** off. Try enabling it only as an experiment if the basic settings do not help.

![Mimicry profile and browser fingerprint](/img/amneziawg-architect/10.jpg)

### 5.9. CPS chain and tags

**Purpose:** the CPS chain consists of five fake packets I1–I5 sent before the handshake. The server does not parse them; they are intended for traffic observers.

**Details:** packets are assembled from tags:

| Tag | Purpose |
| --- | --- |
| `<b 0x...>` | Fixed bytes (the QUIC header in I1) |
| `<t>` | Timestamp |
| `<r N>` | N random bytes |
| `<rc N>` | N random alphanumeric characters |
| `<rd N>` | N random digits |
| `<c>` | Packet counter |

The `<c>` checkbox is shaded in the screenshot: the generator disabled it for the selected client. Do not manually enable unavailable tags.

**Choose:** leave the tags as shown: `<t>`, `<r>`, `<rc>`, and `<rd>` enabled, `<c>` disabled.

![CPS tags and I1–I5 packets](/img/amneziawg-architect/11.jpg)

### 5.10. Protocol switches

These switches control additional obfuscation mechanisms. **Recommended for 3.1** (**«Рекомендуемые для 3.1»**) restores the generator's preset.

::: warning Check the app fields first
The app screenshots do not show separate fields for **RandomTrailers**, **DisableCookies**, or merging **S1–S4**. To follow this example, leave all three **off** before generating values. If your version has these settings, check their compatibility separately.
:::

| Switch | Purpose | Choose |
| --- | --- | --- |
| Header encryption (HeaderProtectionKey) | Encrypts packet type and service fields with ChaCha20; the app creates the key | **On**, including the checkbox in the app |
| Traffic padding (ContentPaddingAddition) | Varies data packet sizes | **On** |
| Floating timers (RekeyAfterTime, KeepaliveTimeout, etc.) | Varies the timing of repeated handshakes | **On** |
| Random trailers (RandomTrailers) | Adds random trailing data; requires support at both ends | **Off** for the interface shown |
| No cookie replies (DisableCookies) | Disables Cookie Reply responses | **Off** |
| Disable H1–H4 | Sets headers to the standard values 1, 2, 3, 4; header encryption provides protection | **On** |
| Merge S1–S4 | Uses one padding value for all packet types | **Off** |

![Protocol switches](/img/amneziawg-architect/12.jpg)

*RandomTrailers is enabled in the original screenshot. Turn it off before generation if the app has no corresponding field.*

### 5.11. Generate values

1. Click **Regenerate** (**«Сгенерировать заново»**). **Several at once** (**«Сразу несколько»**) creates multiple sets.
2. In the results section (**«Что получилось»**), select **One by one** (**«По одному»**) for a copy button next to each parameter. The complete view (**«Целиком»**) shows a `.conf` file.
3. The result includes H1–H4 headers, S1–S4 sizes, Jc/Jmin/Jmax, the I1–I5 chain, and transport protection (ContentPaddingAddition, RekeyAfterTime, RekeyTimeout, RejectAfterTime, KeepaliveTimeout, MaxHandshakeAttempts).

::: warning Use one parameter set
Regenerating creates a new set. Transfer **all** parameters from **one** generation to the app. Do not mix values from different sets.
:::

![Results: headers, packet sizes, junk train, and CPS](/img/amneziawg-architect/13.jpg)

![Results: CPS chain and transport protection](/img/amneziawg-architect/14.jpg)

## Part 6. Transfer parameters to the app {#s7}

Open **AmneziaWG connection settings** (**«AmneziaWG настройки подключения»**) and fill in the fields with the generator values. Use its copy buttons: a single wrong character in I1–I5 can cause an error.

| App field | Source |
| --- | --- |
| VPN address subnet | Leave unchanged |
| Port | Leave unchanged or choose your own |
| Jc, Jmin, Jmax | Junk train section |
| S1, S2, S3, S4 | Packet sizes section |
| H1, H2, H3, H4 | Headers section |
| I1–I5 (Special junk 1–5) | CPS chain section, including all tags |
| ContentPaddingAddition, RekeyAfterTime, RekeyTimeout, RejectAfterTime, KeepaliveTimeout, MaxHandshakeAttempts | Transport protection section |
| HeaderProtectionKey checkbox | Enable manually |

![Subnet, port, Jc, Jmin, Jmax, S1, and S2 fields; port hidden](/img/amneziawg-architect/15.jpg)

![H3, H4, and I1–I5 (Special junk) fields](/img/amneziawg-architect/16.jpg)

1. Fill in the fields using the table.
2. Scroll down and **enable HeaderProtectionKey**. Header encryption is disabled without this checkbox.
3. Fill in the transport protection fields.
4. Click **Save** (**«Сохранить»**). The app warns that old configurations will lose access. **Continue** applies the changes; **Cancel** keeps the previous settings.
5. Wait for the protocol to be reinstalled (up to five minutes).
6. Click **Connect**. Wait for **Connected** (**«Подключено»**) and check that websites load through the VPN.

![HeaderProtectionKey checkbox and transport protection fields](/img/amneziawg-architect/17.jpg)

![Warning when saving](/img/amneziawg-architect/18.jpg)

![Protocol reinstallation](/img/amneziawg-architect/19.jpg)

![Connected status](/img/amneziawg-architect/20.jpg)

::: danger Old configurations will stop working
After changing settings, create new client configurations and send them to all users. See [sharing VPN access](/en/share-connection).
:::

## Part 7. Check and share {#s8}

- All fields were copied from one set. New device configurations contain the updated parameters.
- HeaderProtectionKey is enabled, and the generator and server versions are both 3.1.
- **Old client configurations no longer work** after saving new settings. Issue fresh ones using the share icon.
- Hide IP addresses, passwords, ports, keys, and I1–I5 strings in public instructions.

## Part 8. Troubleshooting {#s9}

| Symptom | What to do |
| --- | --- |
| Cannot connect after changing settings | Compare all values against one generation; check HeaderProtectionKey and version 3.1 |
| Connection drops or slows down | Try MTU 1280, disable Extreme maximums, and set Jc = 3 |
| ISP blocking | Try a new generation, another profile (DTLS 1.3, STUN/TURN), or another host |
| Client rejects the configuration | Check that I1–I5 contain no `<c>` tag |
| App cannot access the server over SSH | Check IP, password, and SSH port; try Soft Reboot in the hosting panel if the server is frozen |

If these checks do not help, follow [VPN diagnostics](/en/vpn-troubleshooting). Parameter selection depends on your network; generating new values alone does not guarantee a working connection.

## Quick reference: values for this example {#s10}

| Section | Value |
| --- | --- |
| Protocol version | `3.1` |
| Target client | Amnezia VPN |
| MTU | `1280` |
| Router mode, Extreme maximums | Off |
| Jc | `5` |
| Jmin / Jmax | MED (`128`–`1024`) |
| S1–S4 | Automatic |
| Mimicry profile | QUIC Initial · RFC 9000 |
| Host region | Any |
| Apply profile to I2–I5, imitate packet sizes | Off |
| `<c>` tag | Off (disabled by the generator) |
| Header encryption, padding, floating timers | On |
| Random trailers, no cookie replies, merge S1–S4 | Off for the interface shown |
| Disable H1–H4 | On (H1–H4 = `1`, `2`, `3`, `4`) |
| HeaderProtectionKey in the app | Checked |
