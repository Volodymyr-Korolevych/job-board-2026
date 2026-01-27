import Job from '~/server/models/Job'
import Company from '~/server/models/Company'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Не вказано id вакансії' })
  }

  const job: any = await Job.findById(id).lean()
  if (!job) {
    throw createError({ statusCode: 404, statusMessage: 'Вакансію не знайдено' })
  }

  const company =
    (job.companyId ? await Company.findById(job.companyId).lean() : null) ||
    (job.employerId ? await Company.findOne({ ownerId: job.employerId }).lean() : null) ||
    (job.ownerId ? await Company.findOne({ ownerId: job.ownerId }).lean() : null) ||
    (job.userId ? await Company.findOne({ ownerId: job.userId }).lean() : null)

  return {
    ...job,
    companyName: company?.name || '',
    companyPhone: company?.phone || ''
  }
})
