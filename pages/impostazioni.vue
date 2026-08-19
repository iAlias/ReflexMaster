<script setup lang="ts">
import { useProgressStore, type Brand } from '~/stores/progress'
import { TOTAL_LESSONS } from '~/utils/lessons'

definePageMeta({ middleware: 'wizard' })

const store = useProgressStore()
const hydrated = useHydrated()
const confirmingReset = ref(false)

// Brand and progress come from localStorage, so they may only drive the markup
// once the client has hydrated. See composables/useHydrated.ts.
const activeBrand = computed(() => (hydrated.value ? store.brand : null))
const completed = computed(() => (hydrated.value ? store.completedCount : 0))

function switchBrand(brand: Brand) {
  store.setBrand(brand)
}

function reset() {
  store.resetAll()
  navigateTo('/wizard')
}
</script>

<template>
  <main class="settings container">
    <h1>Impostazioni</h1>

    <section class="settings__section">
      <h2>La tua fotocamera</h2>
      <p class="settings__hint">
        Cambia marca in ogni momento: il progresso di ciascuna marca resta salvato
        ({{ completed }}/{{ TOTAL_LESSONS }} lezioni completate con la marca attuale).
      </p>
      <div class="settings__cards">
        <BrandCard brand="canon" :selected="activeBrand === 'canon'" @select="switchBrand" />
        <BrandCard brand="nikon" :selected="activeBrand === 'nikon'" @select="switchBrand" />
      </div>
    </section>

    <section class="settings__section settings__danger">
      <h2>Zona pericolosa</h2>
      <p class="settings__hint">Azzera tutto: marca scelta e progressi di entrambe le marche. Irreversibile.</p>
      <button v-if="!confirmingReset" class="btn btn--ghost" @click="confirmingReset = true">
        Azzera tutti i progressi…
      </button>
      <div v-else class="settings__confirm">
        <span>Sicuro? Perderai tutto il progresso.</span>
        <button class="btn settings__confirm-yes" @click="reset">Sì, azzera</button>
        <button class="btn btn--ghost" @click="confirmingReset = false">Annulla</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.settings { padding-block: 48px; display: grid; gap: 40px; max-width: 760px; }
.settings__section { display: grid; gap: 16px; }
.settings__hint { color: var(--text-dim); margin: 0; }
.settings__cards { display: flex; gap: 20px; flex-wrap: wrap; }
.settings__danger h2 { color: var(--err); }
.settings__confirm { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.settings__confirm-yes { background: var(--err); color: #fff; }
</style>
