export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return
  const store = useProgressStore()
  if (!store.wizardCompleted || !store.brand) return navigateTo('/wizard')
})
