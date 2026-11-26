import { h, reactive, onMounted, onUnmounted, nextTick, Teleport } from 'vue'
import { STORIES } from './storiesData.js'

// Wiki Stories на главной вики (тексты экранов — storiesData.js).
// Ряд кружков по центру под поиском, как сторис в соцсетях; история
// открывается поверх страницы во весь экран.

const state = reactive({ story: 0, slide: 0, p: 0, hold: false, open: false, where: '', seen: {} })
let raf = 0
let last = 0

const list = () => STORIES.ru
const N = () => list().length
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
  state.story = ((i % N()) + N()) % N()
  state.slide = k
  state.p = 0
}
function go(k) {
  const s = slidesOf(state.story)
  if (k >= s.length) {
    state.seen[list()[state.story].id] = true
    if (state.story === N() - 1) close()
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
function open(i, where) {
  show(i)
  state.open = true
  state.where = where
  state.hold = false
  if (where === 'overlay') document.documentElement.classList.add('amz-st-lock')
  last = 0
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(tick)
  nextTick(() => {
    const x = document.querySelector('.amz-st-ov .amz-st-x')
    if (x) x.focus({ preventScroll: true })
  })
}

// Экран истории: полоски прогресса, шапка, текущий экран, ✕
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
    h('button', { type: 'button', class: 'amz-st-x', 'aria-label': 'Закрыть', onClick: close }, '✕'),
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
        h('span', { class: 'av' }, 'W'),
        h('span', null, ['Wiki Stories', h('br'), h('small', null, st.who)]),
        h('span', { class: 'sp' }),
        h('span', { class: 'pz' }, '❚❚ пауза')
      ]),
      h('div', { key: st.id + ':' + state.slide, class: ['slide', 'on', cls], innerHTML: html })
    ])
  ])
}

// Кружок истории: кольцо зелёное, пока история не просмотрена (серое — после),
// внутри эмодзи на фоне истории, под кружком название.
function bubble(st, i) {
  return h('button', {
    type: 'button',
    class: ['amz-st-bub', state.seen[st.id] ? 'is-seen' : null],
    'aria-label': 'Смотреть: ' + st.title,
    onClick: () => open(i, 'overlay')
  }, [
    h('span', { class: 'ring', 'aria-hidden': 'true' }, [
      h('span', { class: ['pic', st.grad] }, st.emoji)
    ]),
    h('span', { class: 'cap' }, st.title)
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
      h('section', { class: 'amz-st-strip', 'aria-label': 'Wiki Stories' }, [
        h('div', { class: 'amz-st-row' }, list().map(bubble)),
        state.open
          ? h(Teleport, { to: 'body' }, [
              h('div', {
                class: 'amz-st-ov',
                role: 'dialog',
                'aria-modal': 'true',
                'aria-label': list()[state.story].title,
                onClick: (e) => { if (e.target === e.currentTarget) close() }
              }, [phone()])
            ])
          : null
      ])
  }
}
