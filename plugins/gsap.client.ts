import type gsapType from 'gsap'

// Loaded in parallel with the other plugins and code-split into its own chunk:
// GSAP is ~70 KB that nothing needs before the app mounts, and pulling it in
// statically put it on the critical path of every page.
export default defineNuxtPlugin({
  name: 'gsap',
  parallel: true,
  async setup() {
    const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    gsap.registerPlugin(ScrollTrigger)
    return { provide: { gsap } }
  },
})

// Type the injected helper once, here, so every consumer can use
// `useNuxtApp().$gsap` directly instead of casting.
declare module '#app' {
  interface NuxtApp {
    $gsap: typeof gsapType
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $gsap: typeof gsapType
  }
}
