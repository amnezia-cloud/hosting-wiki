import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Feedback from './Feedback.js'
import NewsCarousel from './NewsCarousel.js'
import Banner from './Banner.js'
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
      'doc-before': () => h(Banner),
      // Блок «предложить правку» под текстом каждой страницы.
      'doc-after': () => h(Feedback)
    }),
  enhanceApp({ app }) {
    // Лента новостей: <NewsCarousel /> доступен в любой markdown-странице.
    app.component('NewsCarousel', NewsCarousel)
  }
}
