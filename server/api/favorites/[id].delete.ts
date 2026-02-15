import Favorite from '~/server/models/Favorite'
import { connectDB } from '~/server/utils/db'
import { requireSeeker } from '~/server/utils/authUser'

export default defineEventHandler(async (event) => {
  await connectDB()
  const user = await requireSeeker(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Не вказано id' })
  }

  const res = await Favorite.deleteOne({ _id: id, seekerId: user._id })
  return { ok: true, deletedCount: res.deletedCount || 0 }
})
