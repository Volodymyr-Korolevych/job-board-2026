<script setup lang="ts">
const { data: jobs, refresh } = await useFetch('/api/employer/jobs')

const removeJob = async (id: string) => {
  if (!confirm('Видалити вакансію?')) return
  await $fetch(`/api/jobs/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold text-primary">Мої вакансії</h1>
      <NuxtLink
        to="/employer/jobs/create"
        class="text-xs px-3 py-2 rounded-xl bg-accent text-white hover:opacity-90"
      >
        Створити вакансію
      </NuxtLink>
    </div>

    <div v-if="!jobs?.length" class="text-sm text-muted">
      Ви ще не створили жодної вакансії.
    </div>

    <div class="space-y-3">
      <article
        v-for="job in jobs"
        :key="job._id"
        class="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-start"
      >
        <div>
          <h2 class="text-base font-semibold text-primary">
            {{ job.title }}
          </h2>
          <p class="text-xs text-muted mt-1">
            {{ job.city || 'Місто не вказано' }} · {{ job.employmentType }} · {{ job.workFormat }}
          </p>
        </div>
        <div class="flex gap-2 text-xs">
          <NuxtLink
            :to="`/employer/jobs/${job._id}/edit`"
            class="px-3 py-1 rounded-xl border border-slate-300 hover:border-accent"
          >
            Редагувати
          </NuxtLink>
          <NuxtLink
            :to="`/employer/jobs/${job._id}/applications`"
            class="px-3 py-1 rounded-xl border border-slate-300 hover:border-accent"
          >
            Відгуки
          </NuxtLink>
          <button
            @click="removeJob(job._id)"
            class="px-3 py-1 rounded-xl border border-red-300 text-red-600 hover:bg-red-50"
          >
            Видалити
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
