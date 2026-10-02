import { h } from 'vue'
import { useData } from 'vitepress'

// Строка «Последнее обновление» прямо под заголовком статьи. Вставляется
// плагином amzSections из config.mjs после первого «# …». Дата — из git
// (lastUpdated), поэтому деплой и делается с fetch-depth: 0.
//
// Дату собираем вручную по UTC, а не через toLocaleDateString: так она
// одинакова при сборке и в браузере, и гидрация не ругается на расхождение.

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n) => String(n).padStart(2, '0')

const STRINGS = {
  ru: {
    label: 'Последнее обновление',
    format: (d) => `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`
  },
  en: {
    label: 'Last updated',
    format: (d) => `${MONTHS_EN[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
  }
}

const CLOCK_ICON = 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 2a1 1 0 0 1 1 1v4.6l3 1.8a1 1 0 1 1-1 1.7l-3.5-2A1 1 0 0 1 11 12V7a1 1 0 0 1 1-1z'

export default {
  name: 'AmzPageMeta',
  setup() {
    const { page, lang } = useData()

    return () => {
      if (!page.value.lastUpdated) return null
      const t = lang.value && lang.value.startsWith('en') ? STRINGS.en : STRINGS.ru
      const date = new Date(page.value.lastUpdated)

      return h('p', { class: 'amz-meta' }, [
        h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, 'aria-hidden': 'true' }, [
          h('path', { d: CLOCK_ICON, fill: 'currentColor' })
        ]),
        h('span', null, `${t.label}: `),
        h('time', { datetime: date.toISOString() }, t.format(date))
      ])
    }
  }
}
