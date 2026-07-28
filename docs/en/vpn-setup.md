---
title: "How to Launch Your Own VPN"
description: "Three steps: add the server to the AmneziaVPN app, install a protocol, and connect."
head:
  - - meta
    - name: keywords
      content: "vpn setup, amneziavpn, own vpn, connection, protocol, installation, three steps, configuration"
---

# 🛡️ How to Launch Your Own <span class="green">VPN</span>

Three simple steps to create your own personal VPN on a virtual private server.

::: info Important
If you received a ready-to-use key through *Amnezia Free* or *Amnezia Premium* services, you do not need to buy your own server. Simply open the received configuration file using the official Amnezia application.
:::

## 1️⃣ Step 1. Purchase a Virtual Private Server (VPS)

If you do not have your own server yet, you need to purchase one. When choosing a hosting provider, look for the following technical criteria:

*   **Operating System:** Linux (Ubuntu 22.04 or Debian 12 recommended).
*   **CPU Architecture:** x86-64.
*   **Virtualization:** Strictly **KVM**.
*   **Network:** IPv4 address support is mandatory.
*   **RAM:** At least 1 GB (2 GB recommended).
*   **Software:** Pre-installed software and control panels are not required.

::: danger Attention: Incompatible Hostings
Servers from **Reg.ru** and **Yandex Cloud** are technically not compatible with automatic VPN installation via the Amnezia app!
:::

::: warning Please Note
Third-party hosting providers are mentioned as examples only. We are not responsible for the quality of services provided by these companies or any potential technical risks. Most international VPS providers currently support payment with Russian bank cards and cryptocurrency.
:::

## 2️⃣ Step 2. Get Access Credentials

After successful order and activation of your server, you will receive an information email sent to the address used during registration on the hosting provider's website.

**We will need three parameters from this email for the configuration:**

1.  **IP Address** of the server
2.  **Username** (User name / User ID, usually `root`)
3.  **Password**

::: warning What if you didn't receive the email?
Some hosting providers do not send passwords via email for security reasons. In this case, all server credentials can be found inside your personal account dashboard on the hosting website. If you have trouble finding your data, please contact their technical support.
:::

## 3️⃣ Step 3. Installation and Launch via AmneziaVPN

1.  Download and install the official **AmneziaVPN** client for your operating system (Windows, macOS, Linux, iOS, or Android).
2.  Launch the app on your device.
3.  Click the button **"I have connection data"**.
4.  In the menu that appears, select **"Configure your server"**.
5.  Enter your server credentials: IP address, username, and password.
6.  Click **"Continue"** and follow the automatic interactive prompts inside the app.

## 📘 Additional Resources

You can find more detailed information about traffic obfuscation methods, available connection protocols, and advanced application features in other sections of our documentation.
