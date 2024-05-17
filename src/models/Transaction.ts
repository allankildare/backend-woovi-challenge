import mongoose, { Document, Schema } from 'mongoose'

// value will be represented as number (in cents)
interface ITransaction extends Document {
  sender: mongoose.Schema.Types.ObjectId
  receiver: mongoose.Schema.Types.ObjectId
  transactionId: string
  value: number
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  transactionId: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
})

const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema,
)

export default Transaction
