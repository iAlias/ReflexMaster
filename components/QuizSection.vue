<script setup lang="ts">
import { ref } from 'vue'
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
