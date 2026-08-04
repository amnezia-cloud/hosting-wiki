# Setting Up the Hysteria 2 Protocol

This guide will help you deploy and configure a fast VPN server on the **Hysteria 2** protocol on your own. It is written for beginners: deep knowledge of Linux or networking is not required — just follow the steps carefully in order.

## Step 1. Connect to the Server via SSH

Open a terminal on your computer and enter the connection command. Replace `<USER>` with your username (e.g., `root`) and `<SERVER_IP>` with your VPS IP address:

```bash
ssh <USER>@<SERVER_IP>
```

## Step 2. Update the System and Install Utilities

After logging in, update the package list and install the tools required for the setup (`curl`, the `micro` text editor, and the `pwgen` password generator):

```bash
apt update && apt install curl micro pwgen -y
```

## Step 3. Install Hysteria 2

Download and run the official script that automatically installs the latest version of Hysteria 2:

```bash
bash <(curl -fsSL https://get.hy2.sh/)
```

## Step 4. Configure Masquerade

To protect against blocking, we will create a fake website. If censors try to check your IP in a browser, they will see an ordinary loading page.

Create the directory and generate the placeholder page:

```bash
mkdir -p /var/www/masq
tee /var/www/masq/index.html >/dev/null <<'HTML'
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Please wait</title><style>body{background:#080808;height:100vh;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif}.dots{display:flex;gap:15px;margin-bottom:30px}.d{width:20px;height:20px;background:#fff;border-radius:50%;animation:b 1.4s infinite ease-in-out both}.d:nth-child(1){animation-delay:-0.32s}.d:nth-child(2){animation-delay:-0.16s}@keyframes b{0%,80%,100%{transform:scale(0);opacity:0.2}40%{transform:scale(1);opacity:1}}.t{color:#555;font-size:14px;letter-spacing:2px;font-weight:600}</style></head><body><div class="dots"><div class="d"></div><div class="d"></div><div class="d"></div></div><div class="t">RETRYING CONNECTION</div></body></html>
HTML
```

## Step 5. Generate a Password for the VPN

Create a strong random password that you will need to enter in the configuration file:

```bash
openssl rand -hex 16
```

*Copy the resulting string to a notepad.*

## Step 6. Create the Configuration File

Open the built-in editor to configure the server:

```bash
micro /etc/hysteria/config.yaml
```

Paste the following configuration template, replacing the sample values (`your_domain`, `your_email`, and `your_password`) with your real ones:

```yaml
listen: :443

acme:
  type: http
  domains:
    - your_domain_here
  email: your_email_here

auth:
  type: userpass
  userpass:
    Admin: your_password_here

masquerade:
  type: file
  file:
    dir: /var/www/masq
  listenHTTP: :80
  forceHTTPS: true
```

*To save your changes in the `micro` editor, press `Ctrl + S`, then press `Ctrl + Q` to exit.*

## Step 7. Configure the Firewall (UFW)

Allow connections to the required ports so the server is reachable from the network:

```bash
ufw allow 22/tcp      # SSH access (change 22 if you use a non-standard port)
ufw allow 80/tcp      # SSL certificate issuance (HTTP)
ufw allow 443/tcp     # HTTPS masquerade
ufw allow 443/udp     # Main Hysteria 2 working port (UDP)
ufw --force enable    # Enable the firewall
ufw status verbose    # Check the port status
```

## Step 8. Start and Verify the Service

Reload the service manager, add Hysteria to autostart, and launch the process:

```bash
systemctl daemon-reload
systemctl enable --now hysteria-server.service
```

To make sure the server is running without errors, check its status:

```bash
systemctl status hysteria-server.service
```

Congratulations! Your Hysteria 2 server is ready. You can now use the details you obtained (the domain, the `Admin` username, and the generated password) to configure client applications (such as Nekobox, v2rayN, or Shadowrocket).
