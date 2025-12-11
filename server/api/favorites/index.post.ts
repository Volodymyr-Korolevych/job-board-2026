import Favorite from '../../models/Favorite'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'seeker') {
    throw createError({ statusCode: 401, statusMessage: 'Only seekers' })
  }

  const body = await readBody(event)
  const { jobId } = body
  if (!jobId) {
    throw createError({ statusCode: 400, statusMessage: 'jobId required' })
  }

  const fav = await Favorite.findOneAndUpdate(
    { seekerId: user.id, jobId },
    { seekerId: user.id, jobId },
    { upsert: true, new: true }
  )

  return fav
})
