<script setup lang="ts">
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

defineProps<{ job: Job; showDescription?: boolean }>()

const showDescription = computed(() => (typeof showDescription === 'boolean' ? showDescription : true))

const formatPhone = (v: string) => {
  const d = v.replace('+380', '')
  return `+380 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)}${d.slice(7, 9)}`
}

</script>

<template>
  <article class="vacancy-card">
    <div class="flex justify-between gap-4 items-start">
      <div class="min-w-0">
        <NuxtLink :to="`/jobs/${job._id}`" class="text-lg font-bold">
          {{ job.title || 'Без назви' }}
        </NuxtLink>

        <p class="mt-2 text-sm text-ink-600 flex flex-wrap gap-2 items-center">
          {{ job.city || 'Місто не вказано' }}
          <template v-if="job.employmentType"> · {{ job.employmentType }}</template>
          <template v-if="job.workFormat"> · {{ job.workFormat }}</template>
        </p>

        <p v-if="job.companyName || job.companyPhone" class="text-xs text-slate-700 mt-1">
          <span class="font-semibold text-ink-700" v-if="job.companyName">{{ job.companyName }}</span>
          <span v-if="job.companyName && job.companyPhone"> · </span>
          <span class="font-semibold text-ink-900"  v-if="job.companyPhone">{{ formatPhone(job.companyPhone) }}</span>
        </p>
        <p v-else class="text-xs text-muted mt-1">Компанія: не вказано</p>
      </div>

      <div class="font-semibold">
        <span v-if="job.salaryFrom || job.salaryTo">
          {{ job.salaryFrom || '—' }}–{{ job.salaryTo || '—' }} ₴
        </span>
        <span v-else class="text-muted text-xs">Зарплата не вказана</span>
      </div>
    </div>

    <p v-if="showDescription && job.description" class="mt-3 text-sm text-ink-700 line-clamp-2">
      {{ job.description }}
    </p>
  </article>
</template>
