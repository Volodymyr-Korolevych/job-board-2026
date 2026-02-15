import Favorite from '~/server/models/Favorite'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()

  const user = (event.context as any).user
  if (!user?._id) {
    throw createError({ statusCode: 401, statusMessage: 'Потрібна авторизація' })
  }
  if (user.role !== 'seeker') {
    throw createError({ statusCode: 403, statusMessage: 'Доступно лише для пошукача' })
  }

  const body = await readBody(event)
  const favoriteId = body?.favoriteId ? String(body.favoriteId) : ''
  const jobId = body?.jobId ? String(body.jobId) : ''

  if (!favoriteId && !jobId) {
    throw createError({ statusCode: 400, statusMessage: 'Не вказано favoriteId або jobId' })
  }

  if (favoriteId) {
    const res = await Favorite.deleteOne({ _id: favoriteId, seekerId: user._id })
    return { ok: true, deletedCount: res.deletedCount || 0 }
  }

  const res = await Favorite.deleteOne({ seekerId: user._id, jobId })
  return { ok: true, deletedCount: res.deletedCount || 0 }
})
