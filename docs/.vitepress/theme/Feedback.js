import { h } from 'vue'
import { useData } from 'vitepress'

// Блок «предложить правку» в конце каждой страницы документации.
// Без внешних сервисов: GitHub-issue с предзаполненным телом + чат поддержки.
const REPO = 'amnezia-cloud/hosting-wiki'
const SITE = 'https://wiki.amnezia.host'
const SUPPORT = 'https://t.me/amnezia_hosting_bot'

const STRINGS = {
  ru: {
    title: 'Нашли ошибку или есть что добавить?',
    lead: 'Предложения по этой странице приветствуются — поправим и допишем.',
    suggest: '✍️ Предложить правку',
    support: '💬 Написать в поддержку',
    hint: 'Для правки через GitHub нужен аккаунт GitHub. Если его нет — просто напишите в Telegram.',
    issueTitle: (page) => `Правка страницы: ${page}`,
    issueBody: (url) =>
      `Страница: ${url}\n\nЧто предлагаю изменить или добавить:\n\n`
  },
  en: {
    title: 'Found a mistake or something to add?',
    lead: 'Suggestions for this page are welcome — we will fix and extend it.',
    suggest: '✍️ Suggest an edit',
    support: '💬 Contact support',
    hint: 'Editing via GitHub requires a GitHub account. If you do not have one, just message us on Telegram.',
    issueTitle: (page) => `Page feedback: ${page}`,
    issueBody: (url) =>
      `Page: ${url}\n\nWhat I suggest changing or adding:\n\n`
  }
}

export default {
  name: 'AmzFeedback',
  setup() {
    const { lang, page, frontmatter } = useData()

    return () => {
      if (frontmatter.value.layout === 'home') return null

      const t = lang.value && lang.value.startsWith('en') ? STRINGS.en : STRINGS.ru
      const relativePath = page.value.relativePath || ''
      const url = `${SITE}/${relativePath.replace(/\.md$/, '.html')}`
      const issueUrl =
        `https://github.com/${REPO}/issues/new` +
        `?title=${encodeURIComponent(t.issueTitle(relativePath))}` +
        `&body=${encodeURIComponent(t.issueBody(url))}`

      const link = (href, text, brand) =>
        h(
          'a',
          {
            class: brand ? 'amz-feedback__btn amz-feedback__btn--brand' : 'amz-feedback__btn',
            href,
            target: '_blank',
            rel: 'noreferrer'
          },
          text
        )

      return h('aside', { class: 'amz-feedback' }, [
        h('p', { class: 'amz-feedback__title' }, t.title),
        h('p', { class: 'amz-feedback__lead' }, t.lead),
        h('div', { class: 'amz-feedback__actions' }, [
          link(issueUrl, t.suggest, true),
          link(SUPPORT, t.support, false)
        ]),
        h('p', { class: 'amz-feedback__hint' }, t.hint)
      ])
    }
  }
}
