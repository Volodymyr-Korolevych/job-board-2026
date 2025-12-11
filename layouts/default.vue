<script setup lang="ts">
const user = useAuthUser()
const { data } = await useFetch('/api/auth/me')
if (data.value?.user) {
  user.value = data.value.user
}

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  user.value = null
  await navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <nav class="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight text-primary">
          JobBoard-2026
        </NuxtLink>

        <div class="flex items-center gap-4 text-sm">
          <NuxtLink to="/jobs" class="hover:text-accent">Вакансії</NuxtLink>
          <NuxtLink v-if="user?.role === 'seeker'" to="/profile/favorites" class="hover:text-accent">
            Обране
          </NuxtLink>
          <NuxtLink
            v-if="user?.role === 'employer'"
            to="/employer/jobs"
            class="hover:text-accent"
          >
            Мої вакансії
          </NuxtLink>

          <template v-if="!user">
            <NuxtLink
              to="/auth/login"
              class="px-3 py-1 rounded-full border border-slate-300 hover:border-accent"
            >
              Увійти
            </NuxtLink>
          </template>
          <template v-else>
            <span class="text-xs text-muted">
              {{ user.email }} ({{ user.role }})
            </span>
            <button
              @click="logout"
              class="px-3 py-1 rounded-full border border-slate-300 hover:border-accent"
            >
              Вийти
            </button>
          </template>
        </div>
      </nav>
    </header>

    <main class="flex-1 mx-auto max-w-5xl w-full px-4 py-6">
      <NuxtPage />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500 flex justify-between">
        <span>© 2026 JobBoard-2026</span>
        <div class="flex gap-4">
          <NuxtLink to="/about" class="hover:text-accent">Про сервіс</NuxtLink>
          <NuxtLink to="/contacts" class="hover:text-accent">Контакти</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
