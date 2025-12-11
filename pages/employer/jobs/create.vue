<script setup lang="ts">
const form = reactive({
  title: '',
  city: '',
  workFormat: 'office',
  employmentType: 'full-time',
  salaryFrom: null as number | null,
  salaryTo: null as number | null,
  description: '',
  requirements: '',
  conditions: '',
  tags: '' as string,
  status: 'active'
})

const error = ref<string | null>(null)
const saving = ref(false)

const submit = async () => {
  error.value = null
  saving.value = true
  try {
    await $fetch('/api/jobs', {
      method: 'POST',
      body: { 
        ...form, 
        tags: form.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      }
    })
    await navigateTo('/employer/jobs')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Помилка створення вакансії'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="max-w-xl space-y-4">
    <h1 class="text-lg font-semibold text-primary">Нова вакансія</h1>

    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>

    <form
      @submit.prevent="submit"
      class="space-y-3 bg-white p-4 rounded-2xl border border-slate-200"
    >
      <div class="space-y-1">
        <label class="text-xs text-muted">Посада</label>
        <input
          v-model="form.title"
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

      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="space-y-1">
          <label class="text-xs text-muted">Формат роботи</label>
          <select
            v-model="form.workFormat"
            class="w-full px-3 py-2 border rounded-xl outline-none focus:border-accent text-xs"
          >
            <option value="office">Офіс</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted">Тип зайнятості</label>
          <select
            v-model="form.employmentType"
            class="w-full px-3 py-2 border rounded-xl outline-none focus:border-accent text-xs"
          >
            <option value="full-time">Повна</option>
            <option value="part-time">Часткова</option>
            <option value="freelance">Фріланс</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs text-muted">Зарплата від</label>
          <input
            v-model.number="form.salaryFrom"
            type="number"
            min="0"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted">Зарплата до</label>
          <input
            v-model.number="form.salaryTo"
            type="number"
            min="0"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Опис</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Вимоги</label>
        <textarea
          v-model="form.requirements"
          rows="3"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Умови</label>
        <textarea
          v-model="form.conditions"
          rows="3"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Теги (через кому)</label>
        <input
          v-model="form.tags"
          type="text"
          placeholder="Frontend, Junior, Remote"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        :disabled="saving"
        class="w-full text-sm px-4 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90 disabled:opacity-60"
      >
        {{ saving ? 'Збереження...' : 'Створити' }}
      </button>
    </form>
  </section>
</template>
