<script setup lang="ts">
const user = useAuthUser()
const saving = ref(false)
const message = ref<string | null>(null)
const error = ref<string | null>(null)

const form = reactive({
  fullName: '',
  city: '',
  desiredPosition: '',
  level: 'junior',
  cvLink: ''
})

const { data } = await useFetch('/api/profile')

if (data.value) {
  form.fullName = data.value.fullName || ''
  form.city = data.value.city || ''
  form.desiredPosition = data.value.desiredPosition || ''
  form.level = data.value.level || 'junior'
  form.cvLink = data.value.cvLink || ''
}

const submit = async () => {
  saving.value = true
  message.value = null
  error.value = null
  try {
    const res: any = await $fetch('/api/profile', {
      method: 'PUT',
      body: form
    })
    message.value = 'Профіль збережено'
    // Оновлюємо локальний стейт користувача (мінімально)
    if (user.value) {
      user.value = {
        ...user.value,
        fullName: res.fullName,
        city: res.city,
        desiredPosition: res.desiredPosition,
        level: res.level
      }
    }
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Помилка збереження профілю'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="max-w-xl space-y-4">
    <h1 class="text-lg font-semibold text-primary">Мій профіль</h1>

    <p class="text-xs text-muted">
      Дані цього профілю використовуються при відгуку на вакансії.
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
        <label class="text-xs text-muted">Повне ім'я</label>
        <input
          v-model="form.fullName"
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
        <label class="text-xs text-muted">Бажана посада</label>
        <input
          v-model="form.desiredPosition"
          type="text"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs text-muted">Рівень</label>
          <select
            v-model="form.level"
            class="w-full text-xs px-3 py-2 border rounded-xl outline-none focus:border-accent"
          >
            <option value="junior">Junior</option>
            <option value="middle">Middle</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Лінк на CV</label>
          <input
            v-model="form.cvLink"
            type="url"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>
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
