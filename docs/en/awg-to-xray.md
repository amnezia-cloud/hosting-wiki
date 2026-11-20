---
title: What to Do if AmneziaWG Stops Working
description: "AmneziaWG does not connect — add XRay (VLESS + Reality): port 443, a foreign SNI or your own domain (Self-SNI), fingerprint firefox."
head:
  - - meta
    - name: keywords
      content: amneziawg not working, awg not connecting, xray, vless, reality, sni, self-sni, fingerprint, firefox, port 443, isp blocking, dpi, amnezia
---

# 🔁 AmneziaWG Stopped Working — Switch to XRay

If AWG no longer connects or the connection hangs, the cause is most likely the network, not the protocol. AWG runs over **UDP**, and some ISPs may not pass UDP traffic at all or may restrict it — by speed, by session length, or only on certain routes.

The fix is to move the server to **XRay (VLESS + Reality)**: it runs over **TCP + TLS** and looks to the ISP like an ordinary HTTPS connection to a large website.

::: tip In short
**Port** `443` · **SNI** — a large foreign website reachable from Russia (or your own domain) · **Fingerprint** — `firefox`
:::

## Symptoms {#symptoms}

- The connection spins endlessly and drops on timeout.
- AWG used to work and stopped with no configuration changes.
- The same AWG connects on a different network (another carrier, wired internet).

::: warning The server does not answer over SSH either?
Then the protocol is not the problem — start with the **[step-by-step troubleshooting](/en/vpn-troubleshooting#error-305)**.
:::

## Step-by-step fix {#fix}

1. **Update the app.** Download the latest AmneziaVPN client from GitHub — this is mandatory, older versions handle XRay incorrectly.
2. **Decide whether to keep AWG.** On the **Start** plan, delete AWG in the server settings inside the app: running two protocols at once on 1 GB of RAM is [not recommended](/en/choose-plan). On **Basic** and above you can keep AWG — XRay is installed alongside it, and you can switch between them in the app.
3. **Install XRay.** Click **“Add protocol”** → **XRay** and set the masking parameters:

| Setting | Value | Comment |
| --- | --- | --- |
| **Port** | `443` | the standard HTTPS port, anything else looks suspicious |
| **SNI** | `www.nvidia.com` or `www.rolex.com` | any large **foreign** website reachable from Russia — [details](#sni) |
| **Fingerprint** | `firefox` | instead of the default `chrome` — [details](#fingerprint) |

::: info Where to find it in the app
SNI and Fingerprint are under **XRay server settings** → **Security** → **Reality**. Step by step — see [Switch the fingerprint to firefox](#fingerprint).
:::

4. Wait for the installation to finish (up to a minute) and connect with XRay selected in the protocol list.

## Which SNI to choose {#sni}

SNI is the domain your connection is disguised as. The ISP sees it at the start of the TLS handshake and compares it with the IP address the traffic actually goes to.

::: danger Do not use Russian websites
`ya.ru`, `2gis.ru`, `pochta.ru`, `vk.com` and the like are **poor masking**. These sites live on Russian IPs, while your server is abroad. A “Yandex” connection going to a foreign hosting IP is an obvious mismatch, and it is the first thing DPI notices.
:::

Pick a domain that meets three criteria:

- **Foreign and large** — an international brand that naturally gets a lot of traffic from every country.
- **Reachable from Russia** — opens without a VPN. A blocked site in the SNI draws attention immediately.
- **Supports TLS 1.3 and HTTP/2** — Reality will not work without it. How to check — **[XRay: verifying the domain](/en/xray-tuning#verify)**.

| Option | Example | Masking |
| --- | --- | --- |
| 🥇 **Your own domain (Self-SNI)** | `mysite.duckdns.org` | **best** — the IP, domain and certificate all match |
| 🥈 A large foreign website | `www.nvidia.com`, `www.rolex.com` | good, works for most users |
| ❌ A Russian website | `ya.ru`, `2gis.ru` | poor — do not use |

::: tip The best option is Self-SNI
With someone else's domain there is always a mismatch: the domain points to one IP while the traffic goes to another. If you run your own domain and a decoy site on the server, there is no mismatch at all — an observer sees a domain that really lives on this IP and serves its own certificate.

Step-by-step guide with a free domain: **[🔐 Self-SNI for VLESS + Reality](/en/self-sni)**.
:::

## Switch the fingerprint to firefox {#fingerprint}

The fingerprint (`fp`) defines which browser the client imitates in the TLS handshake. The default is `chrome` — almost every VPN client uses it, so it has become the most overused fingerprint. Switch it to **`firefox`**.

**In the AmneziaVPN app:**

1. Open the server settings → the **XRay** protocol → **XRay server settings**.
2. Go to **Security** — **Reality** should be selected there.
3. In the **Fingerprint** field, choose **`firefox`**. The masking domain is set on the same screen, in the **Server name (SNI)** field.
4. Click **Save**.

**In a `vless://` link** — the `fp=firefox` parameter:

```text
vless://<UUID>@<IP-or-domain>:443?security=reality&sni=www.nvidia.com&fp=firefox&pbk=<PublicKey>&sid=<ShortId>&flow=xtls-rprx-vision&type=tcp#xray
```

More on changing the fingerprint — **[XRay: changing the fingerprint](/en/xray-tuning#fingerprint)**.

## If it still does not work {#fallback}

Change **one setting at a time**, otherwise you will not know what helped:

| What to change | Options | When to try it |
| --- | --- | --- |
| **SNI** | another large foreign website, then [Self-SNI](/en/self-sni) | the current domain does not pass DPI |
| **Fingerprint** | `firefox` → `safari` → `edge` | the connection drops during the handshake |
| **Port** | `8443` | only if 443 is taken by something else on the server |
| **Network** | another carrier, wired internet | to find out whose network is filtering |

::: details How to tell that 443 is taken
Connect to the server over SSH and run:

```bash
ss -tlnp | grep :443
```

If the output shows a process other than Xray, the port is taken. Free it or use `8443`.
:::

## AmneziaWG and XRay: what's the difference {#why}

AmneziaWG and XRay do not compete — they complement each other. Both protocols mask traffic reliably; the difference is the transport: AWG runs over UDP, XRay over TCP. That is why each one performs best in its own conditions.

| | AmneziaWG | XRay (VLESS + Reality) |
| --- | --- | --- |
| **Transport** | UDP | TCP + TLS |
| **Speed and latency** | the best — ideal for calls, games and video | high, with slight TCP overhead |
| **Load on device and battery** | minimal | slightly higher |
| **Masking** | its own obfuscation: packets look like neither WireGuard nor any other known VPN | the connection looks like an HTTPS session with the site from the SNI |
| **Where it helps most** | most networks, everyday use | networks where UDP is restricted or does not work |

::: info Why UDP sometimes does not get through
Some ISPs may not pass UDP traffic or may restrict it: speed is throttled, connections drop after a few minutes, or UDP is blocked entirely. This is most common on mobile carriers, corporate networks and public Wi-Fi. It is a property of that particular network, not of the protocol — on such networks XRay, which runs over TCP, helps out.
:::

::: tip Keep both protocols on the server
AWG is the main protocol for everyday use: it is faster and lighter. XRay is the fallback for networks where UDP is cut. Switching between them in the app takes a couple of seconds.

Running two protocols at once requires the **Basic** plan or higher. On **Start**, keep one — whichever works on your network. Changing the plan takes a couple of minutes and keeps your data and IP — [📦 Changing the plan](/en/change-plan).
:::

Comparison of all protocols — **[Protocols](/en/protocols)**.
