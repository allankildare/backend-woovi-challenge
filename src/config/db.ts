import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const uri = process.env.MONGO_DB_URI

export async function connectToDatabase() {
  try {
    if (uri) {
      mongoose
        .connect(uri, {
          dbName: 'woovi-challenge',
        })
        .then(() => {
          console.log('Successfully connected to MongoDB Atlas!')
        })
        .catch((error) => {
          console.error('Error connecting to MongoDB Atlas', error)
          mongoose.connection.close()
        })
    }
  } catch (error) {
    console.error('Something went wrong\n', error)
    process.exit(1)
  }
}
