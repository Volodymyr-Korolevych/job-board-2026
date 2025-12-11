import Job from '../../models/Job'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const body = await readBody(event)
  const job = await Job.findOneAndUpdate(
    { _id: id, employerId: user.id },
    body,
    { new: true }
  )
  if (!job) {
    throw createError({ statusCode: 404, statusMessage: 'Job not found or not owner' })
  }
  return job
})
