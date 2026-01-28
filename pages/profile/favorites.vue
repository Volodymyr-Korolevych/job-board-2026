<script setup lang="ts">
import JobCard from '~/components/JobCard.vue'

type Job = {
  _id: string
  title?: string
  city?: string
  employmentType?: string
  workFormat?: string
  salaryFrom?: number | string | null
  salaryTo?: number | string | null
  description?: string
  companyName?: string
  companyPhone?: string
}

const { $notify } = useNuxtApp()

const { data: favorites, refresh, pending, error } = await useFetch<Job[]>('/api/favorites')

const items = ref<Job[]>([])

const enrichWithCompany = async (list: Job[]) => {
  if (!Array.isArray(list) || list.length === 0) {
    items.value = []
    return
  }

  const enriched = await Promise.all(
    list.map(async (j) => {
      try {
        const full: any = await $fetch(`/api/jobs/${j._id}`)
        return {
          ...j,
          companyName: full?.companyName || j.companyName || '',
          companyPhone: full?.companyPhone || j.companyPhone || ''
        }
      } catch {
        return j
      }
    })
  )

  items.value = enriched
}

watch(
  () => favorites.value,
  (v) => {
    if (v) enrichWithCompany(v)
  },
  { immediate: true }
)

const removeFromFavorites = async (jobId: string) => {
  try {
    await $fetch('/api/favorites', { method: 'DELETE', body: { jobId } })
    $notify('Видалено з обраного', 'success')
    await refresh()
  } catch (e: any) {
    $notify(e?.data?.statusMessage || 'Не вдалося видалити з обраного', 'error')
  }
}
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-primary">Обране</h1>
      <p class="text-sm text-muted mt-1">Ваші збережені вакансії.</p>
    </div>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-primary">Обране</h1>
      <p class="text-sm text-muted mt-1">Ваші збережені вакансії.</p>
    </div>

    <div v-if="pending" class="text-sm text-muted">Завантаження...</div>

    <div v-else-if="error" class="text-sm text-red-500">
      {{ (error as any)?.data?.statusMessage || 'Помилка завантаження обраного' }}
    <div v-if="pending" class="text-sm text-muted">Завантаження...</div>

    <div v-else-if="error" class="text-sm text-red-500">
      {{ (error as any)?.data?.statusMessage || 'Помилка завантаження обраного' }}
    </div>

    <div v-else class="space-y-3">
      <div v-if="!items.length" class="text-sm text-muted">Поки що немає обраних вакансій</div>

      <div v-for="job in items" :key="job._id" class="space-y-2">
        <JobCard :job="job.jobId" :show-description="true" />
        <button
          class="text-xs px-3 py-2 rounded-xl border border-slate-300 hover:border-red-400 hover:text-red-600"
          @click="removeFromFavorites(job._id)"
        >
          Видалити з обраного
        </button>
      </div>
    </div>
  </section>
</template>
