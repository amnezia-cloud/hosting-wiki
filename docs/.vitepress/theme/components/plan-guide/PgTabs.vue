<script setup>
// Ряд вкладок второго уровня: «Для себя / Семья / ...», «Start / Basic / ...»
defineProps({ labels: { type: Array, required: true } })
const model = defineModel({ type: Number, default: 0 })
</script>

<template>
  <div class="pg-tabrow" role="tablist">
    <button
      v-for="(l, i) in labels"
      :key="l"
      type="button"
      role="tab"
      :aria-selected="model === i"
      :class="{ on: model === i }"
      @click="model = i"
    >{{ l }}</button>
  </div>
</template>
