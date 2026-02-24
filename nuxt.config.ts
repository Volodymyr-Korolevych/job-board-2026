// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: false },

  experimental: {
    appManifest: false
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-mongoose',
    '@pinia/nuxt'
  ],

  css: ['@/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {
    mongodbUri: '',
    public: {}
  },

  mongoose: {
    uri: process.env.MONGODB_URI || '',
    options: {},
    modelsDir: 'server/models'
  },

  // 🔴 ВАЖЛИВО: поки ЩО БЕЗ nitro.preset (див. нижче)
  // nitro: { preset: 'vercel' },

  app: {
    head: {
      title: 'JobBoard-2026',
      meta: [
        { name: 'description', content: 'Job board для пошуку роботи та працівників' }
      ]
    }
  },

  compatibilityDate: '2025-12-10'
})