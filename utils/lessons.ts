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
