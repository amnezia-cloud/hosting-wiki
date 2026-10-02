import { h } from 'vue'
import { useData, withBase } from 'vitepress'

// Хлебные крошки над заголовком: дом → группа сайдбара → текущая страница.
// Путь берётся из того же сайдбара, что и меню слева, поэтому отдельно
// поддерживать его не нужно: переложили страницу в другую группу — крошки
// поменяются сами.

const HOME_ICON =
  'M10.6 3.3a2 2 0 0 1 2.8 0l7.3 7a1 1 0 0 1-1.4 1.4l-.3-.3V19a2 2 0 0 1-2 2h-3v-5a2 2 0 0 0-4 0v5H7a2 2 0 0 1-2-2v-7.6l-.3.3a1 1 0 0 1-1.4-1.4z'

// «/vpn-setup.html#step» → «/vpn-setup»; «/en/» остаётся «/en/».
const normalize = (link) => (link || '').split('#')[0].replace(/\.html$/, '').replace(/\/index$/, '/')

// Эмодзи в начале пункта меню в крошках только шумят.
const stripIcon = (text) => (text || '').replace(/^[^\p{L}\p{N}«“"']+/u, '').trim()

function findTrail(groups, path) {
  for (const group of groups || []) {
    const walk = (items, trail) => {
      for (const item of items || []) {
        if (item.link && !item.link.includes('#') && normalize(item.link) === path) {
          return [...trail, item]
        }
        const found = walk(item.items, item.link ? [...trail, item] : trail)
        if (found) return found
      }
      return null
    }
    const found = walk(group.items, [])
    if (found) return { group, items: found }
  }
  return null
}

export default {
  name: 'AmzBreadcrumbs',
  setup() {
    const { page, theme, frontmatter, localeIndex } = useData()

    return () => {
      if (frontmatter.value.layout === 'home') return null

      const path = '/' + (page.value.relativePath || '').replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
      const trail = findTrail(theme.value.sidebar, path)
      const home = localeIndex.value === 'root' ? '/' : `/${localeIndex.value}/`
      const homeLabel = localeIndex.value === 'en' ? 'Home' : 'Главная'

      const crumbs = [
        h('a', { class: 'amz-crumbs__home', href: withBase(home), 'aria-label': homeLabel }, [
          h('svg', { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': 'true' }, [
            h('path', { d: HOME_ICON, fill: 'currentColor' })
          ])
        ])
      ]

      const parts = []
      if (trail) {
        parts.push({ text: trail.group.text })
        trail.items.forEach((item, i) => {
          const last = i === trail.items.length - 1
          parts.push({ text: stripIcon(item.text), link: last ? null : item.link })
        })
      } else {
        parts.push({ text: stripIcon(frontmatter.value.title || page.value.title) })
      }

      parts.forEach((part, i) => {
        const last = i === parts.length - 1
        crumbs.push(h('span', { class: 'amz-crumbs__sep', 'aria-hidden': 'true' }, '›'))
        if (last) {
          crumbs.push(h('span', { class: 'amz-crumbs__current', 'aria-current': 'page' }, part.text))
        } else if (part.link) {
          crumbs.push(h('a', { class: 'amz-crumbs__link', href: withBase(part.link) }, part.text))
        } else {
          crumbs.push(h('span', { class: 'amz-crumbs__link' }, part.text))
        }
      })

      return h('nav', { class: 'amz-crumbs', 'aria-label': 'Breadcrumbs' }, crumbs)
    }
  }
}
