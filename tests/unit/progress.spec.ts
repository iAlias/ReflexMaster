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
