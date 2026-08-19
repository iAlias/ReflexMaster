<script setup lang="ts">
import { withBase } from 'ufo'
import { useProgressStore } from '~/stores/progress'

const store = useProgressStore()

// Declared here rather than in nuxt.config so the href honours app.baseURL: the
// site can be deployed under a sub-path (e.g. /AI/Reflex/). Declaring the icon
// also stops browsers from probing /favicon.ico, which the build does not ship.
useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: withBase('/favicon.svg', useRuntimeConfig().app.baseURL) }],
})

// Flip the shared hydration flag once the client has mounted, so persisted-state
// -driven UI can switch on from its SSG default without a hydration mismatch.
// See composables/useHydrated.ts.
const hydrated = useHydrated()
onMounted(() => {
  hydrated.value = true
})

watchEffect(() => {
  if (import.meta.client) {
    document.documentElement.dataset.brand = store.brand ?? ''
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
