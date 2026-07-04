import { afterEach, describe, expect, it, vi } from 'vitest'
import { prefersReducedMotion } from '~/composables/useMotion'

// The `import.meta.server` short-circuit (returns true on the server) is a
// build-time constant that is always falsy under vitest, so these tests exercise
// the client branch: the actual `matchMedia` logic that gates every animation.
describe('prefersReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true when the user prefers reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }))
    expect(prefersReducedMotion()).toBe(true)
  })

  it('returns false when the user has no reduced-motion preference', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query }))
    expect(prefersReducedMotion()).toBe(false)
  })

  it('queries the reduced-motion media feature', () => {
    const queried: string[] = []
    vi.stubGlobal('matchMedia', (query: string) => {
      queried.push(query)
      return { matches: false, media: query }
    })
    prefersReducedMotion()
    expect(queried).toEqual(['(prefers-reduced-motion: reduce)'])
  })
})
