<script setup lang="ts">
const email = ref('')
const password = ref('')
const role = ref<'seeker' | 'employer'>('seeker')
const error = ref<string | null>(null)
const user = useAuthUser()

const submit = async () => {
  error.value = null
  try {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: email.value, password: password.value, role: role.value }
    })
    // авто-логін
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    user.value = res.user
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Помилка реєстрації'
  }
}
</script>

<template>
  <section class="max-w-sm mx-auto bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
    <h1 class="text-lg font-semibold text-primary">Реєстрація</h1>

    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>

    <form @submit.prevent="submit" class="space-y-3">
      <div class="space-y-1">
        <label class="text-xs text-muted">Роль</label>
        <div class="flex gap-2 text-xs">
          <button
            type="button"
            @click="role = 'seeker'"
            :class="[
              'flex-1 px-3 py-2 rounded-xl border',
              role === 'seeker' ? 'border-accent bg-blue-50' : 'border-slate-300'
            ]"
          >
            Пошукач
          </button>
          <button
            type="button"
            @click="role = 'employer'"
            :class="[
              'flex-1 px-3 py-2 rounded-xl border',
              role === 'employer' ? 'border-accent bg-blue-50' : 'border-slate-300'
            ]"
          >
            Роботодавець
          </button>
        </div>
      </div>

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
        Зареєструватися
      </button>
    </form>
  </section>
</template>
