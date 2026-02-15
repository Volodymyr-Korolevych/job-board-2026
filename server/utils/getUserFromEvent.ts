import User from '~/server/models/User'
import { H3Event } from 'h3'

function base64UrlDecode(input: string) {
  const pad = '='.repeat((4 - (input.length % 4)) % 4)
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(b64, 'base64').toString('utf-8')
}

function safeJsonParse<T = any>(s: string): T | null {
  try {
    return JSON.parse(s) as T
  } catch {
    return null
  }
}

function tryReadUserFromJsonCookie(event: H3Event) {
  const c1 = getCookie(event, 'auth_user')
  const c2 = getCookie(event, 'user')
  const raw = c1 || c2
  if (!raw) return null

  const parsed = safeJsonParse<any>(raw)
  if (!parsed) return null

  // підтримка формату { user: {...} } або просто { _id, role, ... }
  const u = parsed.user || parsed
  if (u?._id) return u
  return null
}

function tryReadUserIdFromJwtCookie(event: H3Event) {
  const token =
    getCookie(event, 'token') ||
    getCookie(event, 'auth_token') ||
    getCookie(event, 'access_token') ||
    ''

  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const payloadRaw = base64UrlDecode(parts[1])
  const payload = safeJsonParse<any>(payloadRaw)
  if (!payload) return null

  return (
    payload.sub ||
    payload.userId ||
    payload._id ||
    payload.id ||
    null
  )
}

export async function getUserFromEvent(event: H3Event) {
  // 1) якщо middleware уже заповнює context.user
  const ctxUser = (event.context as any).user
  if (ctxUser?._id) return ctxUser

  // 2) cookie з JSON користувачем
  const cookieUser = tryReadUserFromJsonCookie(event)
  if (cookieUser?._id) return cookieUser

  // 3) JWT cookie -> userId -> user з БД
  const userId = tryReadUserIdFromJwtCookie(event)
  if (!userId) return null

  try {
    const u: any = await User.findById(userId).lean()
    return u || null
  } catch {
    return null
  }
}
