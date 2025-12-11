<script setup lang="ts">
const email = ref('')
const password = ref('')
const role = ref<'seeker' | 'employer'>('seeker')
const error = ref<string | null>(null)
const user = useAuthUser()

// Профіль пошукача
const seekerProfile = reactive({
  fullName: '',
  city: '',
  desiredPosition: '',
  level: 'junior',
  cvLink: ''
})

// Профіль компанії
const companyProfile = reactive({
  name: '',
  city: '',
  website: '',
  description: '',
  industry: '',
  staffCount: null as number | null
})

const submit = async () => {
  error.value = null
  try {
    const body: any = {
      email: email.value,
      password: password.value,
      role: role.value
    }

    if (role.value === 'seeker') {
      Object.assign(body, {
        fullName: seekerProfile.fullName,
        city: seekerProfile.city,
        desiredPosition: seekerProfile.desiredPosition,
        level: seekerProfile.level,
        cvLink: seekerProfile.cvLink
      })
    } else {
      Object.assign(body, {
        companyName: companyProfile.name,
        companyCity: companyProfile.city,
        companyWebsite: companyProfile.website,
        companyDescription: companyProfile.description,
        companyIndustry: companyProfile.industry,
        companyStaffCount: companyProfile.staffCount
      })
    }

    await $fetch('/api/auth/register', {
      method: 'POST',
      body
    })

    // Автоматичний логін після реєстрації
    const loginRes: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    user.value = loginRes.user

    if (role.value === 'seeker') {
      await navigateTo('/profile')
    } else {
      await navigateTo('/employer/company')
    }
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Помилка реєстрації'
  }
}
</script>

<template>
  <section
    class="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 space-y-4"
  >
    <h1 class="text-lg font-semibold text-primary">Реєстрація</h1>

    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>

    <form @submit.prevent="submit" class="space-y-4">
      <div class="space-y-1">
        <label class="text-xs text-muted">Роль</label>
        <div class="flex gap-2 text-xs">
          <button
            type="button"
            @click="role = 'seeker'"
            :class="[
              'flex-1 px-3 py-2 rounded-xl border',
              role === 'seeker' ? 'border-accent bg-blue-50' : 'border-slate-300'
            ]"
          >
            Пошукач
          </button>
          <button
            type="button"
            @click="role = 'employer'"
            :class="[
              'flex-1 px-3 py-2 rounded-xl border',
              role === 'employer' ? 'border-accent bg-blue-50' : 'border-slate-300'
            ]"
          >
            Роботодавець
          </button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs text-muted">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted">Пароль</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>
      </div>

      <!-- Блок профілю пошукача -->
      <div v-if="role === 'seeker'" class="space-y-3 border-t border-slate-200 pt-3">
        <h2 class="text-sm font-semibold text-primary">Профіль пошукача</h2>

        <div class="space-y-1">
          <label class="text-xs text-muted">Повне ім'я</label>
          <input
            v-model="seekerProfile.fullName"
            type="text"
            required
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Місто</label>
          <input
            v-model="seekerProfile.city"
            type="text"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Бажана посада</label>
          <input
            v-model="seekerProfile.desiredPosition"
            type="text"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted">Рівень</label>
            <select
              v-model="seekerProfile.level"
              class="w-full text-xs px-3 py-2 border rounded-xl outline-none focus:border-accent"
            >
              <option value="junior">Junior</option>
              <option value="middle">Middle</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-muted">Лінк на CV</label>
            <input
              v-model="seekerProfile.cvLink"
              type="url"
              class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      <!-- Блок профілю компанії -->
      <div v-else class="space-y-3 border-t border-slate-200 pt-3">
        <h2 class="text-sm font-semibold text-primary">Профіль компанії</h2>

        <div class="space-y-1">
          <label class="text-xs text-muted">Назва компанії</label>
          <input
            v-model="companyProfile.name"
            type="text"
            required
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Місто</label>
          <input
            v-model="companyProfile.city"
            type="text"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Сайт або лінк</label>
          <input
            v-model="companyProfile.website"
            type="url"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Опис компанії</label>
          <textarea
            v-model="companyProfile.description"
            rows="3"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full text-sm px-4 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90"
      >
        Зареєструватися
      </button>
    </form>

    <p class="text-xs text-muted">
      Вже маєте акаунт?
      <NuxtLink to="/auth/login" class="text-accent underline">
        Увійти
      </NuxtLink>
    </p>
  </section>
</template>
