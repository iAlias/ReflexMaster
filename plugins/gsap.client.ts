import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)
  return { provide: { gsap } }
})

// Type the injected helper once, here, so every consumer can use
// `useNuxtApp().$gsap` directly instead of casting.
declare module '#app' {
  interface NuxtApp {
    $gsap: typeof gsap
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $gsap: typeof gsap
  }
}
