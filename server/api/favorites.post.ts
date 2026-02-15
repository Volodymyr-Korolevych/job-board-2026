import Favorite from '~/server/models/Favorite'
import { connectDB } from '~/server/utils/db'
import { getUserFromEvent } from '~/server/utils/getUserFromEvent'

export default defineEventHandler(async (event) => {
  await connectDB()

  const user: any = await getUserFromEvent(event)
  if (!user?._id) {
    throw createError({ statusCode: 401, statusMessage: 'Потрібна авторизація' })
  }
  if (user.role !== 'seeker') {
    throw createError({ statusCode: 403, statusMessage: 'Доступно лише для пошукача' })
  }

  const body = await readBody(event)
  const jobId = body?.jobId ? String(body.jobId) : ''
  if (!jobId) {
    throw createError({ statusCode: 400, statusMessage: 'Не вказано jobId' })
  }

  try {
    const fav = await Favorite.create({ seekerId: user._id, jobId })
    return { ok: true, favoriteId: String(fav._id) }
  } catch (e: any) {
    if (String(e?.code) == '11000') return { ok: true, already: true }
    throw createError({ statusCode: 500, statusMessage: 'Не вдалося додати в обране' })
  }
})
