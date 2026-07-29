import { computed, h, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import { newsEn, newsRu } from './newsItems.js'

const STRINGS = {
  ru: {
    prev: 'Предыдущие новости',
    next: 'Следующие новости',
    more: 'Подробнее',
    emptyTitle: 'Пока новостей нет',
    emptyText:
      'Здесь будут появляться анонсы, изменения в тарифах и важные объявления по Amnezia Premium.'
  },
  en: {
    prev: 'Previous news',
    next: 'Next news',
    more: 'Read more',
    emptyTitle: 'No news yet',
    emptyText:
      'Announcements, plan changes, and important notices about Amnezia Premium will appear here.'
  }
}

// Лента новостей: карточки листаются кнопками, колесом, свайпом и клавиатурой.
export default {
  name: 'AmzNewsCarousel',
  setup() {
    const { lang } = useData()
    const isEn = computed(() => !!lang.value && lang.value.startsWith('en'))
    const items = computed(() => (isEn.value ? newsEn : newsRu))
    const t = computed(() => (isEn.value ? STRINGS.en : STRINGS.ru))

    const track = ref(null)
    const atStart = ref(true)
    const atEnd = ref(true)

    const measure = () => {
      const el = track.value
      if (!el) return
      // Запас в 2px — субпиксельные значения scrollLeft иначе не дают
      // кнопкам погаснуть в самом конце ленты.
      atStart.value = el.scrollLeft <= 2
      atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
    }

    const step = (direction) => {
      const el = track.value
      if (!el) return
      const card = el.querySelector('.amz-news__card')
      const distance = card
        ? card.getBoundingClientRect().width + 16
        : el.clientWidth * 0.8
      const reduceMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollBy({
        left: direction * distance,
        behavior: reduceMotion ? 'auto' : 'smooth'
      })
    }

    const onKeydown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }

    onMounted(async () => {
      await nextTick()
      measure()
      window.addEventListener('resize', measure)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', measure)
    })

    const renderCard = (item, index) =>
      h('article', { class: 'amz-news__card', key: `${item.date}-${index}` }, [
        h('div', { class: 'amz-news__meta' }, [
          item.tag ? h('span', { class: 'amz-news__tag' }, item.tag) : null,
          item.date ? h('span', { class: 'amz-news__date' }, item.date) : null
        ]),
        h('h3', { class: 'amz-news__title' }, item.title),
        item.text ? h('p', { class: 'amz-news__text' }, item.text) : null,
        item.link
          ? h(
              'a',
              { class: 'amz-news__link', href: item.link },
              `${item.linkText || t.value.more} →`
            )
          : null
      ])

    return () => {
      if (!items.value.length) {
        return h('div', { class: 'amz-news amz-news--empty' }, [
          h('div', { class: 'amz-news__empty-icon', 'aria-hidden': 'true' }, '📭'),
          h('p', { class: 'amz-news__empty-title' }, t.value.emptyTitle),
          h('p', { class: 'amz-news__empty-text' }, t.value.emptyText)
        ])
      }

      return h('div', { class: 'amz-news' }, [
        h('div', { class: 'amz-news__controls' }, [
          h(
            'button',
            {
              class: 'amz-news__nav',
              type: 'button',
              disabled: atStart.value,
              'aria-label': t.value.prev,
              onClick: () => step(-1)
            },
            '←'
          ),
          h(
            'button',
            {
              class: 'amz-news__nav',
              type: 'button',
              disabled: atEnd.value,
              'aria-label': t.value.next,
              onClick: () => step(1)
            },
            '→'
          )
        ]),
        h(
          'div',
          {
            class: 'amz-news__track',
            ref: track,
            tabindex: '0',
            role: 'list',
            onScroll: measure,
            onKeydown
          },
          items.value.map(renderCard)
        )
      ])
    }
  }
}
