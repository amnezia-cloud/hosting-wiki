import { h, reactive, onMounted, onUnmounted, nextTick, Teleport } from 'vue'
import { STORIES } from './storiesData.js'

// Сторис на главной вики.
//   <AmzStories mode="hero" />  — живой телефон справа в шапке (только на широком экране);
//   <AmzStories mode="shelf" /> — блок историй внизу главной.
// Оба экземпляра делят одно состояние: нажатие на карточку внизу переключает
// телефон наверху. Если телефона не видно (узкий экран), история открывается
// поверх страницы во весь экран.

const state = reactive({ story: 0, slide: 0, p: 0, paused: false, hold: false, overlay: false, seen: {} })
let raf = 0
let last = 0
let users = 0
let heroVisible = false

const list = () => STORIES.ru
const slidesOf = (i) => list()[i].slides

// Время показа экрана зависит от количества текста на нём.
const dur = (i, k) => {
  const s = slidesOf(i)
  if (k === s.length - 1) return 8000
  const text = s[k][1].replace(/<[^>]+>/g, '').length
  return Math.min(6500, Math.max(3600, 2400 + text * 18))
}

function open(i, k = 0) {
  const n = list().length
  state.story = (i + n) % n
  state.slide = k
  state.p = 0
}
function go(k) {
  const s = slidesOf(state.story)
  if (k >= s.length) { state.seen[list()[state.story].id] = true; open(state.story + 1); return }
  if (k < 0) {
    if (state.story > 0) open(state.story - 1, slidesOf(state.story - 1).length - 1)
    else state.slide = 0
    state.p = 0
    return
  }
  state.slide = k
  state.p = 0
}

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
function tick(t) {
  const dt = last ? t - last : 0
  last = t
  const playing = (heroVisible || state.overlay) && !state.paused && !state.hold && !document.hidden && !reduce()
  if (playing) {
    state.p += dt / dur(state.story, state.slide)
    if (state.p >= 1) go(state.slide + 1)
  }
  raf = requestAnimationFrame(tick)
}
function start() { if (!users++) { last = 0; raf = requestAnimationFrame(tick) } }
function stop() { if (!--users) cancelAnimationFrame(raf) }

// Телефон истории: полоски прогресса, шапка, текущий экран, зоны нажатия
function phone(extraClass) {
  const st = list()[state.story]
  const slides = st.slides
  const [cls, html] = slides[state.slide]
  let holdT = 0
  const down = (e) => {
    if (e.target.closest('a,button')) return
    holdT = setTimeout(() => { state.hold = true }, 180)
  }
  const up = () => { clearTimeout(holdT); if (state.hold) setTimeout(() => { state.hold = false }, 0) }
  const click = (e) => {
    if (state.hold) return
    const nx = e.target.closest('[data-next-story]')
    if (nx) { e.preventDefault(); state.seen[st.id] = true; open(state.story + 1); return }
    if (e.target.closest('a,button')) return
    const r = e.currentTarget.getBoundingClientRect()
    go(e.clientX - r.left < r.width * 0.35 ? state.slide - 1 : state.slide + 1)
  }
  return h('div', { class: ['amz-st-phone', extraClass] }, [
    h('div', {
      class: ['amz-st', (state.paused || state.hold) ? 'is-paused' : null],
      role: 'region',
      'aria-roledescription': 'сторис',
      'aria-label': st.title,
      onPointerdown: down, onPointerup: up, onPointerleave: up, onPointercancel: up, onClick: click
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

function card(st, i, onPick) {
  const now = i === state.story
  const prog = now ? (state.slide + Math.min(state.p, 1)) / st.slides.length : (state.seen[st.id] ? 1 : 0)
  return h('button', {
    type: 'button',
    class: ['amz-st-card', st.grad, now ? 'is-now' : null],
    onClick: () => onPick(i)
  }, [
    h('span', { class: 'pr' }, [h('i', { style: { width: prog * 100 + '%' } })]),
    h('span', { class: 'e', 'aria-hidden': 'true' }, st.emoji),
    h('span', { class: 'bt' }, [h('b', null, st.title), h('span', { class: 'go' }, '▶ Смотреть')])
  ])
}

export default {
  name: 'AmzStories',
  props: { mode: { type: String, default: 'shelf' } },
  setup(props) {
    let io = null
    let el = null
    const onKey = (e) => { if (e.key === 'Escape' && state.overlay) close() }
    const close = () => { state.overlay = false; document.documentElement.classList.remove('amz-st-lock') }

    onMounted(() => {
      start()
      if (props.mode === 'hero' && el) {
        io = new IntersectionObserver((es) => { heroVisible = es.some((x) => x.isIntersecting && x.target.offsetWidth > 0) }, { threshold: 0.3 })
        io.observe(el)
      }
      window.addEventListener('keydown', onKey)
    })
    onUnmounted(() => { stop(); if (io) io.disconnect(); window.removeEventListener('keydown', onKey); if (props.mode === 'hero') heroVisible = false })

    const pick = (i) => {
      state.paused = false
      open(i)
      const hero = document.querySelector('.amz-st-phone.is-hero')
      if (hero && hero.offsetWidth > 0) {
        hero.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        state.overlay = true
        document.documentElement.classList.add('amz-st-lock')
        nextTick(() => { const x = document.querySelector('.amz-st-ov__x'); if (x) x.focus({ preventScroll: true }) })
      }
    }

    return () => {
      if (props.mode === 'hero') {
        return h('div', { class: 'amz-st-hero', ref: (r) => { el = r } }, [phone('is-hero'), h('p', { class: 'amz-st-cap' }, 'тап — дальше · удержание — пауза')])
      }
      return h('section', { class: 'amz-st-shelf', 'aria-label': 'Сторис' }, [
        h('div', { class: 'amz-st-side' }, [
          h('span', { class: 'av', 'aria-hidden': 'true' }, 'A'),
          h('b', null, 'Amnezia Hosting'),
          h('span', null, 'Главное о VPN')
        ]),
        h('div', { class: 'amz-st-row' }, list().map((st, i) => card(st, i, pick))),
        state.overlay
          ? h(Teleport, { to: 'body' }, [
              h('div', { class: 'amz-st-ov', role: 'dialog', 'aria-modal': 'true', 'aria-label': list()[state.story].title, onClick: (e) => { if (e.target === e.currentTarget) close() } }, [
                h('button', { type: 'button', class: 'amz-st-ov__x', 'aria-label': 'Закрыть', onClick: close }, '✕'),
                phone('is-ov')
              ])
            ])
          : null
      ])
    }
  }
}
