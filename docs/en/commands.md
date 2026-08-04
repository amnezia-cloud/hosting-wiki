---
title: "Quick Start with VPS"
description: "Your first SSH connection to an Amnezia Hosting server, updating the system, and the basic Linux commands."
head:
  - - meta
    - name: keywords
      content: "quick start, first connection, ssh, vps, linux commands, system update, apt, beginners"
---

# Quick Start <span class="green">with VPS</span>

This guide will help you make your first connection to your new Amnezia Hosting server and introduce you to the basic commands for managing the system.

## Step 1. Get Server Credentials

After your VPS is successfully activated, the main access details will be sent to the email address in your account:

*   **Server IP Address** (e.g., `192.168.1.100`)
*   **Username** (usually `root`)
*   **Password** or **SSH Key**

## Step 2. Connect to the Server via SSH

Depending on your operating system, open a terminal and enter the connection command.

**For Linux / macOS / Windows (via Terminal or PowerShell):**

```bash
ssh root@YOUR_SERVER_IP
```

*Example:* `ssh root@192.168.1.100`

::: info First connection
On the first connection, the terminal will show the warning `The authenticity of host... can't be established`. Type **`yes`** and press **Enter**, then paste your server password (the password characters will not be shown as you type).
:::

## Step 3. Update the System First

Right after your first login, be sure to update the package list and installed software to the latest security versions. Run the command:

```bash
apt update && apt upgrade -y
```

## Essential Commands for Managing Your VPS

Here is the basic set of Linux commands that every administrator needs:

| Command | Description |
| :--- | :--- |
| `pwd` | Show the current folder you are in |
| `ls -la` | List all files and folders in the current directory |
| `cd /path/to/folder` | Change to another folder |
| `df -h` | Show how much free disk space is left |
| `free -h` | Show RAM usage |
| `htop` | Launch the task manager (CPU and RAM monitoring) |
| `nano file` | Open a text file in the editor (exit with `Ctrl + X`) |
| `apt install package` | Install a program from the repository |
| `systemctl status service` | Check a service's status (e.g., `ssh`) |
| `reboot` | Reboot your server |

## Next Step

After the basic update, you can move on to deploying your personal VPN.

*   **[Go to Amnezia VPN Setup](/en/vpn-setup)**
