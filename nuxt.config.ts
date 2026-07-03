export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  modules: ['@nuxt/content', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Reflex Master — Impara la fotografia reflex',
      htmlAttrs: { lang: 'it' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Il corso interattivo che ti porta da zero a fotografo: impara a usare la tua reflex Canon o Nikon come un professionista.' },
      ],
    },
  },
})
