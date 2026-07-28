---
title: "Server Security"
description: "Basic VPS protection: updates, a separate user, changing the SSH port, key-based login, the UFW firewall, and fail2ban."
head:
  - - meta
    - name: keywords
      content: "server security, ufw, firewall, ssh port, fail2ban, ssh keys, sudo, hardening, vps protection, brute force"
---

# 🔒 Server Security

A few straightforward steps noticeably improve your VPS's protection, shutting it off from password guessing and automated scanners. You do not have to do everything at once — start with the basics and add the rest when you have time.

::: tip The order matters
Work through the sections top to bottom. Above all: before disabling password login and before enabling the firewall, make sure the new way in works — test it in a **new** terminal window without closing the current one.
:::

## 1. Updates {#updates}

Current packages close known vulnerabilities:

```bash
sudo apt update && sudo apt upgrade -y
```

To install security updates automatically:

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

## 2. A separate user with sudo rights {#user}

Working as `root` all the time is risky. Create a regular user with admin rights — replace `alex` with a name of your own (Latin letters only):

```bash
adduser alex
usermod -aG sudo alex
echo "alex ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/alex
su - alex
```

From here on, run commands as that user with the `sudo` prefix.

## 3. Changing the default SSH port {#ssh-port}

Port 22 is scanned by botnets around the clock. Moving to a non-standard port (1024–65535) sharply reduces the flow of login attempts.

```bash
sudo nano /etc/ssh/sshd_config
```

Find the `#Port 22` line, remove the `#`, and set your own port, e.g. `Port 2222`. Save with `Ctrl+O` → Enter → `Ctrl+X`. Then open the port and restart the service:

```bash
sudo ufw allow 2222/tcp
sudo systemctl restart ssh   # on very old systems: sudo systemctl restart sshd
```

Connecting now looks like this: `ssh -p 2222 alex@SERVER_IP`

::: danger Verify access first
Without closing your current session, open a **new** terminal window and confirm that logging in on the new port works. Otherwise you may lock yourself out.
:::

::: warning Important for AmneziaVPN
If the server is added to the app, set the new port there too — otherwise protocol installation will fail. The app cannot edit saved credentials: remove the server and add it again, and instead of reinstalling protocols use the **“Check the server for previously installed Amnezia services”** button. See **[30x errors](/en/error-30x#credentials-changed)**.
:::

## 4. Key-based login instead of a password {#ssh-keys}

A key is sturdier than a password: the public key sits on the server (the “lock”), the private one stays with you (the “key”).

### Create the keys on your own computer

**Windows** (built-in SSH — the recommended route), in Command Prompt:

```bash
cd /D %USERPROFILE%\.ssh && ssh-keygen -f id_ed25519 -C "amnezia" -N "" -q -t ed25519
```

| Flag | Meaning |
| :--- | :--- |
| `-f id_ed25519` | the private key filename — make it distinctive |
| `-C "amnezia"` | a label to identify the key |
| `-N ""` | no passphrase |
| `-q` | quiet mode |
| `-t ed25519` | key type ED25519 |

You get a pair: `id_ed25519` (private — never share it) and `id_ed25519.pub` (public).

**macOS and Linux:**

```bash
ssh-keygen                                  # Enter is fine for every question
ssh-copy-id -p 2222 alex@SERVER_IP
```

### Adding the public key manually

```bash
mkdir -p ~/.ssh && nano ~/.ssh/authorized_keys
```

Paste the contents of the `.pub` file and save: `Ctrl+O` → Enter → `Ctrl+X`.

::: details If you use PuTTY
A `.ppk` key works only with PuTTY itself: set its path in **Connection → SSH → Auth → Credentials**, the *Private key file for authentication* field. For the AmneziaVPN app the key has to be exported to OpenSSH format — the steps are in **[30x errors](/en/error-30x#ssh-keys)**.
:::

### Disabling password login

::: danger Test key login first
Open a new terminal window and confirm the server lets you in without a password. Only then continue.
:::

```bash
sudo nano /etc/ssh/sshd_config
```

Find `PasswordAuthentication yes` and change it to `PasswordAuthentication no`. You can also forbid `root` logins: turn `#PermitRootLogin yes` into `PermitRootLogin no`. Save and restart the service:

```bash
sudo systemctl restart ssh
```

## 5. The UFW firewall {#ufw}

Close everything except what you need:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp     # CRITICAL: your SSH port
sudo ufw allow 443/tcp      # e.g. XRay over TCP
sudo ufw allow 51820/udp    # e.g. AmneziaWG / WireGuard over UDP
sudo ufw enable && sudo ufw status
```

::: danger Do not lock yourself out of SSH
The SSH port must be allowed **before** the firewall is enabled. Skip that and you lose access to the server.
:::

A rule of thumb when changing protocols: added a new protocol in AmneziaVPN or changed a port? Open it in UFW (`sudo ufw allow PORT`). Close old unused ports (`sudo ufw delete allow PORT`) and reload the firewall (`sudo ufw reload`). The 3X-UI panel port needs opening too — see **[3X-UI Panel](/en/3x-ui#credentials-panel)**.

## 6. Brute-force protection: fail2ban {#fail2ban}

fail2ban bans addresses after a series of failed login attempts.

```bash
sudo apt install fail2ban -y
sudo nano /etc/fail2ban/jail.local
```

Paste the settings:

```ini
[sshd]
ignoreip = 127.0.0.1
bantime = 7200s
findtime = 1d
maxretry = 3
```

| Setting | Meaning |
| :--- | :--- |
| `ignoreip` | trusted addresses that are never banned — e.g. your home or office external IP |
| `bantime` | how long an address stays banned |
| `findtime` | the window in which failed attempts are counted |
| `maxretry` | how many attempts are allowed before a ban |

Examples of `ignoreip`:

```ini
ignoreip = 127.0.0.1/8 ::1 192.168.1.0/24 10.0.0.0/8
ignoreip = 127.0.0.1/8 ::1 93.184.216.34 198.51.100.42
ignoreip = 127.0.0.1/8 172.16.0.0/12 82.202.15.115 myhome.ddns.net
```

Time suffixes for `bantime` and `findtime`: `s` or none — seconds, `m` — minutes, `h` — hours, `d` — days, `w` — weeks, `mo` — months, `y` — years.

Save the file and restart the service:

```bash
sudo systemctl restart fail2ban
```

### Handy fail2ban commands

| Task | Command |
| :--- | :--- |
| List banned addresses | `sudo iptables -L -n -v \| grep fail2ban` |
| SSH jail status | `sudo fail2ban-client status sshd` |
| Unban an address manually | `sudo fail2ban-client set sshd unbanip IP-ADDRESS` |
| Logs for the past day | `sudo awk -v d="$(date -d '1 day ago' +'%Y-%m-%d')" '$1 >= d' /var/log/fail2ban.log` |
| Logs for the past week | `sudo awk -v d="$(date -d '7 days ago' +'%Y-%m-%d')" '$1 >= d' /var/log/fail2ban.log` |

::: tip Banned yourself?
It happens, and it is no disaster: connect from another network, lift the ban with the command above, and add your home address to `ignoreip`. If you have no access at all, write to us and we will help: **[Contacting Support](/en/support)**.
:::

## 7. A strong root password {#password}

```bash
passwd                      # change the password
openssl rand -base64 18     # generate a strong one
```

More on which password is used where — **[How to change the root password](/en/root-password)**.

## 8. Monitoring {#monitoring}

| Task | Command |
| :--- | :--- |
| Active network connections | `ss -tulpn` |
| Who is logged in | `who` |
| Recent logins | `last -n 20` |
| Load and processes | `htop` |
| Free disk space | `df -h` |

::: tip Fewer services, less risk
Do not install software or panels you do not need for the VPN. The fewer exposed services, the smaller the attack surface.
:::
