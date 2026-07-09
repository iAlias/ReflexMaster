<script setup lang="ts">
import type { LessonMeta } from '~/utils/lessons'

defineProps<{ lesson: LessonMeta; state: 'done' | 'next' | 'todo' }>()
</script>

<template>
  <NuxtLink :to="`/corso/${lesson.slug}`" class="lesson-card card" :class="`is-${state}`" data-reveal>
    <span class="lesson-card__order">{{ String(lesson.order).padStart(2, '0') }}</span>
    <span class="lesson-card__body">
      <span class="lesson-card__title">{{ lesson.title }}</span>
      <span class="lesson-card__desc">{{ lesson.description }}</span>
    </span>
    <span class="lesson-card__state" aria-hidden="true">
      <template v-if="state === 'done'">✓</template>
      <template v-else-if="state === 'next'">▶</template>
    </span>
    <span class="sr-only">
      {{ state === 'done' ? 'Lezione completata' : state === 'next' ? 'Prossima lezione' : 'Da fare' }}
    </span>
  </NuxtLink>
</template>

<style scoped>
.lesson-card {
  display: flex; align-items: center; gap: 16px; text-decoration: none; color: var(--text);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.lesson-card:hover { transform: translateY(-3px); border-color: var(--brand); }
.lesson-card__order { font-size: 1.4rem; font-weight: 800; color: var(--text-dim); }
.lesson-card__body { display: grid; gap: 2px; }
.lesson-card__title { font-weight: 700; }
.lesson-card__desc { color: var(--text-dim); font-size: 0.9rem; }
.lesson-card__state { margin-left: auto; font-size: 1.1rem; color: var(--ok); }
.is-next { border-color: var(--brand); }
.is-next .lesson-card__state { color: var(--brand); }
.is-done { opacity: 0.75; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
</style>
