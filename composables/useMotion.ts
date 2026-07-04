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
