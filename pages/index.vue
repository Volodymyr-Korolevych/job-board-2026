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
      <h1 class="text-2xl font-semibold text-primary">Вакансії</h1>
      <p class="text-sm text-muted mt-1">Знайдіть роботу або перегляньте актуальні пропозиції.</p>
    </div>

    <div class="grid gap-3 md:grid-cols-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
      <input
        v-model="term"
        type="text"
        placeholder="Посада або ключові слова"
        class="md:col-span-2 text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
      />
      <input
        v-model="city"
        type="text"
        placeholder="Місто"
        class="text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
      />
      <button
        @click="search"
        class="text-sm px-4 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90"
      >
        Пошук
      </button>
    </div>

    <div class="space-y-3">
      <div v-if="!jobs?.length" class="text-sm text-muted">
        За введеними критеріями для пошуку вакансій поки немає
      </div>

      <JobCard v-for="job in jobs" :key="job._id" :job="job" :show-description="true" />
    </div>
  </section>
</template>
