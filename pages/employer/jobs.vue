<script setup lang="ts">
const { data: jobs, refresh, error } = await useFetch('/api/employer/jobs')

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

    <div v-if="error" class="text-xs text-red-500">
      {{ error.data?.statusMessage || 'Помилка завантаження вакансій' }}
    </div>

    <div v-if="!error && !jobs?.length" class="text-sm text-muted">
      Ви ще не створили жодної вакансії.
    </div>

    <div v-if="jobs?.length" class="space-y-3">
      <article
        v-for="job in jobs"
        :key="job._id"
        class="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-start"
      >
        <div class="space-y-1">
          <h2 class="text-base font-semibold text-primary">
            {{ job.title }}
          </h2>
          <p class="text-xs text-muted">
            {{ job.city || 'Місто не вказано' }} · {{ job.employmentType }} ·
            {{ job.workFormat }}
          </p>
          <p class="text-xs text-muted">
            Статус:
            <span
              :class="[
                'px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide',
                job.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              ]"
            >
              {{ job.status === 'active' ? 'Активна' : 'Неактивна' }}
            </span>
          </p>
        </div>
        <div class="flex flex-col items-end gap-2 text-xs">
          <div class="text-[11px] text-muted">
            Переглядів: {{ job.views || 0 }} · Відгуків: {{ job.applicationsCount || 0 }}
          </div>
          <div class="flex gap-2">
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
        </div>
      </article>
    </div>
  </section>
</template>
