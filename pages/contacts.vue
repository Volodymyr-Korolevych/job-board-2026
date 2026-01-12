<script setup lang="ts">
definePageMeta({ title: 'Контакти' })
</script>

<template>
  <section class="max-w-3xl space-y-6">
    <h1 class="text-xl font-semibold text-primary">Контакти</h1>

    <div class="bg-white border border-slate-200 rounded-2xl p-5 space-y-6">
      <div class="space-y-2">
        <h2 class="text-base font-semibold text-primary">Телефони</h2>

        <div class="grid sm:grid-cols-3 gap-3 text-sm">
          <div class="rounded-xl border border-slate-200 p-3">
            <div class="text-xs text-slate-500">Vodafone</div>
            <div class="font-medium">050 361-02-35</div>
          </div>
          <div class="rounded-xl border border-slate-200 p-3">
            <div class="text-xs text-slate-500">Київстар</div>
            <div class="font-medium">067 630-30-84</div>
          </div>
          <div class="rounded-xl border border-slate-200 p-3">
            <div class="text-xs text-slate-500">Lifecell</div>
            <div class="font-medium">093 966-15-22</div>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h2 class="text-base font-semibold text-primary">Електронна пошта</h2>

        <div class="grid sm:grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl border border-slate-200 p-3">
            <div class="text-xs text-slate-500">Служба підтримки</div>
            <a class="font-medium hover:text-accent" href="mailto:support@JobBoard.ua">support@JobBoard.ua</a>
          </div>
          <div class="rounded-xl border border-slate-200 p-3">
            <div class="text-xs text-slate-500">Послуги для роботодавців</div>
            <a class="font-medium hover:text-accent" href="mailto:sales@JobBoard.ua">sales@JobBoard.ua</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
