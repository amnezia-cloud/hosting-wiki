---
title: "Сайт в сети Tor на сервере"
description: "Как установить сайт в сети Tor через AmneziaVPN и настроить WordPress."
---

# Сайт в сети Tor на сервере

С помощью **AmneziaVPN** можно не только создавать VPN на сервере, но и разворачивать сайт на WordPress в сети Tor.

1. На главном экране нажмите на название сервера, затем нажмите на иконку ⚙️ (**шестерёнка**) рядом с сервером. Перейдите на вкладку **Сервисы**, выберите **Веб-сайт в сети Tor** и нажмите **Установить**.

   ![Установка сервиса «Веб-сайт в сети Tor» через настройки сервера](/img/create-tor-website/create_tor_website1_ru.png)

2. После установки сервиса перейдите на вкладку **Сервисы**, выберите **Веб-сайт в сети Tor**, затем выберите **Website in Tor network настройки сервера**. Скопируйте **Адрес сайта** и откройте его в [Tor Browser].

   Через несколько минут после установки Onion Site станет доступен в сети Tor. При настройке WordPress укажите этот onion-адрес в качестве домена.

   ![Переход к настройкам сайта в сети Tor и копирование onion-адреса](/img/create-tor-website/create_tor_website2_ru.png)

3. В WordPress выберите **Русский** и нажмите **Продолжить**. Если выбран английский язык, кнопка называется **Continue**.

   ![Выбор языка интерфейса при установке WordPress](/img/create-tor-website/create_tor_website3.png)

4. Укажите название сайта, имя пользователя, пароль и e-mail. Сохраните пароль для входа, затем нажмите **Установить WordPress**.

   ![Ввод названия сайта и данных администратора при установке WordPress](/img/create-tor-website/create_tor_website4_ru.png)

5. После установки WordPress нажмите **Войти**.

   ![Завершение установки WordPress и кнопка «Войти»](/img/create-tor-website/create_tor_website5_ru.png)

6. Введите имя пользователя или email и пароль, затем нажмите **Войти**.

   ![Форма входа в WordPress: имя пользователя или email и пароль](/img/create-tor-website/create_tor_website6_ru.png)

7. Откроется консоль WordPress. Сайт готов к настройке и публикации.

   ![Консоль WordPress после входа администратора](/img/create-tor-website/create_tor_website7_ru.png)

Более подробную информацию по созданию сайтов на WordPress вы найдёте в [документации WordPress].

[Tor Browser]: https://www.torproject.org/
[документации WordPress]: https://wordpress.org/documentation/
