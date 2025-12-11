export default defineEventHandler(async (event) => {
  // @ts-ignore
  const user = event.context.user || null
  return { user }
})
