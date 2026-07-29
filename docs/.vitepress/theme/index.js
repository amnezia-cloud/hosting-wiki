import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Feedback from './Feedback.js'
import NewsCarousel from './NewsCarousel.js'
import Icon from './Icon.js'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Блок обратной связи идёт сразу за текстом статьи: слот doc-footer-before
  // ставит его выше строки «Обновлено» и выше перехода на соседние страницы.
  // В doc-after он оказывался в самом низу, уже после навигации, где его
  // читают последним — а предложить правку логичнее до того, как человек
  // ушёл на следующую страницу.
  Layout: () =>
    h(DefaultTheme.Layout, null, { 'doc-footer-before': () => h(Feedback) }),
  enhanceApp({ app }) {
    // Лента новостей: <NewsCarousel /> доступен в любой markdown-странице.
    app.component('NewsCarousel', NewsCarousel)
    // Иконки: <Icon /> работает в любом .md без импорта.
    app.component('Icon', Icon)
  }
}
