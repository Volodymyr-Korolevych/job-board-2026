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
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
