import { h, reactive, ref, onMounted, onUnmounted, nextTick, Teleport } from 'vue'
import { STORIES } from './storiesData.js'

// Wiki Stories на главной вики (тексты экранов — storiesData.js).
//   <AmzStories mode="rail" />  — колонка справа на широких экранах: лента карточек
//                                 стоит вровень с колонками главной; по нажатию сверху
//                                 выезжает экран с историей, лента уезжает вниз и
//                                 уменьшается; ✕ возвращает всё на место.
//   <AmzStories mode="strip" /> — на узких экранах лента под поиском; история
//                                 открывается во весь экран.
// Оба экземпляра делят одно состояние. Какой из них виден, решает CSS (custom.css).

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
    const x = document.querySelector(where === 'overlay' ? '.amz-st-ov .amz-st-x' : '.amz-st-rail .amz-st-x')
    if (x) x.focus({ preventScroll: true })
  })
  // Экран истории выезжает в верху страницы. Если страницу прокрутили вниз, он оказался бы
  // над видимой областью, а лента просто «уезжала» бы вниз. Поэтому мягко возвращаем страницу вверх.
  if (where === 'rail') {
    const rail = document.querySelector('.amz-st-rail')
    if (rail) {
      const want = Math.max(0, rail.getBoundingClientRect().top + window.scrollY + 40 - 64 - 16)
      if (window.scrollY > want + 8) window.scrollTo({ top: want, behavior: reduce() ? 'auto' : 'smooth' })
    }
  }
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

function card(st, i, onPick, pos) {
  const now = state.open && i === state.story
  const prog = now ? (state.slide + Math.min(state.p, 1)) / st.slides.length : (state.seen[st.id] ? 1 : 0)
  return h('button', {
    type: 'button',
    class: ['amz-st-card', st.grad, state.seen[st.id] ? 'is-seen' : null],
    'data-pos': pos,
    tabindex: pos === undefined || Math.abs(pos) <= 1 ? null : -1,
    'aria-label': 'Смотреть: ' + st.title,
    onClick: () => onPick(i)
  }, [
    h('span', { class: 'pr' }, [h('i', { style: { width: prog * 100 + '%' } })]),
    h('span', { class: 'e', 'aria-hidden': 'true' }, st.emoji),
    h('span', { class: 'bt' }, [h('b', null, st.title), h('span', { class: 'go' }, '▶ Смотреть')])
  ])
}

const head = () =>
  h('div', { class: 'amz-st-head' }, [
    h('span', { class: 'ring', 'aria-hidden': 'true' }, [h('span', null, 'W')]),
    h('div', null, [h('b', null, 'Wiki Stories'), h('span', null, 'Новостная лента')])
  ])

export default {
  name: 'AmzStories',
  props: { mode: { type: String, default: 'strip' } },
  setup(props) {
    const spacer = ref(0)
    const carH = ref(0)
    const ready = ref(false) // колонка выровнена и можно показывать (до этого скрыта, без анимаций)
    let el = null
    let ro = null

    // Колонка справа: лента стоит вровень с колонками главной
    const align = () => {
      if (props.mode !== 'rail' || !el) return
      const paths = document.querySelector('.amz-home__paths')
      const sp = el.querySelector('.amz-st-spacer')
      if (!paths || !sp || !el.offsetWidth) return
      const top = sp.getBoundingClientRect().top + window.scrollY
      const r = paths.getBoundingClientRect()
      spacer.value = Math.max(0, Math.round(r.top + window.scrollY - top))
      carH.value = Math.max(420, Math.round(r.height))
      // Открытая колонка (экран 330×642 + зазор 18 + уменьшенная лента 309) выше четырёх колонок.
      // Нижние плитки растянуты на всю ширину, поэтому их нужно отодвинуть на этот «вылет».
      const openBottom = top + 642 + 18 + 309 + 24
      const tilesTop = r.bottom + window.scrollY + 16
      const wrap = el.parentElement
      if (wrap) wrap.style.setProperty('--st-extra', Math.max(0, Math.round(openBottom - tilesTop)) + 'px')
    }
    const onKey = (e) => {
      if (!state.open) return
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(state.slide + 1)
      else if (e.key === 'ArrowLeft') go(state.slide - 1)
    }
    onMounted(() => {
      if (props.mode === 'rail') {
        // Показываем колонку только после первого точного расчёта (шрифты загружены), иначе при
        // загрузке страницы лента сначала сжата вверху и потом «съезжает» на место.
        const markReady = () => {
          if (ready.value) return
          align()
          nextTick(() => requestAnimationFrame(() => { ready.value = true }))
        }
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(markReady, 120))
        setTimeout(markReady, 1500)
        nextTick(align)
        // ещё раз — после анимации появления главной и загрузки шрифтов
        setTimeout(align, 700)
        if (document.fonts) document.fonts.ready.then(align)
        ro = new ResizeObserver(align)
        const paths = document.querySelector('.amz-home__paths')
        if (paths) ro.observe(paths)
        window.addEventListener('resize', align)
      } else {
        window.addEventListener('keydown', onKey)
      }
    })
    onUnmounted(() => {
      if (ro) ro.disconnect()
      window.removeEventListener('resize', align)
      window.removeEventListener('keydown', onKey)
      if (state.open) close()
    })

    const pickRail = (i) => {
      if (state.open && state.where === 'rail' && i === state.story) return
      state.seen = { ...state.seen }
      open(i, 'rail')
    }
    const step = (d) => {
      if (state.open && state.where === 'rail') open(state.story + d, 'rail')
      else show(state.story + d)
    }

    return () => {
      if (props.mode === 'rail') {
        const isOpen = state.open && state.where === 'rail'
        const pos = (k) => { let d = ((k - state.story) % N() + N()) % N(); if (d > N() / 2) d -= N(); return d }
        return h('aside', {
          class: ['amz-st-rail', isOpen ? 'is-open' : null, ready.value ? 'is-ready' : null],
          'aria-label': 'Wiki Stories',
          ref: (r) => { el = r },
          style: { '--sp': spacer.value + 'px', '--ch': carH.value + 'px' }
        }, [
          h('div', { class: 'amz-st-spacer', 'aria-hidden': 'true' }),
          h('div', { class: 'amz-st-player' }, isOpen ? [phone()] : []),
          h('div', { class: 'amz-st-car' }, [
            head(),
            h('div', { class: 'amz-st-stage' }, [
              ...list().map((st, i) => card(st, i, pickRail, pos(i))),
              h('button', { type: 'button', class: 'amz-st-arr l', 'aria-label': 'Назад', onClick: () => step(-1) }, '‹'),
              h('button', { type: 'button', class: 'amz-st-arr r', 'aria-label': 'Дальше', onClick: () => step(1) }, '›')
            ]),
            h('div', { class: 'amz-st-dots', 'aria-hidden': 'true' }, list().map((_, k) => h('i', { class: k === state.story ? 'on' : null })))
          ])
        ])
      }
      return h('section', { class: 'amz-st-strip', 'aria-label': 'Wiki Stories' }, [
        head(),
        h('div', { class: 'amz-st-row' }, list().map((st, i) => card(st, i, (k) => open(k, 'overlay')))),
        state.open && state.where === 'overlay'
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
}
