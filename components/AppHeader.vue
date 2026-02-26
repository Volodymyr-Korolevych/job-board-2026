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
  <header class="border-b border-slate-200 bg-white shadow-sm">
    <nav class="mx-auto max-w-7xl flex items-center justify-between px-4 py-5">
      <NuxtLink to="/" class="text-lg font-bold tracking-tight">
        JobBoard-2026
      </NuxtLink>

      <div class="flex items-center gap-4 text-sm">
        <NuxtLink to="/jobs" class="text-base font-medium text-ink-700 hover:text-brand-700">Вакансії</NuxtLink>
        <NuxtLink to="/rules" class="text-base font-medium text-ink-700 hover:text-brand-700">Правила використання</NuxtLink>

        <template v-if="user?.role === 'seeker'">
          <NuxtLink to="/profile" class="hover:text-accent">Профіль</NuxtLink>
          <NuxtLink to="/profile/favorites" class="text-base font-medium text-ink-700 hover:text-brand-700">Обране</NuxtLink>
        </template>

        <template v-if="user?.role === 'employer'">
          <NuxtLink to="/employer/company" class="text-base font-medium text-ink-700 hover:text-brand-700">
            Компанія
          </NuxtLink>
          <NuxtLink to="/employer/jobs" class="text-base font-medium text-ink-700 hover:text-brand-700">
            Мої вакансії
          </NuxtLink>
        </template>

        <template v-if="!user">
          <NuxtLink
            to="/auth/login"
            class="px-3 py-1 rounded-full border border-slate-300 text-base font-medium text-ink-700 hover:text-brand-700"
          >
            Увійти
          </NuxtLink>
        </template>

        <template v-else>
          <span class="text-xs text-muted">
            {{ user.email }}
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
</template>
