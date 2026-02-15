<script setup lang="ts">
import JobCard from '~/components/JobCard.vue'

type Item = {
  _id: string
  createdAt?: string
  job: any
}

const { $notify } = useNuxtApp()

const { data: items, refresh, pending, error } = await useFetch<Item[]>('/api/favorites')

const removeFavorite = async (favoriteId: string) => {
  try {
    const res: any = await $fetch('/api/favorites', { method: 'DELETE', body: { favoriteId } })
    if ((res?.deletedCount || 0) > 0) $notify('Видалено з обраного', 'success')
    else $notify('Запис не знайдено або вже видалено', 'warning')
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

    <div v-if="pending" class="text-sm text-muted">Завантаження...</div>

    <div v-else-if="error" class="text-sm text-red-500">
      {{ (error as any)?.data?.statusMessage || 'Помилка завантаження обраного' }}
    </div>

    <div v-else class="space-y-3">
      <div v-if="!items?.length" class="text-sm text-muted">Поки що немає обраних вакансій</div>

      <div v-for="fav in items" :key="fav._id" class="space-y-2">
        <JobCard v-if="fav.job" :job="fav.job" :show-description="true" />
        <button
          class="text-xs px-3 py-2 rounded-xl border border-slate-300 hover:border-red-400 hover:text-red-600"
          @click="removeFavorite(fav._id)"
        >
          Видалити з обраного
        </button>
      </div>
    </div>
  </section>
</template>
