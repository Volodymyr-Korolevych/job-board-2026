export default defineEventHandler(async (event) => {
  setCookie(event, 'jb_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0
  })
  return { success: true }
})
