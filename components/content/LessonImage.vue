<script setup lang="ts">
import { withBase } from 'ufo'

const props = defineProps<{
  src: string
  alt: string
  credit?: string
  width?: number | string
  height?: number | string
}>()

// Lesson Markdown writes site-absolute paths (/images/...). When the site is
// deployed under a sub-path (app.baseURL, e.g. /AI/Reflex/), those would resolve
// against the domain root and 404, so prefix them with the configured base.
const resolvedSrc = computed(() => withBase(props.src, useRuntimeConfig().app.baseURL))
const failed = ref(false)
</script>

<template>
  <figure class="lesson-image">
    <img
      v-if="!failed"
      :src="resolvedSrc"
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
