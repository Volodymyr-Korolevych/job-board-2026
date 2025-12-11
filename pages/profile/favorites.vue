<script setup lang="ts">
const { data: favorites } = await useFetch('/api/favorites')
</script>

<template>
  <section class="space-y-4">
    <h1 class="text-lg font-semibold text-primary">Обрані вакансії</h1>

    <div v-if="!favorites?.length" class="text-sm text-muted">
      У вас ще немає обраних вакансій.
    </div>

    <div class="space-y-3">
      <article
        v-for="fav in favorites"
        :key="fav._id"
        class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-accent transition"
      >
        <NuxtLink
          :to="`/jobs/${fav.jobId._id}`"
          class="text-base font-semibold text-primary hover:text-accent"
        >
          {{ fav.jobId.title }}
        </NuxtLink>
        <p class="text-xs text-muted mt-1">
          {{ fav.jobId.city || 'Місто не вказано' }} · {{ fav.jobId.employmentType }} ·
          {{ fav.jobId.workFormat }}
        </p>
      </article>
    </div>
  </section>
</template>
