<script setup lang="ts">
import type { Brand } from '~/stores/progress'

const props = defineProps<{ brand: Brand; selected: boolean }>()
defineEmits<{ select: [brand: Brand] }>()

const NAMES: Record<Brand, string> = { canon: 'Canon', nikon: 'Nikon' }
const TAGLINES: Record<Brand, string> = {
  canon: 'EOS — modalità Av/Tv, ghiera principale e Quick Control',
  nikon: 'Serie D — modalità A/S, ghiere di comando anteriore e posteriore',
}

const el = ref<HTMLElement>()

function onMove(e: MouseEvent) {
  if (prefersReducedMotion() || !el.value) return
  const r = el.value.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.value.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`
}
function onLeave() {
  if (el.value) el.value.style.transform = ''
}
</script>

<template>
  <button
    ref="el"
    type="button"
    class="brand-card card"
    :class="[`brand-card--${brand}`, { 'is-selected': selected }]"
    @mousemove="onMove"
    @mouseleave="onLeave"
    @click="$emit('select', brand)"
  >
    <span class="brand-card__name">{{ NAMES[brand] }}</span>
    <span class="brand-card__tagline">{{ TAGLINES[brand] }}</span>
    <span v-if="selected" class="brand-card__check" aria-hidden="true">✓</span>
  </button>
</template>

<style scoped>
.brand-card {
  position: relative; display: grid; gap: 8px; width: min(320px, 100%);
  padding: 40px 28px; text-align: left; color: var(--text);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;
}
.brand-card--canon:hover, .brand-card--canon.is-selected { border-color: #e60012; box-shadow: 0 12px 40px rgb(230 0 18 / 0.25); }
.brand-card--nikon:hover, .brand-card--nikon.is-selected { border-color: #ffe100; box-shadow: 0 12px 40px rgb(255 225 0 / 0.18); }
.brand-card__name { font-size: 2rem; font-weight: 800; }
.brand-card__tagline { color: var(--text-dim); font-size: 0.95rem; }
.brand-card__check {
  position: absolute; top: 16px; right: 16px; width: 28px; height: 28px;
  display: grid; place-items: center; border-radius: 50%;
  background: var(--ok); color: #0a0a0b; font-weight: 800;
}
@media (hover: none) { .brand-card { transform: none !important; } }
</style>
