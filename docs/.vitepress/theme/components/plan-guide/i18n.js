// Выбор языка страницы «Какой тариф выбрать»: /en/... — английский, остальное — русский
import { computed } from 'vue'
import { useData } from 'vitepress'
import * as RU from './plans.js'
import * as EN from './plans.en.js'

export function useGuide () {
  const { lang } = useData()
  return computed(() => {
    const d = String(lang.value).startsWith('en') ? EN : RU
    return { PLANS: d.PLANS, byName: d.byName, SCENARIOS_VPN: d.SCENARIOS_VPN, SCENARIOS_OTHER: d.SCENARIOS_OTHER, PROTOCOLS: d.PROTOCOLS, COMPARE: d.COMPARE, T: d.T }
  })
}
