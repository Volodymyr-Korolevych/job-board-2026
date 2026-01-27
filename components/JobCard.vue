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

const props = defineProps<{
  job: Job
  showDescription?: boolean
}>()

const showDescription = computed(() => props.showDescription ?? true)

const salaryText = computed(() => {
  const from = props.job.salaryFrom
  const to = props.job.salaryTo
  if (from || to) return `${from || '—'}–${to || '—'} ₴`
  return ''
})
</script>

<template>
  <article class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-accent transition flex flex-col gap-2">
    <div class="flex justify-between gap-4 items-start">
      <div class="min-w-0">
        <NuxtLink :to="`/jobs/${job._id}`" class="text-base font-semibold text-primary hover:text-accent">
          {{ job.title || 'Без назви' }}
        </NuxtLink>

        <p class="text-xs text-muted mt-1">
          {{ job.city || 'Місто не вказано' }}
          <template v-if="job.employmentType"> · {{ job.employmentType }}</template>
          <template v-if="job.workFormat"> · {{ job.workFormat }}</template>
        </p>

        <p v-if="job.companyName || job.companyPhone" class="text-xs text-slate-700 mt-1">
          <span v-if="job.companyName" class="font-medium">{{ job.companyName }}</span>
          <span v-if="job.companyName && job.companyPhone"> · </span>
          <span v-if="job.companyPhone">{{ job.companyPhone }}</span>
        </p>
        <p v-else class="text-xs text-muted mt-1">Компанія: не вказано</p>
      </div>

      <div class="text-right text-sm text-primary font-medium whitespace-nowrap">
        <span v-if="salaryText">{{ salaryText }}</span>
        <span v-else class="text-muted text-xs">Зарплата не вказана</span>
      </div>
    </div>

    <p v-if="showDescription && job.description" class="text-xs text-slate-600">
      {{ job.description }}
    </p>
  </article>
</template>
