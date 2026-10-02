import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Feedback from './Feedback.js'
import NewsCarousel from './NewsCarousel.js'
import Banner from './Banner.js'
import Breadcrumbs from './Breadcrumbs.js'
import PageMeta from './PageMeta.js'
import HelpLinks from './HelpLinks.js'
import Footer from './Footer.js'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // Красный баннер: над hero на главной и над текстом на всех остальных
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
    app.component('NewsCarousel', NewsCarousel)
    // Строка «Последнее обновление» под заголовком — её вставляет плагин
    // amzSections из config.mjs, поэтому компонент регистрируется глобально.
    app.component('AmzPageMeta', PageMeta)
  }
}
