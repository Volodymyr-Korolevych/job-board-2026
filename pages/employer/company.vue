<script setup lang="ts">
const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  name: '',
  city: '',
  website: '',
  description: '',
  industry: '',
  staffCount: null as number | null
})

const initial = ref({
  name: '',
  city: '',
  website: '',
  description: '',
  industry: '',
  staffCount: null as number | null
})

const fieldErrors = reactive<Record<string, string>>({
  name: '',
  website: '',
  staffCount: ''
})

const clearFieldErrors = () => {
  fieldErrors.name = ''
  fieldErrors.website = ''
  fieldErrors.staffCount = ''
}

const normalizeUrl = (url: string) => url.trim()

const validate = () => {
  clearFieldErrors()
  let ok = true

  if (!form.name.trim()) {
    fieldErrors.name = 'Вкажіть назву компанії'
    ok = false
  }

  if (form.website) {
    const u = normalizeUrl(form.website)
    // дозволяємо тільки http/https
    if (!/^https?:\/\/.+/i.test(u)) {
      fieldErrors.website = 'Вкажіть коректне посилання (наприклад, https://company.com)'
      ok = false
    }
  }

  if (form.staffCount !== null) {
    const n = Number(form.staffCount)
    if (Number.isNaN(n) || n < 1) {
      fieldErrors.staffCount = 'Кількість співробітників має бути числом від 1'
      ok = false
    }
  }

  return ok
}

const { data, error: fetchError } = await useFetch('/api/company')

const applyFromServer = (src: any) => {
  form.name = src?.name || ''
  form.city = src?.city || ''
  form.website = src?.website || ''
  form.description = src?.description || ''
  form.industry = src?.industry || ''
  form.staffCount = src?.staffCount ?? null

  initial.value = {
    name: form.name,
    city: form.city,
    website: form.website,
    description: form.description,
    industry: form.industry,
    staffCount: form.staffCount
  }
}

if (data.value) applyFromServer(data.value)

const hasChanges = computed(() => {
  const a = initial.value
  return (
    form.name !== a.name ||
    form.city !== a.city ||
    form.website !== a.website ||
    form.description !== a.description ||
    form.industry !== a.industry ||
    (form.staffCount ?? null) !== (a.staffCount ?? null)
  )
})

watch(
  () => ({ ...form }),
  () => {
    if (saved.value) saved.value = false
  },
  { deep: true }
)

const submit = async () => {
  error.value = null
  saved.value = false

  if (!validate()) {
    error.value = 'Перевірте поля форми'
    return
  }
  if (!hasChanges.value) return

  saving.value = true
  try {
    const updated: any = await $fetch('/api/company', {
      method: 'PUT',
      body: form
    })
    applyFromServer(updated)
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Не вдалося зберегти профіль компанії'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="max-w-xl space-y-4">
    <h1 class="text-lg font-semibold text-primary">Профіль компанії</h1>

    <p class="text-xs text-muted">
      Дані компанії відображаються у вакансіях і допомагають пошукачам краще вас зрозуміти.
    </p>

    <div v-if="fetchError" class="text-xs text-red-500">
      {{ fetchError.data?.statusMessage || 'Помилка завантаження профілю компанії' }}
    </div>

    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>

    <!-- novalidate: вимикає браузерні англ. підказки -->
    <form
      v-if="!fetchError"
      novalidate
      @submit.prevent="submit"
      class="space-y-3 bg-white p-4 rounded-2xl border border-slate-200"
    >
      <div class="space-y-1">
        <label class="text-xs text-muted">Назва компанії</label>
        <input
          v-model="form.name"
          type="text"
          aria-required="true"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
        <p v-if="fieldErrors.name" class="text-[11px] text-red-500">{{ fieldErrors.name }}</p>
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
          type="text"
          inputmode="url"
          placeholder="https://company.com"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
        <p v-if="fieldErrors.website" class="text-[11px] text-red-500">{{ fieldErrors.website }}</p>
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
        <p v-if="fieldErrors.staffCount" class="text-[11px] text-red-500">{{ fieldErrors.staffCount }}</p>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Опис компанії</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="pt-1">
        <button
          v-if="hasChanges && !saved"
          type="submit"
          :disabled="saving"
          class="w-full text-sm px-4 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90 disabled:opacity-60"
        >
          {{ saving ? 'Збереження...' : 'Зберегти' }}
        </button>

        <div
          v-else-if="saved"
          class="w-full text-sm px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-medium text-center border border-emerald-200"
        >
          Збережено ✓
        </div>
      </div>
    </form>
  </section>
</template>
