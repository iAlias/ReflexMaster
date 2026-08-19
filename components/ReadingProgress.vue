<script setup lang="ts">
const pct = ref(0)

function onScroll() {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  pct.value = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="read-progress" aria-hidden="true">
    <div class="read-progress__fill" :style="{ width: `${pct}%` }" />
  </div>
</template>

<style scoped>
.read-progress { position: fixed; inset: 0 0 auto 0; height: 3px; z-index: 50; background: transparent; }
.read-progress__fill { height: 100%; background: var(--brand); }
</style>
