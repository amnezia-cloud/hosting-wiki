---
title: "Updating Your Server to Address CVE-2026-98432"
description: "Update the system and reinstall Xray through AmneziaVPN to address CVE-2026-98432."
# Keep this reprint out of search results; the original is on docs.amnezia.org.
head:
  - - meta
    - name: robots
      content: noindex, follow
---

# Updating Your Server to Address CVE-2026-98432

Source: [Amnezia Docs](https://docs.amnezia.org/documentation/instructions/update-server-cve-2026-98432/).

## Step 1. Remove the old Xray installation

:::warning
The server will be unavailable to all users during the reboot. Following steps 1–3 below will invalidate existing Xray connections for everyone using the server. The server owner will need to share access again.
:::

Before updating the system, remove the old Xray installation through the app:

1. Open **AmneziaVPN** on a device with **full access** to the server.
2. Click ⚙️ (**gear icon**) → **Servers**, then select your server.
3. Open the **Protocols** tab, select **Xray**, click **Remove**, and confirm.

## Step 2. Update the system and reboot the server

Fixing the vulnerability requires a patched Linux kernel.

You can update the system and reboot the server through the **AmneziaVPN** app:

:::info
The **Update server packages** option was introduced in **AmneziaVPN 5.1.0.6**. If you have an earlier version of the app, download and install the latest version from [GitHub](https://github.com/amnezia-vpn/amnezia-client/releases/latest) or the [downloads page](https://amnezia.org/downloads) ([mirror](https://storage.googleapis.com/amnezia/amnezia.org?m-path=/downloads)).
:::

1. On the home screen, click the server name, then click ⚙️ (**gear icon**) next to the server you want to update.
2. Open the **Management** tab and click **Update server packages**.

    This updates the system packages, similar to running `sudo apt update && sudo apt dist-upgrade -y` on Ubuntu.

3. Click **Continue** and wait for confirmation that the packages have been updated.
4. Once the update is complete, the app will prompt you to reboot the server. Click **Reboot** and wait for the server to come back online. **A reboot is required** for the server to use the updated kernel.

![Updating server packages and rebooting the server in AmneziaVPN](/img/update-server/Update_server_packages_en_1.png)

:::info
The **Update server packages** button installs updates from the repositories configured on your server, but does not guarantee that a kernel containing the fix will be installed.

On some versions of **Ubuntu**, the fix is currently available only in the `-proposed` testing repository and is not included in a standard system update. See [Canonical's advisory](https://ubuntu.com/blog/fixes-available-in-proposed-pocket-for-cve-2026-98432) for details.

If you use a different distribution, check its official security advisories to find out whether a fix for **CVE-2026-98432** is available for your system version and how to install it.
:::

## Step 3. Install the updated Xray

Installing the updated **Xray** requires **AmneziaVPN 5.1.0.6 or later**. If you have an earlier version of the app, download and install the latest version from [GitHub](https://github.com/amnezia-vpn/amnezia-client/releases/latest) or the [downloads page](https://amnezia.org/downloads) ([mirror](https://storage.googleapis.com/amnezia/amnezia.org?m-path=/downloads)). Then reinstall **Xray** on your server using the steps below.

1. Open the updated **AmneziaVPN** app.
2. Go to **Settings** → **Servers**, select your server, and open the **Protocols** tab.
3. Select **Xray**, click **Install**, and wait for the installation to finish.
4. Connect to the VPN and share access with the other server users again.

:::warning
If you reboot the server again after completing this guide, reinstall the **Xray** container by repeating steps 1 and 3. Each subsequent reboot leaves the server vulnerable to **CVE-2026-98432** again until you reinstall the container. This behavior will be fixed in a future **AmneziaVPN** release.
:::
