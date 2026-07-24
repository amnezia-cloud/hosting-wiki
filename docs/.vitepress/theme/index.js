import DefaultTheme from 'vitepress/theme'
import './custom.css'

// Пасхалка: наберите "meow" на любой странице — пробежит кот.
function setupCatEasterEgg() {
  if (typeof window === 'undefined') return

  const secret = 'meow'
  let buffer = ''

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return
    buffer = (buffer + e.key.toLowerCase()).slice(-secret.length)
    if (buffer === secret) {
      buffer = ''
      const cat = document.createElement('div')
      cat.className = 'amz-easter-cat'
      cat.textContent = '🐈'
      cat.setAttribute('aria-hidden', 'true')
      document.body.appendChild(cat)
      cat.addEventListener('animationend', () => cat.remove())
    }
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp() {
    setupCatEasterEgg()
  }
}
