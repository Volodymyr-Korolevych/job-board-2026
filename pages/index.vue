<script setup lang="ts">
import JobCard from '~/components/JobCard.vue'

const term = ref('')
const city = ref('')

const { data: jobs, refresh } = await useFetch('/api/jobs', {
  query: { term, city }
})

const search = async () => {
  await refresh()
}
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-ink-900">Вакансії</h1>
      <p class="mt-1 text-ink-600">Знайдіть роботу або перегляньте актуальні пропозиції</p>
    </div>

    <div class="grid gap-3 md:grid-cols-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-line">
      <input v-model="term" type="text" placeholder="Посада або ключові слова" class="input md:col-span-2" />
      <input v-model="city" type="text" placeholder="Місто" class="input" />
      <button @click="search" class="btn-primary w-full">
        Пошук
      </button>
    </div>

    <div class="space-y-4 pb-6">
      <div v-if="!jobs?.length" class="text-sm text-ink-600">
        За введеними критеріями для пошуку вакансій поки немає
      </div>

      <JobCard v-for="job in jobs" :key="job._id" :job="job" :show-description="true" />
    </div>
  </section>
</template>
