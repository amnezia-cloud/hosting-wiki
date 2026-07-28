import { defineConfig } from 'vitepress'

// Общие соц-ссылки
const socialLinks = [
  { icon: 'github', link: 'https://github.com/amnezia-cloud/hosting-wiki' }
]

export default defineConfig({
  title: 'Amnezia Hosting Docs',
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

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#00e63d' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Amnezia Hosting Docs' }]
  ],

  themeConfig: {
    logo: '/logo.png',
    socialLinks,
    footer: {
      message: [
        '<a href="https://amnezia.org" target="_blank" rel="noreferrer">Amnezia VPN</a>',
        '<a href="https://amnezia.host" target="_blank" rel="noreferrer">Amnezia Hosting</a>',
        '<a href="https://amnezia.host/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>',
        '<a href="https://amnezia.host/refund" target="_blank" rel="noreferrer">Refund and Compensation Policy</a>',
        '<a href="https://amnezia.host/terms" target="_blank" rel="noreferrer">User Agreement</a>',
        '<a href="https://t.me" target="_blank" rel="noreferrer">Telegram</a>',
        '<a href="mailto:support@amnezia.host">support@amnezia.host</a>',
        '<a href="mailto:abuse@amnezia.host" style="color:#ff5a5a">Report abuse</a>'
      ].join('&nbsp;&nbsp;·&nbsp;&nbsp;'),
      copyright:
        'LLC "AIMor", Yerevan, 2 Avetis Aharonyan St. Registration number: 264.110.1229448 · © 2026 Amnezia Hosting'
    },
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
              }
            ]
          },
          {
            text: 'VPN и защита',
            items: [
              { text: '🛡️ Настройка VPN', link: '/vpn-setup' },
              { text: '🔌 Протоколы', link: '/protocols' },
              { text: '📊 Панель 3X-UI', link: '/3x-ui' },
              { text: '🔒 Безопасность сервера', link: '/security' }
            ]
          },
          {
            text: 'Помощь',
            items: [
              { text: '❓ Решение проблем (FAQ)', link: '/faq' },
              { text: '🤖 Gemini через VPN', link: '/gemini' }
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
              }
            ]
          },
          {
            text: 'VPN & Security',
            items: [
              { text: '🛡️ VPN Setup', link: '/en/vpn-setup' },
              { text: '🔌 Protocols', link: '/en/protocols' },
              { text: '📊 3X-UI Panel', link: '/en/3x-ui' },
              { text: '🔒 Server Security', link: '/en/security' }
            ]
          },
          {
            text: 'Help',
            items: [
              { text: '❓ Troubleshooting (FAQ)', link: '/en/faq' },
              { text: '🤖 Gemini via VPN', link: '/en/gemini' }
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
