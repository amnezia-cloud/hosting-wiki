# ❓ Troubleshooting <span class="green">(FAQ)</span>

Answers to frequently asked questions and technical solutions for common issues with VPS and AmneziaVPN.

## ❓ Frequently Asked Questions

::: details Can I use a single server for multiple devices?
**Yes.** You can configure AmneziaVPN on your server and then generate configuration files or QR codes for any of your devices (smartphones, tablets, PCs) or share them with others. Our plans are tuned for smooth performance with **up to 10 devices** connected simultaneously.
:::

::: details Why does the app say 'Server connection error'?
This is usually due to three main reasons:

1.  **Incorrect credentials:** Double-check your IP address, username, or password for any accidental spaces.
2.  **Server is not ready yet:** After purchasing hosting, the OS installation can take 2 to 10 minutes. Please wait a bit and try again.
3.  **Port 22 is closed:** Ensure that no firewall in your hosting control panel is blocking incoming SSH connections.
:::

::: details Which VPN protocol should I choose in the Amnezia app?
*   **Amnezia WG (WireGuard):** The fastest and most lightweight protocol, ideal if your ISP does not block standard VPN traffic.
*   **XRay / OpenVPN vmess:** Excellent choice for regions with strict censorship, as these protocols disguise traffic as regular website visits (HTTPS).
:::

::: details How much traffic does running a VPN on the server consume?
The VPN server itself does not generate traffic. Consumption depends entirely on your activity: if you download a 1 GB file through the VPN, the server spends 1 GB downloading it and another 1 GB delivering it to you (2 GB total from your hosting limit). Choose plans with unlimited traffic.
:::

::: details The Ping command doesn't work! 'Request timed out' or '100% loss'
ICMP traffic is blocked on our servers. Check the server's availability via `ssh root@server-ip` instead.
:::

::: details How can I pay for Amnezia Hosting?
We accept **Visa** and **Mastercard** bank cards, as well as the **Freekassa** payment service. All invoices and payment history are available in your **Client Area** under the "Invoices" section.
:::

::: details How do I get a refund for a server?
Refund conditions are described in the **Refund and Compensation Policy**. To request a refund, open a ticket in your **Client Area** — the support team will guide you through the process.
:::

::: details Why doesn't Google Gemini work via VPN?
Gemini rejects requests from hosting and data-center IP addresses — that restriction is enforced on Google's side and no VPN setting works around it. Full explanation, including split tunneling as a workaround: **[Gemini via VPN](/en/gemini)**.
:::

::: details How do I protect my server from hacking?
Set up the UFW firewall, change the default SSH port, and enable fail2ban. See the **[Server Security](/en/security)** section for step-by-step instructions.
:::

::: details How do I change the root password?
Connect via SSH and run `passwd` — the system will ask for the new password twice. You can also reissue the password with the **Reset Password** button in your client area (the server must be powered off first).
:::

## 🔧 Technical Support

If your problem is not listed here, or you need personalized assistance with your Amnezia Hosting servers:

*   💻 Open a ticket in the **Client Area** of your hosting provider.
*   💬 Visit the official Amnezia user community on Telegram.
*   📂 Check the **[Server Management](/en/server-management)** section for self-diagnosis of the OS.
