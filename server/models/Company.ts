import { Schema, model, Types } from 'mongoose'

const CompanySchema = new Schema({
  ownerId: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  logoUrl: String,
  city: String,
  website: String,
  description: String,
  industry: String,
  staffCount: Number
}, { timestamps: true })

export default model('Company', CompanySchema)
