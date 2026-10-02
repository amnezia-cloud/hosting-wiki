import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Feedback from './Feedback.js'
import NewsCarousel from './NewsCarousel.js'
import Banner from './Banner.js'
import Breadcrumbs from './Breadcrumbs.js'
import PageMeta, { pageUrl, copyText } from './PageMeta.js'
import HelpLinks from './HelpLinks.js'
import Footer from './Footer.js'
import Home from './Home.js'
import './custom.css'

// Клик по заголовку раздела копирует ссылку на него. Кириллица в якоре
// остаётся читаемой (decodeURI в pageUrl), а сам якорь попадает в адресную
// строку — как если бы перешли по «#».
function setupHeadingLinks() {
  let toast
  let timer

  const showToast = (text) => {
    if (!toast) {
      toast = document.createElement('div')
      toast.className = 'amz-toast'
      toast.setAttribute('role', 'status')
      document.body.appendChild(toast)
    }
    toast.textContent = text
    toast.classList.add('is-visible')
    clearTimeout(timer)
    timer = setTimeout(() => toast.classList.remove('is-visible'), 1800)
  }

  document.addEventListener('click', async (event) => {
    const heading = event.target.closest('.vp-doc :is(h2, h3, h4)[id]')
    if (!heading) return
    // Ссылки внутри заголовка (в т.ч. штатный «#») работают как обычно.
    if (event.target.closest('a')) return
    // Выделение текста мышью — не клик по заголовку.
    if (String(window.getSelection())) return

    const id = decodeURIComponent(heading.id)
    history.replaceState(history.state, '', `#${encodeURIComponent(id)}`)
    const en = document.documentElement.lang.startsWith('en')
    if (await copyText(`${pageUrl()}#${id}`)) {
      showToast(en ? 'Link to the section copied' : 'Ссылка на раздел скопирована')
    }
  })
}

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // Красный баннер: над главной и над текстом на всех остальных
      // страницах. Намеренно в потоке контента, а не фиксирован сверху —
      // фиксированный баннер пришлось бы согласовывать по высоте с шапкой,
      // и на узких экранах, где текст переносится, они бы перекрывались.
      'home-hero-before': () => h(Banner),
      // Над текстом страницы: сначала хлебные крошки, под ними баннер.
      'doc-before': () => [h(Breadcrumbs), h(Banner)],
      // Блок «предложить правку» — перед «Назад / Вперёд», чтобы пагинация
      // и кнопки помощи под ней стояли вместе, как на docs.amnezia.org.
      'doc-footer-before': () => h(Feedback),
      'doc-after': () => h(HelpLinks),
      // Футер на всю ширину страницы, поверх нижнего края сайдбара.
      'layout-bottom': () => h(Footer)
    }),
  enhanceApp({ app }) {
    // Лента новостей: <NewsCarousel /> доступен в любой markdown-странице.
    // Сама страница новостей сейчас исключена из сборки (srcExclude в config.mjs).
    app.component('NewsCarousel', NewsCarousel)
    // Строка «Последнее обновление» под заголовком — её вставляет плагин
    // amzSections из config.mjs, поэтому компонент регистрируется глобально.
    app.component('AmzPageMeta', PageMeta)
    // Главная страница целиком (docs/index.md, docs/en/index.md).
    app.component('AmzHome', Home)

    if (!import.meta.env.SSR) setupHeadingLinks()
  }
}
