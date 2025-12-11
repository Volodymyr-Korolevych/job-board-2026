<script setup lang="ts">
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const user = useAuthUser()

const submit = async () => {
  error.value = null
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    user.value = res.user
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Помилка входу'
  }
}
</script>

<template>
  <section class="max-w-sm mx-auto bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
    <h1 class="text-lg font-semibold text-primary">Вхід</h1>

    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>

    <form @submit.prevent="submit" class="space-y-3">
      <div class="space-y-1">
        <label class="text-xs text-muted">Email</label>
        <input
          v-model="email"
          type="email"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>
      <div class="space-y-1">
        <label class="text-xs text-muted">Пароль</label>
        <input
          v-model="password"
          type="password"
          class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        class="w-full text-sm px-4 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90"
      >
        Увійти
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
