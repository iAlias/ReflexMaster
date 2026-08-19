<script setup lang="ts">
import type { LessonMeta } from '~/utils/lessons'

defineProps<{ prev: LessonMeta | null; next: LessonMeta | null }>()
</script>

<template>
  <nav class="lesson-nav" aria-label="Navigazione lezioni">
    <NuxtLink v-if="prev" :to="`/corso/${prev.slug}`" class="lesson-nav__link card">
      <span class="lesson-nav__dir">← Precedente</span>
      <span>{{ prev.title }}</span>
    </NuxtLink>
    <span v-else />
    <NuxtLink v-if="next" :to="`/corso/${next.slug}`" class="lesson-nav__link card lesson-nav__link--next">
      <span class="lesson-nav__dir">Successiva →</span>
      <span>{{ next.title }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.lesson-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-block: 48px; }
.lesson-nav__link { display: grid; gap: 4px; text-decoration: none; color: var(--text); }
.lesson-nav__link:hover { border-color: var(--brand); }
.lesson-nav__link--next { text-align: right; }
.lesson-nav__dir { color: var(--text-dim); font-size: 0.85rem; }
@media (max-width: 560px) { .lesson-nav { grid-template-columns: 1fr; } }
</style>
