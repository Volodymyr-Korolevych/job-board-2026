import Company from '../../models/Company'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const body = await readBody(event)
  const existing = await Company.findOne({ ownerId: user.id })
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Company already exists' })
  }

  const company = await Company.create({
    ...body,
    ownerId: user.id
  })

  return company
})
