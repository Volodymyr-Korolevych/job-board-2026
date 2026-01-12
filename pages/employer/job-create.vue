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

const submit = async () => {
  error.value = null
  if (!validate()) {
    error.value = 'Перевірте поля форми'
    return
  }

  saving.value = true
  try {
    await $fetch('/api/jobs', {
      method: 'POST',
      body: {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      }
    })
    await navigateTo('/employer/jobs')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Не вдалося створити вакансію'
  } finally {
    saving.value = false
  }
}
</script>
<!-- template лишається без змін -->
