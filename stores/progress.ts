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
