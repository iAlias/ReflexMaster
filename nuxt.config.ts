export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  modules: ['@nuxt/content', '@pinia/nuxt'],
  content: {
    experimental: {
      // @nuxt/content needs a SQLite adapter to build its content database. Rather
      // than depending on the optional native `better-sqlite3` binding (which is
      // intentionally NOT a direct dependency in package.json - see task-1 review
      // finding), use Node's built-in `node:sqlite` module (available on Node >= 22.5.0).
      sqliteConnector: 'native',
    },
  },
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
