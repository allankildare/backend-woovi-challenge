import mongoose, { Document, Schema } from 'mongoose'

interface IAccount extends Document {
  accountId: string
  accountNumber: string
  userId: mongoose.Schema.Types.ObjectId
  balance: number
}

const AccountSchema: Schema<IAccount> = new Schema({
  accountId: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balance: { type: Number, default: 0 },
})

const Account = mongoose.model<IAccount>('Account', AccountSchema)

export default Account
