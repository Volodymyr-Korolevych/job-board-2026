import Job from '../../models/Job'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const job = await Job.findById(id)
  if (!job) {
    throw createError({ statusCode: 404, statusMessage: 'Job not found' })
  }
  // increment views (fire and forget)
  Job.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec()
  return job
})
