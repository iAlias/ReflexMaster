<script setup lang="ts">
import type gsap from 'gsap'

withDefaults(defineProps<{ size?: number }>(), { size: 160 })
const root = ref<SVGSVGElement>()

onMounted(() => {
  const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }
  if (prefersReducedMotion() || !$gsap || !root.value) return
  const tl = $gsap.timeline()
  tl.from(root.value.querySelector('.aperture__blades'), {
    rotation: -90, transformOrigin: '50% 50%', duration: 1.4, ease: 'power3.out',
  }, 0)
  tl.from(root.value.querySelector('.aperture__iris'), {
    scale: 0, transformOrigin: '50% 50%', duration: 1.4, ease: 'power3.out',
  }, 0)
})
</script>

<template>
  <svg ref="root" :width="size" :height="size" viewBox="0 0 200 200" aria-hidden="true" class="aperture">
    <circle cx="100" cy="100" r="96" class="aperture__ring" />
    <g class="aperture__blades">
      <path
        v-for="i in 6" :key="i"
        :transform="`rotate(${i * 60} 100 100)`"
        d="M100 100 L100 10 A90 90 0 0 1 177.9 55 Z"
        class="aperture__blade"
      />
    </g>
    <circle cx="100" cy="100" r="34" class="aperture__iris" />
  </svg>
</template>

<style scoped>
.aperture__ring { fill: none; stroke: var(--border); stroke-width: 3; }
.aperture__blade { fill: var(--surface-2); stroke: var(--bg); stroke-width: 2; }
.aperture__iris { fill: var(--accent); }
</style>
