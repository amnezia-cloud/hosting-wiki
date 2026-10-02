import { h } from 'vue'
import { useData, withBase } from 'vitepress'

// Две кнопки под «Назад / Вперёд»: указатель FAQ и чат поддержки.
// Последнее, что человек видит под статьёй, — куда идти, если она не помогла.

const SUPPORT = 'https://t.me/amnezia_hosting_bot'

const STRINGS = {
  ru: { faq: 'Частые вопросы', faqLink: '/faq', chat: 'Чат поддержки' },
  en: { faq: 'Frequently asked questions', faqLink: '/en/faq', chat: 'Support chat' }
}

const QUESTION_ICON = h('svg', { class: 'amz-help__icon amz-help__icon--faq', viewBox: '0 0 24 24', width: 22, height: 22, 'aria-hidden': 'true' }, [
  h('circle', { cx: 12, cy: 12, r: 9.25, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6 }),
  h('path', { d: 'M9.6 9.4a2.5 2.5 0 0 1 4.85.85c0 1.65-2.45 2.2-2.45 3.6', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
  h('circle', { cx: 12, cy: 16.6, r: 1, fill: 'currentColor' })
])

const TELEGRAM_ICON = h('svg', { class: 'amz-help__icon amz-help__icon--tg', viewBox: '0 0 24 24', width: 22, height: 22, 'aria-hidden': 'true' }, [
  h('circle', { cx: 12, cy: 12, r: 12, fill: '#2aabee' }),
  h('path', { d: 'M5.4 11.8l11.3-4.4c.5-.2 1 .1.8.9l-1.9 9c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-3 5.4-4.9c.2-.2 0-.3-.3-.1l-6.7 4.2-2.9-.9c-.6-.2-.6-.6.1-.9z', fill: '#fff' })
])

export default {
  name: 'AmzHelpLinks',
  setup() {
    const { lang, frontmatter } = useData()

    return () => {
      if (frontmatter.value.layout === 'home') return null
      const t = lang.value && lang.value.startsWith('en') ? STRINGS.en : STRINGS.ru

      const card = (href, icon, text, external) =>
        h('a', {
          class: 'amz-help__card',
          href,
          ...(external ? { target: '_blank', rel: 'noreferrer' } : {})
        }, [
          icon,
          h('span', { class: 'amz-help__text' }, text),
          h('span', { class: 'amz-help__arrow', 'aria-hidden': 'true' }, '›')
        ])

      return h('div', { class: 'amz-help' }, [
        card(withBase(`${t.faqLink}.html`), QUESTION_ICON, t.faq, false),
        card(SUPPORT, TELEGRAM_ICON, t.chat, true)
      ])
    }
  }
}
