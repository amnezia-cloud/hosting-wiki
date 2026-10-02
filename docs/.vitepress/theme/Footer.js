import { h } from 'vue'
import { useData, withBase } from 'vitepress'

// Футер на всю ширину: логотип слева, колонки ссылок, юр. строка внизу.
// Данные — themeConfig.amzFooter в config.mjs (своя копия на каждую локаль).
// Штатный VPFooter не подходит: на страницах с сайдбаром VitePress его прячет.

export default {
  name: 'AmzFooter',
  setup() {
    const { theme, localeIndex } = useData()

    return () => {
      const data = theme.value.amzFooter
      if (!data) return null
      const home = localeIndex.value === 'root' ? '/' : `/${localeIndex.value}/`

      const link = (item) => {
        const external = /^(https?:|mailto:)/.test(item.link)
        return h('li', null, [
          h('a', {
            class: item.danger ? 'amz-footer__link amz-footer__link--danger' : 'amz-footer__link',
            href: item.link,
            ...(external && !item.link.startsWith('mailto:') ? { target: '_blank', rel: 'noreferrer' } : {})
          }, item.text)
        ])
      }

      return h('footer', { class: 'amz-footer' }, [
        h('div', { class: 'amz-footer__inner' }, [
          h('a', { class: 'amz-footer__brand', href: withBase(home) }, [
            h('img', { src: withBase('/logo.png'), alt: '', width: 56, height: 56 }),
            h('span', { class: 'amz-footer__brand-name' }, [
              'Amnezia',
              h('span', null, 'Hosting')
            ])
          ]),
          h('div', { class: 'amz-footer__cols' },
            data.columns.map((col) =>
              h('div', { class: 'amz-footer__col' }, [
                h('p', { class: 'amz-footer__title' }, col.title),
                h('ul', null, col.links.map(link))
              ])
            )
          )
        ]),
        h('p', { class: 'amz-footer__copyright' }, data.copyright)
      ])
    }
  }
}
