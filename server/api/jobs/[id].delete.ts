import Job from '../../models/Job'
import Application from '../../models/Application'
import Favorite from '../../models/Favorite'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  // @ts-ignore
  const user = event.context.user
  if (!user || user.role !== 'employer') {
    throw createError({ statusCode: 401, statusMessage: 'Only employers' })
  }

  const job = await Job.findOneAndDelete({ _id: id, employerId: user.id })
  if (!job) {
    throw createError({ statusCode: 404, statusMessage: 'Job not found or not owner' })
  }

  await Application.deleteMany({ jobId: job._id })
  await Favorite.deleteMany({ jobId: job._id })

  return { success: true }
})
