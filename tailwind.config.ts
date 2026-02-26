// tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111827", // темно-графітовий
        accent: "#3B82F6",  // синій (Tailwind blue-500)
        muted: "#6B7280",   // grey-500
        brand: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            600: '#3B82F6',
            700: '#2563EB',
          },
          ink: {
            900: '#0F172A',
            700: '#334155',
            600: '#475569',
          },
          line: '#E2E8F0',
          page: '#F8FAFC',
          surface: '#FFFFFF',
        },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
