import bcrypt from 'bcrypt'
import User from '../../models/User'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, role } = body

  if (!email || !password || !role) {
    throw createError({ statusCode: 400, statusMessage: 'email, password, role required' })
  }

  const existing = await User.findOne({ email })
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Email already used' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.create({
    email,
    passwordHash,
    role
  })

  return { success: true, user: { id: user._id, email: user.email, role: user.role } }
})
