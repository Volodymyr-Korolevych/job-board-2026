  import mongoose from 'mongoose'

  let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } =
    // @ts-expect-error global cache
    globalThis.__mongoose_cache || { conn: null, promise: null }

  // @ts-expect-error global cache
  globalThis.__mongoose_cache = cached

  export async function connectDB() {
    if (cached.conn) return cached.conn
    if (!cached.promise) {
      const uri = process.env.MONGODB_URI || process.env.MONGODB_URL
      if (!uri) {
        throw new Error('MONGODB_URI (або MONGODB_URL) не задано в .env')
      }
      cached.promise = mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined })
    }
    cached.conn = await cached.promise
    return cached.conn
  }
  EOF
