<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProgressStore } from '~/stores/progress'
import { prefersReducedMotion } from '~/composables/useMotion'

const props = defineProps<{ slug: string }>()
const store = useProgressStore()
const { $gsap } = useNuxtApp()
const btn = ref<HTMLElement>()

const progress = computed(() => store.lessonProgress(props.slug))
const ready = computed(() => progress.value.quizPassed && progress.value.challengeDone)
const completed = computed(() => progress.value.completedAt !== null)

function complete() {
  if (!store.completeLesson(props.slug)) return
  if (prefersReducedMotion() || !btn.value || !$gsap) return
  $gsap.fromTo(btn.value, { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' })
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
