import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  taxId: String,
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
