import Application from '../../models/Application'
import Job from '../../models/Job'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { jobId, message } = body

  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'seeker') {
    throw createError({ statusCode: 401, statusMessage: 'Only seekers' })
  }

  const job = await Job.findById(jobId)
  if (!job) {
    throw createError({ statusCode: 404, statusMessage: 'Job not found' })
  }

  const app = await Application.create({
    jobId,
    seekerId: user.id,
    message,
    status: 'new'
  })

  return app
})
