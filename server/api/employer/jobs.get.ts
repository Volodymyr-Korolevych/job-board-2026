import Job from '../../models/Job'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const jobs = await Job.find({ employerId: user.id }).sort({ createdAt: -1 })
  return jobs
})
