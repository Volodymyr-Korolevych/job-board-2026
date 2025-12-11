import { Schema, model, Types } from 'mongoose'

const FavoriteSchema = new Schema({
  seekerId: { type: Types.ObjectId, ref: 'User', required: true },
  jobId: { type: Types.ObjectId, ref: 'Job', required: true }
}, { timestamps: true })

FavoriteSchema.index({ seekerId: 1, jobId: 1 }, { unique: true })

export default model('Favorite', FavoriteSchema)
