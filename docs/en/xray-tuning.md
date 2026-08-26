---
title: "XRay: Proper Masking and Fine-Tuning"
description: "How to pick a masking domain inside your own subnet, verify it, update the XRay core, enable BBR, and what to do when XRay stops connecting."
head:
  - - meta
    - name: keywords
      content: "xray, vless, reality, masking site, sni, realitlscanner, domain check, fingerprint, firefox, bbr, xray core update, port 443"
---

# ⚡ XRay: Proper Masking and Fine-Tuning

The settings below are a technical best practice rather than a guarantee: they noticeably reduce how visible your traffic is to DPI and make the server's disguise plausible, but promising a hundred-percent bypass would not be honest.

::: warning Re-issue the configs after any change
Changing the port, the masking domain, or the fingerprint invalidates existing configurations. Hand out new ones to your users.
:::

## Port: always 443 {#port}

Keep `443` — the standard port for encrypted web traffic. We disguise the VPN as an ordinary website, and a website on a non-standard port looks odd by itself and breaks the disguise.

## Masking domain: look for a neighbour in your subnet {#domain}

Popular sites such as `google.com` or `github.com` actually reduce security: censorship systems see the mismatch — your server's IP (say `15.x.x.x`) and Google's real IP (`182.x.x.x`) live in completely different networks.

The goal is a donor site that resides in the same subnet as your server. The **RealiTLScanner** utility helps with that.

::: danger Scan only from your own computer
Running the scanner from inside the VPS may look like network scanning to your host and get the server suspended. Work from your home machine.
:::

::: info Realistic expectations
VLESS Reality is popular, so within your host's subnet you will almost certainly find plenty of other XRay users. And bear in mind: Microsoft, VK, Mail.ru, GitHub or Samsung are not going to be hosted on a no-name provider.
:::

### Step 1. Prepare the scanner

1.  Download a [RealiTLScanner](https://github.com/XTLS/RealiTLScanner/releases) release for your system — e.g. `RealiTLScanner-windows-amd64.exe` or `RealiTLScanner-darwin-amd64`.
2.  Open a terminal in the folder with the file:
    *   **Windows 11** — right-click empty space in the folder → “Open in Terminal”.
    *   **Windows 10** — click the folder's address bar, clear the path, type `cmd`, press Enter.
    *   **macOS** — `Cmd + Space`, “Terminal”, then type `cd ` (with a space) and drag the folder from Finder into the window.
    *   **Linux** — right-click empty space → “Open in terminal”.

### Step 2. Run the scan

**Windows:**

```bash
RealiTLScanner-windows-amd64.exe -addr YOUR_SERVER_IP -thread 5 -timeout 5
```

Look for `ip=` and `cert-domain=` in the output — the latter is the domain to use for masking.

**macOS / Linux:**

```bash
chmod +x RealiTLScanner-linux-64
./RealiTLScanner-linux-64 -addr YOUR_SERVER_IP -thread 5 -timeout 5 | awk '{
  ip=""; sni="";
  for(i=1; i<=NF; i++) {
    if ($i ~ /^ip=/) ip=substr($i, 4);
    if ($i ~ /^cert-domain=/) sni=substr($i, 13);
  }
  if (ip != "" && sni != "") print ip " " sni;
}'
```

The output lists working sites from the same subnet as your server. Any of them can go into the “masking site” field in AmneziaVPN, with the port left at `443`.

## Verifying the chosen domain {#verify}

### In a browser

1.  Open `https://domain_name` **without a VPN or proxy**. The site must load correctly and the browser must show a secure connection with no certificate warnings. That confirms the target server is alive and serving a legitimate TLS certificate.
2.  Check the domain's A records with `nslookup` and make sure the IP from DNS matches the target server's actual IP.
3.  After adding the domain in AmneziaVPN, open `https://YOUR_VPS_IP` in a browser. You should see the **`ERR_CERT_COMMON_NAME_INVALID`** warning.

    ::: warning A different error means the domain is unsuitable
    If the browser shows anything other than `ERR_CERT_COMMON_NAME_INVALID`, that masking domain automatically does not fit.
    :::
4.  Confirm that the masking site's certificate (`https://domain_name`) matches the one XRay serves at `https://YOUR_VPS_IP`.

### Via a Telegram bot

The bot **@gig_reality_bot** is a convenient way to assess a domain — it returns detailed information about the server. What to look at:

| Parameter | Requirement |
| :--- | :--- |
| **Port 443 (TCP)** | must be open |
| **TLS 1.3** | mandatory — Reality specifically mimics modern certificates |
| **HTTP/2** | highly desirable, and required in newer versions |
| **Geography and ASN** | ideally at least roughly matching your VPS location: do not pick an Australian site if your server is in Germany |
| **Ping from your VPS** | always check it; 1–6 ms is ideal |
| **Redirects** | if the bot shows a redirect, check the final domain. For example `samsung.com` leads to `www.samsung.com`, so check the latter. And a domain behind a CDN is a poor fit for masking |

## Speeding up TCP: BBR {#bbr}

BBR is a congestion-control algorithm — roughly speaking, a TCP accelerator. A ready-made script enables it:

```bash
wget -qO- https://raw.githubusercontent.com/VadimBoev/bbr/main/enable_bbr.sh | bash
```

## Updating the XRay core {#core-update}

The latest check was done with XRay-core `v26.3.27`.

```bash
# current core version
docker exec amnezia-xray xray -version

# enter the container
docker exec -it amnezia-xray /bin/bash

# download the latest release core
cd /tmp && wget https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip

# unpack, install, exit
unzip Xray-linux-64.zip && cp xray /usr/bin/xray && exit

# restart the container and check the version
docker restart amnezia-xray && docker exec amnezia-xray xray -version
```

## If XRay stopped connecting {#troubleshooting}

1.  Check the core version and update it if needed — see **[Updating the core](#core-update)**.
2.  Re-run the **[domain verification](#verify)**: it may have gone offline, changed its certificate, or moved behind a CDN.
3.  If the checks pass, **switch the fingerprint from `chrome` to `firefox`** on the client. This helps most often: in the native XRay format (`.json`), in the AmneziaVPN settings, or in the `vless://` link (the `fp=firefox` parameter). In the 3X-UI panel it is the **uTLS** field: **[3X-UI Panel](/en/3x-ui#inbound)**.

## Only the first user shows up in the app {#one-user}

This affects very old AmneziaVPN builds: the XRay protocol was installed by an outdated app version. A full reinstall is required — remove XRay from the server through the app (the “Management” menu) and install it again.

::: warning Protocol tuning is outside hosting support
We sell a server, not a VPN service. Choosing the masking domain, the fingerprint and the routing rules is on your side — see the **[scope of responsibility](/en/support#scope)**. This page shares what we and the community have collected, but we cannot debug individual configurations.

*   Questions about the protocol and its parameters belong in the Amnezia community: **[Russian chat](https://t.me/amnezia_vpn)**, **[English](https://t.me/amnezia_vpn_en)**.
*   Write to **[hosting support](/en/support)** when the server itself is the problem: it will not power on, is unreachable, or shows Bad State.
:::
