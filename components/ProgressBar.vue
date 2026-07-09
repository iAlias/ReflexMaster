<script setup lang="ts">
withDefaults(defineProps<{ value: number; label?: string }>(), { label: '' })
</script>

<template>
  <div class="progress" role="progressbar" :aria-valuenow="Math.round(value)" aria-valuemin="0" aria-valuemax="100" :aria-label="label || 'Avanzamento'">
    <div class="progress__fill" :style="{ width: `${value}%` }" />
  </div>
</template>

<style scoped>
.progress { height: 8px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
.progress__fill {
  height: 100%; border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--brand));
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
