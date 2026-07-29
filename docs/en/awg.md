# AmneziaWG (AWG): Detailed Guide

**AmneziaWG (AWG)** is a fork of the popular **WireGuard** protocol, extended by the Amnezia team. It keeps all the speed and lightness of WireGuard but adds **obfuscation** that hides WireGuard's recognizable "fingerprint" from Deep Packet Inspection (DPI) systems.

## How It Differs from Plain WireGuard

Classic WireGuard is very fast, but its handshake has a recognizable structure that DPI can easily detect and block. AmneziaWG solves this in two ways:

*   **Junk packets:** random packets are added at the start of a session so the traffic does not begin with a predictable handshake.
*   **Header obfuscation:** WireGuard's service message types are replaced with custom values, so the packet no longer "looks like WireGuard".

## Quick Setup (recommended)

The easiest way is not to configure AWG manually but to deploy it through the official **AmneziaVPN** app — all obfuscation parameters are chosen automatically:

1. Install AmneziaVPN and add your server (see **[VPN Setup](/en/vpn-setup)**).
2. On the protocols tab, click **"Install"** next to **AmneziaWG**.
3. Connect. Done.

## Obfuscation Parameters

If you configure AWG manually, additional parameters appear in the `[Interface]` section. **They must match on the server and the client**, otherwise the connection will not be established.

| Parameter | Purpose |
| :--- | :--- |
| `Jc` | Number of "junk" packets at the start of a session (usually 3–10) |
| `Jmin` | Minimum junk packet size, bytes |
| `Jmax` | Maximum junk packet size, bytes (`Jmax` > `Jmin`) |
| `S1` | Size of random data in the init packet |
| `S2` | Size of random data in the response packet |
| `H1`–`H4` | Custom header values for the 4 WireGuard message types |

::: warning Important about parameters
The `H1`–`H4` values must be **unique** from each other, and the whole set of parameters must be **identical** on the server and client. When installed via the AmneziaVPN app, this is done automatically.
:::

## Example Client Configuration

```ini
[Interface]
PrivateKey = <client_private_key>
Address = 10.8.1.2/32
DNS = 1.1.1.1

# AmneziaWG obfuscation parameters
Jc = 4
Jmin = 40
Jmax = 70
S1 = 50
S2 = 100
H1 = 1500000000
H2 = 1600000000
H3 = 1700000000
H4 = 1800000000

[Peer]
PublicKey = <server_public_key>
PresharedKey = <preshared_key>
Endpoint = YOUR_IP:PORT
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
```

## Client Applications

*   **AmneziaVPN** — Windows, macOS, Linux, Android, iOS (recommended).
*   **AmneziaWG** — a standalone app for importing a ready-made config.

## When to Choose AWG

*   <Icon name="check" tone="ok" /> Everyday use, streaming, gaming — where maximum speed and minimal ping matter.
*   <Icon name="check" tone="ok" /> Mobile internet — fast reconnection and low battery drain.
*   <Icon name="warning" tone="warn" /> If your ISP fully blocks **UDP**, AWG may fail to connect. In that case use **[VLESS + Reality](/en/vless)**, which runs over TCP.

::: tip Tip
Install both protocols on your server — **AmneziaWG** as the primary one and **VLESS** as a backup. If AWG stops connecting, switch to VLESS in one click.
:::
