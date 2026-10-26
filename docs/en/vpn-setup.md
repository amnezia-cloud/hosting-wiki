---
title: "Set up a VPN on your own server"
description: "Set up a VPN with AmneziaVPN, choose a protocol, or restore access to a server you've already configured."
head:
  - - meta
    - name: keywords
      content: "vpn setup, amneziavpn, own vpn, self-hosted, server installation, amneziawg, ssh"
---

# Set up a VPN on your own server

If you don't have a server yet, choose a VPS that fits your needs from [Amnezia Hosting](https://amnezia.host/). All Amnezia Hosting servers meet AmneziaVPN's setup requirements. You can compare server specifications when choosing a plan.

Use the **AmneziaVPN** app to set up a VPN on a **Linux** server you own or rent. You won't need to enter any terminal commands.

Before you start, have your server's IP address, username, and password or SSH private key ready.

::: warning Servers from other hosting providers
Check the [server requirements](https://docs.amnezia.org/documentation/supported-linux-os-for-vps) before you start. Installation may fail if your server doesn't meet them.
:::

::: danger Incompatible hosting providers
The [Amnezia setup guide](https://amnezia.org/en/starter-guide) lists servers from **Reg.ru** and **Yandex Cloud** as incompatible with VPN installation through **AmneziaVPN**.
:::

## Set up your VPN

::: warning Update the app
Update **AmneziaVPN** to the latest version before setting up or making changes to a self-hosted server. Updates improve AmneziaWG, fix bugs, and make connections more stable.
:::

1. Download and install **AmneziaVPN** from the [official download page](https://amnezia.org/en/downloads) ([mirror](https://storage.googleapis.com/amnezia/amnezia.org?m-path=/en/downloads)) or the [latest stable release on GitHub](https://github.com/amnezia-vpn/amnezia-client/releases/latest). If you already have the app, update it.
2. Open **AmneziaVPN**. Click **➕**, or **Let's get started** if you haven't added any connections yet.
3. Select **Self-hosted VPN**.
4. Enter your server's login details

   Once you've purchased a server, you'll find its login details in your [**Amnezia Hosting account**](https://my.amnezia.host/). Sign in with the email address and password you used to create your account.

   You'll need:

   - **Server IP address [:port]**. If the server uses an SSH port other than `22`, add the port after a colon, for example `203.0.113.10:2221`.
   - **SSH Username** — for example, `root` or a user with **sudo** privileges who can run commands as an administrator.
   - **Password or SSH private key**.

   Click **Continue**.

   ![Adding a server: select Self-hosted VPN and enter your server's login details](/img/vpn-setup/en_vpn_setup_1.png)

5. Choose an installation type and click **Continue**:

   - **Automatic** installs **AmneziaWG** only. You can add other protocols later.

     ![Automatic AmneziaWG setup and the new VPN connection](/img/vpn-setup/en_vpn_setup_2.png)

   - **Manual** lets you choose which protocol to install. Select a protocol and click **Install**. You can add other protocols later.

     ![Manual setup: select XRay and install it on the server](/img/vpn-setup/en_vpn_setup_3.png)

When setup is complete, the app creates a VPN connection with **full access** to your server. The connection is ready to use.

::: tip Choose an AmneziaWG port below 9999
By default, **AmneziaWG** uses a randomly assigned port. Some internet providers block UDP traffic on high ports. After installation, we recommend switching to an unused port below `9999`, such as `585` or `1234`. Make sure no other service on the server is using that port.

If your VPN isn't working, see the [AmneziaWG troubleshooting guide](https://docs.amnezia.org/troubleshooting/self-hosted-amneziawg-not-working).

![Changing and saving the AmneziaWG port in the server settings](/img/vpn-setup/en_vpn_setup_8.png)
:::

To connect another device or give someone access to your VPN, see [Share and revoke VPN access](/en/share-connection).

## If you clicked “Skip setup” {#if-you-clicked-skip-setup}

Clicking **Skip setup** adds an empty connection without running any commands on the server.

Use this option if the server already has a VPN installed through AmneziaVPN. It lets you add a connection with full access without a backup file or a full-access key.

![Skipping setup creates a connection with no VPN protocol installed](/img/vpn-setup/en_vpn_setup_6.png)

**VPN is already installed on the server**

1. Click any connection name.
2. Click **⚙️** next to your server.
3. Open the **Management** tab and select **Check the server for previously installed Amnezia services**.

The app updates the connection to show the VPN protocols and services already installed on the server.

![The option to check for installed Amnezia services on the Management tab](/img/vpn-setup/en_vpn_setup_7.png)

**You skipped setup by mistake on a fresh server**

1. Click any connection name.
2. Click **⚙️** next to your server. You'll see a list of protocols you can install.
3. Click **📥** next to the protocol you want, then click **Install**.

![Installing AmneziaWG after skipping setup](/img/vpn-setup/en_vpn_setup_4.png)

*Installing AmneziaWG after skipping setup.*

Once installation is complete, you can use the connection to access the VPN and manage the server.

You can install other protocols in the same way:

![Adding XRay to a server that already has AmneziaWG installed](/img/vpn-setup/en_vpn_setup_5.png)

*Adding XRay as another VPN protocol.*

## What you can do with the connection

With full access, you can connect to the VPN and manage your server in AmneziaVPN:

- [share and revoke VPN access](/en/share-connection);
- [manage VPN protocols](/en/install-configure-protocols);
- [install a SOCKS5 proxy](/en/socks5-proxy-server);
- [set up AmneziaDNS on the server](/en/change-dns);
- [store and transfer files over SFTP](/en/sftp);
- [host a website on Tor](/en/create-tor-website).

## Other guides

- [Troubleshoot a self-hosted AmneziaWG connection](https://docs.amnezia.org/troubleshooting/self-hosted-amneziawg-not-working).
- [Self-hosted FAQ](https://docs.amnezia.org/faq#self-hosted-faq).
- [Split tunneling](https://docs.amnezia.org/documentation/instructions/vpn-split-tunneling).
- [Set up a VPN on Android TV](https://docs.amnezia.org/documentation/instructions/android_tv_connect).
- [Set up a VPN on a Keenetic router](https://docs.amnezia.org/documentation/instructions/keenetic-os-awg).
- [Set up a VPN on an OpenWrt router](https://docs.amnezia.org/documentation/instructions/openwrt-os-awg).
