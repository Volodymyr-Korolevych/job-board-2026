import Company from '../../models/Company'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const body = await readBody(event)
  const company = await Company.findOneAndUpdate(
    { ownerId: user.id },
    body,
    { new: true, upsert: true }
  )

  return company
})
