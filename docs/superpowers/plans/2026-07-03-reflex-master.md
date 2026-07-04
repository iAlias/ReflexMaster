# Reflex Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "Reflex Master", an Italian-language interactive web course (Nuxt 3 SSG) that teaches DSLR photography to professional level, with brand-specific content paths (Canon/Nikon), quizzes, practical challenges, localStorage progress, and GSAP-driven animations.

**Architecture:** Nuxt 3 static site (SSG). Lessons are Markdown files under `content/canon/` and `content/nikon/` managed by Nuxt Content v3 (quiz/challenge data in front-matter). Progress lives in a Pinia store persisted to localStorage. GSAP + ScrollTrigger drive reveals/transitions; interactive SVG diagram components are embedded in Markdown via MDC syntax.

**Tech Stack:** Nuxt 3, @nuxt/content v3, Pinia + pinia-plugin-persistedstate, GSAP + ScrollTrigger, plain CSS with custom properties, Vitest + @vue/test-utils + happy-dom.

**Spec:** `docs/superpowers/specs/2026-07-03-reflex-master-design.md` — read it before starting any task.

## Global Constraints

- All UI copy and lesson content in **Italian only**.
- Brands are exactly the strings `'canon'` and `'nikon'` everywhere (types, folders, front-matter, CSS attributes).
- 24 lessons per brand (48 lesson files total), 3 modules: 1 = "Fondamenta tecniche" (lessons 1–11), 2 = "Composizione, luce e visione" (12–16), 3 = "Generi, contesti e trick da pro" (17–24).
- Lesson body: 800–1500 words, professional-level content, always concrete numeric settings, recurring sections "Errori comuni" and "Pro tip".
- Quiz: 3–5 questions per lesson, exactly 4 options each, `correctIndex` 0-based, each with `explanation`.
- Persistence: localStorage only (no cookies, no backend). Progress is stored **per brand**; switching brand never deletes progress.
- **Hydration gate (SSG safety):** the site is statically generated with the store in its default state (the build has no localStorage), and `pinia-plugin-persistedstate` restores real state on the client during hydration. Therefore **any markup that renders from persisted state (`brand`, `wizardCompleted`, per-lesson progress) MUST be gated behind `useHydrated()`** (`composables/useHydrated.ts`): render the default view while it is `false`, the personalised view once it flips `true` after mount. Reading persisted fields directly at first render causes hydration mismatches (added after Task 5's review found this). The route-guard `middleware/wizard.ts` is exempt (it reads the restored store to redirect and renders nothing). Never initialise a `ref` from a persisted field at setup — set it in `onMounted` instead (see `pages/wizard.vue`'s `choice`).
- Dark theme by default. Base accent amber `#f59e0b`; brand accent applied via `:root[data-brand]`: Canon `#e60012`, Nikon `#ffe100`.
- Every animation must degrade to simple fades (or nothing) under `prefers-reduced-motion: reduce`.
- Images: only free-license sources (Wikimedia Commons, Unsplash, Pexels), downloaded into `public/images/`, attributed in `CREDITS.md`. Never hotlink. If no free image exists, use an SVG illustration instead. All `<img>`: `loading="lazy"` + explicit width/height.
- Mobile-first responsive. No CSS framework.
- Git identity is already configured repo-locally (distefanino / ialias@live.it). Commit after every task.
- **Node >=22.5.0 required** (enforced via `package.json` `engines` + `.npmrc` `engine-strict=true`). @nuxt/content is configured with `content.experimental.sqliteConnector: 'native'` in `nuxt.config.ts`, using Node's built-in `node:sqlite` module instead of the optional native `better-sqlite3` binding — this avoids the native-module install/build entirely, but requires Node 22.5+ (where `node:sqlite` exists). This supersedes the original "Node 20+ required" constraint after Task 1's review found that a lower floor caused @nuxt/content to fall back to an interactive/auto-install path for `better-sqlite3` that crashed non-interactively and could silently rewrite the lockfile.

## File Structure

```
package.json, nuxt.config.ts, content.config.ts, vitest.config.ts, .gitignore
app.vue                          # shell: layout + brand data-attribute watcher
error.vue                        # themed 404/error page
assets/css/main.css              # design tokens, base styles, utilities, transitions
content/canon/NN-slug.md         # 24 lessons
content/nikon/NN-slug.md         # 24 lessons
stores/progress.ts               # brand, wizardCompleted, per-brand progress
utils/lessons.ts                 # pure helpers: sort, group by module, next/adjacent
composables/useMotion.ts         # prefers-reduced-motion + scroll reveal helper
plugins/gsap.client.ts           # GSAP + ScrollTrigger registration
plugins/persistedstate.client.ts # pinia persistence -> localStorage, safe deserialize
middleware/wizard.ts             # redirect to /wizard when brand not chosen
layouts/default.vue              # header + page wrapper
pages/index.vue                  # animated landing hero
pages/wizard.vue                 # brand selection wizard
pages/corso/index.vue            # course dashboard
pages/corso/[slug].vue           # lesson page
pages/impostazioni.vue           # settings: switch brand, reset progress
components/AppHeader.vue         # nav + hamburger + global progress
components/ApertureMark.vue      # animated aperture-blades SVG logo
components/BrandCard.vue         # wizard card with CSS tilt
components/LessonCard.vue        # dashboard card
components/ProgressBar.vue       # animated progress bar
components/QuizSection.vue       # multiple-choice quiz with feedback
components/ChallengeSection.vue  # practical challenge + checkbox
components/CompleteLessonButton.vue
components/LessonNavigation.vue  # prev/next links
components/ReadingProgress.vue   # top scroll-progress bar
components/content/LessonImage.vue        # MDC: image with fallback + credit
components/content/ApertureDiagram.vue    # MDC: interactive aperture slider
components/content/ExposureTriangle.vue   # MDC: animated exposure triangle
components/content/ShutterMotionDiagram.vue # MDC: shutter speed / motion blur
public/images/{canon,nikon,common}/       # downloaded photos (webp)
tests/unit/progress.spec.ts
tests/unit/lessons-utils.spec.ts
tests/component/QuizSection.spec.ts
CREDITS.md                       # image attributions
```

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `.gitignore`, `nuxt.config.ts`, `vitest.config.ts`, `app.vue`, `assets/css/main.css`, `pages/index.vue` (placeholder)

**Interfaces:**
- Produces: npm scripts `dev`/`build`/`generate`/`test`; CSS custom properties consumed by every later task (`--bg`, `--surface`, `--surface-2`, `--text`, `--text-dim`, `--accent`, `--brand`, `--ok`, `--err`, `--radius`); utility classes `.container`, `.btn`, `.card`.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "reflex-master",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "test": "vitest run",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "@nuxt/content": "^3.6.0",
    "@pinia/nuxt": "^0.11.0",
    "gsap": "^3.13.0",
    "nuxt": "^3.17.0",
    "pinia": "^3.0.0",
    "pinia-plugin-persistedstate": "^4.3.0",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "@vue/test-utils": "^2.4.6",
    "happy-dom": "^17.0.0",
    "vitest": "^3.1.0"
  }
}
```

- [ ] **Step 2: Write `.gitignore`**

```
node_modules
.nuxt
.output
dist
.data
*.log
```

- [ ] **Step 3: Write `nuxt.config.ts`**

```ts
export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  modules: ['@nuxt/content', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Reflex Master — Impara la fotografia reflex',
      htmlAttrs: { lang: 'it' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Il corso interattivo che ti porta da zero a fotografo: impara a usare la tua reflex Canon o Nikon come un professionista.' },
      ],
    },
  },
})
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: { environment: 'happy-dom' },
  resolve: { alias: { '~': fileURLToPath(new URL('.', import.meta.url)) } },
})
```

- [ ] **Step 5: Write `app.vue`**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 6: Write `assets/css/main.css`**

```css
/* ===== Design tokens ===== */
:root {
  --bg: #0a0a0b;
  --surface: #141416;
  --surface-2: #1d1d21;
  --border: #2a2a30;
  --text: #f4f4f5;
  --text-dim: #a1a1aa;
  --accent: #f59e0b;
  --brand: var(--accent);
  --ok: #22c55e;
  --err: #ef4444;
  --radius: 14px;
  --font: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color-scheme: dark;
}
:root[data-brand='canon'] { --brand: #e60012; }
:root[data-brand='nikon'] { --brand: #ffe100; }

/* ===== Reset / base ===== */
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; display: block; }
h1, h2, h3 { line-height: 1.15; letter-spacing: -0.02em; }
h1 { font-size: clamp(2.2rem, 6vw, 4rem); }
h2 { font-size: clamp(1.5rem, 4vw, 2.2rem); }
a { color: var(--accent); }
button { font: inherit; cursor: pointer; }

/* ===== Utilities ===== */
.container { max-width: 1080px; margin-inline: auto; padding-inline: 20px; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent); color: #0a0a0b; border: 0;
  padding: 12px 24px; border-radius: 999px; font-weight: 700;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgb(245 158 11 / 0.35); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
.btn--ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 20px;
}

/* ===== Page transitions ===== */
.page-enter-active, .page-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }

/* ===== Reduced motion ===== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 7: Write placeholder `pages/index.vue`** (replaced in Task 4)

```vue
<template>
  <main class="container">
    <h1>Reflex Master</h1>
  </main>
</template>
```

- [ ] **Step 8: Install and verify dev server**

Run: `npm install`
Then: `npm run dev` — expect Nuxt to start on `http://localhost:3000` with the placeholder heading, no console errors. Stop the server.
(If better-sqlite3 fails to compile: upgrade to Node 22 LTS, delete `node_modules`, reinstall.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Nuxt 3 project with content, pinia, gsap, vitest"
```

---

### Task 2: Progress store (TDD)

**Files:**
- Create: `stores/progress.ts`, `plugins/persistedstate.client.ts`
- Test: `tests/unit/progress.spec.ts`

**Interfaces:**
- Produces (consumed by wizard, dashboard, lesson, quiz, settings tasks):
  - `type Brand = 'canon' | 'nikon'`
  - `interface LessonProgress { quizPassed: boolean; challengeDone: boolean; completedAt: string | null }`
  - `useProgressStore()` with state `{ brand: Brand | null, wizardCompleted: boolean, progress: Record<Brand, Record<string, LessonProgress>> }`
  - getters: `lessonProgress(slug): LessonProgress`, `isLessonCompleted(slug): boolean`, `completedCount: number`
  - actions: `setBrand(brand)`, `completeWizard()`, `markQuizPassed(slug)`, `markChallengeDone(slug, done = true)`, `completeLesson(slug): boolean`, `resetAll()`

- [ ] **Step 1: Write the failing tests — `tests/unit/progress.spec.ts`**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProgressStore } from '~/stores/progress'

describe('progress store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('starts with no brand and wizard not completed', () => {
    const s = useProgressStore()
    expect(s.brand).toBeNull()
    expect(s.wizardCompleted).toBe(false)
    expect(s.completedCount).toBe(0)
  })

  it('setBrand + completeWizard', () => {
    const s = useProgressStore()
    s.setBrand('canon')
    s.completeWizard()
    expect(s.brand).toBe('canon')
    expect(s.wizardCompleted).toBe(true)
  })

  it('lessonProgress returns empty progress for unknown slug', () => {
    const s = useProgressStore()
    s.setBrand('canon')
    expect(s.lessonProgress('x')).toEqual({ quizPassed: false, challengeDone: false, completedAt: null })
  })

  it('completeLesson refuses until quiz passed AND challenge done', () => {
    const s = useProgressStore()
    s.setBrand('canon')
    expect(s.completeLesson('apertura')).toBe(false)
    s.markQuizPassed('apertura')
    expect(s.completeLesson('apertura')).toBe(false)
    s.markChallengeDone('apertura')
    expect(s.completeLesson('apertura')).toBe(true)
    expect(s.isLessonCompleted('apertura')).toBe(true)
    expect(s.completedCount).toBe(1)
  })

  it('progress is isolated per brand and survives brand switch', () => {
    const s = useProgressStore()
    s.setBrand('canon')
    s.markQuizPassed('apertura')
    s.markChallengeDone('apertura')
    s.completeLesson('apertura')
    s.setBrand('nikon')
    expect(s.completedCount).toBe(0)
    expect(s.isLessonCompleted('apertura')).toBe(false)
    s.setBrand('canon')
    expect(s.completedCount).toBe(1)
  })

  it('resetAll returns to initial state', () => {
    const s = useProgressStore()
    s.setBrand('nikon')
    s.markQuizPassed('macro')
    s.resetAll()
    expect(s.brand).toBeNull()
    expect(s.progress).toEqual({ canon: {}, nikon: {} })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/unit/progress.spec.ts`
Expected: FAIL — cannot resolve `~/stores/progress`.

- [ ] **Step 3: Write `stores/progress.ts`**

```ts
import { defineStore } from 'pinia'

export type Brand = 'canon' | 'nikon'

export interface LessonProgress {
  quizPassed: boolean
  challengeDone: boolean
  completedAt: string | null
}

interface State {
  brand: Brand | null
  wizardCompleted: boolean
  progress: Record<Brand, Record<string, LessonProgress>>
}

const emptyLesson = (): LessonProgress => ({ quizPassed: false, challengeDone: false, completedAt: null })

export const useProgressStore = defineStore('progress', {
  state: (): State => ({
    brand: null,
    wizardCompleted: false,
    progress: { canon: {}, nikon: {} },
  }),
  getters: {
    lessonProgress(state) {
      return (slug: string): LessonProgress =>
        (state.brand && state.progress[state.brand][slug]) || emptyLesson()
    },
    isLessonCompleted(): (slug: string) => boolean {
      return slug => this.lessonProgress(slug).completedAt !== null
    },
    completedCount(state): number {
      if (!state.brand) return 0
      return Object.values(state.progress[state.brand]).filter(p => p.completedAt !== null).length
    },
  },
  actions: {
    ensure(slug: string): LessonProgress {
      if (!this.brand) throw new Error('Nessuna marca selezionata')
      if (!this.progress[this.brand][slug]) this.progress[this.brand][slug] = emptyLesson()
      return this.progress[this.brand][slug]
    },
    setBrand(brand: Brand) { this.brand = brand },
    completeWizard() { this.wizardCompleted = true },
    markQuizPassed(slug: string) { this.ensure(slug).quizPassed = true },
    markChallengeDone(slug: string, done = true) { this.ensure(slug).challengeDone = done },
    completeLesson(slug: string): boolean {
      const p = this.ensure(slug)
      if (!p.quizPassed || !p.challengeDone) return false
      p.completedAt = new Date().toISOString()
      return true
    },
    resetAll() { this.$reset() },
  },
  persist: true,
})
```

(`persist: true` is inert under plain Pinia in unit tests; it is activated by the Nuxt plugin below.)

- [ ] **Step 4: Write `plugins/persistedstate.client.ts`** (localStorage + corrupted-data safety)

```ts
import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  ;(nuxtApp.$pinia as Pinia).use(createPersistedState({
    storage: localStorage,
    serializer: {
      serialize: JSON.stringify,
      deserialize: (value: string) => {
        try { return JSON.parse(value) } catch { return {} }
      },
    },
  }))
})
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/unit/progress.spec.ts`
Expected: 6 passed.

- [ ] **Step 6: Commit**

```bash
git add stores plugins tests
git commit -m "feat: progress store with per-brand localStorage persistence"
```

---

### Task 3: Content pipeline + lesson 01 (both brands, fully authored)

**Files:**
- Create: `content.config.ts`, `utils/lessons.ts`, `components/content/LessonImage.vue`, `content/canon/01-anatomia-della-reflex.md`, `content/nikon/01-anatomia-della-reflex.md`
- Test: `tests/unit/lessons-utils.spec.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces:
  - Content collection `lessons` queried as `queryCollection('lessons').where('brand', '=', brand).order('order', 'ASC').all()`; single lesson: `.where('brand', '=', brand).where('slug', '=', slug).first()`. Items expose front-matter fields plus `path` and rendered `body` (render with `<ContentRenderer :value="lesson" />`).
  - `utils/lessons.ts` exports: `interface LessonMeta { slug: string; title: string; description: string; order: number; module: number; path: string }`, `MODULES: Record<number, string>`, `TOTAL_LESSONS = 24`, `sortLessons(lessons)`, `groupByModule(lessons)` → `{ module, name, lessons }[]`, `nextLesson(lessons, isCompleted)` → first non-completed or null, `adjacentLessons(lessons, slug)` → `{ prev, next }`.
  - MDC component usable in every lesson: `::lesson-image{src="..." alt="..." credit="..." width="1200" height="800"}` `::`

- [ ] **Step 1: Write `content.config.ts`**

```ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    lessons: defineCollection({
      type: 'page',
      source: '{canon,nikon}/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        slug: z.string(),
        order: z.number().int().min(1).max(24),
        module: z.number().int().min(1).max(3),
        brand: z.enum(['canon', 'nikon']),
        quiz: z.array(z.object({
          question: z.string(),
          options: z.array(z.string()).length(4),
          correctIndex: z.number().int().min(0).max(3),
          explanation: z.string(),
        })).min(3).max(5),
        challenge: z.object({
          title: z.string(),
          steps: z.array(z.string()).min(3),
        }),
      }),
    }),
  },
})
```

- [ ] **Step 2: Write the failing tests — `tests/unit/lessons-utils.spec.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { adjacentLessons, groupByModule, nextLesson, sortLessons } from '~/utils/lessons'

const L = (slug: string, order: number, module: number) =>
  ({ slug, order, module, title: slug, description: '', path: `/canon/${slug}` })

const lessons = [L('c', 3, 2), L('a', 1, 1), L('b', 2, 1)]

describe('lessons utils', () => {
  it('sortLessons orders by order without mutating input', () => {
    const input = [...lessons]
    expect(sortLessons(input).map(l => l.slug)).toEqual(['a', 'b', 'c'])
    expect(input).toEqual(lessons)
  })

  it('groupByModule groups sorted lessons with module names', () => {
    const groups = groupByModule(lessons)
    expect(groups.map(g => g.module)).toEqual([1, 2])
    expect(groups[0].lessons.map(l => l.slug)).toEqual(['a', 'b'])
    expect(groups[0].name).toBe('Fondamenta tecniche')
  })

  it('nextLesson returns first non-completed lesson in order', () => {
    expect(nextLesson(lessons, s => s === 'a')?.slug).toBe('b')
    expect(nextLesson(lessons, () => true)).toBeNull()
  })

  it('adjacentLessons returns prev/next by order', () => {
    expect(adjacentLessons(lessons, 'b')).toMatchObject({ prev: { slug: 'a' }, next: { slug: 'c' } })
    expect(adjacentLessons(lessons, 'a').prev).toBeNull()
    expect(adjacentLessons(lessons, 'c').next).toBeNull()
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/unit/lessons-utils.spec.ts`
Expected: FAIL — cannot resolve `~/utils/lessons`.

- [ ] **Step 4: Write `utils/lessons.ts`**

```ts
export interface LessonMeta {
  slug: string
  title: string
  description: string
  order: number
  module: number
  path: string
}

export const MODULES: Record<number, string> = {
  1: 'Fondamenta tecniche',
  2: 'Composizione, luce e visione',
  3: 'Generi, contesti e trick da pro',
}

export const TOTAL_LESSONS = 24

export function sortLessons<T extends { order: number }>(lessons: T[]): T[] {
  return [...lessons].sort((a, b) => a.order - b.order)
}

export function groupByModule<T extends LessonMeta>(lessons: T[]) {
  const sorted = sortLessons(lessons)
  const map = new Map<number, T[]>()
  for (const l of sorted) {
    if (!map.has(l.module)) map.set(l.module, [])
    map.get(l.module)!.push(l)
  }
  return [...map.entries()].map(([module, ls]) => ({
    module,
    name: MODULES[module] ?? `Modulo ${module}`,
    lessons: ls,
  }))
}

export function nextLesson<T extends LessonMeta>(lessons: T[], isCompleted: (slug: string) => boolean): T | null {
  return sortLessons(lessons).find(l => !isCompleted(l.slug)) ?? null
}

export function adjacentLessons<T extends LessonMeta>(lessons: T[], slug: string) {
  const sorted = sortLessons(lessons)
  const i = sorted.findIndex(l => l.slug === slug)
  return {
    prev: i > 0 ? sorted[i - 1] : null,
    next: i >= 0 && i < sorted.length - 1 ? sorted[i + 1] : null,
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/unit/lessons-utils.spec.ts`
Expected: 4 passed.

- [ ] **Step 6: Write `components/content/LessonImage.vue`**

(Components in `components/content/` are auto-registered globally by Nuxt for MDC use. If a lesson renders `<!-- unknown component -->` instead, add `components: { dirs: [{ path: '~/components/content', global: true }] }` to `nuxt.config.ts`.)

```vue
<script setup lang="ts">
defineProps<{
  src: string
  alt: string
  credit?: string
  width?: number | string
  height?: number | string
}>()
const failed = ref(false)
</script>

<template>
  <figure class="lesson-image">
    <img
      v-if="!failed"
      :src="src"
      :alt="alt"
      loading="lazy"
      :width="width ?? 1200"
      :height="height ?? 800"
      @error="failed = true"
    >
    <div v-else class="lesson-image__fallback" role="img" :aria-label="alt">
      <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
        <path d="M4 7h3l2-2h6l2 2h3v12H4z" fill="none" stroke="currentColor" stroke-width="1.5" />
        <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
      <span>{{ alt }}</span>
    </div>
    <figcaption v-if="credit">{{ credit }}</figcaption>
  </figure>
</template>

<style scoped>
.lesson-image { margin: 32px 0; }
.lesson-image img { border-radius: var(--radius); }
.lesson-image__fallback {
  display: grid; place-items: center; gap: 8px; padding: 48px 24px;
  background: var(--surface-2); border: 1px dashed var(--border);
  border-radius: var(--radius); color: var(--text-dim); text-align: center;
}
figcaption { font-size: 0.8rem; color: var(--text-dim); margin-top: 8px; }
</style>
```

- [ ] **Step 7: Author lesson 01 for BOTH brands — complete, final content**

These are real deliverables, not samples: full 800–1500-word Italian lessons following the spec's quality standard. Structure for `content/canon/01-anatomia-della-reflex.md` (the Nikon file mirrors it with Nikon terminology, dials, menu names and model examples — D3500/D5600 instead of EOS 2000D/850D):

```markdown
---
title: "Anatomia della reflex"
description: "Impara a riconoscere ogni ghiera, pulsante e componente della tua Canon."
slug: anatomia-della-reflex
order: 1
module: 1
brand: canon
quiz:
  - question: "A cosa serve la ghiera principale (Main Dial) vicino al pulsante di scatto?"
    options:
      - "Ad accendere la fotocamera"
      - "A regolare il parametro principale della modalità attiva (es. tempo in Tv, apertura in Av)"
      - "A cambiare obiettivo"
      - "A rivedere le foto scattate"
    correctIndex: 1
    explanation: "La ghiera principale controlla il parametro chiave della modalità: il tempo in Tv, l'apertura in Av."
  - question: "Cosa vedi guardando nel mirino ottico di una reflex?"
    options:
      - "Un'anteprima digitale elaborata dal sensore"
      - "La scena riflessa dallo specchio attraverso il pentaprisma"
      - "L'ultima foto scattata"
      - "Solo i punti di messa a fuoco, senza immagine"
    correctIndex: 1
    explanation: "Nel mirino ottico la luce passa dall'obiettivo, viene riflessa dallo specchio e raddrizzata dal pentaprisma: vedi la scena reale, non un'anteprima digitale."
  - question: "Sulla ghiera dei modi di una Canon, cosa indica la posizione «Av»?"
    options:
      - "Modalità automatica avanzata"
      - "Priorità di apertura: tu scegli il diaframma, la fotocamera il tempo"
      - "Modalità video"
      - "Autoscatto"
    correctIndex: 1
    explanation: "Av = Aperture value: imposti tu l'apertura e la fotocamera calcola il tempo di scatto corretto."
challenge:
  title: "Esplora la tua Canon a occhi chiusi"
  steps:
    - "Prendi la tua Canon e individua senza guardare: pulsante di scatto, ghiera principale, ghiera dei modi."
    - "Ruota la ghiera dei modi su P, Av, Tv e M e osserva sul display quali parametri puoi controllare in ciascuna modalità."
    - "Individua il pulsante Q (Quick Control) e naviga il menu rapido cambiando un'impostazione qualsiasi."
    - "Smonta e rimonta l'obiettivo: allinea il punto bianco/rosso, ruota fino al clic. Fallo 3 volte finché diventa naturale."
---

[Corpo della lezione: 800–1500 parole in italiano, livello professionale.
Sezioni obbligatorie, in quest'ordine, come heading H2:
"Il corpo macchina", "L'obiettivo", "Il mirino e lo specchio",
"Ghiere e pulsanti essenziali" (nomi ESATTI Canon: ghiera principale,
ghiera controllo rapido, ghiera dei modi, pulsante Q, pulsante ISO,
AF-ON dove presente), "Il display e il menu", "Errori comuni", "Pro tip".
Dentro "Il corpo macchina" e "Ghiere e pulsanti essenziali" inserire
::lesson-image con foto reali (src verso /images/canon/... che verranno
scaricate nel Task 17 — l'immagine mostra intanto il fallback SVG).]
```

Author both files completely now (prose included). Word count check: `(Get-Content content/canon/01-anatomia-della-reflex.md -Raw).Split() | Measure-Object` → 800–1500 words of body.

- [ ] **Step 8: Verify the content pipeline**

Run: `npm run dev` and open `http://localhost:3000/_studio` — not needed; instead verify via a temporary check: create `pages/debug.vue`:

```vue
<script setup lang="ts">
const { data } = await useAsyncData('dbg', () => queryCollection('lessons').all())
</script>
<template><pre>{{ data?.map(l => `${l.brand}/${l.slug} #${l.order}`) }}</pre></template>
```

Open `http://localhost:3000/debug` — expect `canon/anatomia-della-reflex #1` and `nikon/anatomia-della-reflex #1`. Delete `pages/debug.vue` afterwards.

- [ ] **Step 9: Commit**

```bash
git add content.config.ts utils components/content content tests
git commit -m "feat: content collection, lesson utils, LessonImage, lesson 01 canon+nikon"
```

---

### Task 4: GSAP plugin, motion composable, animated landing page

**Files:**
- Create: `plugins/gsap.client.ts`, `composables/useMotion.ts`, `components/ApertureMark.vue`
- Modify: `pages/index.vue` (replace placeholder)

**Interfaces:**
- Consumes: `useProgressStore` (Task 2).
- Produces (used by dashboard/lesson/wizard tasks):
  - `useNuxtApp().$gsap` (GSAP instance with ScrollTrigger registered, client only)
  - `prefersReducedMotion(): boolean` — exported from `composables/useMotion.ts`
  - `useReveal(selector?: string)` — call in a page/component `setup()`; on mount animates every matching element (default `[data-reveal]`) with fade-up on scroll; no-ops under reduced motion or on server
  - `<ApertureMark :size="number" />` — animated aperture SVG that opens on mount

- [ ] **Step 1: Write `plugins/gsap.client.ts`**

```ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)
  return { provide: { gsap } }
})
```

- [ ] **Step 2: Write `composables/useMotion.ts`**

```ts
import type gsap from 'gsap'

export function prefersReducedMotion(): boolean {
  if (import.meta.server) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useReveal(selector = '[data-reveal]') {
  const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }
  onMounted(() => {
    if (prefersReducedMotion() || !$gsap) return
    $gsap.utils.toArray<HTMLElement>(selector).forEach((el, i) => {
      $gsap.from(el, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        delay: (i % 4) * 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })
  })
}
```

- [ ] **Step 3: Write `components/ApertureMark.vue`**

```vue
<script setup lang="ts">
import type gsap from 'gsap'

withDefaults(defineProps<{ size?: number }>(), { size: 160 })
const root = ref<SVGSVGElement>()

onMounted(() => {
  const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }
  if (prefersReducedMotion() || !$gsap || !root.value) return
  const tl = $gsap.timeline()
  tl.from(root.value.querySelector('.aperture__blades'), {
    rotation: -90, transformOrigin: '50% 50%', duration: 1.4, ease: 'power3.out',
  }, 0)
  tl.from(root.value.querySelector('.aperture__iris'), {
    scale: 0, transformOrigin: '50% 50%', duration: 1.4, ease: 'power3.out',
  }, 0)
})
</script>

<template>
  <svg ref="root" :width="size" :height="size" viewBox="0 0 200 200" aria-hidden="true" class="aperture">
    <circle cx="100" cy="100" r="96" class="aperture__ring" />
    <g class="aperture__blades">
      <path
        v-for="i in 6" :key="i"
        :transform="`rotate(${i * 60} 100 100)`"
        d="M100 100 L100 10 A90 90 0 0 1 177.9 55 Z"
        class="aperture__blade"
      />
    </g>
    <circle cx="100" cy="100" r="34" class="aperture__iris" />
  </svg>
</template>

<style scoped>
.aperture__ring { fill: none; stroke: var(--border); stroke-width: 3; }
.aperture__blade { fill: var(--surface-2); stroke: var(--bg); stroke-width: 2; }
.aperture__iris { fill: var(--accent); }
</style>
```

- [ ] **Step 4: Replace `pages/index.vue` with the animated hero**

```vue
<script setup lang="ts">
import type gsap from 'gsap'
import { useProgressStore } from '~/stores/progress'

const store = useProgressStore()
const title = 'Reflex Master'
const chars = title.split('')

onMounted(() => {
  const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }
  if (prefersReducedMotion() || !$gsap) return
  $gsap.from('.hero__char', {
    yPercent: 120, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.04, delay: 0.2,
  })
  $gsap.from('.hero__sub, .hero__cta', {
    opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.15, delay: 0.9,
  })
})
</script>

<template>
  <main class="hero">
    <ApertureMark :size="180" class="hero__mark" />
    <h1 class="hero__title" aria-label="Reflex Master">
      <span
        v-for="(c, i) in chars" :key="i"
        class="hero__char" aria-hidden="true"
      >{{ c === ' ' ? ' ' : c }}</span>
    </h1>
    <p class="hero__sub">
      Il corso interattivo che ti porta da zero a fotografo.
      Impara a dominare la tua reflex, lezione dopo lezione.
    </p>
    <NuxtLink :to="store.wizardCompleted ? '/corso' : '/wizard'" class="btn hero__cta">
      {{ store.wizardCompleted ? 'Riprendi il corso' : 'Inizia ora' }}
    </NuxtLink>
  </main>
</template>

<style scoped>
.hero {
  min-height: 100svh; display: grid; place-content: center; justify-items: center;
  gap: 24px; text-align: center; padding: 24px;
}
.hero__title { margin: 0; overflow: hidden; }
.hero__char { display: inline-block; }
.hero__sub { max-width: 46ch; color: var(--text-dim); font-size: 1.15rem; margin: 0; }
</style>
```

- [ ] **Step 5: Verify manually**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: aperture blades rotate open, title characters slide up, subtitle/CTA fade in. CTA reads "Inizia ora" and links to `/wizard`. With DevTools → Rendering → "Emulate prefers-reduced-motion", everything is instantly visible.

- [ ] **Step 6: Commit**

```bash
git add plugins composables components pages
git commit -m "feat: gsap setup, motion composable, animated landing hero"
```

---

### Task 5: Wizard, brand theming, route guard

**Files:**
- Create: `pages/wizard.vue`, `components/BrandCard.vue`, `middleware/wizard.ts`
- Modify: `app.vue` (brand data-attribute watcher)

**Interfaces:**
- Consumes: `useProgressStore` (`setBrand`, `completeWizard`, `brand`, `wizardCompleted`), `$gsap`, `prefersReducedMotion`.
- Produces:
  - `middleware/wizard.ts` — named route middleware `wizard`; course pages opt in with `definePageMeta({ middleware: 'wizard' })`; redirects to `/wizard` when `!store.wizardCompleted || !store.brand` (client-side only).
  - Brand theming: `app.vue` mirrors `store.brand` to `document.documentElement.dataset.brand`, activating `--brand` per the CSS in Task 1.
  - `<BrandCard brand="canon|nikon" :selected="boolean" @select="...">` — tilt card.

- [ ] **Step 1: Write `middleware/wizard.ts`**

```ts
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return
  const store = useProgressStore()
  if (!store.wizardCompleted || !store.brand) return navigateTo('/wizard')
})
```

(`useProgressStore` is auto-imported from `stores/` by `@pinia/nuxt`; if not, add the explicit import.)

- [ ] **Step 2: Update `app.vue`**

```vue
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
```

- [ ] **Step 3: Write `components/BrandCard.vue`**

```vue
<script setup lang="ts">
import type { Brand } from '~/stores/progress'

const props = defineProps<{ brand: Brand; selected: boolean }>()
defineEmits<{ select: [brand: Brand] }>()

const NAMES: Record<Brand, string> = { canon: 'Canon', nikon: 'Nikon' }
const TAGLINES: Record<Brand, string> = {
  canon: 'EOS — modalità Av/Tv, ghiera principale e Quick Control',
  nikon: 'Serie D — modalità A/S, ghiere di comando anteriore e posteriore',
}

const el = ref<HTMLElement>()

function onMove(e: MouseEvent) {
  if (prefersReducedMotion() || !el.value) return
  const r = el.value.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.value.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`
}
function onLeave() {
  if (el.value) el.value.style.transform = ''
}
</script>

<template>
  <button
    ref="el"
    type="button"
    class="brand-card card"
    :class="[`brand-card--${brand}`, { 'is-selected': selected }]"
    @mousemove="onMove"
    @mouseleave="onLeave"
    @click="$emit('select', brand)"
  >
    <span class="brand-card__name">{{ NAMES[brand] }}</span>
    <span class="brand-card__tagline">{{ TAGLINES[brand] }}</span>
    <span v-if="selected" class="brand-card__check" aria-hidden="true">✓</span>
  </button>
</template>

<style scoped>
.brand-card {
  position: relative; display: grid; gap: 8px; width: min(320px, 100%);
  padding: 40px 28px; text-align: left; color: var(--text);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;
}
.brand-card--canon:hover, .brand-card--canon.is-selected { border-color: #e60012; box-shadow: 0 12px 40px rgb(230 0 18 / 0.25); }
.brand-card--nikon:hover, .brand-card--nikon.is-selected { border-color: #ffe100; box-shadow: 0 12px 40px rgb(255 225 0 / 0.18); }
.brand-card__name { font-size: 2rem; font-weight: 800; }
.brand-card__tagline { color: var(--text-dim); font-size: 0.95rem; }
.brand-card__check {
  position: absolute; top: 16px; right: 16px; width: 28px; height: 28px;
  display: grid; place-items: center; border-radius: 50%;
  background: var(--ok); color: #0a0a0b; font-weight: 800;
}
@media (hover: none) { .brand-card { transform: none !important; } }
</style>
```

- [ ] **Step 4: Write `pages/wizard.vue`**

Two steps with GSAP-animated transitions: step 1 = brand choice, step 2 = summary + start.

```vue
<script setup lang="ts">
import type gsap from 'gsap'
import { useProgressStore, type Brand } from '~/stores/progress'

const store = useProgressStore()
const router = useRouter()
const step = ref<1 | 2>(1)
const choice = ref<Brand | null>(store.brand)

function g() {
  return (useNuxtApp() as unknown as { $gsap: typeof gsap }).$gsap
}

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
  if (prefersReducedMotion()) return done()
  g().fromTo(el, { opacity: 0, x: 48 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', onComplete: done })
}
function onLeave(el: Element, done: () => void) {
  if (prefersReducedMotion()) return done()
  g().to(el, { opacity: 0, x: -48, duration: 0.3, ease: 'power2.in', onComplete: done })
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
```

- [ ] **Step 5: Verify manually**

Run: `npm run dev`.
- `http://localhost:3000/wizard`: pick Canon → check appears, "Continua" enables → summary slides in → "Inizia il corso" → lands on `/corso` (404 for now — dashboard comes in Task 6; the redirect happening is what matters).
- Reload any page: `localStorage` key `progress` exists; `<html data-brand="canon">`; CTA hover now uses Canon red.

- [ ] **Step 6: Commit**

```bash
git add app.vue pages middleware components
git commit -m "feat: onboarding wizard with brand theming and route guard"
```

---

### Task 6: Course dashboard

**Files:**
- Create: `pages/corso/index.vue`, `components/LessonCard.vue`, `components/ProgressBar.vue`

**Interfaces:**
- Consumes: `queryCollection('lessons')`, `groupByModule` / `nextLesson` / `TOTAL_LESSONS` (Task 3), `useProgressStore`, `useReveal` (Task 4), middleware `wizard` (Task 5).
- Produces: route `/corso`; `<ProgressBar :value="0..100" label="..." />` (reused by header in Task 11); `<LessonCard :lesson :state="'done'|'next'|'todo'" />` linking to `/corso/<slug>`.

- [ ] **Step 1: Write `components/ProgressBar.vue`**

```vue
<script setup lang="ts">
withDefaults(defineProps<{ value: number; label?: string }>(), { label: '' })
</script>

<template>
  <div class="progress" role="progressbar" :aria-valuenow="Math.round(value)" aria-valuemin="0" aria-valuemax="100" :aria-label="label || 'Avanzamento'">
    <div class="progress__fill" :style="{ width: `${value}%` }" />
  </div>
</template>

<style scoped>
.progress { height: 8px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
.progress__fill {
  height: 100%; border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--brand));
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
```

- [ ] **Step 2: Write `components/LessonCard.vue`**

```vue
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
```

- [ ] **Step 3: Write `pages/corso/index.vue`**

```vue
<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'
import { groupByModule, nextLesson, TOTAL_LESSONS } from '~/utils/lessons'

definePageMeta({ middleware: 'wizard' })

const store = useProgressStore()
const { data: lessons } = await useAsyncData(
  () => `lessons-${store.brand ?? 'none'}`,
  () => queryCollection('lessons').where('brand', '=', store.brand ?? 'canon').order('order', 'ASC').all(),
  { watch: [() => store.brand] },
)

const modules = computed(() => groupByModule(lessons.value ?? []))
const next = computed(() => nextLesson(lessons.value ?? [], s => store.isLessonCompleted(s)))
const pct = computed(() => Math.round((store.completedCount / TOTAL_LESSONS) * 100))

function stateOf(slug: string): 'done' | 'next' | 'todo' {
  if (store.isLessonCompleted(slug)) return 'done'
  if (next.value?.slug === slug) return 'next'
  return 'todo'
}

function modulePct(ls: { slug: string }[]) {
  const done = ls.filter(l => store.isLessonCompleted(l.slug)).length
  return ls.length ? Math.round((done / ls.length) * 100) : 0
}

useReveal()
</script>

<template>
  <main class="dashboard container">
    <header class="dashboard__head">
      <h1>Il tuo corso</h1>
      <p class="dashboard__meta">
        {{ store.completedCount }} / {{ TOTAL_LESSONS }} lezioni completate
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
```

- [ ] **Step 4: Verify manually**

Run: `npm run dev`, complete the wizard, land on `/corso`.
Expected: module 1 shows lesson 01 card marked "next" (▶, brand border); progress bars at 0%; cards reveal on scroll. Clear localStorage → visiting `/corso` redirects to `/wizard`.

- [ ] **Step 5: Commit**

```bash
git add pages components
git commit -m "feat: course dashboard with module grouping and progress"
```

---

### Task 7: Lesson page

**Files:**
- Create: `pages/corso/[slug].vue`, `components/ReadingProgress.vue`, `components/LessonNavigation.vue`

**Interfaces:**
- Consumes: `queryCollection('lessons')`, `adjacentLessons` (Task 3), middleware `wizard`, `useReveal`, `useProgressStore`.
- Produces: route `/corso/<slug>` rendering lesson body via `<ContentRenderer>`. Exposes a `<section id="esercizi">` placeholder where Task 8 mounts quiz/challenge (Task 8 modifies this file).

- [ ] **Step 1: Write `components/ReadingProgress.vue`**

```vue
<script setup lang="ts">
const pct = ref(0)

function onScroll() {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  pct.value = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="read-progress" aria-hidden="true">
    <div class="read-progress__fill" :style="{ width: `${pct}%` }" />
  </div>
</template>

<style scoped>
.read-progress { position: fixed; inset: 0 0 auto 0; height: 3px; z-index: 50; background: transparent; }
.read-progress__fill { height: 100%; background: var(--brand); }
</style>
```

- [ ] **Step 2: Write `components/LessonNavigation.vue`**

```vue
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
```

- [ ] **Step 3: Write `pages/corso/[slug].vue`**

```vue
<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'
import { adjacentLessons } from '~/utils/lessons'

definePageMeta({ middleware: 'wizard' })

const route = useRoute()
const store = useProgressStore()
const slug = computed(() => String(route.params.slug))

const { data: lesson, status } = await useAsyncData(
  () => `lesson-${store.brand ?? 'none'}-${slug.value}`,
  () => queryCollection('lessons')
    .where('brand', '=', store.brand ?? 'canon')
    .where('slug', '=', slug.value)
    .first(),
  { watch: [() => store.brand, slug] },
)

const { data: all } = await useAsyncData(
  () => `lessons-${store.brand ?? 'none'}`,
  () => queryCollection('lessons').where('brand', '=', store.brand ?? 'canon').order('order', 'ASC').all(),
  { watch: [() => store.brand] },
)

const adj = computed(() => adjacentLessons(all.value ?? [], slug.value))

useHead(() => ({ title: lesson.value ? `${lesson.value.title} — Reflex Master` : 'Reflex Master' }))
useReveal('.lesson-body > *')
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

      <section id="esercizi" class="lesson__exercises">
        <!-- Task 8 mounts QuizSection / ChallengeSection / CompleteLessonButton here -->
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
```

- [ ] **Step 4: Verify manually**

Run: `npm run dev`, from `/corso` click lesson 01.
Expected: `/corso/anatomia-della-reflex` renders title, kicker, prose with scroll reveals, reading bar fills while scrolling, `::lesson-image` blocks show the SVG fallback (photos arrive in Task 17), prev/next absent (only 1 lesson per brand so far). Visiting `/corso/finta-lezione` shows "Lezione non trovata".

- [ ] **Step 5: Commit**

```bash
git add pages components
git commit -m "feat: lesson page with reading progress and prev/next navigation"
```

---

### Task 8: Quiz, challenge and lesson completion (TDD)

**Files:**
- Create: `components/QuizSection.vue`, `components/ChallengeSection.vue`, `components/CompleteLessonButton.vue`
- Modify: `pages/corso/[slug].vue` (fill the `#esercizi` section)
- Test: `tests/component/QuizSection.spec.ts`

**Interfaces:**
- Consumes: `useProgressStore` (`markQuizPassed`, `markChallengeDone`, `completeLesson`, `lessonProgress`), lesson front-matter `quiz` and `challenge` shapes (Task 3 schema).
- Produces:
  - `<QuizSection :questions="QuizQuestion[]" :slug="string" />` where `QuizQuestion = { question: string; options: string[]; correctIndex: number; explanation: string }`; calls `store.markQuizPassed(slug)` when every question is solved.
  - `<ChallengeSection :title="string" :steps="string[]" :slug="string" />` — checkbox "L'ho fatta!" wired to `store.markChallengeDone(slug, checked)`.
  - `<CompleteLessonButton :slug="string" />` — disabled until `quizPassed && challengeDone`; on click calls `store.completeLesson(slug)` and plays a celebration pulse.

- [ ] **Step 1: Write the failing component test — `tests/component/QuizSection.spec.ts`**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import QuizSection from '~/components/QuizSection.vue'
import { useProgressStore } from '~/stores/progress'

const questions = [
  { question: 'Q1?', options: ['a', 'b', 'c', 'd'], correctIndex: 1, explanation: 'Perché sì.' },
  { question: 'Q2?', options: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: 'Ecco perché.' },
]

function factory() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useProgressStore()
  store.setBrand('canon')
  const wrapper = mount(QuizSection, {
    props: { questions, slug: 'test-lezione' },
    global: { plugins: [pinia] },
  })
  return { wrapper, store }
}

describe('QuizSection', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('shows one block per question with 4 options', () => {
    const { wrapper } = factory()
    expect(wrapper.findAll('.quiz__question')).toHaveLength(2)
    expect(wrapper.findAll('.quiz__option')).toHaveLength(8)
  })

  it('wrong answer shows retry feedback and does not pass the quiz', async () => {
    const { wrapper, store } = factory()
    await wrapper.findAll('.quiz__option')[0].trigger('click') // Q1 option a (wrong)
    expect(wrapper.find('.quiz__feedback.is-wrong').exists()).toBe(true)
    expect(store.lessonProgress('test-lezione').quizPassed).toBe(false)
  })

  it('answering all questions correctly marks the quiz passed', async () => {
    const { wrapper, store } = factory()
    await wrapper.findAll('.quiz__option')[1].trigger('click') // Q1 option b (correct)
    expect(store.lessonProgress('test-lezione').quizPassed).toBe(false)
    await wrapper.findAll('.quiz__option')[4].trigger('click') // Q2 option a (correct)
    expect(store.lessonProgress('test-lezione').quizPassed).toBe(true)
    expect(wrapper.findAll('.quiz__feedback.is-correct')).toHaveLength(2)
  })

  it('a wrong answer can be corrected by retrying', async () => {
    const { wrapper, store } = factory()
    const opts = wrapper.findAll('.quiz__option')
    await opts[0].trigger('click') // wrong
    await opts[1].trigger('click') // correct on retry
    await opts[4].trigger('click') // Q2 correct
    expect(store.lessonProgress('test-lezione').quizPassed).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/component/QuizSection.spec.ts`
Expected: FAIL — cannot resolve `~/components/QuizSection.vue`.

- [ ] **Step 3: Write `components/QuizSection.vue`**

Note: import the store explicitly (not via auto-import) so the component works under plain Vitest.

```vue
<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const props = defineProps<{ questions: QuizQuestion[]; slug: string }>()
const store = useProgressStore()

const selections = ref<(number | null)[]>(props.questions.map(() => null))
const solved = ref<boolean[]>(props.questions.map(() => false))

function select(qi: number, oi: number) {
  if (solved.value[qi]) return
  selections.value[qi] = oi
  if (oi === props.questions[qi].correctIndex) {
    solved.value[qi] = true
    if (solved.value.every(Boolean)) store.markQuizPassed(props.slug)
  }
}

function optionClass(qi: number, oi: number) {
  if (selections.value[qi] !== oi) return ''
  return oi === props.questions[qi].correctIndex ? 'is-correct' : 'is-wrong'
}
</script>

<template>
  <section class="quiz" aria-label="Quiz di verifica">
    <h2>Mettiti alla prova</h2>
    <div v-for="(q, qi) in questions" :key="qi" class="quiz__question card">
      <h3>{{ qi + 1 }}. {{ q.question }}</h3>
      <div class="quiz__options">
        <button
          v-for="(opt, oi) in q.options"
          :key="oi"
          type="button"
          class="quiz__option"
          :class="optionClass(qi, oi)"
          :disabled="solved[qi]"
          @click="select(qi, oi)"
        >
          {{ opt }}
        </button>
      </div>
      <p v-if="selections[qi] !== null" class="quiz__feedback" :class="solved[qi] ? 'is-correct' : 'is-wrong'" aria-live="polite">
        <template v-if="solved[qi]">✔ Esatto! {{ q.explanation }}</template>
        <template v-else>✘ Non proprio: riprova, la risposta giusta c'è.</template>
      </p>
    </div>
  </section>
</template>

<style scoped>
.quiz { display: grid; gap: 18px; margin-block: 48px; }
.quiz__question { display: grid; gap: 14px; }
.quiz__question h3 { margin: 0; font-size: 1.05rem; }
.quiz__options { display: grid; gap: 8px; }
.quiz__option {
  text-align: left; padding: 12px 16px; border-radius: 10px;
  background: var(--surface-2); color: var(--text);
  border: 1px solid var(--border); transition: border-color 0.15s ease, transform 0.15s ease;
}
.quiz__option:hover:not(:disabled) { border-color: var(--brand); }
.quiz__option.is-correct { border-color: var(--ok); background: rgb(34 197 94 / 0.12); }
.quiz__option.is-wrong { border-color: var(--err); background: rgb(239 68 68 / 0.12); animation: shake 0.3s ease; }
.quiz__feedback { margin: 0; font-size: 0.95rem; }
.quiz__feedback.is-correct { color: var(--ok); }
.quiz__feedback.is-wrong { color: var(--err); }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/component/QuizSection.spec.ts`
Expected: 4 passed.

- [ ] **Step 5: Write `components/ChallengeSection.vue`**

```vue
<script setup lang="ts">
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
```

- [ ] **Step 6: Write `components/CompleteLessonButton.vue`**

```vue
<script setup lang="ts">
import type gsap from 'gsap'
import { useProgressStore } from '~/stores/progress'
import { prefersReducedMotion } from '~/composables/useMotion'

const props = defineProps<{ slug: string }>()
const store = useProgressStore()
const btn = ref<HTMLElement>()

const progress = computed(() => store.lessonProgress(props.slug))
const ready = computed(() => progress.value.quizPassed && progress.value.challengeDone)
const completed = computed(() => progress.value.completedAt !== null)

function complete() {
  if (!store.completeLesson(props.slug)) return
  if (prefersReducedMotion() || !btn.value) return
  const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }
  $gsap?.fromTo(btn.value, { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' })
}
</script>

<template>
  <div class="complete">
    <button ref="btn" class="btn" :disabled="!ready || completed" @click="complete">
      <template v-if="completed">✓ Lezione completata</template>
      <template v-else>Segna lezione come completata</template>
    </button>
    <p v-if="!ready && !completed" class="complete__hint">
      Rispondi correttamente a tutte le domande del quiz e spunta la sfida pratica per completare la lezione.
    </p>
  </div>
</template>

<style scoped>
.complete { display: grid; gap: 10px; justify-items: center; margin-block: 40px; }
.complete__hint { margin: 0; color: var(--text-dim); font-size: 0.9rem; text-align: center; }
</style>
```

- [ ] **Step 7: Wire into `pages/corso/[slug].vue`**

Replace the `#esercizi` placeholder section with:

```vue
      <section id="esercizi" class="lesson__exercises">
        <QuizSection v-if="lesson.quiz?.length" :questions="lesson.quiz" :slug="lesson.slug" />
        <ChallengeSection v-if="lesson.challenge" :title="lesson.challenge.title" :steps="lesson.challenge.steps" :slug="lesson.slug" />
        <CompleteLessonButton :slug="lesson.slug" />
      </section>
```

- [ ] **Step 8: Run full test suite and verify manually**

Run: `npm run test` — expected: all green (progress, lessons-utils, QuizSection).
Manual: open lesson 01 → answer quiz (wrong answer shakes red with retry message; correct turns green with explanation) → tick the challenge → button enables → click → pulse animation, button reads "✓ Lezione completata" → back on `/corso` the card shows ✓ and progress bars move. Reload: state persists.

- [ ] **Step 9: Commit**

```bash
git add pages components tests
git commit -m "feat: quiz, practical challenge and lesson completion flow"
```

---

### Task 9: Interactive SVG diagrams (MDC components)

**Files:**
- Create: `components/content/ApertureDiagram.vue`, `components/content/ExposureTriangle.vue`, `components/content/ShutterMotionDiagram.vue`

**Interfaces:**
- Consumes: `$gsap`, `prefersReducedMotion`.
- Produces MDC blocks used by content-authoring tasks (12–16), written in Markdown exactly as:
  - `::aperture-diagram` + `::` — interactive f-stop slider (used in lessons 03, 06, 17, 18)
  - `::exposure-triangle` + `::` — scroll-drawn triangle (used in lessons 02, 06)
  - `::shutter-motion-diagram` + `::` — shutter speed slider with motion blur (used in lessons 04, 19, 23)

- [ ] **Step 1: Write `components/content/ApertureDiagram.vue`**

```vue
<script setup lang="ts">
const stops = [1.8, 2.8, 4, 5.6, 8, 11, 16]
const idx = ref(2)
const f = computed(() => stops[idx.value])
const r = computed(() => 12 + 80 / f.value)
const caption = computed(() => {
  if (f.value <= 2.8) return 'Apertura ampia: tanta luce, sfondo molto sfocato (PDC minima).'
  if (f.value <= 5.6) return 'Apertura media: buon compromesso tra luce e profondità di campo.'
  if (f.value <= 11) return 'Apertura chiusa: quasi tutto a fuoco, serve più luce o ISO più alti.'
  return 'Molto chiusa: massima profondità di campo, attenzione alla diffrazione.'
})
</script>

<template>
  <figure class="diagram card">
    <svg viewBox="0 0 200 200" role="img" :aria-label="`Diaframma impostato a f/${f}`">
      <circle cx="100" cy="100" r="90" class="diagram__ring" />
      <g v-for="i in 8" :key="i" :transform="`rotate(${i * 45} 100 100)`">
        <line x1="100" :y1="100 - r" x2="100" y2="12" class="diagram__blade" />
      </g>
      <circle cx="100" cy="100" :r="r" class="diagram__iris" />
      <text x="100" y="106" text-anchor="middle" class="diagram__label">f/{{ f }}</text>
    </svg>
    <input v-model.number="idx" type="range" min="0" :max="stops.length - 1" step="1" aria-label="Regola l'apertura del diaframma">
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.diagram { display: grid; gap: 14px; justify-items: center; margin-block: 32px; padding: 28px; }
.diagram svg { width: min(240px, 60vw); }
.diagram__ring { fill: var(--surface-2); stroke: var(--border); stroke-width: 3; }
.diagram__blade { stroke: var(--bg); stroke-width: 3; }
.diagram__iris { fill: #fef3c7; opacity: 0.92; transition: r 0.25s ease; }
.diagram__label { font-weight: 800; font-size: 20px; fill: #0a0a0b; }
.diagram input { width: min(280px, 80%); accent-color: var(--brand); }
figcaption { color: var(--text-dim); font-size: 0.9rem; text-align: center; }
</style>
```

- [ ] **Step 2: Write `components/content/ExposureTriangle.vue`**

```vue
<script setup lang="ts">
import type gsap from 'gsap'
import { prefersReducedMotion } from '~/composables/useMotion'

const root = ref<HTMLElement>()

onMounted(() => {
  const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }
  if (prefersReducedMotion() || !$gsap || !root.value) return
  const path = root.value.querySelector('.triangle__path') as SVGPathElement
  const len = path.getTotalLength()
  $gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
  $gsap.to(path, {
    strokeDashoffset: 0, duration: 1.6, ease: 'power2.out',
    scrollTrigger: { trigger: root.value, start: 'top 80%' },
  })
  $gsap.from(root.value.querySelectorAll('.triangle__label'), {
    opacity: 0, scale: 0.6, duration: 0.5, stagger: 0.2, delay: 0.6, ease: 'back.out(2)',
    scrollTrigger: { trigger: root.value, start: 'top 80%' },
  })
})
</script>

<template>
  <figure ref="root" class="triangle card">
    <svg viewBox="0 0 320 280" role="img" aria-label="Il triangolo dell'esposizione: apertura, tempo di scatto e ISO">
      <path class="triangle__path" d="M160 30 L295 245 L25 245 Z" />
      <text class="triangle__label" x="160" y="20" text-anchor="middle">APERTURA</text>
      <text class="triangle__label" x="295" y="268" text-anchor="middle">TEMPO</text>
      <text class="triangle__label" x="25" y="268" text-anchor="middle">ISO</text>
      <text class="triangle__center" x="160" y="185" text-anchor="middle">ESPOSIZIONE</text>
    </svg>
    <figcaption>Ogni lato influenza gli altri: cambia uno dei tre parametri e dovrai compensare con gli altri due.</figcaption>
  </figure>
</template>

<style scoped>
.triangle { display: grid; gap: 12px; justify-items: center; margin-block: 32px; padding: 28px; }
.triangle svg { width: min(320px, 75vw); overflow: visible; }
.triangle__path { fill: none; stroke: var(--brand); stroke-width: 3; stroke-linejoin: round; }
.triangle__label { fill: var(--text); font-weight: 800; font-size: 15px; }
.triangle__center { fill: var(--text-dim); font-size: 12px; letter-spacing: 0.15em; }
figcaption { color: var(--text-dim); font-size: 0.9rem; text-align: center; }
</style>
```

- [ ] **Step 3: Write `components/content/ShutterMotionDiagram.vue`**

```vue
<script setup lang="ts">
const speeds = ['1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15', '1/8']
const idx = ref(2)
const speed = computed(() => speeds[idx.value])
const blur = computed(() => idx.value * 1.6)
const caption = computed(() => {
  if (idx.value <= 2) return `${speed.value}s: il movimento è congelato — adatto a sport e soggetti veloci.`
  if (idx.value <= 4) return `${speed.value}s: soggetti lenti ok, ma i movimenti rapidi iniziano a strisciare.`
  return `${speed.value}s: mosso evidente — a mano libera serve stabilizzazione o treppiede.`
})
</script>

<template>
  <figure class="shutter card">
    <svg viewBox="0 0 320 140" role="img" :aria-label="`Effetto del tempo di scatto ${speed} sul movimento`">
      <line x1="10" y1="120" x2="310" y2="120" class="shutter__ground" />
      <g :style="{ filter: `blur(${blur}px)` }">
        <circle cx="160" cy="60" r="14" class="shutter__head" />
        <line x1="160" y1="74" x2="160" y2="105" class="shutter__body" />
        <line x1="160" y1="85" x2="140" y2="70" class="shutter__limb" />
        <line x1="160" y1="85" x2="182" y2="72" class="shutter__limb" />
        <line x1="160" y1="105" x2="143" y2="120" class="shutter__limb" />
        <line x1="160" y1="105" x2="178" y2="120" class="shutter__limb" />
      </g>
      <text x="160" y="24" text-anchor="middle" class="shutter__label">{{ speed }}s</text>
    </svg>
    <input v-model.number="idx" type="range" min="0" :max="speeds.length - 1" step="1" aria-label="Regola il tempo di scatto">
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.shutter { display: grid; gap: 14px; justify-items: center; margin-block: 32px; padding: 28px; }
.shutter svg { width: min(320px, 80vw); }
.shutter__ground { stroke: var(--border); stroke-width: 2; }
.shutter__head { fill: var(--brand); }
.shutter__body, .shutter__limb { stroke: var(--brand); stroke-width: 5; stroke-linecap: round; }
.shutter__label { fill: var(--text); font-weight: 800; font-size: 18px; }
.shutter input { width: min(280px, 80%); accent-color: var(--brand); }
figcaption { color: var(--text-dim); font-size: 0.9rem; text-align: center; }
</style>
```

- [ ] **Step 4: Verify manually**

Temporarily add to `content/canon/01-anatomia-della-reflex.md` body:

```markdown
::exposure-triangle
::

::aperture-diagram
::

::shutter-motion-diagram
::
```

Run `npm run dev`, open the lesson: triangle draws itself on scroll, aperture iris shrinks/grows with the slider (f/1.8 ↔ f/16), runner blurs as shutter slows. Remove the temporary blocks afterwards.

- [ ] **Step 5: Commit**

```bash
git add components/content content
git commit -m "feat: interactive SVG diagrams (aperture, exposure triangle, shutter)"
```

---

### Task 10: Error page, settings page

**Files:**
- Create: `error.vue`, `pages/impostazioni.vue`

**Interfaces:**
- Consumes: `useProgressStore` (`brand`, `setBrand`, `resetAll`, `completedCount`), `<BrandCard>` (Task 5), `TOTAL_LESSONS` (Task 3).
- Produces: themed 404/error page; `/impostazioni` route (linked from header in Task 11).

- [ ] **Step 1: Write `error.vue`** (project root)

```vue
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
```

- [ ] **Step 2: Write `pages/impostazioni.vue`**

Reset uses a two-step inline confirmation (NO browser `confirm()` dialogs).

```vue
<script setup lang="ts">
import { useProgressStore, type Brand } from '~/stores/progress'
import { TOTAL_LESSONS } from '~/utils/lessons'

definePageMeta({ middleware: 'wizard' })

const store = useProgressStore()
const confirmingReset = ref(false)

function switchBrand(brand: Brand) {
  store.setBrand(brand)
}

function reset() {
  store.resetAll()
  navigateTo('/wizard')
}
</script>

<template>
  <main class="settings container">
    <h1>Impostazioni</h1>

    <section class="settings__section">
      <h2>La tua fotocamera</h2>
      <p class="settings__hint">
        Cambia marca in ogni momento: il progresso di ciascuna marca resta salvato
        ({{ store.completedCount }}/{{ TOTAL_LESSONS }} lezioni completate con la marca attuale).
      </p>
      <div class="settings__cards">
        <BrandCard brand="canon" :selected="store.brand === 'canon'" @select="switchBrand" />
        <BrandCard brand="nikon" :selected="store.brand === 'nikon'" @select="switchBrand" />
      </div>
    </section>

    <section class="settings__section settings__danger">
      <h2>Zona pericolosa</h2>
      <p class="settings__hint">Azzera tutto: marca scelta e progressi di entrambe le marche. Irreversibile.</p>
      <button v-if="!confirmingReset" class="btn btn--ghost" @click="confirmingReset = true">
        Azzera tutti i progressi…
      </button>
      <div v-else class="settings__confirm">
        <span>Sicuro? Perderai tutto il progresso.</span>
        <button class="btn settings__confirm-yes" @click="reset">Sì, azzera</button>
        <button class="btn btn--ghost" @click="confirmingReset = false">Annulla</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.settings { padding-block: 48px; display: grid; gap: 40px; max-width: 760px; }
.settings__section { display: grid; gap: 16px; }
.settings__hint { color: var(--text-dim); margin: 0; }
.settings__cards { display: flex; gap: 20px; flex-wrap: wrap; }
.settings__danger h2 { color: var(--err); }
.settings__confirm { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.settings__confirm-yes { background: var(--err); color: #fff; }
</style>
```

- [ ] **Step 3: Verify manually**

- `/pagina-inesistente` → "Fuori fuoco!" page with working "Torna alla home".
- `/impostazioni`: switching Canon→Nikon updates `data-brand` and dashboard content instantly, progress preserved per brand; reset asks inline confirmation then lands on `/wizard` with empty localStorage state.
- Corrupted-storage check: in DevTools run `localStorage.setItem('progress', '{broken')` then reload → app starts clean at wizard (no crash).

- [ ] **Step 4: Commit**

```bash
git add error.vue pages
git commit -m "feat: themed error page and settings with brand switch and reset"
```

---

### Task 11: Layout, header, mobile nav

**Files:**
- Create: `layouts/default.vue`, `components/AppHeader.vue`

**Interfaces:**
- Consumes: `useProgressStore`, `TOTAL_LESSONS`, `<ProgressBar>` (Task 6), `<ApertureMark>` (Task 4).
- Produces: sticky header with logo → `/`, links to `/corso` and `/impostazioni`, global progress bar, hamburger menu under 720px. Wraps all pages via default layout.

- [ ] **Step 1: Write `components/AppHeader.vue`**

```vue
<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'
import { TOTAL_LESSONS } from '~/utils/lessons'

const store = useProgressStore()
const open = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { open.value = false })

const pct = computed(() => Math.round((store.completedCount / TOTAL_LESSONS) * 100))
</script>

<template>
  <header class="header">
    <div class="header__inner container">
      <NuxtLink to="/" class="header__logo" aria-label="Reflex Master — home">
        <ApertureMark :size="28" />
        <span>Reflex Master</span>
      </NuxtLink>

      <button
        class="header__burger"
        :aria-expanded="open"
        aria-label="Apri menu"
        @click="open = !open"
      >
        <span /><span /><span />
      </button>

      <nav class="header__nav" :class="{ 'is-open': open }" aria-label="Principale">
        <NuxtLink to="/corso">Il corso</NuxtLink>
        <NuxtLink to="/impostazioni">Impostazioni</NuxtLink>
        <div v-if="store.wizardCompleted" class="header__progress">
          <ProgressBar :value="pct" label="Avanzamento corso" />
          <span class="header__pct">{{ pct }}%</span>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 40;
  background: rgb(10 10 11 / 0.85); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.header__inner { display: flex; align-items: center; gap: 24px; padding-block: 12px; }
.header__logo { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--text); text-decoration: none; }
.header__nav { display: flex; align-items: center; gap: 20px; margin-left: auto; }
.header__nav a { color: var(--text-dim); text-decoration: none; font-weight: 600; }
.header__nav a:hover, .header__nav a.router-link-active { color: var(--text); }
.header__progress { display: flex; align-items: center; gap: 8px; width: 140px; }
.header__progress .progress { flex: 1; }
.header__pct { font-size: 0.8rem; color: var(--text-dim); }
.header__burger { display: none; }

@media (max-width: 720px) {
  .header__burger {
    display: grid; gap: 4px; margin-left: auto;
    background: none; border: 0; padding: 8px;
  }
  .header__burger span { width: 22px; height: 2px; background: var(--text); border-radius: 2px; }
  .header__nav {
    display: none; position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; align-items: stretch; padding: 16px 20px;
    background: var(--surface); border-bottom: 1px solid var(--border);
  }
  .header__nav.is-open { display: flex; }
  .header__progress { width: 100%; }
}
</style>
```

- [ ] **Step 2: Write `layouts/default.vue`**

```vue
<template>
  <div>
    <AppHeader />
    <slot />
  </div>
</template>
```

- [ ] **Step 3: Hide the header on immersive pages**

Landing and wizard are full-screen experiences: add `definePageMeta({ layout: false })` to `pages/index.vue` and `pages/wizard.vue`.

- [ ] **Step 4: Verify manually**

Desktop: header sticky on `/corso` and lessons with working links and progress %. Mobile (DevTools ≤ 720px): hamburger toggles the menu; menu closes on navigation. Landing/wizard have no header.

- [ ] **Step 5: Commit**

```bash
git add layouts components pages
git commit -m "feat: app header with global progress and mobile nav"
```

---

## Content authoring reference (Tasks 12–16)

Shared by all authoring tasks. Every lesson file MUST:

1. Follow the exact front-matter schema from Task 3 (`title`, `description`, `slug`, `order`, `module`, `brand`, `quiz` 3–5 questions × 4 options with `correctIndex` + `explanation`, `challenge` with `title` + ≥3 `steps`).
2. Body: 800–1500 Italian words, professional level, H2 sections, ending with the two mandatory H2 sections **"Errori comuni"** (≥3 numbered mistakes with fixes) and **"Pro tip"** (≥2 advanced tips).
3. Always give concrete numeric settings (e.g. "ritratto: f/1.8–f/2.8, tempo minimo 1/200s, ISO auto max 1600"), never vague advice.
4. Use the brand's exact terminology (table below) and cite real entry/mid-range models (Canon: EOS 2000D, 850D, 90D — Nikon: D3500, D5600, D7500).
5. Module 3 lessons (17–24) follow the fixed structure: "Il contesto" → "Impostazioni consigliate" (Markdown table: Parametro | Valore | Perché) → "Trick base" → "Trick avanzati" → "Errori comuni" → "Pro tip".
6. Embed diagrams where mapped below (MDC syntax `::aperture-diagram` newline `::`). Embed `::lesson-image{...}` blocks with `src="/images/<brand>/<file>.webp"` or `src="/images/common/<file>.webp"` where a real photo helps (gear photos, example shots): the images land in Task 17, the SVG fallback shows meanwhile. Every `lesson-image` MUST have a meaningful Italian `alt`.
7. Quiz questions must test understanding (scenario-based), not word recall; wrong options must be plausible.
8. Slugs are identical across brands (only `brand:` and the prose differ).

**Terminology table (use exact names):**

| Concetto | Canon | Nikon |
|---|---|---|
| Priorità apertura | Av | A |
| Priorità tempi | Tv | S |
| AF singolo | One-Shot AF | AF-S |
| AF continuo | AI Servo AF | AF-C |
| Ghiera vicino allo scatto | Ghiera principale (Main Dial) | Ghiera di comando secondaria (anteriore) |
| Ghiera posteriore | Ghiera controllo rapido (Quick Control Dial) | Ghiera di comando principale (posteriore) |
| Menu rapido | Pulsante Q (Quick Control) | Pulsante i |
| Profili colore | Picture Style | Picture Control |
| Misurazione multi-zona | Misurazione valutativa | Misurazione matrix |
| File RAW | .CR3 (o .CR2 sui modelli meno recenti) | .NEF |

**Lesson catalog (filename → title → required diagrams):**

Module 1 — Fondamenta tecniche:
| File | Titolo | Diagrammi |
|---|---|---|
| `01-anatomia-della-reflex.md` | Anatomia della reflex | (done in Task 3) |
| `02-luce-ed-esposizione.md` | Luce ed esposizione | `::exposure-triangle` |
| `03-apertura-e-profondita-di-campo.md` | Apertura e profondità di campo | `::aperture-diagram` |
| `04-tempi-di-scatto-e-movimento.md` | Tempi di scatto e movimento | `::shutter-motion-diagram` |
| `05-iso-e-rumore.md` | ISO e rumore | — |
| `06-triangolo-esposizione-in-pratica.md` | Il triangolo dell'esposizione in pratica | `::exposure-triangle` + `::aperture-diagram` |
| `07-modalita-di-scatto.md` | Le modalità di scatto | — |
| `08-misurazione-e-compensazione.md` | Misurazione esposimetrica e compensazione | — |
| `09-messa-a-fuoco-da-professionista.md` | Messa a fuoco da professionista | — |
| `10-bilanciamento-del-bianco-e-colore.md` | Bilanciamento del bianco e colore | — |
| `11-raw-jpeg-e-menu.md` | RAW, JPEG e configurazione del menu | — |

Required topics per lesson (module 1): 02 sensore/otturatore, concetto di stop, lettura istogramma · 03 f/stop, diaframma, sfocato, diffrazione · 04 congelare vs mosso creativo, regola del reciproco, micromosso · 05 sensibilità, ISO nativo, quando alzare, gestione rumore · 06 bilanciamento dei tre parametri con almeno 3 scenari numerici completi · 07 P/A(Av)/S(Tv)/M e quando usare ciascuna · 08 valutativa/matrix vs spot vs media pesata, compensazione EV, esporre a destra (ETTR) · 09 modalità AF, punti e aree, back-button focus, MF con conferma di fuoco · 10 temperatura Kelvin, WB personalizzato, cartoncino grigio · 11 RAW vs JPEG, spazio colore sRGB/AdobeRGB, impostazioni menu essenziali con percorsi menu reali della marca.

Module 2 — Composizione, luce e visione:
| File | Titolo |
|---|---|
| `12-composizione-1.md` | Composizione I: le regole fondamentali |
| `13-composizione-2.md` | Composizione II: geometria e momento decisivo |
| `14-la-luce.md` | La luce: qualità, direzione e ora d'oro |
| `15-obiettivi-e-focali.md` | Obiettivi e lunghezze focali |
| `16-flash-e-luce-artificiale.md` | Flash e luce artificiale |

Required topics: 12 regola dei terzi, linee guida, inquadratura, spazio negativo · 13 geometria, ritmo, livelli di lettura, momento decisivo · 14 luce dura/morbida, direzione, ora d'oro e blu, controluce · 15 grandangolo/normale/tele, prospettiva e compressione, scelta ottica per genere · 16 flash integrato vs esterno, TTL vs manuale, sincro tendina, fill flash, luce rimbalzata.

Module 3 — Generi, contesti e trick da pro:
| File | Titolo |
|---|---|
| `17-ritratto.md` | Ritratto |
| `18-paesaggio.md` | Paesaggio |
| `19-sport-e-azione.md` | Sport e azione |
| `20-notturna-e-astrofotografia.md` | Notturna e astrofotografia |
| `21-macro.md` | Macro |
| `22-street-e-reportage.md` | Street e reportage |
| `23-lunghe-esposizioni-creative.md` | Lunghe esposizioni creative |
| `24-workflow-del-professionista.md` | Il workflow del professionista |

Required topics: 17 aperture larghe, fuoco sull'occhio, focali ritratto, gestione sfondo · 18 iperfocale, treppiede, filtri ND/polarizzatore, bracketing · 19 raffica, AF continuo con tracking, tempi minimi, pre-focheggiatura · 20 lunghe esposizioni, regola del 500, ISO alto, riduzione rumore, intervalometro · 21 rapporto di riproduzione, MF, focus stacking, PDC minima · 22 zone focusing, discrezione, esposizione rapida, "f/8 and be there" · 23 panning, scie di luce, acqua setosa, filtri ND estremi · 24 gestione file e backup, culling, basi di sviluppo RAW, checklist pre-uscita.

**Per-file verification (run after writing each file):** `npm run dev` still starts with no content-schema errors, and the lesson renders at `/corso/<slug>` for its brand.

---

### Task 12: Author Module 1 — Canon (lessons 02–11)

**Files:**
- Create: `content/canon/02-luce-ed-esposizione.md` … `content/canon/11-raw-jpeg-e-menu.md` (10 files)

**Interfaces:**
- Consumes: content authoring reference above; MDC components (Tasks 3, 9).
- Produces: 10 complete Canon lessons.

- [ ] **Step 1:** Write lessons 02–06 (Canon) per the catalog and checklist above.
- [ ] **Step 2:** Write lessons 07–11 (Canon).
- [ ] **Step 3:** Verify — `npm run dev`: dashboard shows 11 Canon lessons in Modulo 1, each renders with quiz + challenge; diagrams appear in 02, 03, 04, 06.
- [ ] **Step 4:** Commit

```bash
git add content/canon
git commit -m "content: canon module 1 lessons 02-11"
```

---

### Task 13: Author Module 1 — Nikon (lessons 02–11)

**Files:**
- Create: `content/nikon/02-luce-ed-esposizione.md` … `content/nikon/11-raw-jpeg-e-menu.md` (10 files)

**Interfaces:** same as Task 12, Nikon terminology/models. Do NOT copy Canon prose verbatim: rewrite brand-specific parts (dials, menus, mode names, models); universal theory may share structure but must read naturally.

- [ ] **Step 1:** Write lessons 02–06 (Nikon).
- [ ] **Step 2:** Write lessons 07–11 (Nikon).
- [ ] **Step 3:** Verify — switch brand to Nikon in `/impostazioni`: 11 lessons render; spot-check 03 and 07 for correct Nikon terms (A/S, non Av/Tv).
- [ ] **Step 4:** Commit

```bash
git add content/nikon
git commit -m "content: nikon module 1 lessons 02-11"
```

---

### Task 14: Author Module 2 — both brands (lessons 12–16)

**Files:**
- Create: `content/canon/12-…16.md` and `content/nikon/12-…16.md` (10 files, catalog above)

**Interfaces:** same reference. Module 2 is mostly universal theory; brand-specific hooks required at minimum in 15 (attacchi EF/EF-S vs F, esempi di ottiche reali della marca) and 16 (Speedlite vs Speedlight, nomi menu flash).

- [ ] **Step 1:** Write Canon 12–16.
- [ ] **Step 2:** Write Nikon 12–16.
- [ ] **Step 3:** Verify — both brands show Modulo 2 complete (5 lessons each) and render correctly.
- [ ] **Step 4:** Commit

```bash
git add content
git commit -m "content: module 2 lessons 12-16 for canon and nikon"
```

---

### Task 15: Author Module 3 — Canon (lessons 17–24)

**Files:**
- Create: `content/canon/17-ritratto.md` … `content/canon/24-workflow-del-professionista.md` (8 files)

**Interfaces:** same reference; MANDATORY module-3 structure (contesto → tabella impostazioni → trick base → trick avanzati → errori comuni → pro tip). Settings tables must name Canon controls (Av/Tv, AI Servo, ghiera principale).

- [ ] **Step 1:** Write lessons 17–20 (Canon).
- [ ] **Step 2:** Write lessons 21–24 (Canon).
- [ ] **Step 3:** Verify — Canon dashboard shows all 24 lessons; `::shutter-motion-diagram` present in 19 and 23; `::aperture-diagram` in 17 and 18.
- [ ] **Step 4:** Commit

```bash
git add content/canon
git commit -m "content: canon module 3 lessons 17-24"
```

---

### Task 16: Author Module 3 — Nikon (lessons 17–24)

**Files:**
- Create: `content/nikon/17-…24.md` (8 files)

**Interfaces:** same as Task 15 with Nikon controls (A/S, AF-C, ghiera di comando principale).

- [ ] **Step 1:** Write lessons 17–20 (Nikon).
- [ ] **Step 2:** Write lessons 21–24 (Nikon).
- [ ] **Step 3:** Verify — Nikon dashboard shows all 24 lessons; completing a full lesson end-to-end still works.
- [ ] **Step 4:** Commit

```bash
git add content/nikon
git commit -m "content: nikon module 3 lessons 17-24"
```

---

### Task 17: Real photos and CREDITS.md

**Files:**
- Create: `public/images/canon/*`, `public/images/nikon/*`, `public/images/common/*`, `CREDITS.md`
- Possibly modify: lesson files (aligning `::lesson-image` `src` values to the actual downloaded filenames)

**Interfaces:**
- Consumes: the `::lesson-image` blocks already present in lessons; `LessonImage` fallback behavior.
- Produces: every `lesson-image` src resolves to a real file, or the lesson is edited to drop the block in favor of prose/SVG.

- [ ] **Step 1: Inventory** — grep all image references: `grep -rho 'src="/images/[^"]*"' content/ | sort -u`. This is the download list.
- [ ] **Step 2: Source images** — for each reference, find a matching photo on Wikimedia Commons (camera bodies, dials: search e.g. "Canon EOS 850D top"), Unsplash or Pexels (example shots: portrait bokeh, panning, star trails…). License MUST be CC0/CC-BY/CC-BY-SA/Unsplash/Pexels license. Download, convert/resize to WebP max 1600px wide (use `npx sharp-cli` or any local converter), save under the referenced path.
- [ ] **Step 3: Attribution** — write `CREDITS.md`: one line per image — path, author, source URL, license. Include even "no attribution required" sources.
- [ ] **Step 4: Fallbacks** — for any reference with no adequately-licensed image found, edit the lesson: remove the `::lesson-image` block or replace with an existing diagram. Zero permanently-broken image references may remain.
- [ ] **Step 5: Verify** — click through several lessons of both brands: photos load lazily, no layout shift, `CREDITS.md` covers every file in `public/images/`. If the executing environment has no internet access: STOP and report to the user which images are needed instead of shipping broken references.
- [ ] **Step 6: Commit**

```bash
git add public/images CREDITS.md content
git commit -m "content: free-license photos with attributions"
```

---

### Task 18: Final QA — tests, SSG build, E2E checklist

**Files:**
- Possibly modify: anything that fails verification.

- [ ] **Step 1: Full test suite** — Run `npm run test`. Expected: all tests pass. Fix any failure before proceeding.
- [ ] **Step 2: Static build** — Run `npm run generate`. Expected: completes with no errors. Then `npm run preview` and test against the generated site (not dev mode).
- [ ] **Step 3: Manual E2E — desktop** (fresh browser profile / cleared localStorage):
  1. `/` → hero animates → "Inizia ora" → wizard.
  2. Pick Nikon → summary → "Inizia il corso" → dashboard shows 24 Nikon lessons, `data-brand="nikon"`.
  3. Open lesson 01 → scroll (reveals + reading bar) → fail a quiz question (shake + retry) → answer all correctly → tick challenge → complete → celebration → dashboard shows ✓ and updated bars, header shows %.
  4. `/impostazioni` → switch to Canon → dashboard progress back to 0 → switch back to Nikon → progress restored.
  5. Reload → everything persists. `/rotta-finta` → themed 404.
  6. DevTools reduced-motion emulation → pages usable, content immediately visible.
- [ ] **Step 4: Manual E2E — mobile** (DevTools iPhone-class viewport): hamburger menu works, wizard cards stack, lesson tables scroll horizontally, quiz buttons comfortably tappable, no horizontal page scroll anywhere.
- [ ] **Step 5: Lighthouse** — run on `/corso` and one lesson (generated build). Target: Performance ≥ 85, Accessibility ≥ 95. Fix low-hanging issues (missing alt, contrast, image sizes) if below.
- [ ] **Step 6: Content spot-check** — pick 2 random lessons per brand: word count 800+, "Errori comuni" + "Pro tip" present, quiz plausible, brand terms correct.
- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "chore: final QA fixes"
```

---

## Plan self-review notes

- Spec coverage: wizard (T5), brand-specific 24-lesson course (T3, T12–16), quiz + practical challenges (T8), progress in localStorage per brand (T2), immersive GSAP animations with reduced-motion degradation (T4, T9, plus per-component animations), dark theme + brand accents (T1, T5), mobile (T11, T18), error handling incl. corrupted storage (T2, T10), images with free licenses + CREDITS.md (T3, T17), tests (T2, T3, T8, T18), SSG build (T18). Hosting intentionally out of scope per spec.
- Type consistency: `Brand`, `LessonProgress`, `LessonMeta`, `QuizQuestion` and store action names are defined once (T2/T3/T8) and referenced identically in later tasks.
- Lesson prose in Tasks 12–16 is a content deliverable authored at execution time; its structure, length, terminology, topics, quiz shape and verification are fully specified in the "Content authoring reference".
