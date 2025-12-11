import bcrypt from 'bcrypt'
import User from '../../models/User'
import { signUser } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const user = await User.findOne({ email })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = signUser({ id: user._id, role: user.role })

  setCookie(event, 'jb_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7
  })

  return { success: true, user: { id: user._id, email: user.email, role: user.role } }
})
