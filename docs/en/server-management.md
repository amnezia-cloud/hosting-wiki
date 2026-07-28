---
title: "Managing Your Amnezia VPS"
description: "Connection details, control panel actions, connecting over SSH, and a cheat sheet of commands for your VPS."
head:
  - - meta
    - name: keywords
      content: "server management, client area, power on, reboot, reset password, reinstall os, ssh, vps resources, broken state"
---

# 🖥️ Managing Your Amnezia VPS

Welcome to the control panel for your virtual private server (VPS). This page brings together everything you need to control your server: connection details, available actions, and step-by-step instructions for beginners.

## ⚙️ 1. Connection Details (Your Credentials) {#credentials}

You need this information to configure VPN clients, connect to the server via the console, or pass it to third-party applications.

::: danger IMPORTANT SECURITY RULE
This information is strictly confidential. Never share it with third parties. Technical support staff will never ask you for your password.
:::

*   🌐 **Server IP Address:** `0.0.0.0` *(The main address of your server on the internet)*
*   👤 **Username:** `root` *(The main system administrator with full privileges)*
*   🔑 **Access Password:** `XXxxXX2026` *(Generated automatically when the server was created)*

## 🛠️ 2. Available Actions in the Control Panel {#panel-actions}

You can manage the physical state of your server directly from the control panel using these buttons:

*   🚀 **Power On:** Starts the server's operating system if it was shut down.
*   🛑 **Shutdown:** Sends a signal to the operating system to safely terminate all processes and power off. We recommend using this option.
*   ⚡ **Power Off:** Instantly cuts power to the server. Use only if the server has frozen and does not respond to the regular `Shutdown` command.
*   🔄 **Reboot:** Performs a quick restart of the server to refresh the configuration or apply settings.
*   🔑 **Reset Password:** Erases the current administrator password and generates a new one. **Note:** before clicking this button, you must shut the server down first with the `Shutdown` command.
*   🔄 **Reinstall OS:** Returns the server to a clean system, wiping every setting and key.

::: danger Reinstall OS and Reset Password do not work on every server
These two buttons are supported only on servers issued **on or after 20 July 2026**. On older VPS they put the server into **Bad State**, and it has to be replaced by support. Check the service activation date before clicking: **[Reinstalling the OS](/en/reinstall#check)**.
:::
*   💳 **Renew Service:** A quick link to the payment gateway to top up your balance and extend the lease.

## ⚠️ 3. Security and Resolving Critical Issues {#security}

We care about keeping your work stable, so the panel enforces restrictions designed to protect your data.

### 🚨 What to do if the status changes to "Broken State"?

If you see **Broken State** in the server status field, or if the server has stopped powering on for any reason and does not respond to the `Power On` / `Reboot` buttons:

1. Do not repeatedly click the control buttons — this may worsen the error inside the virtual container.
2. Immediately **open a ticket with our technical support**. Our engineers will manually check the state of the node (the physical hardware) and restore access as quickly as possible.

A full walkthrough, including the most common cause and what happens to your data and IP address: **[The server is in Bad State](/en/broken-state)**.

### 🔒 Why can't I change the IP address myself?

For the security of all hosting clients, the option to change the IP address yourself in the panel is disabled. This prevents accidental loss of connection to the server and protects against fraudulent activity.

*   If you genuinely need to replace your IP address (for example, due to blocking by providers), **contact support**.
*   Our specialists will quickly verify your account and replace the address manually for your safety.

## 📊 4. Dedicated Technical Resources {#resources}

Your server is guaranteed the following capacity, which is not shared with other users. It is enough for stable VPN performance with up to 10 devices connected at once:

*   🧠 **Processor:** 1 dedicated CPU core (1 × 2.2 GHz)
*   ⚡ **RAM:** 1 GB RAM
*   🌐 **Network:** Up to 100 MB/s channel, unlimited traffic
*   💾 **Storage:** 10 GB of fast SSD disk space

## 📖 5. Detailed Connection Instructions (For Beginners) {#ssh}

If you need to install additional software on the server, configure a proxy, or check the configuration, you will need to connect to the server's text console over the **SSH** protocol.

### Step 1: Open a terminal on your PC

*   **Windows 10/11:** Press `Win + X` and pick **Terminal** or **PowerShell**. Alternatively `Win + R` → `cmd` → Enter.
*   **macOS or Linux:** Use the app search to find the **Terminal** program and launch it.
*   **Windows 7/8:** There is no built-in SSH client — download and run **PuTTY**, enter the server IP in *Host Name*, and click **Open**.

### Step 2: Enter the connection command

In the terminal, enter the following command (replace `0.0.0.0` with your real IP address from Section 1) and press Enter:

```bash
ssh root@0.0.0.0
```

### Step 3: Confirm the security prompt

On the very first connection, your computer will ask whether you trust this server:

> *Are you sure you want to continue connecting (yes/no/[fingerprint])?*

*   Type the word **`yes`** and press Enter.

### Step 4: Enter the access password

The system will ask for the secret key: `root@0.0.0.0's password:`

1. Copy your password (`XXxxXX2026`).
2. Right-click in the terminal window (or press `Shift + Insert`) to paste the password.
3. Press Enter.

::: warning The password is not shown — this is normal
When you paste or type a password in the terminal, **nothing appears on screen (no characters, asterisks, or dots)**. This is a built-in protection of Unix systems. The password is still entered successfully — just press Enter.
:::

### If the connection fails

| Error | Cause and fix |
| :--- | :--- |
| `Connection timed out` | Check that the server status in the panel is **Active**. If it is, your network is blocking traffic to the server: on mobile data under regional restrictions port 22 is often closed — switch to wired Wi-Fi. Walkthrough: **[Connection troubleshooting](/en/vpn-troubleshooting#isp-blocks)** |
| `Permission denied` | The server is reachable but the password is wrong. Note: you need the **server's SSH password**, not your client-area password. Reissue it with **Reset Password** — power the server off first, and only if it was issued on or after 20 July 2026 ([why](/en/reinstall#check)) |
| `Connection refused` | The SSH service is down or the port was changed. If you changed the port in the security settings, connect with `-p`: `ssh root@0.0.0.0 -p 2222` |
| `Connection closed by … port 22` | The connection opened and dropped immediately. Most often the node is closed for maintenance — wait and retry, and open a ticket if it persists. Less commonly it is fail2ban: your address got banned after failed login attempts, so connect from another network or lift the ban |

## 🗲 6. Basic Commands Cheat Sheet {#commands}

After a successful login, you will see the system greeting. Here are the main commands that may come in handy:

*   **Fully update the system to the latest version:**
    ```bash
    apt update && apt upgrade -y
    ```
*   **Check how much free space is left on the disk:**
    ```bash
    df -h
    ```
*   **Launch the task manager to view CPU and memory load** *(press `Q` to exit)*:
    ```bash
    htop
    ```
*   **Force a reboot of the server from inside the system:**
    ```bash
    reboot
    ```
*   **Safely close the connection to the server and the terminal:**
    ```bash
    exit
    ```
