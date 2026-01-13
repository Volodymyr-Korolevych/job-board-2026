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
  <header class="border-b border-slate-200 bg-white">
    <nav class="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
      <NuxtLink to="/" class="text-lg font-semibold tracking-tight text-primary">
        JobBoard-2026
      </NuxtLink>

      <div class="flex items-center gap-4 text-sm">
        <NuxtLink to="/jobs" class="hover:text-accent">Вакансії</NuxtLink>
        <NuxtLink to="/rules" class="hover:text-accent">Правила використання</NuxtLink>

        <template v-if="user?.role === 'seeker'">
          <NuxtLink to="/profile" class="hover:text-accent">Профіль</NuxtLink>
          <NuxtLink to="/profile/favorites" class="hover:text-accent">Обране</NuxtLink>
        </template>

        <template v-if="user?.role === 'employer'">
          <NuxtLink to="/employer/company" class="hover:text-accent">
            Компанія
          </NuxtLink>
          <NuxtLink to="/employer/jobs" class="hover:text-accent">
            Мої вакансії
          </NuxtLink>
        </template>

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
</template>
