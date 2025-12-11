import Favorite from '../../models/Favorite'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'seeker') {
    throw createError({ statusCode: 401, statusMessage: 'Only seekers' })
  }

  await Favorite.findOneAndDelete({ _id: id, seekerId: user.id })
  return { success: true }
})
