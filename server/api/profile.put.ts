import User from '../models/User'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const ctxUser = event.context.user
  if (!ctxUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { fullName, city, desiredPosition, level, cvLink } = body

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

  user.fullName = fullName || ''
  user.city = city || ''
  user.desiredPosition = desiredPosition || ''
  user.level = level || 'junior'
  user.cvLink = cvLink || ''

  await user.save()

  return {
    fullName: user.fullName || '',
    city: user.city || '',
    desiredPosition: user.desiredPosition || '',
    level: user.level || 'junior',
    cvLink: user.cvLink || ''
  }
})
