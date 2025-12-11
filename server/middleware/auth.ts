import { verifyToken } from '../utils/jwt'
import User from '../models/User'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jb_token')
  if (!token) return

  try {
    const payload = verifyToken(token) as any
    const user = await User.findById(payload.id)
    if (user) {
      // @ts-ignore
      event.context.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email
      }
    }
  } catch (e) {
    // ignore invalid token
  }
})
