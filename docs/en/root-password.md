---
title: How to Change the Root Password
description: Changing it with passwd over SSH and reissuing it with Reset Password — with a caveat for servers issued before 20 July 2026.
head:
  - - meta
    - name: keywords
      content: change root password, passwd, reset password, forgot server password, restore access, vps password
---

# 🔑 How to Change the Root Password

## If you still have access {#passwd}

Connect over SSH and run:

```bash
passwd
```

The system asks for the new password twice. Characters do not appear while typing — that is normal. The change takes effect immediately, no reconnection needed.

## If the password is lost {#reset}

The password can be reissued with the **Reset Password** button on the server card at **[my.amnezia.host](https://my.amnezia.host)**. Shut the server down with **Shutdown** first.

::: danger Check when your server was issued
`Reset Password` only works on servers issued **on or after 20 July 2026**. On older VPS the button puts the server into **Bad State** and it has to be replaced by support. Details — **[Reinstalling the OS](/en/reinstall#check)**.

If your server predates that date and the password is lost, do not press the button — open a ticket instead.
:::

## Which password is which {#which-password}

| Password | Where it is used |
| :--- | :--- |
| **Root (SSH) password** | Connecting to the server over SSH, adding the server to the AmneziaVPN app |
| **Client area password** | Signing in to my.amnezia.host, invoices, server actions |
| **3X-UI panel password** | Signing in to the web panel; recoverable on the server with `x-ui settings` |

::: warning Passwords are never sent over
Support never asks for your root password. Do not paste passwords into a ticket or chat — if one has already been sent, change it with `passwd`.
:::
