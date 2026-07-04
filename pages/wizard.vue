<script setup lang="ts">
import { useProgressStore, type Brand } from '~/stores/progress'

const store = useProgressStore()
const router = useRouter()
const { $gsap } = useNuxtApp()
const step = ref<1 | 2>(1)
// Start empty so the static build (no localStorage) matches the first client
// render; a returning user's saved brand is filled in after mount, avoiding a
// hydration mismatch on the selected card. See composables/useHydrated.ts.
const choice = ref<Brand | null>(null)
onMounted(() => {
  choice.value = store.brand
})

function pick(brand: Brand) {
  choice.value = brand
}

function toSummary() {
  if (!choice.value) return
  store.setBrand(choice.value)
  step.value = 2
}

function start() {
  store.completeWizard()
  router.push('/corso')
}

function onEnter(el: Element, done: () => void) {
  if (prefersReducedMotion() || !$gsap) return done()
  $gsap.fromTo(el, { opacity: 0, x: 48 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', onComplete: done })
}
function onLeave(el: Element, done: () => void) {
  if (prefersReducedMotion() || !$gsap) return done()
  $gsap.to(el, { opacity: 0, x: -48, duration: 0.3, ease: 'power2.in', onComplete: done })
}
</script>

<template>
  <main class="wizard container">
    <Transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
      <section v-if="step === 1" key="s1" class="wizard__step">
        <h1>Che fotocamera hai?</h1>
        <p class="wizard__hint">Il corso si adatta alla tua marca: ghiere, pulsanti e menu saranno quelli della tua reflex.</p>
        <div class="wizard__cards">
          <BrandCard brand="canon" :selected="choice === 'canon'" @select="pick" />
          <BrandCard brand="nikon" :selected="choice === 'nikon'" @select="pick" />
        </div>
        <button class="btn" :disabled="!choice" @click="toSummary">Continua</button>
      </section>

      <section v-else key="s2" class="wizard__step">
        <h1>Tutto pronto!</h1>
        <p class="wizard__hint">
          Corso configurato per <strong>{{ choice === 'canon' ? 'Canon' : 'Nikon' }}</strong>:
          24 lezioni in 3 moduli, con quiz ed esercizi pratici.
          Potrai cambiare marca in ogni momento dalle impostazioni, senza perdere i progressi.
        </p>
        <div class="wizard__actions">
          <button class="btn btn--ghost" @click="step = 1">Indietro</button>
          <button class="btn" @click="start">Inizia il corso</button>
        </div>
      </section>
    </Transition>
  </main>
</template>

<style scoped>
.wizard { min-height: 100svh; display: grid; place-content: center; text-align: center; }
.wizard__step { display: grid; gap: 24px; justify-items: center; }
.wizard__hint { color: var(--text-dim); max-width: 52ch; margin: 0; }
.wizard__cards { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
.wizard__actions { display: flex; gap: 12px; }
</style>
