<script setup lang="ts">
const email = ref('')
const password = ref('')
const role = ref<'seeker' | 'employer'>('seeker')
const error = ref<string | null>(null)
const submitting = ref(false)
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
  phone: '', // TASK007
  website: '',
  description: '',
  industry: '',
  staffCount: null as number | null
})

const fieldErrors = reactive<Record<string, string>>({
  email: '',
  password: '',
  fullName: '',
  companyName: '',
  cvLink: '',
  website: '',
  staffCount: '',
  phone: '' // TASK007
})

const clearFieldErrors = () => {
  for (const k of Object.keys(fieldErrors)) fieldErrors[k] = ''
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isHttpUrl = (v: string) => /^https?:\/\/.+/i.test(v.trim())

// Телефон: дозволяємо +, цифри, пробіли, (), -, але перевіряємо що цифр >= 10
const normalizePhone = (v: string) => v.trim()
const isValidPhone = (v: string) => {
  const s = normalizePhone(v)
  if (!/^[+\d\s().-]+$/.test(s)) return false
  const digits = s.replace(/\D/g, '')
  return digits.length >= 10
}

const mapAuthError = (e: any): string => {
  const status = e?.statusCode || e?.data?.statusCode || e?.response?.status
  const msg = String(e?.data?.statusMessage || e?.data?.message || e?.message || '').toLowerCase()

  if (status === 409) return 'Користувач з таким email вже існує'
  if (status === 400) return 'Перевірте поля реєстрації'
  if (status === 429) return 'Забагато спроб. Спробуйте пізніше'
  if (msg.includes('duplicate') || msg.includes('already') || msg.includes('exists')) return 'Користувач з таким email вже існує'
  if (msg.includes('invalid') && msg.includes('email')) return 'Вкажіть коректний email'
  if (msg.includes('password') && (msg.includes('short') || msg.includes('min'))) return 'Пароль занадто короткий'
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
    return 'Помилка мережі. Перевірте інтернет і спробуйте ще раз'
  }
  return e?.data?.statusMessage || 'Не вдалося зареєструватися. Спробуйте ще раз'
}

const validate = () => {
  clearFieldErrors()
  let ok = true

  if (!email.value.trim()) {
    fieldErrors.email = 'Вкажіть email'
    ok = false
  } else if (!isEmail(email.value)) {
    fieldErrors.email = 'Email має бути коректним (наприклад, name@gmail.com)'
    ok = false
  }

  if (!password.value) {
    fieldErrors.password = 'Вкажіть пароль'
    ok = false
  } else if (password.value.length < 6) {
    fieldErrors.password = 'Пароль має містити щонайменше 6 символів'
    ok = false
  }

  if (role.value === 'seeker') {
    if (!seekerProfile.fullName.trim()) {
      fieldErrors.fullName = "Вкажіть повне ім'я"
      ok = false
    }
    if (seekerProfile.cvLink && !isHttpUrl(seekerProfile.cvLink)) {
      fieldErrors.cvLink = 'Лінк на CV має починатися з http:// або https://'
      ok = false
    }
  } else {
    if (!companyProfile.name.trim()) {
      fieldErrors.companyName = 'Вкажіть назву компанії'
      ok = false
    }

    // TASK007: телефон (не обов'язковий, але якщо введений — має бути коректним)
    if (companyProfile.phone && !isValidPhone(companyProfile.phone)) {
      fieldErrors.phone = 'Вкажіть коректний номер телефону (мінімум 10 цифр)'
      ok = false
    }

    if (companyProfile.website && !isHttpUrl(companyProfile.website)) {
      fieldErrors.website = 'Сайт має починатися з http:// або https://'
      ok = false
    }
    if (companyProfile.staffCount !== null) {
      const n = Number(companyProfile.staffCount)
      if (Number.isNaN(n) || n < 1) {
        fieldErrors.staffCount = 'Кількість співробітників має бути числом від 1'
        ok = false
      }
    }
  }

  return ok
}

const submit = async () => {
  error.value = null
  if (!validate()) {
    error.value = 'Перевірте поля форми'
    return
  }

  submitting.value = true
  try {
    const body: any = {
      email: email.value.trim(),
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
        companyPhone: companyProfile.phone.trim(), // TASK007
        companyWebsite: companyProfile.website,
        companyDescription: companyProfile.description,
        companyIndustry: companyProfile.industry,
        companyStaffCount: companyProfile.staffCount
      })
    }

    await $fetch('/api/auth/register', { method: 'POST', body })

    // Автоматичний логін після реєстрації
    const loginRes: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value.trim(), password: password.value }
    })

    user.value = loginRes.user

    if (role.value === 'seeker') {
      await navigateTo('/profile')
    } else {
      await navigateTo('/employer/company')
    }
  } catch (e: any) {
    error.value = mapAuthError(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
    <h1 class="text-lg font-semibold text-primary">Реєстрація</h1>

    <div v-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>

    <form novalidate @submit.prevent="submit" class="space-y-4">
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
            type="text"
            inputmode="email"
            autocomplete="email"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
          <p v-if="fieldErrors.email" class="text-[11px] text-red-500">{{ fieldErrors.email }}</p>
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Пароль</label>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
          <p v-if="fieldErrors.password" class="text-[11px] text-red-500">{{ fieldErrors.password }}</p>
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
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
          <p v-if="fieldErrors.fullName" class="text-[11px] text-red-500">{{ fieldErrors.fullName }}</p>
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
              type="text"
              inputmode="url"
              placeholder="https://..."
              class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
            />
            <p v-if="fieldErrors.cvLink" class="text-[11px] text-red-500">{{ fieldErrors.cvLink }}</p>
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
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
          <p v-if="fieldErrors.companyName" class="text-[11px] text-red-500">{{ fieldErrors.companyName }}</p>
        </div>

        <div class="grid md:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted">Місто</label>
            <input
              v-model="companyProfile.city"
              type="text"
              class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-muted">Контактний телефон (опційно)</label>
            <input
              v-model="companyProfile.phone"
              type="text"
              inputmode="tel"
              placeholder="+380..."
              class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
            />
            <p v-if="fieldErrors.phone" class="text-[11px] text-red-500">{{ fieldErrors.phone }}</p>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Сайт або лінк</label>
          <input
            v-model="companyProfile.website"
            type="text"
            inputmode="url"
            placeholder="https://company.com"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
          <p v-if="fieldErrors.website" class="text-[11px] text-red-500">{{ fieldErrors.website }}</p>
        </div>

        <div class="space-y-1">
          <label class="text-xs text-muted">Опис компанії</label>
          <textarea
            v-model="companyProfile.description"
            rows="3"
            class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
          />
        </div>

        <div class="grid md:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs text-muted">Сфера діяльності</label>
            <input
              v-model="companyProfile.industry"
              type="text"
              class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-muted">К-сть співробітників (опційно)</label>
            <input
              v-model.number="companyProfile.staffCount"
              type="number"
              min="1"
              class="w-full text-sm px-3 py-2 border rounded-xl outline-none focus:border-accent"
            />
            <p v-if="fieldErrors.staffCount" class="text-[11px] text-red-500">{{ fieldErrors.staffCount }}</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full text-sm px-4 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90 disabled:opacity-60"
      >
        {{ submitting ? 'Реєстрація...' : 'Зареєструватися' }}
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
