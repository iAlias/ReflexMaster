<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'
import { TOTAL_LESSONS } from '~/utils/lessons'

const store = useProgressStore()
const hydrated = useHydrated()
const open = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { open.value = false })

// Progress comes from localStorage: keep it hidden (and at 0) until the client
// has hydrated, so the first client render matches the static markup.
// See composables/useHydrated.ts.
const showProgress = computed(() => hydrated.value && store.wizardCompleted)
const pct = computed(() => (hydrated.value ? Math.round((store.completedCount / TOTAL_LESSONS) * 100) : 0))
</script>

<template>
  <header class="header">
    <div class="header__inner container">
      <NuxtLink to="/" class="header__logo" aria-label="Reflex Master — home">
        <ApertureMark :size="28" />
        <span>Reflex Master</span>
      </NuxtLink>

      <button
        class="header__burger"
        :aria-expanded="open"
        aria-label="Apri menu"
        @click="open = !open"
      >
        <span /><span /><span />
      </button>

      <nav class="header__nav" :class="{ 'is-open': open }" aria-label="Principale">
        <NuxtLink to="/corso">Il corso</NuxtLink>
        <NuxtLink to="/impostazioni">Impostazioni</NuxtLink>
        <div v-if="showProgress" class="header__progress">
          <ProgressBar :value="pct" label="Avanzamento corso" />
          <span class="header__pct">{{ pct }}%</span>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 40;
  background: rgb(10 10 11 / 0.85); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.header__inner { display: flex; align-items: center; gap: 24px; padding-block: 12px; }
.header__logo { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--text); text-decoration: none; }
.header__nav { display: flex; align-items: center; gap: 20px; margin-left: auto; }
.header__nav a { color: var(--text-dim); text-decoration: none; font-weight: 600; }
.header__nav a:hover, .header__nav a.router-link-active { color: var(--text); }
.header__progress { display: flex; align-items: center; gap: 8px; width: 140px; }
.header__progress .progress { flex: 1; }
.header__pct { font-size: 0.8rem; color: var(--text-dim); }
.header__burger { display: none; }

@media (max-width: 720px) {
  .header__burger {
    display: grid; gap: 4px; margin-left: auto;
    background: none; border: 0; padding: 8px;
  }
  .header__burger span { width: 22px; height: 2px; background: var(--text); border-radius: 2px; }
  .header__nav {
    display: none; position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; align-items: stretch; padding: 16px 20px;
    background: var(--surface); border-bottom: 1px solid var(--border);
  }
  .header__nav.is-open { display: flex; }
  .header__progress { width: 100%; }
}
</style>
