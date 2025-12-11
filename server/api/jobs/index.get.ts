import Job from '../../models/Job'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { city, term } = query

  const filter: any = { status: 'active' }

  if (city) filter.city = city
  if (term) filter.title = { $regex: term as string, $options: 'i' }

  const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100)
  return jobs
})
