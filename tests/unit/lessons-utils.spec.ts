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

  it('adjacentLessons returns null prev/next for an unknown slug', () => {
    expect(adjacentLessons(lessons, 'missing')).toEqual({ prev: null, next: null })
  })
})
