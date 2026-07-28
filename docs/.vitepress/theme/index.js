import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Feedback from './Feedback.js'
import ReadingProgress from './ReadingProgress.js'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // Блок «предложить правку» под текстом каждой страницы.
      'doc-after': () => h(Feedback),
      // Индикатор прочитанного — фиксирован внизу экрана.
      'layout-bottom': () => h(ReadingProgress)
    })
}
