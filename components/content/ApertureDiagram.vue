<script setup lang="ts">
const stops = [1.8, 2.8, 4, 5.6, 8, 11, 16]
const IRIS_BASE = 34
const idx = ref(2)
const f = computed(() => stops[idx.value])
const r = computed(() => 12 + 80 / f.value)
const caption = computed(() => {
  if (f.value <= 2.8) return 'Apertura ampia: tanta luce, sfondo molto sfocato (PDC minima).'
  if (f.value <= 5.6) return 'Apertura media: buon compromesso tra luce e profondità di campo.'
  if (f.value <= 11) return 'Apertura chiusa: quasi tutto a fuoco, serve più luce o ISO più alti.'
  return 'Molto chiusa: massima profondità di campo, attenzione alla diffrazione.'
})
</script>

<template>
  <figure class="diagram card">
    <!--
      Deliberate deviation from the plan's markup: binding SVG geometry props
      (`y1`, `r`, `transform`) makes Vue patch them as read-only DOM properties
      ("Cannot set property r of #<SVGCircleElement>"), the same failure fixed in
      ApertureMark (commit efb5209). The blades are therefore static lines drawn
      to the centre — the iris circle is painted on top and hides their inner
      ends — and the iris is resized with a CSS transform (patchStyle path), so
      the rendering is identical and the slider stays fully interactive.
    -->
    <svg viewBox="0 0 200 200" role="img" :aria-label="`Diaframma impostato a f/${f}`">
      <circle cx="100" cy="100" r="90" class="diagram__ring" />
      <g class="diagram__blades">
        <line transform="rotate(45 100 100)" x1="100" y1="100" x2="100" y2="12" class="diagram__blade" />
        <line transform="rotate(90 100 100)" x1="100" y1="100" x2="100" y2="12" class="diagram__blade" />
        <line transform="rotate(135 100 100)" x1="100" y1="100" x2="100" y2="12" class="diagram__blade" />
        <line transform="rotate(180 100 100)" x1="100" y1="100" x2="100" y2="12" class="diagram__blade" />
        <line transform="rotate(225 100 100)" x1="100" y1="100" x2="100" y2="12" class="diagram__blade" />
        <line transform="rotate(270 100 100)" x1="100" y1="100" x2="100" y2="12" class="diagram__blade" />
        <line transform="rotate(315 100 100)" x1="100" y1="100" x2="100" y2="12" class="diagram__blade" />
        <line transform="rotate(360 100 100)" x1="100" y1="100" x2="100" y2="12" class="diagram__blade" />
      </g>
      <circle
        cx="100" cy="100" :r="IRIS_BASE" class="diagram__iris"
        :style="{ transform: `scale(${(r / IRIS_BASE).toFixed(3)})` }"
      />
      <text x="100" y="106" text-anchor="middle" class="diagram__label">f/{{ f }}</text>
    </svg>
    <input v-model.number="idx" type="range" min="0" :max="stops.length - 1" step="1" aria-label="Regola l'apertura del diaframma">
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.diagram { display: grid; gap: 14px; justify-items: center; margin-block: 32px; padding: 28px; }
.diagram svg { width: 100%; max-width: 240px; }
.diagram__ring { fill: var(--surface-2); stroke: var(--border); stroke-width: 3; }
.diagram__blade { stroke: var(--bg); stroke-width: 3; }
.diagram__iris {
  fill: #fef3c7; opacity: 0.92;
  transform-origin: 100px 100px;
  transition: transform 0.25s ease;
}
.diagram__label { font-weight: 800; font-size: 20px; fill: #0a0a0b; }
.diagram input { width: 100%; max-width: 280px; accent-color: var(--brand); }
figcaption { color: var(--text-dim); font-size: 0.9rem; text-align: center; }
@media (max-width: 480px) { .diagram { padding: 20px 12px; } }
</style>
