import DefaultTheme from 'vitepress/theme'
import { withBase } from 'vitepress'
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

// Кот в футере — нажми на него.
function mountFooterCat() {
  const container = document.querySelector('.VPFooter .container')
  if (!container || container.querySelector('.amz-footer-cat')) return

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'amz-footer-cat'
  btn.setAttribute('aria-label', 'Кот')
  btn.innerHTML = `<img src="${withBase('/cat.png')}" alt="" width="44" height="44" />`
  btn.addEventListener('click', spawnCat)
  container.appendChild(btn)
}

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window === 'undefined') return

    setupCatEasterEgg()
    router.onAfterRouteChanged = () => setTimeout(mountFooterCat, 50)
    setTimeout(mountFooterCat, 50)
  }
}
