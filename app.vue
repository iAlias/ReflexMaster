<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'

const store = useProgressStore()

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
