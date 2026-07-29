import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Feedback from './Feedback.js'
import NewsCarousel from './NewsCarousel.js'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Блок «предложить правку» под текстом каждой страницы.
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => h(Feedback) }),
  enhanceApp({ app }) {
    // Лента новостей: <NewsCarousel /> доступен в любой markdown-странице.
    app.component('NewsCarousel', NewsCarousel)
  }
}
