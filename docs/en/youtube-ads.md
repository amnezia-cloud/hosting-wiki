---
title: "YouTube Ads over VPN"
description: "Why YouTube ads disappear through some locations and stay through others, and what you can do on your side."
head:
  - - meta
    - name: keywords
      content: "youtube ads, youtube ads vpn, block ads, ublock origin, smarttube, revanced, youtube premium, server location"
---

# YouTube Ads over VPN

Whether ads are shown is decided by YouTube itself, based on the IP address and a combination of account signals. Neither the VPN nor the hosting influences that decision, which is why ads disappear through some locations and remain through others.

::: warning There are no guarantees here
YouTube's rules change without notice: a location that showed no ads a month ago may start showing them. What follows is what we know from practice, not a promise.
:::

## Where Google itself disabled advertising {#sanctions}

Advertising and monetisation are blocked in these regions:

| Region | Note |
| :--- | :--- |
| 🇷🇺 Russia | ads were disabled by Google in spring 2022; the system recognises Russian users even outside the country from a combination of account signals |
| 🇨🇺 Cuba | |
| 🇮🇷 Iran | |
| 🇰🇵 North Korea | |
| 🇸🇾 Syria | |
| 🇸🇩 Sudan | |

## Where YouTube has no advertising programme {#no-program}

In these countries the local ad market has not launched or is not monetised by the platform, so ads in videos usually disappear when connecting through their IP addresses:

🇦🇱 Albania (the most popular location among VPN users) · 🇲🇩 Moldova · 🇲🇲 Myanmar · 🇺🇿 Uzbekistan · 🇦🇲 Armenia · 🇲🇳 Mongolia · 🇧🇸 Bahamas · 🇧🇳 Brunei · 🇰🇭 Cambodia · 🇱🇦 Laos · 🇲🇬 Madagascar · 🇲🇻 Maldives · 🇨🇮 Côte d'Ivoire · 🇲🇴 Macao

## What you can do on your side {#workarounds}

If ads do show through your location, client-side options help:

| Platform | Option |
| :--- | :--- |
| **Browsers** | the **uBlock Origin** extension |
| **Browsers** | an alternative link of the form `https://yout-ube.com/watch?v=ID` — e.g. `https://youtube.com/watch?v=SdxteCtjXJ8` → `https://yout-ube.com/watch?v=SdxteCtjXJ8` |
| **Android TV** | the **SmartTube** app |
| **Android phones** | the **YouTube ReVanced** project |

The most predictable option, with no caveats at all, is a **YouTube Premium** subscription — it removes ads regardless of location and IP address.

::: tip A server's location is not the same as its country in the databases
Sometimes a service resolves the server's country differently from what you ordered, because GeoIP databases lag behind. See **[Why your server's geolocation mismatches](/en/geolocation)**.
:::
