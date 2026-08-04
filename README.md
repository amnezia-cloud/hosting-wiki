<div align="center">

<img src="docs/public/logo.png" alt="Amnezia Hosting" width="72" />

# Amnezia Hosting Wiki1

**База знаний для клиентов Amnezia Hosting** — как подключиться к серверу,
настроить свой VPN и разобраться, если что-то не работает.

[**📖 Открыть вики → wiki.amnezia.host**](https://wiki.amnezia.host)

[![Деплой](https://github.com/amnezia-cloud/hosting-wiki/actions/workflows/deploy.yml/badge.svg)](https://github.com/amnezia-cloud/hosting-wiki/actions/workflows/deploy.yml)
[![Звёзды](https://img.shields.io/github/stars/amnezia-cloud/hosting-wiki?style=flat-square&color=00e63d&labelColor=0a0b0d&label=%E2%98%85%20stars)](https://github.com/amnezia-cloud/hosting-wiki/stargazers)
[![Форки](https://img.shields.io/github/forks/amnezia-cloud/hosting-wiki?style=flat-square&color=00e63d&labelColor=0a0b0d)](https://github.com/amnezia-cloud/hosting-wiki/network/members)
[![Issues](https://img.shields.io/github/issues/amnezia-cloud/hosting-wiki?style=flat-square&color=00e63d&labelColor=0a0b0d)](https://github.com/amnezia-cloud/hosting-wiki/issues)
[![Последний коммит](https://img.shields.io/github/last-commit/amnezia-cloud/hosting-wiki?style=flat-square&color=00e63d&labelColor=0a0b0d)](https://github.com/amnezia-cloud/hosting-wiki/commits/main)
[![Правок за месяц](https://img.shields.io/github/commit-activity/m/amnezia-cloud/hosting-wiki?style=flat-square&color=00e63d&labelColor=0a0b0d)](https://github.com/amnezia-cloud/hosting-wiki/pulse)
[![VitePress](https://img.shields.io/badge/VitePress-1.6-00e63d?style=flat-square&labelColor=0a0b0d)](https://vitepress.dev)

</div>

---

## Что внутри

Вики двуязычная: русская версия в `docs/`, английская в `docs/en/`.

| Раздел | О чём |
| :--- | :--- |
| [📰 Новости Amnezia Hosting](https://wiki.amnezia.host/news.html) | Анонсы и объявления карточками; тексты — в `docs/.vitepress/theme/newsItems.js` |
| [🚀 Быстрый старт](https://wiki.amnezia.host/commands.html) | Первое подключение к серверу по SSH и базовые команды |
| [🔁 Переход с Amnezia Premium](https://wiki.amnezia.host/premium-migration.html) | Перенос остатка подписки на свой VPS |
| [🖥️ Управление сервером](https://wiki.amnezia.host/server-management.html) | Личный кабинет, действия с сервером, ресурсы |
| [🛡️ Настройка VPN](https://wiki.amnezia.host/vpn-setup.html) | Запуск VPN через приложение AmneziaVPN |
| [📊 Панель 3X-UI](https://wiki.amnezia.host/3x-ui.html) | VLESS + Reality на 443, выдача ключей, блокировки |
| [⚡ XRay и 🛡️ AmneziaWG](https://wiki.amnezia.host/xray-tuning.html) | Маскировка, домены-доноры, версии AWG и обфускация |
| [🩺 Диагностика](https://wiki.amnezia.host/vpn-troubleshooting.html) | Ошибки 20x / 30x, блокировки провайдера, «нет интернета» |
| [🔒 Безопасность сервера](https://wiki.amnezia.host/security.html) | UFW, порт SSH, ключи, fail2ban |
| [💳 Оплата и тарифы](https://wiki.amnezia.host/payment.html) | Способы оплаты, возвраты, период оплаты |
| [❓ Частые вопросы](https://wiki.amnezia.host/faq.html) | Указатель по всем разборам |

## Как предложить правку

Вики пишется вместе с сообществом — правки и дополнения приветствуются.

*   **Мелкая правка** — кнопка **«Предложить правку этой страницы»** в конце любой статьи открывает файл сразу в редакторе GitHub.
*   **Замечание или идея** — [создайте issue](https://github.com/amnezia-cloud/hosting-wiki/issues/new); на каждой странице есть кнопка, которая подставит её адрес автоматически.
*   **Крупное изменение** — pull request в `main`. После мержа сайт пересобирается сам.

Если правите текст, меняйте **обе локали**: `docs/страница.md` и `docs/en/страница.md`.

## Локальная сборка

```bash
npm ci
npm run docs:dev      # локальный сервер с горячей перезагрузкой
npm run docs:build    # прод-сборка, та же что в CI
npm run docs:preview  # посмотреть собранный сайт
```

Требуется Node.js 20+. Публикация автоматическая: пуш в `main` → GitHub Actions → GitHub Pages.

## Структура

```text
docs/
├─ .vitepress/
│  ├─ config.mjs        # заголовок, локали, навигация, скрытые страницы
│  └─ theme/            # тема: стили, блок обратной связи, индикатор прочитанного
├─ public/              # шрифты, логотип, скриншоты (img/)
├─ en/                  # английская версия страниц
└─ *.md                 # русская версия страниц
```

## Поддержка

| Куда | Адрес |
| :--- | :--- |
| Тикет | [my.amnezia.host](https://my.amnezia.host) |
| Почта | [support@amnezia.host](mailto:support@amnezia.host) |
| Бот в Telegram | [@amnezia_hosting_bot](https://t.me/amnezia_hosting_bot) |
| Чат сообщества | [русский](https://t.me/amnezia_vpn) · [English](https://t.me/amnezia_vpn_en) |

---

<div align="center">

<sub>**English:** knowledge base for Amnezia Hosting customers — server access, VPN setup,
and troubleshooting. Read it at [wiki.amnezia.host/en/](https://wiki.amnezia.host/en/).
Suggestions and corrections are welcome via issues and pull requests.</sub>

</div>
