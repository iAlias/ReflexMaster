import { readdirSync } from 'node:fs'

// Lesson slugs are identical for both brands (only the prose differs), so one
// prerendered page per slug serves Canon and Nikon alike: the page picks the
// brand's content client-side once the store is restored. Crawling alone would
// not find them all - the dashboard only links the lessons of the default
// brand - and an un-prerendered route 404s on static hosting.
const lessonRoutes = readdirSync(new URL('content/canon', import.meta.url))
  .filter(file => file.endsWith('.md'))
  .map(file => `/corso/${file.replace(/^\d+-/, '').replace(/\.md$/, '')}`)

export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  modules: ['@nuxt/content', '@pinia/nuxt'],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/wizard', '/corso', '/impostazioni', ...lessonRoutes],
    },
  },
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
    // Su GitHub Pages il sito vive in una sottocartella (/ReflexMaster/): la base URL
    // va impostata in build, altrimenti tutti gli asset puntano alla radice del dominio.
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
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
