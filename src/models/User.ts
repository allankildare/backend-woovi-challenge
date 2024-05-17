import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

interface IUser extends Document {
  taxId: string
  firstName: string
  lastName: string
  password: string
  comparePassword(password: string): Promise<boolean>
}

const UserSchema: Schema<IUser> = new Schema({
  taxId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const saltStr = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, saltStr)
  next()
})

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model<IUser>('User', UserSchema)
export default User
