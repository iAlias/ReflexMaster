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
