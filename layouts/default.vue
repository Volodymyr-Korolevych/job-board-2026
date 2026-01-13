<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <AppHeader />

    <main class="flex-1 mx-auto max-w-5xl w-full px-4 py-6">
      <NuxtPage />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500 flex justify-between">
        <span>© 2026 JobBoard-2026</span>
        <div class="flex gap-4">
          <NuxtLink to="/about" class="hover:text-accent">Про нас</NuxtLink>
          <NuxtLink to="/contacts" class="hover:text-accent">Контакти</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
