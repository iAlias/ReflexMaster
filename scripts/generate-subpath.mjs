/**
 * Generates the static site for a deployment that does NOT live at the domain
 * root, e.g. https://example.com/AI/Reflex/.
 *
 * Nuxt bakes `app.baseURL` into every link, script, stylesheet and image path at
 * build time, so a build made for `/` cannot be dropped into a sub-folder: the
 * links would point at the domain root and 404. This script sets
 * NUXT_APP_BASE_URL for the build (cross-platform, unlike an inline env var on
 * Windows) and then runs the normal generate.
 *
 *   npm run generate:subpath -- /AI/Reflex/
 *
 * The path must start and end with a slash. Output stays in .output/public.
 */
import { spawnSync } from 'node:child_process'

const base = process.argv[2]

if (!base) {
  console.error('Uso: npm run generate:subpath -- /percorso/della/sottocartella/')
  process.exit(1)
}

if (!base.startsWith('/') || !base.endsWith('/')) {
  console.error(`Percorso non valido: "${base}" - deve iniziare e finire con "/" (es. /AI/Reflex/)`)
  process.exit(1)
}

console.log(`Generazione del sito statico con base URL "${base}"...`)

const result = spawnSync('npx', ['nuxi', 'generate'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NUXT_APP_BASE_URL: base },
})

process.exit(result.status ?? 1)
