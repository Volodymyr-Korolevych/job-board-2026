<script setup lang="ts">
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const submitting = ref(false)

const fieldErrors = reactive<Record<string, string>>({
  email: '',
  password: ''
})

const user = useAuthUser()

const clearFieldErrors = () => {
  fieldErrors.email = ''
  fieldErrors.password = ''
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const mapAuthError = (e: any): string => {
  const status = e?.statusCode || e?.data?.statusCode || e?.response?.status
  const msg = String(e?.data?.statusMessage || e?.data?.message || e?.message || '').toLowerCase()

  if (status === 401) return 'Невірний email або пароль'
  if (status === 403) return 'Доступ заборонено'
  if (status === 429) return 'Забагато спроб. Спробуйте пізніше'
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('ecconn') || msg.includes('failed to fetch')) {
    return 'Помилка мережі. Перевірте інтернет і спробуйте ще раз'
  }
  if (msg.includes('invalid') && msg.includes('email')) return 'Вкажіть коректний email'
  if (msg.includes('password') && (msg.includes('short') || msg.includes('min'))) return 'Пароль занадто короткий'
  if (msg.includes('not found') || msg.includes('user')) return 'Користувача не знайдено'
  return e?.data?.statusMessage || 'Не вдалося увійти. Перевірте дані та спробуйте ще раз'
}

const validate = () => {
  clearFieldErrors()
  let ok = true

  if (!email.value.trim()) {
    fieldErrors.email = 'Вкажіть email'
    ok = false
  } else if (!isEmail(email.value)) {
    fieldErrors.email = 'Email має бути коректним (наприклад, name@gmail.com)'
    ok = false
  }

  if (!password.value) {
    fieldErrors.password = 'Вкажіть пароль'
    ok = false
  } else if (password.value.length < 6) {
    fieldErrors.password = 'Пароль має містити щонайменше 6 символів'
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

  submitting.value = true
  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value.trim(), password: password.value }
    })
    user.value = res.user
    await navigateTo('/')
  } catch (e: any) {
    error.value = mapAuthError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="max-w-sm mx-auto bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
    <h1 class="text-lg font-semibold text-primary">Вхід</h1>

    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>

    <!-- novalidate: вимикає браузерні англомовні підказки -->
    <form novalidate @submit.prevent="submit" class="space-y-3">
      <div class="space-y-1">
        <label class="text-xs text-muted">Email</label>
        <input
          v-model="email"
          type="text"
          inputmode="email"
          autocomplete="email"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
        <p v-if="fieldErrors.email" class="text-[11px] text-red-500">{{ fieldErrors.email }}</p>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted">Пароль</label>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
        <p v-if="fieldErrors.password" class="text-[11px] text-red-500">{{ fieldErrors.password }}</p>
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full text-sm px-4 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90 disabled:opacity-60"
      >
        {{ submitting ? 'Вхід...' : 'Увійти' }}
      </button>
    </form>

    <p class="text-xs text-muted">
      Немає акаунта?
      <NuxtLink to="/auth/register" class="text-accent underline">
        Зареєструватися
      </NuxtLink>
    </p>
  </section>
</template>
