import Job from '../../models/Job'
import Company from '../../models/Company'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const body = await readBody(event)
  const company = await Company.findOne({ ownerId: user.id })
  if (!company) {
    throw createError({ statusCode: 400, statusMessage: 'Спочатку заповніть профіль компанії' })
  }

  const job = await Job.create({
    ...body,
    companyId: company._id,
    employerId: user.id
  })

  return job
})
