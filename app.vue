<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'

const store = useProgressStore()
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
