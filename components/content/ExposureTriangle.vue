<script setup lang="ts">
import { prefersReducedMotion } from '~/composables/useMotion'

const root = ref<HTMLElement>()
const { $gsap } = useNuxtApp()

onMounted(() => {
  if (prefersReducedMotion() || !$gsap || !root.value) return
  const path = root.value.querySelector('.triangle__path') as SVGPathElement
  const len = path.getTotalLength()
  $gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
  $gsap.to(path, {
    strokeDashoffset: 0, duration: 1.6, ease: 'power2.out',
    scrollTrigger: { trigger: root.value, start: 'top 80%' },
  })
  $gsap.from(root.value.querySelectorAll('.triangle__label'), {
    opacity: 0, scale: 0.6, duration: 0.5, stagger: 0.2, delay: 0.6, ease: 'back.out(2)',
    scrollTrigger: { trigger: root.value, start: 'top 80%' },
  })
})
</script>

<template>
  <figure ref="root" class="triangle card">
    <svg viewBox="0 0 320 280" role="img" aria-label="Il triangolo dell'esposizione: apertura, tempo di scatto e ISO">
      <path class="triangle__path" d="M160 30 L295 245 L25 245 Z" />
      <text class="triangle__label" x="160" y="20" text-anchor="middle">APERTURA</text>
      <text class="triangle__label" x="295" y="268" text-anchor="middle">TEMPO</text>
      <text class="triangle__label" x="25" y="268" text-anchor="middle">ISO</text>
      <text class="triangle__center" x="160" y="185" text-anchor="middle">ESPOSIZIONE</text>
    </svg>
    <figcaption>Ogni lato influenza gli altri: cambia uno dei tre parametri e dovrai compensare con gli altri due.</figcaption>
  </figure>
</template>

<style scoped>
.triangle { display: grid; gap: 12px; justify-items: center; margin-block: 32px; padding: 28px; }
.triangle svg { width: min(320px, 75vw); overflow: visible; }
.triangle__path { fill: none; stroke: var(--brand); stroke-width: 3; stroke-linejoin: round; }
.triangle__label { fill: var(--text); font-weight: 800; font-size: 15px; }
.triangle__center { fill: var(--text-dim); font-size: 12px; letter-spacing: 0.15em; }
figcaption { color: var(--text-dim); font-size: 0.9rem; text-align: center; }
</style>
