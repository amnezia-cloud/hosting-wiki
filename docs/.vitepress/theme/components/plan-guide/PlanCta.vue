<script setup>
// Блок «Не знаете, какой тариф выбрать?» — открывает вкладку подбора и прокручивает к ней
import { nextTick } from 'vue'
import { activeTab, scrollToTabs } from './plans.js'
import './plan-guide.css'

function open () {
  activeTab.value = 'calc'
  history.replaceState(history.state, '', '#calc')
  nextTick(scrollToTabs)
}
</script>

<template>
  <div class="pg-cta">
    <div class="pg-cta-txt">
      <p class="pg-cta-h">Не знаете, какой тариф выбрать?</p>
      <p>Ответьте на пару простых вопросов, и мы подскажем оптимальный выбор.</p>
    </div>
    <button type="button" class="pg-btn" @click="open">Подобрать тариф</button>
  </div>
</template>
