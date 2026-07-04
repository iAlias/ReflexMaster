/**
 * Shared flag that becomes `true` only after the client has mounted.
 *
 * The app is generated as static HTML (SSG) with the progress store in its
 * default state — the build has no access to `localStorage`. On the client,
 * `pinia-plugin-persistedstate` restores the real state from `localStorage`
 * during hydration. Any markup that renders from persisted state (`brand`,
 * `wizardCompleted`, per-lesson progress) must therefore be gated behind this
 * flag: while it is `false`, render the same default view the static HTML did
 * (so the first client render matches and Vue does not throw a hydration
 * mismatch); once it flips `true` after mount, render the real, personalised
 * view. The flag is flipped once, centrally, in `app.vue`'s `onMounted`.
 *
 * The route-guard middleware is intentionally exempt: it runs client-side and
 * reads the already-restored store to redirect, which renders nothing.
 */
export function useHydrated() {
  return useState('hydrated', () => false)
}
