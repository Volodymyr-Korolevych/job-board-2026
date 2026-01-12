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

const isValidNumber = (v: unknown) =>
  typeof v === 'number' && !Number.isNaN(v)

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
    form.salaryFrom > form.salaryTo
  ) {
    fieldErrors.salary = 'Зарплата "від" не може бути більшою за "до"'
    ok = false
  }

  const tagArr = form.tags.split(',').map(t => t.trim()).filter(Boolean)
  if (tagArr.some(t => t.length > 24)) {
    fieldErrors.tags = 'Окремий тег не має перевищувати 24 символи'
    ok = false
  }

  return ok
}

const { data } = await useFetch(`/api/jobs/${id}`)

if (data.value) {
  Object.assign(form, {
    title: data.value.title || '',
    city: data.value.city || '',
    workFormat: data.value.workFormat || 'office',
    employmentType: data.value.employmentType || 'full-time',
    salaryFrom: data.value.salaryFrom ?? null,
    salaryTo: data.value.salaryTo ?? null,
    description: data.value.description || '',
    requirements: data.value.requirements || '',
    conditions: data.value.conditions || '',
    status: data.value.status || 'active',
    tags: (data.value.tags || []).join(', ')
  })
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
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
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
<!-- template лишається без змін -->
