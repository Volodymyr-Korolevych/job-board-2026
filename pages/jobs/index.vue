<script setup lang="ts">
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
      <h1 class="text-2xl font-semibold text-primary">Знайди роботу своєї мрії</h1>
      <p class="text-sm text-muted mt-1">
        Job-board для пошуку роботи та працівників.
      </p>
    </div>

    <div
      class="grid gap-3 md:grid-cols-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200"
    >
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

      <article
        v-for="job in jobs"
        :key="job._id"
        class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-accent transition flex flex-col gap-2"
      >
        <div class="flex justify-between gap-4 items-baseline">
          <div class="min-w-0">
            <NuxtLink
              :to="`/jobs/${job._id}`"
              class="text-base font-semibold text-primary hover:text-accent"
            >
              {{ job.title }}
            </NuxtLink>

            <p class="text-xs text-muted mt-1">
              {{ job.city || 'Місто не вказано' }} · {{ job.employmentType }} ·
              {{ job.workFormat }}
            </p>

            <!-- TASK008: компанія + телефон -->
            <p v-if="job.companyName || job.companyPhone" class="text-xs text-slate-700 mt-1">
              <span v-if="job.companyName" class="font-medium">{{ job.companyName }}</span>
              <span v-if="job.companyName && job.companyPhone"> · </span>
              <span v-if="job.companyPhone">{{ job.companyPhone }}</span>
            </p>
            <p v-else class="text-xs text-muted mt-1">
              Компанія: не вказано
            </p>
          </div>

          <div class="text-right text-sm text-primary font-medium whitespace-nowrap">
            <span v-if="job.salaryFrom || job.salaryTo">
              {{ job.salaryFrom || '—' }}–{{ job.salaryTo || '—' }} ₴
            </span>
            <span v-else class="text-muted text-xs">Зарплата не вказана</span>
          </div>
        </div>

        <p class="text-xs text-slate-600">
          {{ job.description }}
        </p>
      </article>
    </div>
  </section>
</template>
