<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)
</script>

<template>
  <main class="err">
    <ApertureMark :size="120" />
    <h1>{{ is404 ? 'Fuori fuoco!' : 'Qualcosa è andato storto' }}</h1>
    <p class="err__msg">
      {{ is404 ? 'La pagina che cerchi non esiste o è stata spostata.' : 'Si è verificato un errore inatteso.' }}
    </p>
    <button class="btn" @click="clearError({ redirect: '/' })">Torna alla home</button>
  </main>
</template>

<style scoped>
.err { min-height: 100svh; display: grid; place-content: center; justify-items: center; gap: 20px; text-align: center; padding: 24px; }
.err__msg { color: var(--text-dim); margin: 0; }
</style>
