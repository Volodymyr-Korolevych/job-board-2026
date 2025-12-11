import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['seeker', 'employer'], required: true },

  fullName: String,
  city: String,
  desiredPosition: String,
  level: { type: String, enum: ['junior', 'middle', 'senior'], default: 'junior' },
  employmentType: [String],
  workFormat: [String],
  skills: [String],
  about: String,
  cvLink: String,

  contactName: String
}, { timestamps: true })

export default model('User', UserSchema)
