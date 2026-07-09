<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'
import { groupByModule, nextLesson, TOTAL_LESSONS } from '~/utils/lessons'

definePageMeta({ middleware: 'wizard' })

const store = useProgressStore()
const hydrated = useHydrated()

// Until the client has hydrated (and localStorage-restored the store), behave as
// the static build did: default brand (canon), zero progress. Keeps the first
// client render identical to the SSG markup (no hydration mismatch), then
// switches to the real brand/progress after mount. See composables/useHydrated.ts
// and the "Hydration gate" constraint in the plan.
const activeBrand = computed(() => (hydrated.value ? (store.brand ?? 'canon') : 'canon'))
const isDone = (slug: string) => hydrated.value && store.isLessonCompleted(slug)

const { data: lessons } = await useAsyncData(
  () => `lessons-${activeBrand.value}`,
  () => queryCollection('lessons').where('brand', '=', activeBrand.value).order('order', 'ASC').all(),
  { watch: [activeBrand] },
)

const modules = computed(() => groupByModule(lessons.value ?? []))
const next = computed(() => nextLesson(lessons.value ?? [], isDone))
const completed = computed(() => (hydrated.value ? store.completedCount : 0))
const pct = computed(() => Math.round((completed.value / TOTAL_LESSONS) * 100))

function stateOf(slug: string): 'done' | 'next' | 'todo' {
  if (isDone(slug)) return 'done'
  if (next.value?.slug === slug) return 'next'
  return 'todo'
}

function modulePct(ls: { slug: string }[]) {
  const done = ls.filter(l => isDone(l.slug)).length
  return ls.length ? Math.round((done / ls.length) * 100) : 0
}

useReveal()
</script>

<template>
  <main class="dashboard container">
    <header class="dashboard__head">
      <h1>Il tuo corso</h1>
      <p class="dashboard__meta">
        {{ completed }} / {{ TOTAL_LESSONS }} lezioni completate
        <template v-if="next"> — prossima: <NuxtLink :to="`/corso/${next.slug}`">{{ next.title }}</NuxtLink></template>
      </p>
      <ProgressBar :value="pct" label="Avanzamento corso" />
    </header>

    <section v-for="group in modules" :key="group.module" class="dashboard__module">
      <div class="dashboard__module-head">
        <h2>Modulo {{ group.module }} — {{ group.name }}</h2>
        <ProgressBar :value="modulePct(group.lessons)" :label="`Avanzamento modulo ${group.module}`" class="dashboard__module-bar" />
      </div>
      <div class="dashboard__grid">
        <LessonCard v-for="l in group.lessons" :key="l.slug" :lesson="l" :state="stateOf(l.slug)" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard { padding-block: 48px; display: grid; gap: 48px; }
.dashboard__head { display: grid; gap: 12px; }
.dashboard__meta { color: var(--text-dim); margin: 0; }
.dashboard__module { display: grid; gap: 20px; }
.dashboard__module-head { display: grid; gap: 10px; }
.dashboard__module-bar { max-width: 320px; }
.dashboard__grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
@media (max-width: 640px) { .dashboard__grid { grid-template-columns: 1fr; } }
</style>
