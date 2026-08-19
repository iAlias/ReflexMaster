<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'
import { adjacentLessons } from '~/utils/lessons'

definePageMeta({ middleware: 'wizard' })

const route = useRoute()
const store = useProgressStore()
const hydrated = useHydrated()
const slug = computed(() => String(route.params.slug))

// Until the client has hydrated (and localStorage-restored the store), query the
// default brand the static build used, so the first client render matches the
// SSG markup. See composables/useHydrated.ts and the plan's "Hydration gate".
const activeBrand = computed(() => (hydrated.value ? (store.brand ?? 'canon') : 'canon'))

const { data: lesson, status } = await useAsyncData(
  () => `lesson-${activeBrand.value}-${slug.value}`,
  () => queryCollection('lessons')
    .where('brand', '=', activeBrand.value)
    .where('slug', '=', slug.value)
    .first(),
  { watch: [activeBrand, slug] },
)

const { data: all } = await useAsyncData(
  () => `lessons-${activeBrand.value}`,
  () => queryCollection('lessons').where('brand', '=', activeBrand.value).order('order', 'ASC').all(),
  { watch: [activeBrand] },
)

const adj = computed(() => adjacentLessons(all.value ?? [], slug.value))

useHead(() => ({ title: lesson.value ? `${lesson.value.title} — Reflex Master` : 'Reflex Master' }))
// ContentRenderer wraps the rendered Markdown in a single <div>, so the blocks
// to reveal are its children, one level deeper than the article itself.
useReveal('.lesson-body > * > *')
</script>

<template>
  <main class="lesson container">
    <ReadingProgress />

    <template v-if="lesson">
      <header class="lesson__head">
        <p class="lesson__kicker">Modulo {{ lesson.module }} · Lezione {{ lesson.order }}</p>
        <h1>{{ lesson.title }}</h1>
        <p class="lesson__desc">{{ lesson.description }}</p>
      </header>

      <article class="lesson-body">
        <ContentRenderer :value="lesson" />
      </article>

      <!-- Exercises read persisted per-lesson progress, so they only render once
           the store has been restored on the client (hydration gate). -->
      <section v-if="hydrated" id="esercizi" class="lesson__exercises">
        <QuizSection v-if="lesson.quiz?.length" :questions="lesson.quiz" :slug="lesson.slug" />
        <ChallengeSection v-if="lesson.challenge" :title="lesson.challenge.title" :steps="lesson.challenge.steps" :slug="lesson.slug" />
        <CompleteLessonButton :slug="lesson.slug" />
      </section>

      <LessonNavigation :prev="adj.prev" :next="adj.next" />
    </template>

    <template v-else-if="status !== 'pending'">
      <section class="lesson__missing">
        <h1>Lezione non trovata</h1>
        <p>Questa lezione non esiste per la tua marca.</p>
        <NuxtLink to="/corso" class="btn">Torna al corso</NuxtLink>
      </section>
    </template>
  </main>
</template>

<style scoped>
.lesson { padding-block: 64px; max-width: 760px; }
.lesson__kicker { color: var(--brand); font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.08em; margin: 0; }
.lesson__desc { color: var(--text-dim); font-size: 1.1rem; }
.lesson-body :deep(h2) { margin-top: 2.2em; }
.lesson-body :deep(p) { color: #d4d4d8; }
.lesson-body :deep(table) { border-collapse: collapse; width: 100%; display: block; overflow-x: auto; }
.lesson-body :deep(th), .lesson-body :deep(td) { border: 1px solid var(--border); padding: 8px 12px; text-align: left; }
.lesson__missing { text-align: center; display: grid; gap: 16px; justify-items: center; padding-block: 96px; }
</style>
