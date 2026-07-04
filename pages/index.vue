<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'

const store = useProgressStore()
const title = 'Reflex Master'
const chars = title.split('')

// Gate the persisted-state-driven CTA behind hydration: the static build renders
// the default ("Inizia ora" -> /wizard); after mount it reflects real progress.
// See composables/useHydrated.ts.
const hydrated = useHydrated()
const resumeCourse = computed(() => hydrated.value && store.wizardCompleted)

onMounted(() => {
  const { $gsap } = useNuxtApp()
  if (prefersReducedMotion() || !$gsap) return
  $gsap.from('.hero__char', {
    yPercent: 120, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.04, delay: 0.2,
  })
  $gsap.from('.hero__sub, .hero__cta', {
    opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.15, delay: 0.9,
  })
})
</script>

<template>
  <main class="hero">
    <ApertureMark :size="180" class="hero__mark" />
    <h1 class="hero__title" aria-label="Reflex Master">
      <span
        v-for="(c, i) in chars" :key="i"
        class="hero__char" aria-hidden="true"
      >{{ c === ' ' ? ' ' : c }}</span>
    </h1>
    <p class="hero__sub">
      Il corso interattivo che ti porta da zero a fotografo.
      Impara a dominare la tua reflex, lezione dopo lezione.
    </p>
    <NuxtLink :to="resumeCourse ? '/corso' : '/wizard'" class="btn hero__cta">
      {{ resumeCourse ? 'Riprendi il corso' : 'Inizia ora' }}
    </NuxtLink>
  </main>
</template>

<style scoped>
.hero {
  min-height: 100svh; display: grid; place-content: center; justify-items: center;
  gap: 24px; text-align: center; padding: 24px;
}
.hero__title { margin: 0; overflow: hidden; }
.hero__char { display: inline-block; }
.hero__sub { max-width: 46ch; color: var(--text-dim); font-size: 1.15rem; margin: 0; }
</style>
