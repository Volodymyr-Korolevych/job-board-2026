<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: job, error: jobError } = await useFetch(`/api/jobs/${id}`)
const { data: applications, error: appsError, refresh } = await useFetch(
  `/api/jobs/${id}/applications`
)

const updateStatus = async (appId: string, status: string) => {
  await $fetch(`/api/applications/${appId}`, {
    method: 'PUT',
    body: { status }
  })
  await refresh()
}

const statusLabel = (s: string) => {
  if (s === 'new') return 'Новий'
  if (s === 'viewed') return 'Переглянуто'
  if (s === 'invited') return 'Запрошено'
  if (s === 'rejected') return 'Відмова'
  return s
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/employer/jobs"
        class="text-xs text-accent underline underline-offset-2"
      >
        ← До списку вакансій
      </NuxtLink>
    </div>

    <div v-if="jobError" class="text-xs text-red-500">
      {{ jobError.data?.statusMessage || 'Помилка завантаження вакансії' }}
    </div>

    <div v-if="job" class="space-y-1">
      <h1 class="text-lg font-semibold text-primary">
        Відгуки на вакансію: {{ job.title }}
      </h1>
      <p class="text-xs text-muted">
        {{ job.city || 'Місто не вказано' }} · {{ job.employmentType }} ·
        {{ job.workFormat }}
      </p>
    </div>

    <div v-if="appsError" class="text-xs text-red-500">
      {{ appsError.data?.statusMessage || 'Помилка завантаження відгуків' }}
    </div>

    <div v-if="!appsError && !applications?.length" class="text-sm text-muted">
      Відгуків на цю вакансію ще немає.
    </div>

    <div v-if="applications?.length" class="space-y-3">
      <article
        v-for="app in applications"
        :key="app._id"
        class="bg-white p-4 rounded-2xl border border-slate-200 space-y-2"
      >
        <div class="flex justify-between items-start gap-4">
          <div class="space-y-1">
            <h2 class="text-sm font-semibold text-primary">
              {{ app.seekerId?.fullName || 'Анонімний кандидат' }}
            </h2>
            <p class="text-xs text-muted">
              {{ app.seekerId?.city || 'Місто не вказано' }}
            </p>
            <p class="text-xs text-muted" v-if="app.seekerId?.desiredPosition">
              Бажана посада: {{ app.seekerId.desiredPosition }}
            </p>
            <p class="text-xs text-muted" v-if="app.seekerId?.cvLink">
              CV:
              <a
                :href="app.seekerId.cvLink"
                target="_blank"
                rel="noreferrer"
                class="text-accent underline"
              >
                переглянути
              </a>
            </p>
          </div>
          <div class="text-right space-y-1">
            <div
              class="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[10px] uppercase tracking-wide text-slate-600"
            >
              {{ statusLabel(app.status) }}
            </div>
            <p class="text-[11px] text-muted">
              {{ new Date(app.createdAt).toLocaleString('uk-UA') }}
            </p>
          </div>
        </div>

        <div v-if="app.message" class="text-xs text-slate-700 whitespace-pre-line">
          {{ app.message }}
        </div>

        <div class="flex flex-wrap gap-2 text-[11px] mt-2">
          <button
            v-if="app.status !== 'viewed'"
            @click="updateStatus(app._id, 'viewed')"
            class="px-2.5 py-1 rounded-full border border-slate-300 hover:border-accent"
          >
            Позначити як переглянутий
          </button>
          <button
            v-if="app.status !== 'invited'"
            @click="updateStatus(app._id, 'invited')"
            class="px-2.5 py-1 rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            Запросити на співбесіду
          </button>
          <button
            v-if="app.status !== 'rejected'"
            @click="updateStatus(app._id, 'rejected')"
            class="px-2.5 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-50"
          >
            Відмова
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
