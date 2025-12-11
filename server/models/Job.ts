import { Schema, model, Types } from 'mongoose'

const JobSchema = new Schema({
  companyId: { type: Types.ObjectId, ref: 'Company', required: true },
  employerId: { type: Types.ObjectId, ref: 'User', required: true },

  title: { type: String, required: true },
  city: String,
  workFormat: { type: String, enum: ['office', 'remote', 'hybrid'], default: 'office' },
  employmentType: { type: String, enum: ['full-time', 'part-time', 'freelance'], default: 'full-time' },

  salaryFrom: Number,
  salaryTo: Number,

  description: String,
  requirements: String,
  conditions: String,
  tags: [String],

  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  views: { type: Number, default: 0 }
}, { timestamps: true })

export default model('Job', JobSchema)
