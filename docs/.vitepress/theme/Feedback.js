import { h } from 'vue'
import { useData } from 'vitepress'
import Icon from './Icon.js'

// Блок обратной связи в конце каждой страницы документации.
//
// Раньше рядом жила штатная ссылка editLink с подписью «Предложить правку
// этой страницы», а в блоке была кнопка «Предложить правку», которая заводила
// issue. Два разных действия назывались почти одинаково и стояли друг под
// другом. Теперь editLink выключен, а оба пути собраны здесь и названы по
// тому, что они делают: править текст, сообщить о проблеме, спросить людей.
//
// Без внешних сервисов: только GitHub и чат поддержки.
const REPO = 'amnezia-cloud/hosting-wiki'
const SITE = 'https://wiki.amnezia.host'
const SUPPORT = 'https://t.me/amnezia_hosting_bot'

const STRINGS = {
  ru: {
    title: 'Нашли ошибку или есть что добавить?',
    lead: 'Страница открыта для правок. Выберите, что вам удобнее.',
    edit: 'Исправить текст',
    editNote: 'правка файла на GitHub',
    issue: 'Сообщить о проблеме',
    issueNote: 'issue с описанием',
    support: 'Спросить поддержку',
    supportNote: 'чат в Telegram',
    hint: 'Для первых двух нужен аккаунт GitHub. Если его нет — просто напишите в Telegram.',
    issueTitle: (page) => `Правка страницы: ${page}`,
    issueBody: (url) =>
      `Страница: ${url}\n\nЧто предлагаю изменить или добавить:\n\n`
  },
  en: {
    title: 'Found a mistake or something to add?',
    lead: 'This page is open to edits. Pick whichever suits you.',
    edit: 'Fix the text',
    editNote: 'edit the file on GitHub',
    issue: 'Report a problem',
    issueNote: 'open an issue',
    support: 'Ask support',
    supportNote: 'Telegram chat',
    hint: 'The first two need a GitHub account. Without one, just message us on Telegram.',
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

      const editUrl = `https://github.com/${REPO}/edit/main/docs/${relativePath}`
      const issueUrl =
        `https://github.com/${REPO}/issues/new` +
        `?title=${encodeURIComponent(t.issueTitle(relativePath))}` +
        `&body=${encodeURIComponent(t.issueBody(url))}`

      const action = (href, icon, label, note, brand) =>
        h(
          'a',
          {
            class: ['amz-feedback__action', brand ? 'amz-feedback__action--brand' : ''],
            href,
            target: '_blank',
            rel: 'noreferrer'
          },
          [
            h('span', { class: 'amz-feedback__action-icon' }, [
              h(Icon, { name: icon, size: 18 })
            ]),
            h('span', { class: 'amz-feedback__action-body' }, [
              h('span', { class: 'amz-feedback__action-label' }, label),
              h('span', { class: 'amz-feedback__action-note' }, note)
            ])
          ]
        )

      return h('aside', { class: 'amz-feedback' }, [
        h('div', { class: 'amz-feedback__head' }, [
          h('span', { class: 'amz-feedback__mark' }, [
            h(Icon, { name: 'chat', size: 18 })
          ]),
          h('div', { class: 'amz-feedback__intro' }, [
            h('p', { class: 'amz-feedback__title' }, t.title),
            h('p', { class: 'amz-feedback__lead' }, t.lead)
          ])
        ]),
        h('div', { class: 'amz-feedback__actions' }, [
          action(editUrl, 'file', t.edit, t.editNote, true),
          action(issueUrl, 'warning', t.issue, t.issueNote, false),
          action(SUPPORT, 'chat', t.support, t.supportNote, false)
        ]),
        h('p', { class: 'amz-feedback__hint' }, t.hint)
      ])
    }
  }
}
