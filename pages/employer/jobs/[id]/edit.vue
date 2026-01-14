<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const error = ref<string | null>(null)
const saving = ref(false)

const fieldErrors = reactive<Record<string, string>>({
  title: '',
  salary: '',
  tags: ''
})

const clearFieldErrors = () => {
  fieldErrors.title = ''
  fieldErrors.salary = ''
  fieldErrors.tags = ''
}

const form = reactive({
  title: '',
  city: '',
  workFormat: 'офіс',
  employmentType: 'full-time',
  salaryFrom: null as number | null,
  salaryTo: null as number | null,
  description: '',
  requirements: '',
  conditions: '',
  tags: '' as string,
  status: 'active'
})

const isValidNumber = (v: unknown) => typeof v === 'number' && !Number.isNaN(v)

const validate = () => {
  clearFieldErrors()
  let ok = true

  if (!form.title.trim()) {
    fieldErrors.title = 'Вкажіть назву посади'
    ok = false
  }

  if (form.salaryFrom !== null) {
    if (!isValidNumber(form.salaryFrom)) {
      fieldErrors.salary = 'Зарплата "від" має бути числом'
      ok = false
    } else if (form.salaryFrom < 0) {
      fieldErrors.salary = 'Зарплата "від" не може бути відʼємною'
      ok = false
    }
  }

  if (form.salaryTo !== null) {
    if (!isValidNumber(form.salaryTo)) {
      fieldErrors.salary = 'Зарплата "до" має бути числом'
      ok = false
    } else if (form.salaryTo < 0) {
      fieldErrors.salary = 'Зарплата "до" не може бути відʼємною'
      ok = false
    }
  }

  if (
    isValidNumber(form.salaryFrom) &&
    isValidNumber(form.salaryTo) &&
    (form.salaryFrom as number) > (form.salaryTo as number)
  ) {
    fieldErrors.salary = 'Зарплата "від" не може бути більшою за "до"'
    ok = false
  }

  const tagArr = form.tags
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  if (tagArr.some(t => t.length > 24)) {
    fieldErrors.tags = 'Окремий тег не має перевищувати 24 символи'
    ok = false
  }

  return ok
}

const { data, error: fetchError } = await useFetch(`/api/jobs/${id}`)

if (data.value) {
  form.title = data.value.title || ''
  form.city = data.value.city || ''
  form.workFormat = data.value.workFormat || 'офіс'
  form.employmentType = data.value.employmentType || 'full-time'
  form.salaryFrom = data.value.salaryFrom ?? null
  form.salaryTo = data.value.salaryTo ?? null
  form.description = data.value.description || ''
  form.requirements = data.value.requirements || ''
  form.conditions = data.value.conditions || ''
  form.status = data.value.status || 'active'
  form.tags = (data.value.tags || []).join(', ')
}

const submit = async () => {
  error.value = null
  if (!validate()) {
    error.value = 'Перевірте поля форми'
    return
  }

  saving.value = true
  try {
    await $fetch(`/api/jobs/${id}`, {
      method: 'PUT',
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
    error.value = e?.data?.statusMessage || 'Не вдалося зберегти вакансію'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="max-w-xl space-y-4">
    <h1 class="text-lg font-semibold text-primary">Редагування вакансії</h1>

    <div v-if="fetchError" class="text-xs text-red-500">
      {{ fetchError.data?.statusMessage || 'Помилка завантаження вакансії' }}
    </div>
    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>

    <form
      v-if="!fetchError"
      novalidate
      @submit.prevent="submit"
      class="space-y-3 bg-white p-4 rounded-2xl border border-slate-200"
    >
      <div class="space-y-1">
        <label class="text-xs text-muted">Посада</label>
        <input
          v-model="form.title"
          type="text"
          aria-required="true"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
        <p v-if="fieldErrors.title" class="text-[11px] text-red-500">{{ fieldErrors.title }}</p>
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
           <option value="офіс">Офіс</option>
            <option value="дистанційно">Дистанційно</option>
            <option value="офіс/дистанційно">Офіс/дистанційно</option>
            <option value="виробництво">Виробництво</option>
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
            inputmode="numeric"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted">Зарплата до</label>
          <input
            v-model.number="form.salaryTo"
            type="number"
            min="0"
            inputmode="numeric"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>
      </div>
      <p v-if="fieldErrors.salary" class="text-[11px] text-red-500">{{ fieldErrors.salary }}</p>

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
        <p v-if="fieldErrors.tags" class="text-[11px] text-red-500">{{ fieldErrors.tags }}</p>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Статус вакансії</label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 border rounded-xl outline-none focus:border-accent text-xs"
        >
          <option value="active">Активна</option>
          <option value="inactive">Неактивна</option>
        </select>
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
