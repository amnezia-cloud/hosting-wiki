import { h } from 'vue'
import { useData } from 'vitepress'

// Красный баннер поверх контента на каждой странице и над hero на главной.
// Нужен, когда одна статья закрывает вал однотипных обращений в поддержку:
// человек видит её сразу, не открывая сайдбар и не пользуясь поиском.
//
// Чтобы сменить тему баннера — поправьте TARGET и STRINGS.
// Чтобы убрать баннер совсем — уберите слоты 'doc-before' и 'home-hero-before'
// в index.js (сам файл можно оставить до следующего раза).

// Страница, на которую ведёт баннер: путь без локали и расширения.
const TARGET = 'awg-3-1-upgrade'

const STRINGS = {
  ru: {
    tag: 'Важно',
    title: 'AmneziaWG 3.1: как обновиться и как вернуться на 2.0',
    lead: 'Переустановка протокола, параметры по умолчанию, откат на 2.0 — и почему после этого перестают работать выданные конфигурации.',
    cta: 'Читать инструкцию',
    href: '/awg-3-1-upgrade.html'
  },
  en: {
    tag: 'Important',
    title: 'AmneziaWG 3.1: how to upgrade and how to roll back to 2.0',
    lead: 'Reinstalling the protocol, default parameters, rolling back to 2.0 — and why issued configurations stop working afterwards.',
    cta: 'Read the guide',
    href: '/en/awg-3-1-upgrade.html'
  }
}

export default {
  name: 'AmzBanner',
  setup() {
    const { lang, page } = useData()

    return () => {
      // На самой статье баннер не показываем — он вёл бы на текущую страницу.
      const path = (page.value.relativePath || '').replace(/\.md$/, '').replace(/^en\//, '')
      if (path === TARGET) return null

      const t = lang.value && lang.value.startsWith('en') ? STRINGS.en : STRINGS.ru

      return h('a', { class: 'amz-banner', href: t.href }, [
        h('span', { class: 'amz-banner__tag' }, t.tag),
        h('span', { class: 'amz-banner__body' }, [
          h('span', { class: 'amz-banner__title' }, t.title),
          h('span', { class: 'amz-banner__lead' }, t.lead)
        ]),
        h('span', { class: 'amz-banner__cta' }, `${t.cta} →`)
      ])
    }
  }
}
