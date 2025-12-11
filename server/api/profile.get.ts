import User from '../models/User'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const ctxUser = event.context.user
  if (!ctxUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = await User.findById(ctxUser.id)
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  if (user.role !== 'seeker') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Profile is available only for seekers'
    })
  }

  return {
    fullName: user.fullName || '',
    city: user.city || '',
    desiredPosition: user.desiredPosition || '',
    level: user.level || 'junior',
    cvLink: user.cvLink || ''
  }
})
