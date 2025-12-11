import { Schema, model, Types } from 'mongoose'

const ApplicationSchema = new Schema({
  jobId: { type: Types.ObjectId, ref: 'Job', required: true },
  seekerId: { type: Types.ObjectId, ref: 'User', required: true },
  message: String,
  status: { type: String, enum: ['new', 'viewed', 'invited', 'rejected'], default: 'new' }
}, { timestamps: true })

export default model('Application', ApplicationSchema)
