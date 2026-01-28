<script setup lang="ts">
definePageMeta({
  middleware: () => { }
})
await navigateTo('/')
</script>

<template>
  <div>
    <ClientOnly>
      <NuxtLink to="/" class="text-accent underline text-sm">
        Повернутися на головну (список вакансій)
      </NuxtLink>
    </ClientOnly>
  </div>
</template>