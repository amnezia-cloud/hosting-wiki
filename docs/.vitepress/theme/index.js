import DefaultTheme from 'vitepress/theme'
import './custom.css'

function spawnCat() {
  const cat = document.createElement('div')
  cat.className = 'amz-easter-cat'
  cat.textContent = '🐈'
  cat.setAttribute('aria-hidden', 'true')
  document.body.appendChild(cat)
  cat.addEventListener('animationend', () => cat.remove())
}

// Пасхалка: наберите "meow" на любой странице — пробежит кот.
function setupCatEasterEgg() {
  const secret = 'meow'
  let buffer = ''

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return
    buffer = (buffer + e.key.toLowerCase()).slice(-secret.length)
    if (buffer === secret) {
      buffer = ''
      spawnCat()
    }
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window === 'undefined') return

    setupCatEasterEgg()

    // Кот заглядывает сам, когда открываешь главную страницу.
    router.onAfterRouteChanged = (to) => {
      if (to === '/' || to === '/en/') {
        setTimeout(spawnCat, 900)
      }
    }
  }
}
