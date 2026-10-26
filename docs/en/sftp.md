---
title: "Set up SFTP file storage"
description: "Set up file storage on your server with AmneziaVPN, then connect using FileZilla or another SFTP client."
---

# Set up SFTP file storage

## Overview

**AmneziaVPN** also lets you set up file storage on your virtual server. Access your files with an SFTP client such as **FileZilla**, or [mount the storage as a local folder](https://docs.amnezia.org/documentation/instructions/sftp-mount-folder) on your computer.

## Install the SFTP service

1. On the main screen, click the server name.
2. Click the settings icon next to the server name.
3. Go to the **Services** tab and select **SFTP file sharing service**.
4. Leave the port set to `222`, or choose a different port. Then click **Install**.

![Selecting a server and installing the SFTP service with the chosen port](/img/sftp/sftp1_en.png)

## Find your connection details

1. Once installation is complete, return to the **Services** tab and select **SFTP file sharing service**.
2. Select **SFTP service server settings** to open **SFTP settings**.

This screen shows the host, port, username, and password you'll need to connect with an SFTP client.

![Opening the SFTP settings to find the storage connection details](/img/sftp/sftp2_en.png)

## Connect with FileZilla

1. Go to the [FileZilla] website and click **Download FileZilla Client**.

   ![The Download FileZilla Client button on the FileZilla homepage](/img/sftp/sftp3.png)

2. Download **FileZilla Client** for your operating system.

   ![The FileZilla Client download page, with Windows shown as an example](/img/sftp/sftp4.png)

3. If you're asked to choose an edition, select the free **FileZilla** edition and click **Download**.

   ![Choosing the free FileZilla edition and clicking Download](/img/sftp/sftp5.png)

4. Install FileZilla.
5. Open FileZilla. In **Host**, enter your server's IP address preceded by `sftp://`, for example `sftp://199.10.20.171`.
6. Enter the username, password, and port shown in the SFTP settings in **AmneziaVPN**.
7. Click **Quickconnect**.

![The SFTP connection fields and Quickconnect button in FileZilla](/img/sftp/sftp6_en.png)

When your server's folder appears under **Remote site**, you're connected. You can now use FileZilla to access your files.

[FileZilla]: https://filezilla-project.org/
