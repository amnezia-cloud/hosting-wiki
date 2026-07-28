import { h, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// Полоса внизу экрана: показывает, какая часть страницы прочитана.
export default {
  name: 'AmzReadingProgress',
  setup() {
    const { frontmatter } = useData()
    const route = useRoute()
    const progress = ref(0)
    let frame = 0

    const measure = () => {
      frame = 0
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      progress.value =
        scrollable > 0 ? Math.min(1, Math.max(0, el.scrollTop / scrollable)) : 0
    }

    // Скролл летит десятками событий в секунду — считаем раз в кадр.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    onMounted(() => {
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
      // Пока грузятся скриншоты, высота страницы ещё меняется — иначе полоса
      // показывала бы прогресс от неверной высоты.
      window.addEventListener('load', schedule)
      measure()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('load', schedule)
      if (frame) cancelAnimationFrame(frame)
    })

    // После перехода на другую страницу высота меняется — пересчитываем,
    // когда новая разметка уже отрисована.
    watch(
      () => route.path,
      () => setTimeout(measure, 60)
    )

    return () => {
      if (frontmatter.value.layout === 'home') return null

      return h('div', { class: 'amz-reading-progress', 'aria-hidden': 'true' }, [
        h('div', {
          class: 'amz-reading-progress__bar',
          style: { transform: `scaleX(${progress.value})` }
        })
      ])
    }
  }
}
