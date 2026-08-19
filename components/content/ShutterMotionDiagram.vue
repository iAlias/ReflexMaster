<script setup lang="ts">
const speeds = ['1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15', '1/8']
const idx = ref(2)
const speed = computed(() => speeds[idx.value])
const blur = computed(() => idx.value * 1.6)
const caption = computed(() => {
  if (idx.value <= 2) return `${speed.value}s: il movimento è congelato — adatto a sport e soggetti veloci.`
  if (idx.value <= 4) return `${speed.value}s: soggetti lenti ok, ma i movimenti rapidi iniziano a strisciare.`
  return `${speed.value}s: mosso evidente — a mano libera serve stabilizzazione o treppiede.`
})
</script>

<template>
  <figure class="shutter card">
    <svg viewBox="0 0 320 140" role="img" :aria-label="`Effetto del tempo di scatto ${speed} sul movimento`">
      <line x1="10" y1="120" x2="310" y2="120" class="shutter__ground" />
      <g :style="{ filter: `blur(${blur}px)` }">
        <circle cx="160" cy="60" r="14" class="shutter__head" />
        <line x1="160" y1="74" x2="160" y2="105" class="shutter__body" />
        <line x1="160" y1="85" x2="140" y2="70" class="shutter__limb" />
        <line x1="160" y1="85" x2="182" y2="72" class="shutter__limb" />
        <line x1="160" y1="105" x2="143" y2="120" class="shutter__limb" />
        <line x1="160" y1="105" x2="178" y2="120" class="shutter__limb" />
      </g>
      <text x="160" y="24" text-anchor="middle" class="shutter__label">{{ speed }}s</text>
    </svg>
    <input v-model.number="idx" type="range" min="0" :max="speeds.length - 1" step="1" aria-label="Regola il tempo di scatto">
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.shutter { display: grid; gap: 14px; justify-items: center; margin-block: 32px; padding: 28px; }
.shutter svg { width: min(320px, 80vw); }
.shutter__ground { stroke: var(--border); stroke-width: 2; }
.shutter__head { fill: var(--brand); }
.shutter__body, .shutter__limb { stroke: var(--brand); stroke-width: 5; stroke-linecap: round; }
.shutter__label { fill: var(--text); font-weight: 800; font-size: 18px; }
.shutter input { width: min(280px, 80%); accent-color: var(--brand); }
figcaption { color: var(--text-dim); font-size: 0.9rem; text-align: center; }
</style>
