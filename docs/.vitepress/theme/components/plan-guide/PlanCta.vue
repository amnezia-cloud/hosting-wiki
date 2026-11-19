<script setup>
// Блок «Не знаете, какой тариф выбрать?» — открывает вкладку подбора и прокручивает к ней
import { nextTick } from 'vue'
import { activeTab, scrollToTabs } from './plans.js'
import { useGuide } from './i18n.js'
import './plan-guide.css'

const G = useGuide()

function open () {
  activeTab.value = 'calc'
  history.replaceState(history.state, '', '#calc')
  nextTick(scrollToTabs)
}
</script>

<template>
  <div class="pg-cta">
    <div class="pg-cta-txt">
      <p class="pg-cta-h">{{ G.T.cta.h }}</p>
      <p>{{ G.T.cta.p }}</p>
    </div>
    <button type="button" class="pg-btn" @click="open">{{ G.T.tabs.calc }}</button>
  </div>
</template>
