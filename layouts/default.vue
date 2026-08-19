<script setup lang="ts">
// Immersive pages (landing, wizard) opt out of the header via page meta rather
// than via `layout: false`, so the layout wrapper stays in place and a redirect
// during hydration never changes the shape of the tree. See pages/wizard.vue.
const route = useRoute()
const immersive = computed(() => route.meta.immersive === true)
</script>

<template>
  <div>
    <AppHeader v-if="!immersive" />
    <slot />
  </div>
</template>
