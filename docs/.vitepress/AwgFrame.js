import { h, ref, onMounted, watch } from 'vue'
import { useData, withBase } from 'vitepress'

// Генератор параметров AmneziaWG (docs/public/tools/awg-generator*.html) во весь экран
// под шапкой вики. Тема вики передаётся в генератор и меняется вместе с ней.

const TEXT = {
  ru: { title: 'Генератор параметров AmneziaWG', open: 'Открыть в отдельной вкладке ↗' },
  en: { title: 'AmneziaWG parameter generator', open: 'Open in a separate tab ↗' }
}

export default {
  name: 'AwgFrame',
  props: { lang: { type: String, default: 'ru' } },
  setup(props) {
    const { isDark } = useData()
    const frame = ref(null)
    const src = ref('')
    const t = TEXT[props.lang] || TEXT.ru
    const file = () => withBase('/tools/awg-generator' + (props.lang === 'en' ? '-en' : '') + '.html')
    const send = () => {
      const w = frame.value && frame.value.contentWindow
      if (w) w.postMessage({ type: 'awg-theme', dark: isDark.value }, '*')
    }
    onMounted(() => { src.value = file() + '?embed=1&theme=' + (isDark.value ? 'dark' : 'light') })
    watch(isDark, send)
    return () =>
      h('div', { class: 'awg-frame' }, [
        h('div', { class: 'awg-frame__bar' }, [
          h('span', { class: 'awg-frame__title' }, t.title),
          h('a', { class: 'awg-frame__open', href: file(), target: '_blank', rel: 'noreferrer' }, t.open)
        ]),
        src.value ? h('iframe', { ref: frame, src: src.value, title: t.title, onLoad: send }) : h('div', { class: 'awg-frame__ph' })
      ])
  }
}
