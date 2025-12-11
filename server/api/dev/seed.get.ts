// server/api/dev/seed.get.ts
import User from '../../models/User'
import Company from '../../models/Company'
import Job from '../../models/Job'

export default defineEventHandler(async () => {
  // Створюємо тестового роботодавця
  const employer = await User.findOneAndUpdate(
    { email: 'employer@example.com' },
    {
      email: 'employer@example.com',
      passwordHash: 'test-hash', // для демо, справжній логін – через /auth/register
      role: 'employer'
    },
    { upsert: true, new: true }
  )

  // Створюємо компанію
  const company = await Company.findOneAndUpdate(
    { ownerId: employer._id },
    {
      ownerId: employer._id,
      name: 'Demo Company',
      city: 'Львів',
      description: 'Тестова компанія для JobBoard-2026'
    },
    { upsert: true, new: true }
  )

  // Створюємо вакансію
  const job = await Job.create({
    companyId: company._id,
    employerId: employer._id,
    title: 'Junior Frontend Developer',
    city: 'Львів',
    workFormat: 'remote',
    employmentType: 'full-time',
    salaryFrom: 20000,
    salaryTo: 30000,
    description: 'Розробка інтерфейсів на Vue/Nuxt.',
    requirements: 'Базові знання HTML, CSS, JavaScript.',
    conditions: 'Гнучкий графік, віддалено.',
    tags: ['Frontend', 'Junior', 'Remote'],
    status: 'active'
  })

  return {
    ok: true,
    employerId: employer._id,
    companyId: company._id,
    jobId: job._id
  }
})
