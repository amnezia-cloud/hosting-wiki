import { h, reactive, onMounted, onUnmounted, nextTick, Teleport } from 'vue'
import { STORIES } from './storiesData.js'

// Сторис на главной вики: блок карточек внизу главной (<AmzStories />).
// Нажатие на карточку открывает историю во весь экран. Истории идут подряд,
// после последней окно закрывается само. Тексты экранов — в storiesData.js.

const state = reactive({ story: 0, slide: 0, p: 0, hold: false, open: false, seen: {} })
let raf = 0
let last = 0

const list = () => STORIES.ru
const slidesOf = (i) => list()[i].slides

// Время показа экрана зависит от количества текста на нём.
const dur = (i, k) => {
  const s = slidesOf(i)
  if (k === s.length - 1) return 8000
  const text = s[k][1].replace(/<[^>]+>/g, '').length
  return Math.min(6500, Math.max(3600, 2400 + text * 18))
}

function close() {
  state.open = false
  cancelAnimationFrame(raf)
  document.documentElement.classList.remove('amz-st-lock')
}
function show(i, k = 0) {
  const n = list().length
  state.story = (i + n) % n
  state.slide = k
  state.p = 0
}
function go(k) {
  const s = slidesOf(state.story)
  if (k >= s.length) {
    state.seen[list()[state.story].id] = true
    if (state.story === list().length - 1) close()
    else show(state.story + 1)
    return
  }
  if (k < 0) {
    if (state.story > 0) show(state.story - 1, slidesOf(state.story - 1).length - 1)
    else state.p = 0
    return
  }
  state.slide = k
  state.p = 0
}

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
function tick(t) {
  const dt = last ? t - last : 0
  last = t
  if (state.open && !state.hold && !document.hidden && !reduce()) {
    state.p += dt / dur(state.story, state.slide)
    if (state.p >= 1) go(state.slide + 1)
  }
  if (state.open) raf = requestAnimationFrame(tick)
}
function open(i) {
  show(i)
  state.open = true
  state.hold = false
  document.documentElement.classList.add('amz-st-lock')
  last = 0
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(tick)
  nextTick(() => {
    const x = document.querySelector('.amz-st-ov__x')
    if (x) x.focus({ preventScroll: true })
  })
}

// Телефон с историей: полоски прогресса, шапка, текущий экран
function phone() {
  const st = list()[state.story]
  const slides = st.slides
  const [cls, html] = slides[state.slide]
  let holdT = 0
  const down = (e) => {
    if (e.target.closest('a,button')) return
    holdT = setTimeout(() => { state.hold = true }, 180)
  }
  const up = () => {
    clearTimeout(holdT)
    if (state.hold) setTimeout(() => { state.hold = false }, 0)
  }
  const click = (e) => {
    if (state.hold) return
    if (e.target.closest('[data-next-story]')) {
      e.preventDefault()
      state.seen[st.id] = true
      show(state.story + 1)
      return
    }
    if (e.target.closest('a,button')) return
    const r = e.currentTarget.getBoundingClientRect()
    go(e.clientX - r.left < r.width * 0.35 ? state.slide - 1 : state.slide + 1)
  }
  return h('div', { class: 'amz-st-phone' }, [
    h('div', {
      class: ['amz-st', state.hold ? 'is-paused' : null],
      role: 'region',
      'aria-roledescription': 'сторис',
      'aria-label': st.title,
      onPointerdown: down,
      onPointerup: up,
      onPointerleave: up,
      onPointercancel: up,
      onClick: click
    }, [
      h('div', { class: 'bars' }, slides.map((_, k) =>
        h('span', null, [h('b', { style: { width: (k < state.slide ? 1 : k === state.slide ? Math.min(state.p, 1) : 0) * 100 + '%' } })])
      )),
      h('div', { class: 'who' }, [
        h('span', { class: 'av' }, 'A'),
        h('span', null, ['Amnezia Hosting', h('br'), h('small', null, st.who)]),
        h('span', { class: 'sp' }),
        h('span', { class: 'pz' }, '❚❚ пауза')
      ]),
      h('div', { key: st.id + ':' + state.slide, class: ['slide', 'on', cls], innerHTML: html })
    ])
  ])
}

function card(st, i) {
  const now = state.open && i === state.story
  const prog = now ? (state.slide + Math.min(state.p, 1)) / st.slides.length : (state.seen[st.id] ? 1 : 0)
  return h('button', {
    type: 'button',
    class: ['amz-st-card', st.grad, state.seen[st.id] ? 'is-seen' : null],
    'aria-label': 'Смотреть: ' + st.title,
    onClick: () => open(i)
  }, [
    h('span', { class: 'pr' }, [h('i', { style: { width: prog * 100 + '%' } })]),
    h('span', { class: 'e', 'aria-hidden': 'true' }, st.emoji),
    h('span', { class: 'bt' }, [h('b', null, st.title), h('span', { class: 'go' }, '▶ Смотреть')])
  ])
}

export default {
  name: 'AmzStories',
  setup() {
    const onKey = (e) => {
      if (!state.open) return
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(state.slide + 1)
      else if (e.key === 'ArrowLeft') go(state.slide - 1)
    }
    onMounted(() => window.addEventListener('keydown', onKey))
    onUnmounted(() => {
      window.removeEventListener('keydown', onKey)
      if (state.open) close()
    })

    return () =>
      h('section', { class: 'amz-st-shelf', 'aria-label': 'Сторис' }, [
        h('div', { class: 'amz-st-side' }, [
          h('span', { class: 'av', 'aria-hidden': 'true' }, 'A'),
          h('b', null, 'Amnezia Hosting'),
          h('span', null, 'Главное о VPN')
        ]),
        h('div', { class: 'amz-st-row' }, list().map(card)),
        state.open
          ? h(Teleport, { to: 'body' }, [
              h('div', {
                class: 'amz-st-ov',
                role: 'dialog',
                'aria-modal': 'true',
                'aria-label': list()[state.story].title,
                onClick: (e) => { if (e.target === e.currentTarget) close() }
              }, [
                h('button', { type: 'button', class: 'amz-st-ov__x', 'aria-label': 'Закрыть', onClick: close }, '✕'),
                phone()
              ])
            ])
          : null
      ])
  }
}
