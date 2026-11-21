import { h, ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

// Плашка «Наш сайт» с вращающимся кубиком — в шапке на всех страницах.
// На главной она стоит на месте поиска (там есть большой поиск по центру),
// на остальных страницах — рядом с поиском. Ведёт на зеркало сайта хостинга.
// Кубик собран из 8 маленьких «серверных» блоков на CSS (custom.css, раздел
// «Кубик»): графитовые грани с мигающими огоньками. Он медленно вращается,
// верхний и нижний слои по очереди поворачиваются, как у кубика Рубика,
// блоки по одному «всплывают», а под плашкой появляется подсказка о хостинге.

const STRINGS = {
  ru: {
    title: 'Наш Сайт',
    url: 'https://storage.googleapis.com/amnezia/host',
    label: 'AmneziaCloud Hosting',
    tips: ['VPS от 5,25 $/мес', 'Безлимитный трафик', 'Сервер за 5 минут', 'Дата-центр в Амстердаме', 'Оплата картами и СБП']
  },
  en: {
    title: 'Our website',
    url: 'https://storage.googleapis.com/amnezia/host',
    label: 'AmneziaCloud Hosting',
    tips: ['VPS from $5.25/mo', 'Unlimited traffic', 'Server in 5 minutes', 'Amsterdam data center', 'Pay by card or crypto']
  }
}

// Позиции 8 кубиков 2×2×2 и сдвиг фазы «всплывания» для каждого
const CELLS = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]
const DELAYS = [0, 5, 2.5, 7.5, 6.25, 1.25, 8.75, 3.75]

const SIZE = 26

const cell = ([x, y, z], i) => {
  const c = SIZE / 2
  const push = SIZE * 0.11
  return h('span', {
    class: 'amz-cube__cell',
    style: {
      '--x': x * c + 'px',
      '--y': y * c + 'px',
      '--z': (z - 0.5) * c + 'px',
      '--px': (x ? 1 : -1) * push + 'px',
      '--py': (y ? 1 : -1) * push + 'px',
      '--pz': (z ? 1 : -1) * push + 'px',
      '--d': -DELAYS[i] + 's'
    }
  }, ['front', 'back', 'right', 'left', 'top', 'bottom'].map((f) =>
    h('span', { class: 'amz-cube__f amz-cube__f--' + f })
  ))
}

// Два слоя (верхний и нижний) — каждый поворачивается отдельно.
const layer = (y) =>
  h('span', { class: 'amz-cube__layer amz-cube__layer--' + (y ? 'bottom' : 'top') },
    CELLS.map((p, i) => (p[1] === y ? cell(p, i) : null))
  )

const cube = () =>
  h('span', { class: 'amz-cube', 'aria-hidden': 'true', style: { '--s': SIZE + 'px' } }, [
    h('span', { class: 'amz-cube__shadow' }),
    h('span', { class: 'amz-cube__rot' }, [layer(0), layer(1)])
  ])

export default {
  name: 'AmzHostCube',
  setup() {
    const { frontmatter, lang } = useData()
    const t = computed(() => (lang.value && lang.value.startsWith('en') ? STRINGS.en : STRINGS.ru))
    const isHome = computed(() => frontmatter.value.layout === 'home')

    const tip = ref('')
    const open = ref(false)
    let index = 0
    let hover = false
    let cycle = 0
    let hide = 0

    const next = () => {
      const tips = t.value.tips
      tip.value = tips[index % tips.length]
      index += 1
    }
    const show = () => { clearTimeout(hide); next(); open.value = true }
    const close = () => { open.value = false }

    onMounted(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      // Раз в 7 секунд подсказка всплывает сама на пару секунд.
      cycle = setInterval(() => {
        if (hover || document.hidden) return
        show()
        hide = setTimeout(close, 2600)
      }, 7000)
    })
    onUnmounted(() => { clearInterval(cycle); clearTimeout(hide) })

    return () =>
      h('a', {
            class: ['amz-host', isHome.value ? 'is-home' : null, open.value ? 'is-tip' : null],
            href: t.value.url,
            target: '_blank',
            rel: 'noreferrer',
            onMouseenter: () => { hover = true; show() },
            onMouseleave: () => { hover = false; close() },
            onFocus: show,
            onBlur: close
          }, [
            cube(),
            h('span', { class: 'amz-host__text' }, [
              h('span', { class: 'amz-host__title' }, t.value.title),
              h('span', { class: 'amz-host__url' }, t.value.label)
            ]),
            h('span', { class: 'amz-host__tip', role: 'status' }, tip.value)
          ])
  }
}
