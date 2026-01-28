          <script setup lang="ts">
          import JobCard from '~/components/JobCard.vue'

          type Favorite = {
            _id?: string
            seekerId?: string
            jobId: any
          }

          type Job = {
            _id: string
            title?: string
            city?: string
            employmentType?: string
            workFormat?: string
            salaryFrom?: number | string | null
            salaryTo?: number | string | null
            description?: string
            companyName?: string
            companyPhone?: string
          }

          const { $notify } = useNuxtApp()

          const { data: favorites, refresh, pending, error } = await useFetch<Favorite[]>('/api/favorites')

          const jobs = ref<Job[]>([])

          const getJobId = (fav: Favorite): string => {
            if (!fav?.jobId) return ''
            if (typeof fav.jobId === 'string') return fav.jobId
            if (typeof fav.jobId === 'object' && fav.jobId._id) return String(fav.jobId._id)
            return ''
          }

          const loadJobs = async (list: Favorite[] | null | undefined) => {
            if (!Array.isArray(list) || list.length === 0) {
              jobs.value = []
              return
            }

            const ids = list.map(getJobId).filter(Boolean)

            const loaded = await Promise.all(
              ids.map(async (id) => {
                try {
                  return await $fetch<Job>(`/api/jobs/${id}`)
                } catch {
                  return null
                }
              })
            )

            jobs.value = loaded.filter(Boolean) as Job[]
          }

          watch(
            () => favorites.value,
            (v) => {
              loadJobs(v)
            },
            { immediate: true }
          )

          const removeFromFavorites = async (jobId: string) => {
            try {
              await $fetch('/api/favorites', { method: 'DELETE', body: { jobId } })
              $notify('Видалено з обраного', 'success')
              await refresh()
            } catch (e: any) {
              $notify(e?.data?.statusMessage || 'Не вдалося видалити з обраного', 'error')
            }
          }
</script>
          
          <template>
            <section class="space-y-6">
              <div>
                <h1 class="text-2xl font-semibold text-primary">Обране</h1>
                <p class="text-sm text-muted mt-1">Ваші збережені вакансії.</p>
              </div>

              <div v-if="pending" class="text-sm text-muted">Завантаження...</div>

              <div v-else-if="error" class="text-sm text-red-500">
                {{ (error as any)?.data?.statusMessage || 'Помилка завантаження обраного' }}
              </div>

              <div v-else class="space-y-3">
                <div v-if="!jobs.length" class="text-sm text-muted">Поки що немає обраних вакансій</div>

                <div v-for="job in jobs" :key="job._id" class="space-y-2">
                  <JobCard :job="job" :show-description="true" />
                  <button
                    class="text-xs px-3 py-2 rounded-xl border border-slate-300 hover:border-red-400 hover:text-red-600"
                    @click="removeFromFavorites(job._id)">
                    Видалити з обраного
                  </button>
                </div>
              </div>
            </section>
          </template>
