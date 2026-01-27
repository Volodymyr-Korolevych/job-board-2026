import Job from '~/server/models/Job'
import Company from '~/server/models/Company'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()

  const q = getQuery(event)
  const term = String(q.term || '').trim()
  const city = String(q.city || '').trim()

  const filter: any = {}
  if (term) {
    filter.$or = [
      { title: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { requirements: { $regex: term, $options: 'i' } }
    ]
  }
  if (city) filter.city = { $regex: city, $options: 'i' }

  const jobs: any[] = await Job.find(filter).sort({ createdAt: -1 }).lean()

  // Підтягуємо компанію за:
  // - job.companyId (якщо є)
  // - або Company.ownerId == job.employerId / job.ownerId / job.userId
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

  return jobs.map((j) => {
    const c =
      (j.companyId ? byId.get(String(j.companyId)) : null) ||
      (j.employerId ? byOwner.get(String(j.employerId)) : null) ||
      (j.ownerId ? byOwner.get(String(j.ownerId)) : null) ||
      (j.userId ? byOwner.get(String(j.userId)) : null)

    return {
      ...j,
      companyName: c?.name || '',
      companyPhone: c?.phone || ''
    }
  })
})
