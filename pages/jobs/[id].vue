<script setup lang="ts">
const route = useRoute()
const user = useAuthUser()
const { $notify } = useNuxtApp()

const { data: job } = await useFetch(`/api/jobs/${route.params.id}`)

const applyMessage = ref('')

const applyToJob = async () => {
  await $fetch('/api/applications', {
    method: 'POST',
    body: { jobId: route.params.id, message: applyMessage.value }
  })
  $notify('Відгук відправлено', 'success')
  applyMessage.value = ''
}

const toggleFavorite = async () => {
  await $fetch('/api/favorites', {
    method: 'POST',
    body: { jobId: route.params.id }
  })
  $notify('Додано в обране', 'info')
}
</script>

<template>
  <section v-if="job" class="space-y-4">
    <div class="flex justify-between gap-4 items-start">
      <div>
        <h1 class="text-2xl font-semibold text-primary">{{ job.title }}</h1>

        <p class="text-sm text-muted mt-1">
          {{ job.city || 'Місто не вказано' }} · {{ job.employmentType }} · {{ job.workFormat }}
        </p>

        <p v-if="job.companyName || job.companyPhone" class="text-sm text-slate-700 mt-1">
          <span v-if="job.companyName" class="font-semibold">{{ job.companyName }}</span>
          <span v-if="job.companyName && job.companyPhone"> · </span>
          <span v-if="job.companyPhone">{{ job.companyPhone }}</span>
        </p>
      </div>

      <div class="text-right text-sm text-primary font-medium">
        <span v-if="job.salaryFrom || job.salaryTo">
          {{ job.salaryFrom || '—' }}–{{ job.salaryTo || '—' }} ₴
        </span>
        <span v-else class="text-muted text-xs">Зарплата не вказана</span>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-4">
        <div>
          <h2 class="text-sm font-semibold text-primary mb-1">Опис</h2>
          <p class="text-sm text-slate-700 whitespace-pre-line">{{ job.description }}</p>
        </div>

        <div v-if="job.requirements">
          <h2 class="text-sm font-semibold text-primary mb-1">Вимоги</h2>
          <p class="text-sm text-slate-700 whitespace-pre-line">{{ job.requirements }}</p>
        </div>

        <div v-if="job.conditions">
          <h2 class="text-sm font-semibold text-primary mb-1">Умови</h2>
          <p class="text-sm text-slate-700 whitespace-pre-line">{{ job.conditions }}</p>
        </div>
      </div>

      <aside class="space-y-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <h3 class="text-sm font-semibold text-primary">Компанія</h3>
          <p v-if="job.companyName" class="text-sm text-slate-700">{{ job.companyName }}</p>
          <p v-if="job.companyPhone" class="text-sm text-slate-700">
            Телефон: <span class="font-medium">{{ job.companyPhone }}</span>
          </p>
          <p v-if="!job.companyName && !job.companyPhone" class="text-xs text-muted">
            Контакти компанії не вказані
          </p>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
          <p class="text-xs text-muted">
            Якщо ви авторизовані як пошукач, можете відгукнутися на вакансію або додати її в обране.
          </p>

          <button v-if="user?.role === 'seeker'" @click="toggleFavorite"
            class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 hover:border-accent">
            Додати в обране
          </button>

          <div v-if="user?.role === 'seeker'" class="space-y-2">
            <textarea v-model="applyMessage" rows="3" placeholder="Коротке супровідне повідомлення"
              class="w-full text-xs px-3 py-2 border rounded-xl outline-none focus:border-accent" />
            <button @click="applyToJob"
              class="w-full text-xs px-3 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90">
              Відгукнутися
            </button>
          </div>

          <p v-else class="text-xs text-muted">
            Для відгуку на вакансію потрібно увійти як пошукач.
          </p>
        </div>
      </aside>
    </div>
  </section>
</template>