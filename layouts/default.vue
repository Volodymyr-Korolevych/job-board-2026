<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <NuxtLink to="/" class="font-semibold tracking-tight text-primary hover:text-accent">
          JobBoard-2026
        </NuxtLink>

        <nav class="flex items-center gap-3 text-sm">
          <NuxtLink to="/jobs" class="hover:text-accent">Вакансії</NuxtLink>
          <NuxtLink to="/employer/jobs" class="hover:text-accent">Роботодавцю</NuxtLink>
          <NuxtLink to="/rules" class="hover:text-accent">Правила використання</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="text-xs text-slate-500">
          © {{ new Date().getFullYear() }} JobBoard-2026
        </div>

        <div class="flex items-center gap-4 text-sm">
          <NuxtLink to="/about" class="hover:text-accent">Про нас</NuxtLink>
          <NuxtLink to="/contacts" class="hover:text-accent">Контакти</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
