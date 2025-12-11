import Application from '../../../models/Application'
import Job from '../../../models/Job'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const job = await Job.findOne({ _id: id, employerId: user.id })
  if (!job) {
    throw createError({ statusCode: 404, statusMessage: 'Job not found or not owner' })
  }

  const apps = await Application.find({ jobId: id })
    .populate('seekerId')
    .sort({ createdAt: -1 })

  return apps
})
