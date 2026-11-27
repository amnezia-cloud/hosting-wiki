import { h, ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

// Плашка «Наш сайт» с вращающимся кубиком — в шапке на всех страницах.
// На главной она стоит на месте поиска (там есть большой поиск по центру),
// на остальных страницах — рядом с поиском. Ведёт на зеркало сайта хостинга.
// Кубик собран из 8 маленьких «серверных» блоков на CSS (custom.css, раздел
// «Кубик»): графитовые грани с мигающими огоньками. Он медленно вращается,
// а надпись «Наш сайт» на плашке время от времени сменяется подсказкой о хостинге
// (цена, трафик и т.д.) — прямо в плашке, без всплывающих окон.
// При наведении кубик вырастает и проходит короткую последовательность (burst):
// плавный разгон вращения до очень быстрого, затем замедление, во время которого
// блоки разлетаются, и сборка обратно, когда лишнее вращение уже затихло.
// Лишнее вращение — свойство rotate у слоёв (складывается с обычным вращением из CSS),
// сумма оборотов целая, поэтому в конце кубик в том же положении и с прежней скоростью.
// Рост при наведении — в custom.css; последовательность не запускается без наведения
// (телефоны) и при настройке системы «меньше анимации».

const STRINGS = {
  ru: {
    title: 'Наш сайт',
    url: 'https://storage.googleapis.com/amnezia/host',
    label: 'AmneziaCloud Hosting',
    tips: ['VPS от 5,25 $/мес', 'Безлимитный трафик', 'Сервер за 5 минут', 'Дата-центр в Амстердаме', 'Оплата картами и СБП']
  },
  en: {
    title: 'Our site',
    url: 'https://storage.googleapis.com/amnezia/host',
    label: 'AmneziaCloud Hosting',
    tips: ['VPS from $5.25/mo', 'Unlimited traffic', 'Server in 5 minutes', 'Amsterdam data center', 'Pay by card or crypto']
  }
}

// Позиции 8 кубиков 2×2×2 и сдвиг фазы «всплывания» для каждого
const CELLS = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]
const DELAYS = [0, 5, 2.5, 7.5, 6.25, 1.25, 8.75, 3.75]

const SIZE = 22

// Параметры последовательности: обороты, длительность (мс), доли времени
const BURST = { turns: 9, duration: 4800, up: 0.27, peak: 0.1, down: 0.4, spread: 3.4, shrink: 0.56, out: 900, back: 1000 }
const IN = 'cubic-bezier(.11,0,.5,0)'
const OUT = 'cubic-bezier(.5,1,.89,1)'
const SPRING_OUT = 'cubic-bezier(.25,1.35,.4,1)'
const SPRING_BACK = 'cubic-bezier(.3,1.15,.4,1)'

let bursting = false
let lastBurst = -1e9 // когда закончилась прошлая раскрутка (до первой её не было)

function burst(host) {
  if (bursting || typeof window === 'undefined') return
  if (performance.now() - lastBurst < 6000) return // не чаще раза в 6 секунд
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const cubeEl = host.querySelector('.amz-cube')
  if (!cubeEl || !cubeEl.animate) return

  const { turns, duration: D, up, peak, down, spread, shrink, out, back } = BURST
  const T1 = up * D
  const T2 = peak * D
  const T3 = down * D
  const E = T1 + T2 + T3
  const total = 360 * turns
  const w = total / (T1 / 2 + T2 + T3 / 2)
  const A1 = (w * T1) / 2
  const A2 = w * T2
  const rot = (deg) => '0 1 0 ' + -deg + 'deg'

  const anims = []
  host.querySelectorAll('.amz-cube__layer').forEach((layer) => {
    anims.push(layer.animate([
      { rotate: rot(0), offset: 0, easing: IN },
      { rotate: rot(A1), offset: T1 / D, easing: 'linear' },
      { rotate: rot(A1 + A2), offset: (T1 + T2) / D, easing: OUT },
      { rotate: rot(total), offset: E / D },
      { rotate: rot(total), offset: 1 }
    ], { duration: D }))
  })

  // Разлёт: начинается к концу быстрого вращения, сборка — когда лишнее вращение затихло
  const a = (T1 + 0.4 * T2) / D
  const b = a + out / D
  const c = E / D
  const d = Math.min(1, c + back / D)
  const zero = '0px 0px 0px'
  host.querySelectorAll('.amz-cube__cell').forEach((el) => {
    const cs = getComputedStyle(el)
    const e = ['--px', '--py', '--pz'].map((v) => parseFloat(cs.getPropertyValue(v)) * spread + 'px').join(' ')
    anims.push(el.animate([
      { translate: zero, offset: 0 },
      { translate: zero, offset: a, easing: SPRING_OUT },
      { translate: e, offset: b },
      { translate: e, offset: c, easing: SPRING_BACK },
      { translate: zero, offset: d },
      { translate: zero, offset: 1 }
    ], { duration: D }))
  })
  // На время разлёта кубик чуть сжимается и опускается, чтобы блоки не упирались в верхний край окна
  anims.push(cubeEl.animate([
    { scale: 1, translate: '0px 0px', offset: 0 },
    { scale: 1, translate: '0px 0px', offset: a, easing: SPRING_OUT },
    { scale: shrink, translate: '0px 10px', offset: b },
    { scale: shrink, translate: '0px 10px', offset: c, easing: SPRING_BACK },
    { scale: 1, translate: '0px 0px', offset: d },
    { scale: 1, translate: '0px 0px', offset: 1 }
  ], { duration: D }))

  bursting = true
  const done = () => {
    bursting = false
    lastBurst = performance.now()
    anims.forEach((x) => x.cancel()) // ничего не оставляем после ритуала
  }
  Promise.all(anims.map((x) => x.finished)).then(done, done)
}

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

    // Номер показанной подсказки; -1 — видна надпись «Наш сайт».
    const current = ref(-1)
    let index = 0
    let hover = false
    let cycle = 0
    let hide = 0

    // «Остров» на узких экранах, где надпись на плашке скрыта: первое нажатие на кубик раскрывает
    // плашку («Наш сайт» и название хостинга), второе — на раскрытую — открывает сайт.
    // Раскрытая плашка сама закрывается через 6 секунд, по нажатию в другом месте и по Esc.
    const open = ref(false)
    let openTimer = 0
    const setOpen = (v) => {
      open.value = v
      document.documentElement.classList.toggle('amz-host-open', v)
      // на страницах статей плашка раскрывается и над логотипом — прячем его целиком
      document.documentElement.classList.toggle('amz-host-open--wide', v && !isHome.value)
      clearTimeout(openTimer)
      if (v) openTimer = setTimeout(() => setOpen(false), 6000)
    }
    const onDocPointer = (e) => { if (open.value && !(e.target.closest && e.target.closest('.amz-host'))) setOpen(false) }
    const onDocKey = (e) => { if (open.value && e.key === 'Escape') setOpen(false) }
    const onClick = (e) => {
      if (open.value) { setOpen(false); return } // второе нажатие: ссылка открывает сайт
      const txt = e.currentTarget.querySelector('.amz-host__text')
      if (txt && getComputedStyle(txt).display === 'none') {
        e.preventDefault() // надпись скрыта: первое нажатие только раскрывает плашку
        setOpen(true)
      }
    }

    onMounted(() => {
      document.addEventListener('pointerdown', onDocPointer)
      document.addEventListener('keydown', onDocKey)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      // Раз в 7 секунд вместо «Наш сайт» на 3 секунды встаёт следующая подсказка.
      cycle = setInterval(() => {
        if (hover || open.value || document.hidden) return
        current.value = index % t.value.tips.length
        index += 1
        hide = setTimeout(() => { current.value = -1 }, 3000)
      }, 7000)
    })
    onUnmounted(() => {
      clearInterval(cycle)
      clearTimeout(hide)
      clearTimeout(openTimer)
      document.removeEventListener('pointerdown', onDocPointer)
      document.removeEventListener('keydown', onDocKey)
      document.documentElement.classList.remove('amz-host-open')
      document.documentElement.classList.remove('amz-host-open--wide')
    })

    return () =>
      h('a', {
            class: ['amz-host', isHome.value ? 'is-home' : null, open.value ? 'is-open' : null],
            href: t.value.url,
            target: '_blank',
            rel: 'noreferrer',
            onClick,
            onMouseenter: (e) => { hover = true; burst(e.currentTarget) },
            onMouseleave: () => { hover = false },
            // раскрутка по фокусу — только если фокус с клавиатуры (не после клика мышью)
            onFocus: (e) => { if (e.currentTarget.matches(':focus-visible')) burst(e.currentTarget) }
          }, [
            cube(),
            h('span', { class: 'amz-host__text' }, [
              h('span', { class: 'amz-host__title' }, [
                h('span', { class: ['amz-host__say', current.value < 0 ? 'is-on' : null] }, t.value.title),
                ...t.value.tips.map((tip, i) =>
                  h('span', { class: ['amz-host__say', 'is-tip', current.value === i ? 'is-on' : null], 'aria-hidden': 'true' }, tip)
                )
              ]),
              h('span', { class: 'amz-host__url' }, ['Amnezia', h('b', null, 'Cloud'), ' Hosting'])
            ])
          ])
  }
}
