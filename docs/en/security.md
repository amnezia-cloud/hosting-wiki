---
title: "Server Security"
description: "Basic VPS hardening: the UFW firewall, changing the SSH port, fail2ban, and security updates."
head:
  - - meta
    - name: keywords
      content: "server security, ufw, firewall, ssh port, fail2ban, hardening, vps protection, hacking"
---

# 🔒 Server Security

A few simple steps will noticeably improve the protection of your VPS. All commands are run over SSH as the `root` user.

## 1. Regular Updates

Keep your system up to date — this closes known vulnerabilities:

```bash
apt update && apt upgrade -y
```

To install security updates automatically:

```bash
apt install unattended-upgrades -y
dpkg-reconfigure --priority=low unattended-upgrades
```

## 2. Configure the Firewall (UFW)

UFW is a simple firewall. Allow only the ports you need and close the rest:

```bash
apt install ufw -y
ufw allow 22/tcp        # SSH
ufw allow 443/udp       # e.g., AmneziaWG or Hysteria 2
ufw --force enable
ufw status verbose
```

::: warning Don't lock yourself out of SSH
Before enabling UFW, make sure to allow the SSH port (22 or your custom one), otherwise you will lose access to the server.
:::

## 3. Change the Default SSH Port

Moving SSH from port 22 to a non-standard one sharply reduces the volume of automated attacks. Open the config:

```bash
micro /etc/ssh/sshd_config
```

Find the line `#Port 22`, remove the `#`, and set your own port, e.g. `Port 2222`. Then open the port and restart the service:

```bash
ufw allow 2222/tcp
systemctl restart ssh
```

::: danger Verify access first
Before closing your current session, open a **new** terminal window and confirm the new port works: `ssh -p 2222 root@YOUR_IP`. Otherwise you may lose access to the server.
:::

## 4. Brute-Force Protection (fail2ban)

fail2ban automatically bans IP addresses after a series of failed login attempts:

```bash
apt install fail2ban -y
systemctl enable --now fail2ban
fail2ban-client status sshd
```

## 5. A Strong root Password

Change the password to a long, random one:

```bash
passwd
```

Or generate a strong password:

```bash
openssl rand -base64 18
```

## 6. Monitoring the Server

| Task | Command |
| :--- | :--- |
| Active network connections | `ss -tulpn` |
| Who is currently logged in | `who` |
| Recent logins | `last -n 20` |
| Load and processes | `htop` |
| Free disk space | `df -h` |

::: tip Tip
Don't install unnecessary software or panels if they aren't needed for the VPN. The fewer open services — the smaller the attack surface.
:::
