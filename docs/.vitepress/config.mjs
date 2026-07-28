import { defineConfig } from 'vitepress'

// Общие соц-ссылки
const socialLinks = [
  { icon: 'github', link: 'https://github.com/amnezia-cloud/hosting-wiki' }
]

const SUPPORT_TELEGRAM = 'https://t.me/amnezia_hosting_bot'

// Футер строится под локаль: юридические страницы на amnezia.host живут
// по локализованным адресам (/ru/… и /en/…).
const footerFor = (locale, labels) => ({
  message: [
    '<a href="https://amnezia.org" target="_blank" rel="noreferrer">Amnezia VPN</a>',
    '<a href="https://amnezia.host" target="_blank" rel="noreferrer">Amnezia Hosting</a>',
    `<a href="https://amnezia.host/${locale}/privacy-policy" target="_blank" rel="noreferrer">${labels.privacy}</a>`,
    `<a href="https://amnezia.host/${locale}/refund-policy" target="_blank" rel="noreferrer">${labels.refund}</a>`,
    `<a href="https://amnezia.host/${locale}/terms-of-use" target="_blank" rel="noreferrer">${labels.terms}</a>`,
    `<a href="${SUPPORT_TELEGRAM}" target="_blank" rel="noreferrer">Telegram</a>`,
    '<a href="mailto:support@amnezia.host">support@amnezia.host</a>',
    `<a href="mailto:abuse@amnezia.host" style="color:#ff5a5a">${labels.abuse}</a>`
  ].join('&nbsp;&nbsp;·&nbsp;&nbsp;'),
  copyright:
    'LLC "AIMor", Yerevan, 2 Avetis Aharonyan St. Registration number: 264.110.1229448 · © 2026 Amnezia Hosting'
})

export default defineConfig({
  title: 'Amnezia Hosting Wiki',
  description: 'VPS-серверы для собственного VPN без сложной настройки. Руководства по подключению, настройке VPN и управлению сервером.',
  base: '/', // кастомный домен wiki.amnezia.host — сайт в корне, не в /hosting-wiki/
  cleanUrls: false,

  // Временно скрытые страницы: не собираются, не попадают в поиск и навигацию.
  // Чтобы вернуть — убрать пути отсюда и восстановить пункты в sidebar (см. ниже),
  // карточку Hysteria 2 в index.md и ссылки «Подробнее» в protocols.md.
  srcExclude: [
    'awg.md',
    'vless.md',
    'hysteria2.md',
    'en/awg.md',
    'en/vless.md',
    'en/hysteria2.md'
  ],

  appearance: 'dark', // по умолчанию тёмная тема, доступен переключатель на светлую
  lastUpdated: true,
  metaChunk: true,

  // Дефолтная тема предзагружает Inter, но базовый шрифт вики — IBM Plex Sans.
  // Убираем ненужный preload, чтобы не тянуть лишний файл на каждой странице.
  transformHtml(code) {
    return code.replace(/<link[^>]+inter-roman[^>]*>/g, '')
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    // Основные начертания IBM Plex Sans — чтобы текст не мигал системным шрифтом
    ['link', {
      rel: 'preload',
      href: '/fonts/ibm-plex-sans-v19-cyrillic_latin-regular.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: ''
    }],
    ['link', {
      rel: 'preload',
      href: '/fonts/ibm-plex-sans-v19-cyrillic_latin-700.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: ''
    }],
    ['meta', { name: 'theme-color', content: '#00e63d' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Amnezia Hosting Wiki' }]
  ],

  themeConfig: {
    logo: '/logo.png',
    socialLinks,
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
              modal: {
                noResultsText: 'Ничего не найдено',
                resetButtonTitle: 'Сбросить',
                footer: { selectText: 'выбрать', navigateText: 'навигация', closeText: 'закрыть' }
              }
            }
          }
        }
      }
    }
  },

  locales: {
    root: {
      label: 'Русский',
      lang: 'ru',
      themeConfig: {
        footer: footerFor('ru', {
          privacy: 'Политика конфиденциальности',
          refund: 'Политика возврата',
          terms: 'Пользовательское соглашение',
          abuse: 'Сообщить о нарушении'
        }),
        nav: [
          { text: 'Главная', link: '/' },
          { text: 'Начало работы', link: '/commands' },
          { text: 'VPN и защита', link: '/vpn-setup' },
          { text: 'Помощь', link: '/faq' }
        ],
        sidebar: [
          {
            text: 'Начало работы',
            items: [
              { text: '🚀 Быстрый старт', link: '/commands' },
              {
                text: '🔁 Переход с Amnezia Premium',
                link: '/premium-migration',
                collapsed: true,
                items: [
                  { text: 'Создайте аккаунт', link: '/premium-migration#account' },
                  { text: 'Тикет на перенос', link: '/premium-migration#ticket' },
                  { text: 'Активация сервера', link: '/premium-migration#activation' },
                  { text: 'Отключение Premium', link: '/premium-migration#premium-off' }
                ]
              },
              {
                text: '🖥️ Управление сервером',
                link: '/server-management',
                collapsed: true,
                items: [
                  { text: 'Параметры подключения', link: '/server-management#credentials' },
                  { text: 'Действия в панели', link: '/server-management#panel-actions' },
                  { text: 'Безопасность и проблемы', link: '/server-management#security' },
                  { text: 'Выделенные ресурсы', link: '/server-management#resources' },
                  { text: 'Подключение по SSH', link: '/server-management#ssh' },
                  { text: 'Шпаргалка по командам', link: '/server-management#commands' }
                ]
              },
              {
                text: '🔄 Переустановка ОС',
                link: '/reinstall',
                collapsed: true,
                items: [
                  { text: 'Проверьте дату выдачи', link: '/reinstall#check' },
                  { text: 'Что происходит', link: '/reinstall#what-happens' },
                  { text: 'Перед переустановкой', link: '/reinstall#before' },
                  { text: 'Порядок действий', link: '/reinstall#how' },
                  { text: 'Старые серверы: замена', link: '/reinstall#legacy' }
                ]
              }
            ]
          },
          {
            text: 'VPN и защита',
            items: [
              { text: '🛡️ Настройка VPN', link: '/vpn-setup' },
              { text: '🔌 Протоколы', link: '/protocols' },
              {
                text: '📊 Панель 3X-UI',
                link: '/3x-ui',
                collapsed: true,
                items: [
                  { text: 'Установка панели', link: '/3x-ui#install' },
                  { text: 'Порт и данные для входа', link: '/3x-ui#credentials-panel' },
                  { text: 'Inbound: VLESS + Reality', link: '/3x-ui#inbound' },
                  { text: 'Выдача ключа клиенту', link: '/3x-ui#client-key' },
                  { text: 'Блокировка рекламы и ру-доменов', link: '/3x-ui#routing' },
                  { text: 'Команды x-ui', link: '/3x-ui#cli' }
                ]
              },
              {
                text: '⚡ XRay: маскировка и настройка',
                link: '/xray-tuning',
                collapsed: true,
                items: [
                  { text: 'Домен маскировки', link: '/xray-tuning#domain' },
                  { text: 'Проверка домена', link: '/xray-tuning#verify' },
                  { text: 'Ускорение BBR', link: '/xray-tuning#bbr' },
                  { text: 'Обновление ядра', link: '/xray-tuning#core-update' },
                  { text: 'XRay перестал подключаться', link: '/xray-tuning#troubleshooting' }
                ]
              },
              {
                text: '🛡️ AmneziaWG: версии и настройка',
                link: '/amneziawg-tuning',
                collapsed: true,
                items: [
                  { text: 'Как определить версию', link: '/amneziawg-tuning#version' },
                  { text: 'Генераторы параметров', link: '/amneziawg-tuning#generators' },
                  { text: 'AWG 1.0 и 1.5', link: '/amneziawg-tuning#legacy' },
                  { text: 'AWG 2.0 и мимикрия', link: '/amneziawg-tuning#awg2' },
                  { text: 'Смена подсети', link: '/amneziawg-tuning#subnet' }
                ]
              },
              {
                text: '🔒 Безопасность сервера',
                link: '/security',
                collapsed: true,
                items: [
                  { text: 'Отдельный пользователь', link: '/security#user' },
                  { text: 'Смена порта SSH', link: '/security#ssh-port' },
                  { text: 'Вход по SSH-ключу', link: '/security#ssh-keys' },
                  { text: 'Файрвол UFW', link: '/security#ufw' },
                  { text: 'fail2ban', link: '/security#fail2ban' }
                ]
              }
            ]
          },
          {
            text: 'Подключение и VPN',
            items: [
              {
                text: '🩺 Не подключается VPN',
                link: '/vpn-troubleshooting',
                collapsed: true,
                items: [
                  { text: 'Статус сервера', link: '/vpn-troubleshooting#status' },
                  { text: 'Ошибка 305 и проверка по SSH', link: '/vpn-troubleshooting#error-305' },
                  { text: 'Блокировки и белые списки', link: '/vpn-troubleshooting#isp-blocks' },
                  { text: 'Подключение есть, интернета нет', link: '/vpn-troubleshooting#next' }
                ]
              },
              { text: '⚠️ «Ошибка подключения к серверу»', link: '/connection-error' },
              { text: '🚫 Подключился, но интернета нет', link: '/no-internet' },
              { text: '📡 Не проходит ping', link: '/ping' },
              {
                text: '🔁 AmneziaWG → XRay',
                link: '/awg-to-xray',
                collapsed: true,
                items: [
                  { text: 'Симптомы', link: '/awg-to-xray#symptoms' },
                  { text: 'Решение по шагам', link: '/awg-to-xray#fix' },
                  { text: 'Запасные порты и SNI', link: '/awg-to-xray#fallback' },
                  { text: 'Почему XRay устойчивее', link: '/awg-to-xray#why' }
                ]
              },
              {
                text: '📵 Мобильные ограничения',
                link: '/mobile-restrictions',
                collapsed: true,
                items: [
                  { text: 'Почему это происходит', link: '/mobile-restrictions#why' },
                  { text: 'Почему нельзя обойти', link: '/mobile-restrictions#no-workaround' },
                  { text: 'Что делать', link: '/mobile-restrictions#what-to-do' }
                ]
              },
              {
                text: '🐳 Ошибки 20x (Docker)',
                link: '/error-20x',
                collapsed: true,
                items: [
                  { text: 'Зеркала Docker Hub', link: '/error-20x#mirrors' },
                  { text: 'Восстановление wrapper', link: '/error-20x#recovery' },
                  { text: 'Нестабильный Alpine CDN', link: '/error-20x#alpine' },
                  { text: 'Установился, но нет сети', link: '/error-20x#no-traffic' },
                  { text: 'Порядок действий', link: '/error-20x#order' }
                ]
              },
              {
                text: '🧩 Ошибки 30x (SSH)',
                link: '/error-30x',
                collapsed: true,
                items: [
                  { text: 'Указать порт явно', link: '/error-30x#explicit-port' },
                  { text: 'Ставить из-под другого VPN', link: '/error-30x#other-vpn' },
                  { text: 'Диагностика сервера', link: '/error-30x#diagnostics' },
                  { text: 'Формат SSH-ключа', link: '/error-30x#ssh-keys' }
                ]
              },
              { text: '🤖 Gemini через VPN', link: '/gemini' },
              { text: '▶️ Реклама на YouTube', link: '/youtube-ads' },
              { text: '👥 Несколько устройств', link: '/multiple-devices' },
              { text: '📊 Расход трафика', link: '/traffic-usage' }
            ]
          },
          {
            text: 'Сервер и доступ',
            items: [
              { text: '🔑 Смена пароля root', link: '/root-password' },
              { text: '🛑 Сервер в Bad State', link: '/broken-state' },
              {
                text: '🌍 Геолокация сервера',
                link: '/geolocation',
                collapsed: true,
                items: [
                  { text: 'Как определяется страна по IP', link: '/geolocation#how-it-works' },
                  { text: 'Что можно сделать', link: '/geolocation#what-to-do' },
                  { text: 'Что делаем мы', link: '/geolocation#what-we-do' }
                ]
              }
            ]
          },
          {
            text: 'Оплата и тарифы',
            items: [
              { text: '💳 Как оплатить хостинг', link: '/payment' },
              { text: '↩️ Возврат средств', link: '/refund' },
              { text: '📦 Изменение тарифа', link: '/change-plan' },
              { text: '🗓️ Период оплаты', link: '/billing-period' }
            ]
          },
          {
            text: 'Помощь',
            items: [
              {
                text: '❓ Частые вопросы',
                link: '/faq',
                collapsed: true,
                items: [
                  { text: 'Подключение и VPN', link: '/faq#connection' },
                  { text: 'Протоколы и трафик', link: '/faq#protocols' },
                  { text: 'Сервер и доступ', link: '/faq#server' },
                  { text: 'Оплата и тарифы', link: '/faq#billing' }
                ]
              },
              {
                text: '💬 Обращение в поддержку',
                link: '/support',
                collapsed: true,
                items: [
                  { text: 'Самопроверка перед тикетом', link: '/support#before' },
                  { text: 'Что сообщить', link: '/support#checklist' },
                  { text: 'Готовый шаблон', link: '/support#template' },
                  { text: 'Зона ответственности', link: '/support#scope' }
                ]
              }
            ]
          }
        ],
        outline: { level: [2, 3], label: 'На этой странице' },
        editLink: {
          pattern: 'https://github.com/amnezia-cloud/hosting-wiki/edit/main/docs/:path',
          text: 'Предложить правку этой страницы'
        },
        docFooter: { prev: 'Назад', next: 'Вперёд' },
        lastUpdatedText: 'Обновлено',
        returnToTopLabel: 'Наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Оформление'
      }
    },

    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        footer: footerFor('en', {
          privacy: 'Privacy Policy',
          refund: 'Refund and Compensation Policy',
          terms: 'User Agreement',
          abuse: 'Report abuse'
        }),
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Getting Started', link: '/en/commands' },
          { text: 'VPN & Security', link: '/en/vpn-setup' },
          { text: 'Help', link: '/en/faq' }
        ],
        sidebar: [
          {
            text: 'Getting Started',
            items: [
              { text: '🚀 Quick Start', link: '/en/commands' },
              {
                text: '🔁 Moving from Amnezia Premium',
                link: '/en/premium-migration',
                collapsed: true,
                items: [
                  { text: 'Create an account', link: '/en/premium-migration#account' },
                  { text: 'Transfer ticket', link: '/en/premium-migration#ticket' },
                  { text: 'Server activation', link: '/en/premium-migration#activation' },
                  { text: 'Premium switch-off', link: '/en/premium-migration#premium-off' }
                ]
              },
              {
                text: '🖥️ Server Management',
                link: '/en/server-management',
                collapsed: true,
                items: [
                  { text: 'Connection Details', link: '/en/server-management#credentials' },
                  { text: 'Control Panel Actions', link: '/en/server-management#panel-actions' },
                  { text: 'Security & Issues', link: '/en/server-management#security' },
                  { text: 'Dedicated Resources', link: '/en/server-management#resources' },
                  { text: 'Connecting via SSH', link: '/en/server-management#ssh' },
                  { text: 'Commands Cheat Sheet', link: '/en/server-management#commands' }
                ]
              },
              {
                text: '🔄 Reinstalling the OS',
                link: '/en/reinstall',
                collapsed: true,
                items: [
                  { text: 'Check the issue date', link: '/en/reinstall#check' },
                  { text: 'What a reinstall does', link: '/en/reinstall#what-happens' },
                  { text: 'Before you reinstall', link: '/en/reinstall#before' },
                  { text: 'Step by step', link: '/en/reinstall#how' },
                  { text: 'Older servers: replacement', link: '/en/reinstall#legacy' }
                ]
              }
            ]
          },
          {
            text: 'VPN & Security',
            items: [
              { text: '🛡️ VPN Setup', link: '/en/vpn-setup' },
              { text: '🔌 Protocols', link: '/en/protocols' },
              {
                text: '📊 3X-UI Panel',
                link: '/en/3x-ui',
                collapsed: true,
                items: [
                  { text: 'Installing the panel', link: '/en/3x-ui#install' },
                  { text: 'Port and credentials', link: '/en/3x-ui#credentials-panel' },
                  { text: 'Inbound: VLESS + Reality', link: '/en/3x-ui#inbound' },
                  { text: 'Issuing a client key', link: '/en/3x-ui#client-key' },
                  { text: 'Blocking ads and RU domains', link: '/en/3x-ui#routing' },
                  { text: 'x-ui commands', link: '/en/3x-ui#cli' }
                ]
              },
              {
                text: '⚡ XRay: masking and tuning',
                link: '/en/xray-tuning',
                collapsed: true,
                items: [
                  { text: 'Masking domain', link: '/en/xray-tuning#domain' },
                  { text: 'Verifying the domain', link: '/en/xray-tuning#verify' },
                  { text: 'BBR acceleration', link: '/en/xray-tuning#bbr' },
                  { text: 'Updating the core', link: '/en/xray-tuning#core-update' },
                  { text: 'XRay stopped connecting', link: '/en/xray-tuning#troubleshooting' }
                ]
              },
              {
                text: '🛡️ AmneziaWG: versions and tuning',
                link: '/en/amneziawg-tuning',
                collapsed: true,
                items: [
                  { text: 'Telling the version', link: '/en/amneziawg-tuning#version' },
                  { text: 'Parameter generators', link: '/en/amneziawg-tuning#generators' },
                  { text: 'AWG 1.0 and 1.5', link: '/en/amneziawg-tuning#legacy' },
                  { text: 'AWG 2.0 and mimicry', link: '/en/amneziawg-tuning#awg2' },
                  { text: 'Changing the subnet', link: '/en/amneziawg-tuning#subnet' }
                ]
              },
              {
                text: '🔒 Server Security',
                link: '/en/security',
                collapsed: true,
                items: [
                  { text: 'A separate user', link: '/en/security#user' },
                  { text: 'Changing the SSH port', link: '/en/security#ssh-port' },
                  { text: 'Key-based login', link: '/en/security#ssh-keys' },
                  { text: 'UFW firewall', link: '/en/security#ufw' },
                  { text: 'fail2ban', link: '/en/security#fail2ban' }
                ]
              }
            ]
          },
          {
            text: 'Connection and VPN',
            items: [
              {
                text: '🩺 VPN not connecting',
                link: '/en/vpn-troubleshooting',
                collapsed: true,
                items: [
                  { text: 'Server status', link: '/en/vpn-troubleshooting#status' },
                  { text: 'Error 305 and SSH check', link: '/en/vpn-troubleshooting#error-305' },
                  { text: 'ISP blocking and whitelists', link: '/en/vpn-troubleshooting#isp-blocks' },
                  { text: 'Connected, but no internet', link: '/en/vpn-troubleshooting#next' }
                ]
              },
              { text: '⚠️ “Server connection error”', link: '/en/connection-error' },
              { text: '🚫 Connected, but no internet', link: '/en/no-internet' },
              { text: '📡 Ping does not work', link: '/en/ping' },
              {
                text: '🔁 AmneziaWG → XRay',
                link: '/en/awg-to-xray',
                collapsed: true,
                items: [
                  { text: 'Symptoms', link: '/en/awg-to-xray#symptoms' },
                  { text: 'Step-by-step fix', link: '/en/awg-to-xray#fix' },
                  { text: 'Fallback ports and SNI', link: '/en/awg-to-xray#fallback' },
                  { text: 'Why XRay is more resilient', link: '/en/awg-to-xray#why' }
                ]
              },
              {
                text: '📵 Mobile restrictions',
                link: '/en/mobile-restrictions',
                collapsed: true,
                items: [
                  { text: 'Why it happens', link: '/en/mobile-restrictions#why' },
                  { text: 'Why it cannot be bypassed', link: '/en/mobile-restrictions#no-workaround' },
                  { text: 'What to do', link: '/en/mobile-restrictions#what-to-do' }
                ]
              },
              {
                text: '🐳 20x errors (Docker)',
                link: '/en/error-20x',
                collapsed: true,
                items: [
                  { text: 'Docker Hub mirrors', link: '/en/error-20x#mirrors' },
                  { text: 'Wrapper recovery', link: '/en/error-20x#recovery' },
                  { text: 'Unstable Alpine CDN', link: '/en/error-20x#alpine' },
                  { text: 'Installed, but no traffic', link: '/en/error-20x#no-traffic' },
                  { text: 'Order of operations', link: '/en/error-20x#order' }
                ]
              },
              {
                text: '🧩 30x errors (SSH)',
                link: '/en/error-30x',
                collapsed: true,
                items: [
                  { text: 'State the port explicitly', link: '/en/error-30x#explicit-port' },
                  { text: 'Install behind another VPN', link: '/en/error-30x#other-vpn' },
                  { text: 'Server diagnostics', link: '/en/error-30x#diagnostics' },
                  { text: 'SSH key format', link: '/en/error-30x#ssh-keys' }
                ]
              },
              { text: '🤖 Gemini via VPN', link: '/en/gemini' },
              { text: '▶️ YouTube ads', link: '/en/youtube-ads' },
              { text: '👥 Multiple devices', link: '/en/multiple-devices' },
              { text: '📊 Traffic usage', link: '/en/traffic-usage' }
            ]
          },
          {
            text: 'Server and access',
            items: [
              { text: '🔑 Changing the root password', link: '/en/root-password' },
              { text: '🛑 Server in Bad State', link: '/en/broken-state' },
              {
                text: '🌍 Server geolocation',
                link: '/en/geolocation',
                collapsed: true,
                items: [
                  { text: 'How country detection works', link: '/en/geolocation#how-it-works' },
                  { text: 'What you can do', link: '/en/geolocation#what-to-do' },
                  { text: 'What we are doing', link: '/en/geolocation#what-we-do' }
                ]
              }
            ]
          },
          {
            text: 'Billing and plans',
            items: [
              { text: '💳 How to pay', link: '/en/payment' },
              { text: '↩️ Refunds', link: '/en/refund' },
              { text: '📦 Changing the plan', link: '/en/change-plan' },
              { text: '🗓️ Billing period', link: '/en/billing-period' }
            ]
          },
          {
            text: 'Help',
            items: [
              {
                text: '❓ Frequently asked questions',
                link: '/en/faq',
                collapsed: true,
                items: [
                  { text: 'Connection and VPN', link: '/en/faq#connection' },
                  { text: 'Protocols and traffic', link: '/en/faq#protocols' },
                  { text: 'Server and access', link: '/en/faq#server' },
                  { text: 'Billing and plans', link: '/en/faq#billing' }
                ]
              },
              {
                text: '💬 Contacting support',
                link: '/en/support',
                collapsed: true,
                items: [
                  { text: 'Self-check before a ticket', link: '/en/support#before' },
                  { text: 'What to include', link: '/en/support#checklist' },
                  { text: 'Ready-to-fill template', link: '/en/support#template' },
                  { text: 'Split of responsibilities', link: '/en/support#scope' }
                ]
              }
            ]
          }
        ],
        outline: { level: [2, 3], label: 'On this page' },
        editLink: {
          pattern: 'https://github.com/amnezia-cloud/hosting-wiki/edit/main/docs/:path',
          text: 'Suggest an edit to this page'
        },
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdatedText: 'Updated'
      }
    }
  }
})
