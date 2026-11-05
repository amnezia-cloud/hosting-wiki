---
title: "How to update your server"
description: "How to update an Amnezia Self-hosted server running Ubuntu or Debian: disable MPTCP, update the system and reinstall Xray."
---

# How to update your server

## General information

This guide to updating a server is intended for **Amnezia Self-hosted** users running Ubuntu or Debian who use the **AmneziaVPN app**.

:::warning
The server will be unavailable to all users during these steps. Xray connections will stop working for all users of this server after following this guide. The owner will need to share access again.
:::

## Connect to the server via SSH

Open a terminal on your computer and run the following command, replacing `YOUR_SERVER_IP` with your VPS IP address:

```bash
ssh root@YOUR_SERVER_IP
```

If you have any questions at this stage, see the detailed guide on [how to connect via SSH](/en/server-management#ssh).

## Step 1. Disable MPTCP

Disabling MPTCP reduces the risk of an attack.

Run the commands one at a time:

```bash
sudo sysctl -w net.mptcp.enabled=0
```

```bash
echo 'net.mptcp.enabled=0' | sudo tee /etc/sysctl.d/99-disable-mptcp.conf
```

The first command disables the creation of new MPTCP sockets on the server. The second saves the setting for subsequent boots.

## Step 2. Remove the old Xray

The MPTCP setting on the server may not apply to the Xray container. Before updating the system, remove the old Xray through the app:

1. Open **AmneziaVPN** with a server connection that has **full access**.
2. Tap the ⚙️ (**gear**) icon → **Servers** → select your server.
3. Open the **Protocols** tab → **Xray** → **Remove** and confirm removal.

## Step 3. Update the system and reboot the server

System and Linux kernel updates include fixes for bugs and vulnerabilities.

Return to the terminal and start the update:

```bash
sudo apt update && sudo apt dist-upgrade -y
```

Wait for the installation to complete successfully, then **make sure to reboot the server**:

```bash
sudo reboot
```

The SSH connection will be interrupted when the server reboots. Wait for the server to start.

:::info
Updates are installed from the configured repositories. The availability of fixes depends on the system version and the repositories in use. A successful update alone does not confirm that all vulnerabilities have been fixed.
:::

## Step 4. Install the updated Xray

If you have not updated **AmneziaVPN** yet, update the app to the [latest version on GitHub](https://github.com/amnezia-vpn/amnezia-client/releases/latest) with **Xray 26.10.31 or later**. Then reinstall the **Xray** protocol on your server by following the steps below.

1. Open the updated **AmneziaVPN** app.
2. Open **Settings** → **Servers** → select your server → **Protocols**.
3. Select **Xray**, tap **Install** and wait for the installation to complete.
4. Connect to the VPN and share access with the other server users again.
