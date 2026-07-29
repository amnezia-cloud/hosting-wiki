---
title: "Installing AmneziaVPN on iOS in Russia"
description: "AmneziaVPN is hidden from the Russian App Store. How to install it with a new Apple account or by changing the region, what to use instead, and how to update an app you already have."
head:
  - - meta
    - name: keywords
      content: "amneziavpn ios, not available in app store, hidden, change app store region, new apple id, defaultvpn, update app, iphone, ipad"
---

# 🍎 Installing AmneziaVPN on iOS in Russia

AmneziaVPN is hidden from the Russian App Store at the request of Roskomnadzor, so it cannot be downloaded to an iPhone or iPad directly. The app is hidden in the Chinese App Store as well. Below are the options that work, from the simplest to the longest.

::: tip You may not need any of this
If your App Store region is already something other than Russian or Chinese, the app simply downloads from the store — you can skip the instructions below.
:::

## Try the easy things first {#quick-options}

### Update an app you already have {#reinstall-trick}

If AmneziaVPN is already on the device, it can be updated even while the store does not list it:

**iPhone Settings** → **General** → **iPhone Storage** → select **AmneziaVPN** → **Offload App** → **Reinstall App**.

### Use DefaultVPN {#defaultvpn}

If the app is not on the device, we recommend our alternative app **DefaultVPN** for connecting to **Amnezia Free** and **Amnezia Premium** — it is available in the Russian App Store. Details on using it are in the Amnezia documentation, in the section about using Amnezia services on iOS in Russia.

### Connect to your own server with another client {#other-clients}

For **your own VPS** the Amnezia app is not required: keys issued through the 3X-UI panel work in any client that supports VLESS — on iOS that means Streisand, FoXray, Shadowrocket, or V2Box. How to issue such a key — **[3X-UI Panel](/en/3x-ui#client-key)**.

## Why the app is missing from the store {#why-hidden}

*   AmneziaVPN is **hidden** from the Russian and Chinese App Store — a store restriction, not a fault of your device or account.
*   An Apple account in another region solves it: you can **change the region** of your current account or **create a new one**.
*   The App Store region and the region in iOS settings (**General → Language & Region**) are **two different settings**. You do not need to change the system language.

::: tip A new account is usually simpler than changing the region
Changing the region requires turning off Family Sharing, zeroing your Apple account balance, and cancelling every subscription. A new account only needs a spare email address — which makes it the shorter path in most cases.
:::

## Option 1. A new Apple account {#new-account}

Below is the process of creating an account in the US region, verified with a Russian phone number. The regions are just an example — any others will do.

### Step 1. Create the account

Open **[account.apple.com/account](https://account.apple.com/account)** and fill in the details:

| Field | What to enter |
| :--- | :--- |
| **First and last name** | your details |
| **Account country/region** | e.g. United States |
| **Date of birth** | yours |
| **Email address** | valid and **not linked** to an existing Apple account — a code will be sent to it |
| **Password** | needed to sign in: remember it or save it in a password manager |
| **Phone number country** | +7 (Russia) |
| **Phone number** | valid; it may belong to another Apple account — an SMS code will be sent to it |
| **Verification method** | “Text message” |
| **Newsletters** | announcements and news — up to you |
| **Captcha** | the code from the image |

Press **Continue**, enter the code from the email, then the code from the SMS. If everything matches, the account is created and ready to use.

::: warning An error at the SMS code step
This is a common Apple error unrelated to the chosen region: it happens even when registering a Russian account with a fresh Russian number. Try again later or contact Apple support.
:::

### Step 2. Sign in with the new account

1.  Open **Settings** and tap your name.
2.  Choose **“Media & Purchases”** → **“Sign Out”**. This affects the App Store only — the device stays signed in with your Apple ID.
3.  Tap **“Media & Purchases”** again and choose **“Not First Last”** — meaning you want to sign in with a different account.
4.  Enter the new account's login and password.

On the first download Apple will ask you to accept the terms and to pick a billing address and payment method. If you do not plan to buy anything, choose **“None”**.

### Step 3. Download AmneziaVPN

The app will show up in App Store search for the new region.

::: danger Delete the old version first
Before installing, make sure any previously installed AmneziaVPN is removed — otherwise the installation fails with an error.
:::

## Option 2. Change your current account's region {#change-region}

Example: switching a Russian account to the US region, verified with a Russian phone number.

### Step 1. Zero your account balance

Open the App Store and tap your avatar in the top right. The balance, if any, is shown just below your email address. No balance line means there is nothing left — move on.

With a non-zero balance the region cannot be changed. If the remainder is smaller than the cheapest app and cannot be spent, Apple suggests contacting their support.

### Step 2. Cancel paid subscriptions

**Settings** → your name → **“Subscriptions”** → **“Cancel Subscription”**.

If there is no “Cancel Subscription” button, or an expiry date is shown in red, the subscription is already cancelled — move on.

### Step 3. Change the region

1.  **Settings** → your name → **“Media & Purchases”** → **“View Account”** (you may need to enter your Apple ID password).
2.  Tap **“Country/Region”**. With active subscriptions Apple will remind you to cancel them.
3.  **“Change Country or Region”** → pick a country, e.g. the United States. Note that some Apple services do not work in certain regions.
4.  Scroll through the terms → **“Agree”** in the top right corner.
5.  Choose a payment method. If you do not plan to buy anything — **“None”**. If “None” is not offered, you will need a card from a bank in **the same country** as the chosen region: a Georgian bank card cannot be attached to the US region.
6.  Enter a billing address and phone number → **“Next”**. If you do not have them, any values from an address generator will do — Apple does not verify them.

The region changes; you may need to sign in to the App Store and other services again. You can switch back to the Russian region at any time — for example once the apps you needed are installed.

### Step 4. Download AmneziaVPN

::: danger Delete the old version first
Same as in the first option: the old version must be removed before installing, otherwise you get an error.
:::

## After installation {#after}

The app is ready to work with **Amnezia Premium**, **Amnezia Free**, and a VPN on your own server:

*   set up your own server — **[VPN Setup](/en/vpn-setup)**;
*   move a Premium subscription to your VPS — **[Moving from Amnezia Premium](/en/premium-migration)**;
*   if the app errors out while connecting — **[30x errors](/en/error-30x)** and **[VPN not connecting](/en/vpn-troubleshooting)**.

If something does not work out, write to us and we will help: **[Contacting Support](/en/support)**.
