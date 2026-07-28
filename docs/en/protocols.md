# 🔌 Protocols: AmneziaWG (AWG) and XRay / VLESS

To ensure maximum connection speed and reliably bypass censorship, our network utilizes two of the most advanced VPN protocols available. Below is a detailed breakdown of their features, pros and cons, and recommended use cases.

## 🛡️ AmneziaWG (AWG)

**AmneziaWG** is a modern fork of the popular WireGuard protocol. The Amnezia development team added header obfuscation to protect traffic from detection by Deep Packet Inspection (DPI) systems.

### Pros & Cons

*   **➕ Pros:** Maximum throughput speed, minimal battery consumption on mobile devices, near-instant connection times, and stable performance on mobile data networks.
*   **➖ Cons:** In certain highly restrictive networks, UDP traffic may be heavily throttled or entirely blocked by the ISP.

### Best Used For

Ideal for daily use, high-definition streaming, online gaming (low latency/ping), and downloading files—provided your ISP does not block UDP connections.

## ⚡ XRay / VLESS (Reality)

**XRay running VLESS with Reality stealth technology** represents the cutting edge of anti-censorship tools. It operates over TCP and fully camouflages your VPN traffic as a standard visit to a legitimate, unblocked website (such as a major international marketplace or IT platform).

### Pros & Cons

*   **➕ Pros:** Virtually immune to modern censorship and blocking techniques. The ISP only detects a standard, secure HTTPS connection to a regular website.
*   **➖ Cons:** Slightly higher CPU utilization on your device; maximum speeds may be marginally lower compared to AWG.

### Best Used For

Highly recommended as the primary protocol in regions with strict internet censorship, or as a reliable backup option if AmneziaWG fails to connect.

📖 Set up VLESS + Reality manually through the web panel: **[3X-UI Panel](/en/3x-ui)**

## 📊 Protocol Comparison Matrix

| Feature | AmneziaWG (AWG) | XRay / VLESS (Reality) |
| :--- | :--- | :--- |
| **Traffic Type** | Obfuscated UDP | TCP / TLS (Web Masking) |
| **Speed & Ping** | 🚀 Excellent (Max Performance) | ⚡ Good |
| **Censorship Bypass** | High (DPI Resistant) | 👑 Complete (Indistinguishable from standard web traffic) |
| **Battery Impact** | Minimal | Moderate |

## ⚙️ Setup and Configuration Guide

No complex command-line actions are required. Configuration is fully automated through the official **Amnezia VPN** client app:

1. Open the Amnezia application and select your server.
2. Navigate to the **"Protocols"** tab (or Server Settings).
3. Click the **"Install"** button next to your chosen protocol (AWG or XRay).
4. Wait for the setup process to finish (typically takes under 1 minute).
5. Return to the main screen, choose the newly installed protocol from the dropdown menu, and click **"Connect"**.

::: tip Pro Tip
We highly recommend deploying both protocols on your server. Use **AmneziaWG** by default to enjoy peak speeds, and switch to **XRay** seamlessly if you encounter any connectivity issues.
:::
