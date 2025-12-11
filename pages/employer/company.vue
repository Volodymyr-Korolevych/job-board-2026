<script setup lang="ts">
const saving = ref(false)
const message = ref<string | null>(null)
const error = ref<string | null>(null)

const form = reactive({
  name: '',
  city: '',
  website: '',
  description: '',
  industry: '',
  staffCount: null as number | null
})

const { data } = await useFetch('/api/company')

if (data.value) {
  form.name = data.value.name || ''
  form.city = data.value.city || ''
  form.website = data.value.website || ''
  form.description = data.value.description || ''
  form.industry = data.value.industry || ''
  form.staffCount = data.value.staffCount || null
}

const submit = async () => {
  saving.value = true
  message.value = null
  error.value = null
  try {
    await $fetch('/api/company', {
      method: 'PUT',
      body: form
    })
    message.value = 'Профіль компанії збережено'
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Помилка збереження профілю компанії'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="max-w-xl space-y-4">
    <h1 class="text-lg font-semibold text-primary">Профіль компанії</h1>

    <p class="text-xs text-muted">
      Дані компанії відображаються у вакансіях і допомагають пошукачам краще вас
      зрозуміти.
    </p>

    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>
    <div v-if="message" class="text-xs text-emerald-600">
      {{ message }}
    </div>

    <form
      @submit.prevent="submit"
      class="space-y-3 bg-white p-4 rounded-2xl border border-slate-200"
    >
      <div class="space-y-1">
        <label class="text-xs text-muted">Назва компанії</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Місто</label>
        <input
          v-model="form.city"
          type="text"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Сайт або лінк</label>
        <input
          v-model="form.website"
          type="url"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Сфера діяльності</label>
        <input
          v-model="form.industry"
          type="text"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Кількість співробітників (опційно)</label>
        <input
          v-model.number="form.staffCount"
          type="number"
          min="1"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Опис компанії</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        :disabled="saving"
        class="w-full text-sm px-4 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90 disabled:opacity-60"
      >
        {{ saving ? 'Збереження...' : 'Зберегти' }}
      </button>
    </form>
  </section>
</template>
