import Application from '../../models/Application'
import Job from '../../models/Job'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const body = await readBody(event)
  const { status } = body

  if (!['new', 'viewed', 'invited', 'rejected'].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
  }

  const app = await Application.findById(id)
  if (!app) {
    throw createError({ statusCode: 404, statusMessage: 'Application not found' })
  }

  const job = await Job.findById(app.jobId)
  if (!job || String(job.employerId) !== String(user.id)) {
    throw createError({ statusCode: 403, statusMessage: 'Not owner of the job' })
  }

  app.status = status
  await app.save()

  return app
})
