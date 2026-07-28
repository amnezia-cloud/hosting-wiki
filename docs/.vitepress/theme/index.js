import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Feedback from './Feedback.js'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Блок «предложить правку» под текстом каждой страницы документации.
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => h(Feedback) })
}
