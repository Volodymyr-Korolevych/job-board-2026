<template>
  <div class="min-h-dvh flex flex-col bg-page">
    <AppHeader />

    <main class="container-page flex-1 pt-10 md:pt-12 pb-10">
      <NuxtPage />
    </main>

    <footer class="mt-auto border-t border-line bg-slate-50">
      <div class="container-page py-4 flex justify-between items-center">
        <span class="text-ms text-ink-600">© 2026 JobBoard-2026</span>

        <div class="flex gap-6 text-md font-medium">
          <NuxtLink to="/about" class="text-ink-700 hover:text-brand-700">Про нас</NuxtLink>
          <NuxtLink to="/contacts" class="text-ink-700 hover:text-brand-700">Контакти</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
