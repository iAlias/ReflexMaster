/**
 * Route guard for the course pages: sends visitors to the wizard until a brand
 * has been chosen. It runs client-side only, because the choice lives in
 * localStorage and the static build has no access to it.
 *
 * On the very first navigation the app is still hydrating: redirecting there
 * would replace the server-rendered page with a different one while Vue is
 * still matching the existing DOM, which it reports as a hydration mismatch
 * ("rendered on server: class=dashboard container / expected on client:
 * class=wizard container"). So during hydration the redirect is deferred to the
 * first tick after it completes; on every later navigation it runs inline.
 */
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const store = useProgressStore()
  const needsWizard = () => !store.wizardCompleted || !store.brand

  if (useNuxtApp().isHydrating) {
    onNuxtReady(() => {
      if (needsWizard()) navigateTo('/wizard')
    })
    return
  }

  if (needsWizard()) return navigateTo('/wizard')
})
