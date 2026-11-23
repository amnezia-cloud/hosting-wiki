---
title: "Cascade: get your VPN working again without changing servers"
description: "Cascade gives your server a new address for VPN and SSH when its IP is unreachable from your region. The server and its data stay the same. Step-by-step setup in your account and in Amnezia VPN."
head:
  - - meta
    - name: keywords
      content: cascade, ip unreachable, server unreachable, new server address, amneziawg, cascade endpoint, cascade port, port forwarding
---

<script setup>
import { onMounted, onUnmounted } from 'vue'

// Click a screenshot to enlarge it (this page only).
let detach
onMounted(() => {
  const open = (img) => {
    const box = document.createElement('div')
    box.className = 'cz-lightbox'
    box.setAttribute('role', 'dialog')
    box.setAttribute('aria-label', img.alt)
    box.innerHTML = '<button type="button" aria-label="Close">Close ✕</button>'
    const big = document.createElement('img')
    big.src = img.src
    big.alt = img.alt
    box.appendChild(big)
    const close = () => { box.remove(); document.removeEventListener('keydown', onKey) }
    const onKey = (e) => { if (e.key === 'Escape') close() }
    box.addEventListener('click', close)
    document.addEventListener('keydown', onKey)
    document.body.appendChild(box)
    box.querySelector('button').focus()
  }
  const onClick = (e) => {
    const img = e.target.closest('.cz-shot img')
    if (img) open(img)
  }
  document.addEventListener('click', onClick)
  detach = () => document.removeEventListener('click', onClick)
})
onUnmounted(() => detach && detach())
</script>

# 🔀 Cascade: get your VPN working again without changing servers

If your server's IP address becomes unreachable from your region, the VPN stops connecting. Until now, the only way out was a new server with a new IP: rent it, install the VPN again, and move everything over from the old server.

Cascade works differently: **your server stays the same**, and you connect to it through a new address. The only thing you need to update is the connections — yours and those of everyone you have shared access with.

<div class="cz-summary">
<div><b>Same server</b><span>your data and installed protocols stay in place</span></div>
<div><b>Two new addresses</b><span>one for VPN, one for managing the server</span></div>
<div><b>~10 minutes</b><span>to set up with this guide</span></div>
<div><b>$2 a month</b><span>instead of a new server and setting everything up again</span></div>
</div>

## How it works {#how}

Cascade is an intermediate node between your device and your server. Your provider only sees a connection to the Cascade address, and Cascade forwards the traffic on to your server. You go online just as before — with your server's IP address.

<figure class="cz-scheme" aria-label="Connection diagram without Cascade and with Cascade">
<svg class="cz-scheme-svg" viewBox="0 0 680 270" role="img">
<title>Without Cascade, the server is unreachable from your region. With Cascade, your device connects to Cascade, which forwards traffic to your server.</title>
<text x="0" y="22" class="cz-s-cap">Without Cascade</text>
<rect x="0" y="38" width="130" height="56" rx="12" class="cz-s-box"/>
<text x="65" y="64" class="cz-s-t">📱 Device</text><text x="65" y="82" class="cz-s-sub">phone, PC</text>
<line x1="130" y1="66" x2="530" y2="66" class="cz-s-line cz-s-dash"/>
<circle cx="330" cy="66" r="16" class="cz-s-block"/><path d="M322 58 L338 74 M338 58 L322 74" class="cz-s-x"/>
<text x="330" y="106" class="cz-s-sub cz-s-red">IP unreachable from your region</text>
<rect x="530" y="38" width="150" height="56" rx="12" class="cz-s-box"/>
<text x="605" y="64" class="cz-s-t">🖥 Your server</text><text x="605" y="82" class="cz-s-mono">192.0.2.147</text>

<text x="0" y="160" class="cz-s-cap">With Cascade</text>
<rect x="0" y="176" width="130" height="56" rx="12" class="cz-s-box"/>
<text x="65" y="202" class="cz-s-t">📱 Device</text><text x="65" y="220" class="cz-s-sub">phone, PC</text>
<line x1="130" y1="204" x2="262" y2="204" class="cz-s-line cz-s-ok"/><path d="M254 198 L264 204 L254 210" class="cz-s-arrow"/>
<rect x="264" y="172" width="152" height="64" rx="12" class="cz-s-box cz-s-accent"/>
<text x="340" y="198" class="cz-s-t">🔀 Cascade</text><text x="340" y="218" class="cz-s-mono">198.51.100.24</text>
<line x1="416" y1="204" x2="528" y2="204" class="cz-s-line cz-s-ok"/><path d="M520 198 L530 204 L520 210" class="cz-s-arrow"/>
<rect x="530" y="176" width="150" height="56" rx="12" class="cz-s-box"/>
<text x="605" y="202" class="cz-s-t">🖥 Your server</text><text x="605" y="220" class="cz-s-mono">192.0.2.147</text>
<text x="605" y="256" class="cz-s-sub">→ to the internet</text>
</svg>
</figure>

::: tip Cascade cannot see your traffic
It only forwards encrypted packets. The encryption keys exist only on your devices and on your server.
:::

## What Cascade includes {#what}

After payment you get two addresses. They come from different subnets: if one becomes unreachable from your region, the other keeps working.

| Address | Protocol | Used for | Example |
| --- | --- | --- | --- |
| **VPN address** | UDP | Connecting to the VPN over AmneziaWG | `198.51.100.24` |
| **SSH address** | TCP | Managing the server, including from the Amnezia VPN app | `203.0.113.89` |

## Before you start {#before}

<div class="cz-check">

- Your server is rented from Amnezia Hosting — Cascade works only with our servers.
- The **Amnezia VPN** app is installed, version **5.1.1.10 or later**.
- You have the server login details at hand: username `root` and the password. You can find them in your account, on the server card.
- The **Cascade** service is paid for and shows up in your account.

</div>

::: info The addresses in the screenshots are examples
Yours will be different. Just enter them in the same places as shown in this guide. The screenshots show the Russian-language interface; the names of buttons and fields are given in the text.
:::

## Step-by-step setup {#setup}

::: details Server not added to the app yet? Do this first
In Amnezia VPN, tap **«+»**, enter the server IP address, the username `root`, and the password from the server card in your account. Choose the **Automatic** installation and wait for it to finish — the app will install the AmneziaWG protocol.

<figure class="cz-shot"><img src="/img/cascade/01.webp" alt="Login details (2) come from the server card in your account and go into the app (1)" loading="lazy"><figcaption>Login details (2) come from the server card in your account and go into the app (1)</figcaption></figure>

<div class="cz-row cz-row-3"><figure class="cz-shot"><img src="/img/cascade/02.webp" alt="Choose “Automatic”" loading="lazy"><figcaption>Choose “Automatic”</figcaption></figure><figure class="cz-shot"><img src="/img/cascade/03.webp" alt="Installing AmneziaWG" loading="lazy"><figcaption>Installing AmneziaWG</figcaption></figure></div>

<figure class="cz-shot"><img src="/img/cascade/04.webp" alt="Server added, the VPN connects directly" loading="lazy"><figcaption>Server added, the VPN connects directly</figcaption></figure>

If the server IP is already unreachable from your region, skip this: the server will be added through Cascade in step 4.
:::

### Find the AmneziaWG port {#cz-step-1}

In the app, open the server settings → **AmneziaWG** → **AmneziaWG server settings**. Note the number in the **Port** field — `44212` in this example.

<div class="cz-row cz-row-1"><figure class="cz-shot"><img src="/img/cascade/06-app.webp" alt="The AmneziaWG protocol port on your server" loading="lazy"><figcaption>The AmneziaWG protocol port on your server</figcaption></figure></div>

### Set up Cascade in your account {#cz-step-2}

Open the **Cascade** service and go to the **Management** tab. Your VPN address and SSH address are already shown there. Fill in three fields:

- **Server** — pick your server from the list;
- **UDP port (VPN)** — the AmneziaWG port from step 1;
- **TCP port (SSH)** — `22`, unless you changed the SSH port.

Click **Save**.

<figure class="cz-shot"><img src="/img/cascade/05.webp" alt="The empty Cascade form: fill in the fields (1), then save (2)" loading="lazy"><figcaption>The empty Cascade form: fill in the fields (1), then save (2)</figcaption></figure>

<figure class="cz-shot"><img src="/img/cascade/06-panel.webp" alt="A filled-in form" loading="lazy"><figcaption>A filled-in form</figcaption></figure>

### Wait for the “Active” status {#cz-step-3}

Two lines with a status will appear to the right of the fields. Cascade usually turns on within a few seconds.

<div class="cz-row cz-row-2 cz-row-panel"><figure class="cz-shot"><img src="/img/cascade/07.webp" alt="“Applying” — setup in progress" loading="lazy"><figcaption>“Applying” — setup in progress</figcaption></figure><figure class="cz-shot"><img src="/img/cascade/08.webp" alt="“Active” — ready to connect" loading="lazy"><figcaption>“Active” — ready to connect</figcaption></figure></div>

Each line shows where Cascade forwards connections. For example, `198.51.100.24:35495 → 192.0.2.147:44212` means: everything that arrives at the Cascade address on port `35495` goes to your server on port `44212`.

::: warning Write down two values — you will need them next
**From the TCP port (SSH) line:** the address and port to the left of the arrow — `203.0.113.89:38906`.<br>
**From the UDP port (VPN) line:** the port after the colon, to the left of the arrow — `35495`.
:::

::: info You can switch Cascade to another server of yours
One Cascade service works with one server, but you can change it: choose another of your servers in the **Server** field, enter its ports, and save. The Cascade addresses stay the same; for the new server, repeat steps 4 and 5.

You can change the server and ports no more often than the set limit allows. The **“Next change — after…”** note under the lines shows when the next change becomes available.
:::

### Add the server to the app through Cascade {#cz-step-4}

In Amnezia VPN, tap **«+»** and fill in:

- **Server IP address [:port]** — the address and port from the TCP line, `203.0.113.89:38906` in this example;
- **SSH username** — `root`;
- **Password** — the same as before.

Tap **Continue**, choose **Automatic**, and wait for it to finish.

<figure class="cz-shot"><img src="/img/cascade/09.webp" alt="The address field (1) gets the Cascade SSH address and the port from the TCP line (2)" loading="lazy"><figcaption>The address field (1) gets the Cascade SSH address and the port from the TCP line (2)</figcaption></figure>

<div class="cz-row cz-row-2"><figure class="cz-shot"><img src="/img/cascade/10.webp" alt="Choose “Automatic”" loading="lazy"><figcaption>Choose “Automatic”</figcaption></figure><figure class="cz-shot"><img src="/img/cascade/11.webp" alt="The app connects to the server through Cascade" loading="lazy"><figcaption>The app connects to the server through Cascade</figcaption></figure></div>

### Enter Cascade in the AmneziaWG settings {#cz-step-5}

Open this server's settings → **AmneziaWG** → **AmneziaWG server settings** and scroll down to the **Cascade connection** section:

- **Cascade endpoint** — the Cascade VPN address, `198.51.100.24` in this example;
- **Cascade port** — the port from the UDP line, `35495` in this example.

Tap **Save**.

<div class="cz-row cz-row-1"><figure class="cz-shot"><img src="/img/cascade/12.webp" alt="You need the second item — “AmneziaWG server settings”" loading="lazy"><figcaption>You need the second item — “AmneziaWG server settings”</figcaption></figure></div>

<figure class="cz-shot"><img src="/img/cascade/13.webp" alt="Cascade endpoint and Cascade port (1) come from your account: the VPN address (3) and the port from the UDP line (2)" loading="lazy"><figcaption>Cascade endpoint and Cascade port (1) come from your account: the VPN address (3) and the port from the UDP line (2)</figcaption></figure>

::: danger Keys you have already shared will not change
Only connections created after saving will work through Cascade. If other people use your server, share access with them again — see [below](#share).
:::

### Connect and check {#cz-step-6}

Tap **Connect**. Then open any IP-check website, for example 2ip.io: it should show **your server's IP**. That means traffic goes through Cascade to your server and from there to the internet.

<figure class="cz-shot"><img src="/img/cascade/14.webp" alt="The VPN is connected through Cascade" loading="lazy"><figcaption>The VPN is connected through Cascade</figcaption></figure>

<figure class="cz-shot"><img src="/img/cascade/15.webp" alt="The website sees your server’s IP — everything works" loading="lazy"><figcaption>The website sees your server’s IP — everything works</figcaption></figure>

## Cheat sheet: what goes where {#cheat}

| Where | What to enter | Where to find it | Example |
| --- | --- | --- | --- |
| Account → UDP port (VPN) | AmneziaWG port | App → AmneziaWG server settings → Port | `44212` |
| Account → TCP port (SSH) | Server SSH port | Usually `22` | `22` |
| App → Server IP address [:port] | Cascade SSH address and port | TCP line, left of the arrow | `203.0.113.89:38906` |
| App → Cascade endpoint | Cascade VPN address | “VPN address” in your account | `198.51.100.24` |
| App → Cascade port | Cascade UDP port | UDP line, port left of the arrow | `35495` |

## If other people use your server {#share}

The keys you shared earlier point to the old address, which is unreachable from your region. After step 5, create a new connection for each person: in the app, open **Share** and send them a new key or QR code. You can delete the old keys.

## Connecting to the server over SSH {#ssh}

If you connect to the server over SSH to manage it, use the Cascade SSH address and the port from the TCP line:

```bash
ssh -p 38906 root@203.0.113.89
```

Use your own port and address from your account.

## Statuses and what to do {#status}

| Status | What it means | What to do |
| --- | --- | --- |
| <span class="cz-dot cz-blue"></span>Applying | Cascade is being set up | Wait a few seconds |
| <span class="cz-dot cz-green"></span>Active | Everything works | You can connect |
| <span class="cz-dot cz-yellow"></span>Delayed | No confirmation for over 5 minutes | Wait; if nothing changes, contact support |
| <span class="cz-dot cz-red"></span>Error | The setup was not applied | Check the server and port, save again, or contact support |
| <span class="cz-dot cz-grey"></span>Server unavailable | The server was deleted or its IP changed | Choose another server in the “Server” field |

</section>

<div class="cz-cta">
<span class="cz-cta-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
<div class="cz-cta-text"><h2 id="get-cascade" class="cz-cta-title">No Cascade yet?</h2><span>Set it up in advance so you don’t lose access to your server</span></div>
<a class="cz-cta-btn" href="https://storage.googleapis.com/amnezia/host?m-path=/en/cascade" target="_blank" rel="noreferrer">Get Cascade <span aria-hidden="true">→</span></a>
</div>

<section class="cz-cta-after">

## FAQ {#faq}

::: details How is Cascade better than replacing the server?
The server, its data, and installed protocols stay in place: no need to rent a new server, install the VPN again, or move data. You will still need to update connections — issue new ones, through Cascade, for yourself and everyone you have shared access with (see [“If other people use your server”](#share)).
:::

::: details Do I need to change anything on the server itself?
You don't need to do anything on the server by hand: everything is set up in your account and in the Amnezia VPN app.
:::

::: details Will it be slower?
Traffic passes through an extra node, so there may be a small additional delay. It usually doesn't affect everyday use or video.
:::

::: details Can I use Cascade with a server from another provider?
No, Cascade works only with servers at Amnezia Hosting.
:::

::: details Can I point Cascade to another server of mine?
Yes, one Cascade service can be switched between your servers: choose another server in the “Server” field and save. You can do this no more often than the set limit allows — the time of the next change is shown in the “Next change — after…” line. See [step 3](#cz-step-3) for details.
:::

::: details Which protocols work through Cascade?
For now, the VPN address accepts only UDP, and the SSH address only TCP: it's used to log in to the server and manage it from the app.

**For VPN through Cascade, we recommend AmneziaWG 3.1.** Cascade has been tested with it and works reliably. Other protocols may work with errors through Cascade or not connect at all.
:::

<style>
/* Styles for this page only (classes prefixed with cz-) */
.cz-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:22px 0}
.cz-summary div{padding:14px;border:1.5px solid var(--vp-c-brand-1);border-radius:12px;background:var(--vp-c-brand-soft)}
.cz-summary b{display:block;color:var(--vp-c-brand-1);font-size:16px;line-height:1.3;margin-bottom:4px}
.cz-summary span{display:block;font-size:13px;line-height:1.45;color:var(--vp-c-text-1)}
@media (max-width:760px){.cz-summary{grid-template-columns:1fr 1fr}}

.cz-scheme{margin:20px 0;padding:18px;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg-soft)}
.cz-scheme-svg{width:100%;height:auto;display:block}
.cz-s-cap{font:600 14px var(--vp-font-family-base);fill:var(--vp-c-text-1)}
.cz-s-box{fill:var(--vp-c-bg);stroke:var(--vp-c-divider);stroke-width:1.5}
.cz-s-accent{stroke:var(--vp-c-brand-1);stroke-width:2;fill:var(--vp-c-brand-soft)}
.cz-s-t{font:600 14px var(--vp-font-family-base);fill:var(--vp-c-text-1);text-anchor:middle}
.cz-s-sub{font:12px var(--vp-font-family-base);fill:var(--vp-c-text-2);text-anchor:middle}
.cz-s-red{fill:var(--vp-c-danger-1)}
.cz-s-mono{font:500 12px var(--vp-font-family-mono);fill:var(--vp-c-brand-1);text-anchor:middle}
.cz-s-line{stroke-width:2.5} .cz-s-dash{stroke:var(--vp-c-text-3);stroke-dasharray:6 6} .cz-s-ok{stroke:var(--vp-c-brand-1)}
.cz-s-arrow{fill:none;stroke:var(--vp-c-brand-1);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.cz-s-block{fill:var(--vp-c-bg);stroke:var(--vp-c-danger-1);stroke-width:2.5} .cz-s-x{stroke:var(--vp-c-danger-1);stroke-width:3;stroke-linecap:round}

.cz-check ul{list-style:none;padding-left:0}
.cz-check li{position:relative;padding-left:30px}
.cz-check li::before{content:"";position:absolute;left:0;top:4px;width:18px;height:18px;border-radius:5px;background:var(--vp-c-brand-soft);border:1.5px solid var(--vp-c-brand-1)}
.cz-check li::after{content:"";position:absolute;left:6px;top:7px;width:5px;height:9px;border:solid var(--vp-c-brand-1);border-width:0 2px 2px 0;transform:rotate(45deg)}

/* Step numbers: green circles before step headings */
.vp-doc h2#setup{counter-reset:czstep}
.vp-doc h3[id^="cz-step-"]{counter-increment:czstep;position:relative;padding-left:48px;margin-top:40px;min-height:36px;display:flex;align-items:center}
.vp-doc h3[id^="cz-step-"]::before{content:counter(czstep);position:absolute;left:0;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:var(--vp-button-brand-bg);color:var(--vp-button-brand-text);font-weight:700;font-size:17px;display:grid;place-items:center}

.cz-shot{margin:14px 0}
.cz-shot img{display:block;width:100%;height:auto;border:1px solid var(--vp-c-divider);border-radius:10px;background:#111;cursor:zoom-in}
.cz-shot figcaption{font-size:13px;color:var(--vp-c-text-2);margin-top:6px;line-height:1.45}
.cz-row{display:grid;gap:12px;align-items:start}
.cz-row .cz-shot{margin:8px 0}
.cz-row-2{grid-template-columns:1fr 1fr} .cz-row-3{grid-template-columns:repeat(3,1fr)} .cz-row-1{max-width:300px}
@media (max-width:560px){.cz-row-3{grid-template-columns:1fr 1fr} .cz-row-panel{grid-template-columns:1fr}}

.cz-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:8px;vertical-align:1px}
.cz-green{background:#22c55e} .cz-blue{background:#3b82f6} .cz-yellow{background:#eab308} .cz-red{background:#ef4444} .cz-grey{background:#9ca3af}

.cz-lightbox{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.86);display:flex;align-items:center;justify-content:center;padding:16px;cursor:zoom-out}
.cz-lightbox img{max-width:100%;max-height:100%;border-radius:8px}
.cz-lightbox button{position:absolute;top:12px;right:16px;background:rgba(255,255,255,.15);color:#fff;border:0;border-radius:20px;padding:6px 14px;font-size:14px;cursor:pointer}
/* “No Cascade yet?” banner before the FAQ */
.cz-cta{display:flex;align-items:center;gap:20px;margin:28px 0;padding:22px 24px;border:1px solid var(--vp-c-brand-1);border-radius:16px;background:linear-gradient(110deg,var(--vp-c-bg-soft) 35%,var(--vp-c-brand-soft))}
.cz-cta-icon{flex:none;width:52px;height:52px;border-radius:12px;display:grid;place-items:center;background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1)}
.cz-cta-text{flex:1;min-width:0}
.vp-doc .cz-cta-text h2.cz-cta-title{display:block;margin:0;padding:0;border:0;font-size:18px;line-height:1.35;letter-spacing:0;color:var(--vp-c-text-1)}
.cz-cta-text span{display:block;margin-top:2px;font-size:15px;line-height:1.5;color:var(--vp-c-text-2)}
.vp-doc a.cz-cta-btn{flex:none;display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:999px;background:var(--vp-c-brand-1);color:#06210f;font-size:15px;font-weight:700;text-decoration:none;white-space:nowrap;transition:background-color .15s ease}
.vp-doc a.cz-cta-btn:hover{background:var(--vp-c-brand-2);color:#06210f}
@media (max-width:640px){.cz-cta{flex-direction:column;align-items:flex-start;gap:14px}.vp-doc a.cz-cta-btn{align-self:stretch;justify-content:center}}

</style>

