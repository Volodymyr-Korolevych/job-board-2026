import Favorite from '../../models/Favorite'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'seeker') {
    throw createError({ statusCode: 401, statusMessage: 'Only seekers' })
  }

  const favorites = await Favorite
    .find({ seekerId: user.id })
    .populate('jobId')

  return favorites
})
