<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '~/stores/progress'

const props = defineProps<{ title: string; steps: string[]; slug: string }>()
const store = useProgressStore()

const done = computed({
  get: () => store.lessonProgress(props.slug).challengeDone,
  set: v => store.markChallengeDone(props.slug, v),
})
</script>

<template>
  <section class="challenge card" aria-label="Sfida pratica">
    <p class="challenge__kicker">📷 Sfida pratica</p>
    <h2>{{ title }}</h2>
    <ol class="challenge__steps">
      <li v-for="(step, i) in steps" :key="i">{{ step }}</li>
    </ol>
    <label class="challenge__done">
      <input v-model="done" type="checkbox">
      <span>L'ho fatta con la mia fotocamera!</span>
    </label>
  </section>
</template>

<style scoped>
.challenge { display: grid; gap: 12px; border-color: var(--brand); }
.challenge__kicker { margin: 0; color: var(--brand); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; }
.challenge h2 { margin: 0; }
.challenge__steps { margin: 0; padding-left: 20px; display: grid; gap: 8px; color: #d4d4d8; }
.challenge__done { display: flex; align-items: center; gap: 10px; font-weight: 600; cursor: pointer; }
.challenge__done input { width: 20px; height: 20px; accent-color: var(--ok); }
</style>
