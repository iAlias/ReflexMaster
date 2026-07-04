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
  <!--
    width/height are set via :style (patchStyle) and the blade rotations are
    static attributes on purpose: binding width/height/transform on SVG elements
    makes Vue 3.5 re-patch them as DOM properties during hydration, which throws
    "Cannot set property … which has only a getter" because SVGAnimatedLength /
    SVGAnimatedTransformList are read-only. viewBox handles the scaling, so the
    render is identical.
  -->
  <svg
    ref="root"
    :style="{ width: `${size}px`, height: `${size}px` }"
    viewBox="0 0 200 200"
    aria-hidden="true"
    class="aperture"
  >
    <circle cx="100" cy="100" r="96" class="aperture__ring" />
    <g class="aperture__blades">
      <path transform="rotate(60 100 100)" d="M100 100 L100 10 A90 90 0 0 1 177.9 55 Z" class="aperture__blade" />
      <path transform="rotate(120 100 100)" d="M100 100 L100 10 A90 90 0 0 1 177.9 55 Z" class="aperture__blade" />
      <path transform="rotate(180 100 100)" d="M100 100 L100 10 A90 90 0 0 1 177.9 55 Z" class="aperture__blade" />
      <path transform="rotate(240 100 100)" d="M100 100 L100 10 A90 90 0 0 1 177.9 55 Z" class="aperture__blade" />
      <path transform="rotate(300 100 100)" d="M100 100 L100 10 A90 90 0 0 1 177.9 55 Z" class="aperture__blade" />
      <path transform="rotate(360 100 100)" d="M100 100 L100 10 A90 90 0 0 1 177.9 55 Z" class="aperture__blade" />
    </g>
    <circle cx="100" cy="100" r="34" class="aperture__iris" />
  </svg>
</template>

<style scoped>
.aperture__ring { fill: none; stroke: var(--border); stroke-width: 3; }
.aperture__blade { fill: var(--surface-2); stroke: var(--bg); stroke-width: 2; }
.aperture__iris { fill: var(--accent); }
</style>
