import { h, ref } from 'vue'
import { useData } from 'vitepress'

// Строка под заголовком статьи: «Последнее обновление» слева и «Поделиться»
// справа. Вставляется плагином amzSections из config.mjs после первого «# …».
// Дата — из git (lastUpdated), поэтому деплой и делается с fetch-depth: 0.
//
// Дату собираем вручную по UTC, а не через toLocaleDateString: так она
// одинакова при сборке и в браузере, и гидрация не ругается на расхождение.

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n) => String(n).padStart(2, '0')

const STRINGS = {
  ru: {
    label: 'Последнее обновление',
    share: 'Поделиться',
    copied: 'Ссылка скопирована',
    format: (d) => `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`
  },
  en: {
    label: 'Last updated',
    share: 'Share',
    copied: 'Link copied',
    format: (d) => `${MONTHS_EN[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
  }
}

const CLOCK_ICON = 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 2a1 1 0 0 1 1 1v4.6l3 1.8a1 1 0 1 1-1 1.7l-3.5-2A1 1 0 0 1 11 12V7a1 1 0 0 1 1-1z'

const SHARE_ICON = () =>
  h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, 'aria-hidden': 'true' }, [
    h('circle', { cx: 18, cy: 5, r: 2.5, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 }),
    h('circle', { cx: 6, cy: 12, r: 2.5, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 }),
    h('circle', { cx: 18, cy: 19, r: 2.5, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 }),
    h('path', { d: 'm8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4', stroke: 'currentColor', 'stroke-width': 1.8 })
  ])

// Адрес страницы без якоря, с читаемой кириллицей вместо %D0%…
export const pageUrl = () => decodeURI(location.origin + location.pathname)

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export default {
  name: 'AmzPageMeta',
  setup() {
    const { page, lang, title } = useData()
    const copied = ref(false)

    const share = async () => {
      const url = pageUrl()
      // На телефонах — системное меню «Поделиться», на десктопе — копирование.
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        try {
          await navigator.share({ title: title.value, url })
        } catch {
          // Пользователь закрыл меню — ничего не делаем.
        }
        return
      }
      if (await copyText(url)) {
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
      }
    }

    return () => {
      const t = lang.value && lang.value.startsWith('en') ? STRINGS.en : STRINGS.ru
      const date = page.value.lastUpdated ? new Date(page.value.lastUpdated) : null

      return h('div', { class: 'amz-meta' }, [
        date
          ? h('p', { class: 'amz-meta__date' }, [
              h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, 'aria-hidden': 'true' }, [
                h('path', { d: CLOCK_ICON, fill: 'currentColor' })
              ]),
              h('span', null, `${t.label}: `),
              h('time', { datetime: date.toISOString() }, t.format(date))
            ])
          : null,
        h('button', { type: 'button', class: 'amz-meta__share', onClick: share }, [
          SHARE_ICON(),
          h('span', null, copied.value ? t.copied : t.share)
        ])
      ])
    }
  }
}
