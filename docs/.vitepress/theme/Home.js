import { h, reactive } from 'vue'
import { useData, withBase } from 'vitepress'

// Главная в духе docs.amnezia.org: заголовок, строка полезных ссылок, большой
// поиск, плитки разделов и плашка поддержки. Плитки строятся из сайдбара —
// новая статья в меню сама появится и на главной.
//
// Плитка показывает до пяти ссылок. Если их больше — четыре и кнопку «Ещё N»,
// которая раскрывает остальные.

const SUPPORT = 'https://t.me/amnezia_hosting_bot'
const MAX_LINES = 5

const icon = (d) =>
  h('svg', { class: 'amz-home__link-icon', viewBox: '0 0 24 24', width: 15, height: 15, 'aria-hidden': 'true' }, [
    h('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
  ])

const ICONS = {
  site: 'M3 10.5 12 4l9 6.5M5 9v10h14V9M10 19v-5h4v5',
  mirror: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  channel: 'M21 4 3 11l6 2.5M21 4l-3.5 16-8.5-6.5M21 4 9 13.5V19l3-3',
  account: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0'
}

const STRINGS = {
  ru: {
    title: 'База знаний',
    lead: 'Как подключиться к серверу Amnezia Hosting, настроить свой VPN и разобраться, если что-то не работает.',
    links: [
      { icon: 'site', text: 'Сайт Amnezia Hosting', link: 'https://amnezia.host' },
      { icon: 'mirror', text: 'Зеркало сайта', link: 'https://storage.googleapis.com/amnezia/my.host' },
      { icon: 'channel', text: 'Telegram-канал', link: 'https://t.me/amneziahosting' },
      { icon: 'account', text: 'Личный кабинет', link: 'https://my.amnezia.host' }
    ],
    search: 'Поиск по базе знаний…',
    more: (n) => `Ещё ${n}`,
    less: 'Свернуть',
    helpTitle: 'Обращайтесь в чат за помощью',
    helpLead: 'Если что-то не получается. Бот поддержки отвечает, даже когда сайт недоступен.',
    helpButton: 'Написать в поддержку',
    credit: [
      'Вики собрана вместе с сообществом: пользователи присылали настройки, скриншоты и правки. Отдельное спасибо ',
      'Shidla',
      ' за ',
      'инструкции по Amnezia',
      ', из которых собраны наши страницы про AmneziaWG.'
    ]
  },
  en: {
    title: 'Knowledge base',
    lead: 'How to connect to your Amnezia Hosting server, set up your own VPN and sort things out when something breaks.',
    links: [
      { icon: 'site', text: 'Amnezia Hosting website', link: 'https://amnezia.host' },
      { icon: 'mirror', text: 'Website mirror', link: 'https://storage.googleapis.com/amnezia/my.host' },
      { icon: 'channel', text: 'Telegram channel', link: 'https://t.me/amneziahosting' },
      { icon: 'account', text: 'Client area', link: 'https://my.amnezia.host' }
    ],
    search: 'Search the knowledge base…',
    more: (n) => `${n} more`,
    less: 'Show less',
    helpTitle: 'Ask for help in the chat',
    helpLead: 'If something does not work. The support bot answers even when the website is down.',
    helpButton: 'Contact support',
    credit: [
      'This wiki is built together with the community: users sent in configurations, screenshots and corrections. Special thanks to ',
      'Shidla',
      ' for the ',
      'Amnezia instructions',
      ' our AmneziaWG pages are built from.'
    ]
  }
}

const SEARCH_ICON = h('svg', { viewBox: '0 0 24 24', width: 20, height: 20, 'aria-hidden': 'true' }, [
  h('circle', { cx: 11, cy: 11, r: 7, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }),
  h('path', { d: 'm20 20-3.5-3.5', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' })
])

const TELEGRAM_ICON = h('svg', { viewBox: '0 0 24 24', width: 34, height: 34, 'aria-hidden': 'true' }, [
  h('circle', { cx: 12, cy: 12, r: 12, fill: '#2aabee' }),
  h('path', { d: 'M5.4 11.8l11.3-4.4c.5-.2 1 .1.8.9l-1.9 9c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-3 5.4-4.9c.2-.2 0-.3-.3-.1l-6.7 4.2-2.9-.9c-.6-.2-.6-.6.1-.9z', fill: '#fff' })
])

// Поиск открываем штатной кнопкой из шапки: так работает тот же локальный
// поиск VitePress со всеми его переводами, без второй копии.
const openSearch = () => {
  const button = document.querySelector('.VPNavBarSearch .DocSearch-Button')
  if (button) button.click()
}

const external = { target: '_blank', rel: 'noreferrer' }

export default {
  name: 'AmzHome',
  setup() {
    const { theme, lang } = useData()
    const expanded = reactive({})

    return () => {
      const t = lang.value && lang.value.startsWith('en') ? STRINGS.en : STRINGS.ru
      const groups = theme.value.sidebar || []

      const tile = (group, index) => {
        const items = (group.items || []).filter((item) => item.link)
        const open = expanded[index]
        const overflow = items.length > MAX_LINES
        const shown = overflow && !open ? items.slice(0, MAX_LINES - 1) : items

        return h('section', { class: 'amz-home__tile' }, [
          h('h2', { class: 'amz-home__tile-title' }, group.text),
          h('ul', { class: 'amz-home__tile-list' }, [
            ...shown.map((item) =>
              h('li', null, [h('a', { href: withBase(item.link) }, item.text)])
            ),
            overflow
              ? h('li', null, [
                  h('button', {
                    type: 'button',
                    class: 'amz-home__more',
                    'aria-expanded': open ? 'true' : 'false',
                    onClick: () => { expanded[index] = !open }
                  }, open ? t.less : t.more(items.length - (MAX_LINES - 1)))
                ])
              : null
          ])
        ])
      }

      return h('div', { class: 'amz-home' }, [
        h('header', { class: 'amz-home__hero' }, [
          h('h1', { class: 'amz-home__title' }, t.title),
          h('p', { class: 'amz-home__lead' }, t.lead),
          h('nav', { class: 'amz-home__links' },
            t.links.map((l) =>
              h('a', { class: 'amz-home__link', href: l.link, ...external }, [icon(ICONS[l.icon]), l.text])
            )
          ),
          h('button', { type: 'button', class: 'amz-home__search', onClick: openSearch }, [
            SEARCH_ICON,
            h('span', { class: 'amz-home__search-text' }, t.search),
            h('kbd', { class: 'amz-home__search-key' }, 'Ctrl K')
          ])
        ]),
        h('div', { class: 'amz-home__tiles' }, groups.map(tile)),
        h('aside', { class: 'amz-home__help' }, [
          TELEGRAM_ICON,
          h('div', { class: 'amz-home__help-body' }, [
            h('p', { class: 'amz-home__help-title' }, t.helpTitle),
            h('p', { class: 'amz-home__help-lead' }, t.helpLead)
          ]),
          h('a', { class: 'amz-home__help-button', href: SUPPORT, ...external }, t.helpButton)
        ]),
        h('p', { class: 'amz-home__credit' }, [
          t.credit[0],
          h('strong', null, t.credit[1]),
          t.credit[2],
          h('a', { href: 'https://gitlab.com/ShidlaSGC/amn-instructions/', ...external }, t.credit[3]),
          t.credit[4]
        ])
      ])
    }
  }
}
