import bcrypt from 'bcrypt'
import User from '../../models/User'
import Company from '../../models/Company'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    email,
    password,
    role,

    // поля профілю пошукача
    fullName,
    city,
    desiredPosition,
    level,
    cvLink,

    // поля профілю компанії
    companyName,
    companyCity,
    companyWebsite,
    companyDescription,
    companyIndustry,
    companyStaffCount
  } = body

  if (!email || !password || !role) {
    throw createError({ statusCode: 400, statusMessage: 'email, password, role required' })
  }

  const existing = await User.findOne({ email })
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Email already used' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const userData: any = {
    email,
    passwordHash,
    role
  }

  if (role === 'seeker') {
    userData.fullName = fullName || ''
    userData.city = city || ''
    userData.desiredPosition = desiredPosition || ''
    userData.level = level || 'junior'
    userData.cvLink = cvLink || ''
  }

  const user = await User.create(userData)

  if (role === 'employer') {
    // Створюємо компанію одразу при реєстрації
    await Company.create({
      ownerId: user._id,
      name: companyName || 'Нова компанія',
      city: companyCity || '',
      website: companyWebsite || '',
      description: companyDescription || '',
      industry: companyIndustry || '',
      staffCount: companyStaffCount || null
    })
  }

  return { success: true, user: { id: user._id, email: user.email, role: user.role } }
})
