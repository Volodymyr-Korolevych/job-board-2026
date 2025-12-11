import Job from '../../models/Job'
import Application from '../../models/Application'

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const jobs = await Job.find({ employerId: user.id }).sort({ createdAt: -1 }).lean()

  const jobIds = jobs.map(j => j._id)
  const counts = await Application.aggregate([
    { $match: { jobId: { $in: jobIds } } },
    { $group: { _id: '$jobId', count: { $sum: 1 } } }
  ])

  const mapCounts = new Map<string, number>()
  counts.forEach((c: any) => {
    mapCounts.set(String(c._id), c.count)
  })

  const withCounts = jobs.map((job: any) => ({
    ...job,
    applicationsCount: mapCounts.get(String(job._id)) || 0
  }))

  return withCounts
})
