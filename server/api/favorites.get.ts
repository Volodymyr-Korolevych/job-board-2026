import Favorite from '~/server/models/Favorite'
import Company from '~/server/models/Company'
import { connectDB } from '~/server/utils/db'
import { getUserFromEvent } from '~/server/utils/getUserFromEvent'

export default defineEventHandler(async (event) => {
  await connectDB()

  const user: any = await getUserFromEvent(event)
  if (!user?._id) {
    throw createError({ statusCode: 401, statusMessage: 'Потрібна авторизація' })
  }
  if (user.role !== 'seeker') {
    throw createError({ statusCode: 403, statusMessage: 'Доступно лише для пошукача' })
  }

  const favorites: any[] = await Favorite.find({ seekerId: user._id })
    .sort({ createdAt: -1 })
    .populate('jobId')
    .lean()

  const jobs: any[] = favorites
    .map((f) => f.jobId)
    .filter(Boolean)
    .map((j) => ({ ...j }))

  const companyIds = new Set<string>()
  const ownerIds = new Set<string>()

  for (const j of jobs) {
    if (j.companyId) companyIds.add(String(j.companyId))
    if (j.employerId) ownerIds.add(String(j.employerId))
    if (j.ownerId) ownerIds.add(String(j.ownerId))
    if (j.userId) ownerIds.add(String(j.userId))
  }

  const or: any[] = []
  if (companyIds.size) or.push({ _id: { $in: Array.from(companyIds) } })
  if (ownerIds.size) or.push({ ownerId: { $in: Array.from(ownerIds) } })

  const companies: any[] = or.length ? await Company.find({ $or: or }).lean() : []
  const byId = new Map(companies.map((c) => [String(c._id), c]))
  const byOwner = new Map(companies.map((c) => [String(c.ownerId), c]))

  return favorites.map((f) => {
    const j = f.jobId
    if (!j) return { _id: String(f._id), createdAt: f.createdAt, job: null }

    const c =
      (j.companyId ? byId.get(String(j.companyId)) : null) ||
      (j.employerId ? byOwner.get(String(j.employerId)) : null) ||
      (j.ownerId ? byOwner.get(String(j.ownerId)) : null) ||
      (j.userId ? byOwner.get(String(j.userId)) : null)

    return {
      _id: String(f._id),
      createdAt: f.createdAt,
      job: {
        ...j,
        companyName: c?.name || '',
        companyPhone: c?.phone || ''
      }
    }
  })
})
