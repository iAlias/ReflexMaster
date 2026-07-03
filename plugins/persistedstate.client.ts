import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  ;(nuxtApp.$pinia as Pinia).use(createPersistedState({
    storage: localStorage,
    serializer: {
      serialize: JSON.stringify,
      deserialize: (value: string) => {
        try { return JSON.parse(value) } catch { return {} }
      },
    },
  }))
})
