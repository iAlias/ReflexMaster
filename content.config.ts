import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    lessons: defineCollection({
      type: 'page',
      // NOTE: brief specifies source: '{canon,nikon}/**/*.md', but that pattern
      // hits an upstream bug in @nuxt/content@3.15.0's parseSourceBase(): it derives
      // the "fixed" (non-glob) prefix by splitting the include string on the first
      // `*`, so for `{canon,nikon}/**/*.md` the fixed prefix becomes the literal,
      // unexpanded string `"{canon,nikon}/"` (14 chars). getKeys() then does
      // `key.substring(fixed.length)` on real glob matches like
      // `canon/01-anatomia-della-reflex.md`, truncating them to garbage
      // (`mia-della-reflex.md`) and causing every file to fail to load (readFile
      // ENOENT, 0 rows ever inserted — verified directly against .data/content/contents.sqlite).
      // Since content/ only ever holds per-brand lesson folders, an unscoped
      // '**/*.md' glob is equivalent here and sidesteps the bug (fixed prefix "").
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        slug: z.string(),
        order: z.number().int().min(1).max(24),
        module: z.number().int().min(1).max(3),
        brand: z.enum(['canon', 'nikon']),
        quiz: z.array(z.object({
          question: z.string(),
          options: z.array(z.string()).length(4),
          correctIndex: z.number().int().min(0).max(3),
          explanation: z.string(),
        })).min(3).max(5),
        challenge: z.object({
          title: z.string(),
          steps: z.array(z.string()).min(3),
        }),
      }),
    }),
  },
})
