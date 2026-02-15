import User from '~/server/models/User'
import { H3Event } from 'h3'

function base64UrlDecode(input: string) {
  const pad = '='.repeat((4 - (input.length % 4)) % 4)
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(b64, 'base64').toString('utf-8')
}

function decodeJwtPayload(token: string) {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const json = base64UrlDecode(parts[1])
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function getAuthUser(event: H3Event) {
  const token = getCookie(event, 'jb_token') || ''
  if (!token) return null

  const payload: any = decodeJwtPayload(token)
  const id = payload?.id || payload?.sub || payload?.userId || payload?._id
  if (!id) return null

  const user: any = await User.findById(id).lean()
  return user || null
}

export async function requireSeeker(event: H3Event) {
  const user: any = await getAuthUser(event)
  if (!user?._id) {
    throw createError({ statusCode: 401, statusMessage: 'Потрібна авторизація' })
  }
  if (user.role !== 'seeker') {
    throw createError({ statusCode: 403, statusMessage: 'Доступно лише для пошукача' })
  }
  return user
}
