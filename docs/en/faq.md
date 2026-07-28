# ❓ Troubleshooting <span class="green">(FAQ)</span>

Short answers to common questions. Larger topics live in their own articles — linked in each section.

## 🔌 Connection and VPN {#connection}

Dedicated articles:

*   🩺 **[VPN connection issues: step-by-step troubleshooting](/en/vpn-troubleshooting)** — error 305, SSH checks, ISP blocking.
*   🔁 **[AmneziaWG stopped working](/en/awg-to-xray)** — switching to XRay: port 443, SNI `ya.ru`, fallbacks.
*   📵 **[No access on mobile internet](/en/mobile-restrictions)** — carrier “whitelists”.
*   🤖 **[Gemini via VPN](/en/gemini)** — why some services reject data-center traffic.

::: details Why does the app say 'Server connection error'?
This is usually due to three main reasons:

1.  **Incorrect credentials:** Double-check your IP address, username, or password for any accidental spaces.
2.  **Server is not ready yet:** After purchasing hosting, the OS installation can take 2 to 10 minutes. Please wait a bit and try again.
3.  **Port 22 is closed:** Ensure that no firewall in your hosting control panel is blocking incoming SSH connections.

If the credentials are correct and it still fails, run the **[step-by-step troubleshooting](/en/vpn-troubleshooting)**.
:::

::: details The Ping command doesn't work! 'Request timed out' or '100% loss'
ICMP traffic is blocked on our servers. Check the server's availability via `ssh root@server-ip` instead.
:::

::: details It connects, but there is no internet
The server is reachable, so the tunnel is at fault: check that two VPNs are not installed at once, that an antivirus or AdGuard is not blocking traffic, and that the `.ru` zone blocking is not enabled in 3X-UI. Walkthrough — **[Connection troubleshooting](/en/vpn-troubleshooting#next)**.
:::

## 🎛️ Protocols and traffic {#protocols}

::: details Which VPN protocol should I choose in the Amnezia app?
*   **Amnezia WG (WireGuard):** The fastest and most lightweight protocol, ideal if your ISP does not block standard VPN traffic.
*   **XRay / OpenVPN vmess:** Excellent choice for regions with strict censorship, as these protocols disguise traffic as regular website visits (HTTPS).

Full comparison — **[Protocols](/en/protocols)**.
:::

::: details Can I use a single server for multiple devices?
**Yes.** You can configure AmneziaVPN on your server and then generate configuration files or QR codes for any of your devices (smartphones, tablets, PCs) or share them with others. Our plans are tuned for smooth performance with **up to 10 devices** connected simultaneously.

Issuing a separate key per device is easiest through the **[3X-UI panel](/en/3x-ui#client-key)**.
:::

::: details How much traffic does running a VPN on the server consume?
The VPN server itself does not generate traffic. Consumption depends entirely on your activity: if you download a 1 GB file through the VPN, the server spends 1 GB downloading it and another 1 GB delivering it to you (2 GB total from your hosting limit). Choose plans with unlimited traffic.
:::

## 🖥️ Server and security {#server}

Dedicated articles:

*   🌍 **[Why your server's geolocation mismatches](/en/geolocation)** — how GeoIP databases work and why their data lags.
*   🔒 **[Server security](/en/security)** — UFW, changing the SSH port, fail2ban.

::: details How do I protect my server from hacking?
Set up the UFW firewall, change the default SSH port, and enable fail2ban. See the **[Server Security](/en/security)** section for step-by-step instructions.
:::

::: details How do I change the root password?
Connect via SSH and run `passwd` — the system will ask for the new password twice. You can also reissue the password with the **Reset Password** button in your client area (the server must be powered off first).
:::

::: details The server is in “Broken State” and will not start
Do not press the control buttons repeatedly — that can make the container error worse. Open a ticket right away and our engineers will check the node manually. Details — **[Server Management](/en/server-management#security)**.
:::

## 💳 Billing and refunds {#billing}

::: details How can I pay for Amnezia Hosting?
We accept **Visa** and **Mastercard** bank cards, as well as the **Freekassa** payment service. All invoices and payment history are available in your **Client Area** under the "Invoices" section.
:::

::: details How do I get a refund for a server?
Refund conditions are described in the **Refund and Compensation Policy**. To request a refund, open a ticket in your **Client Area** — the support team will guide you through the process.
:::

## 🔧 Technical support {#support}

If your problem is not listed here, collect the details from the checklist and write to us: **[Contacting Support](/en/support)**. That page also has a ready-to-fill template and the split of responsibilities.

*   💻 A ticket in the **Client Area** — the main channel.
*   💬 The official Amnezia user community on Telegram.
*   📂 Self-diagnosis of the OS — **[Server Management](/en/server-management)**.
