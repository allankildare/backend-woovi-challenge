import User from './../models/User'
import Account from './../models/Account'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'

interface UserInterface {
  taxId: string
  firstName: string
  lastName: string
  password: string
}

const typeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    taxId: String!
  }

  type Account {
    id: ID!
    accountId: String!
    accountNumber: String!
    userId: String!
    balance: Float!
  }

  type Token {
    token: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(firstName: String!, lastName: String!, taxId: String!, password: String!): Token
    login(taxId: String!, password: String!): Token
  }
`

const resolvers = {
  Mutation: {
    async register(
      _: any,
      { taxId, firstName, lastName, password }: UserInterface,
    ) {
      const alreadyExistsUser = await User.findOne({ taxId })
      if (alreadyExistsUser) {
        throw new Error('User already exists')
      }

      const user = new User({ taxId, firstName, lastName, password })
      await user.save()

      const account = new Account({
        accountId: new mongoose.Types.ObjectId().toString(),
        accountNumber: uuid(),
        userId: user._id,
        balance: 0,
      })
      await account.save()

      const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
        expiresIn: '1h',
      })
      return { token }
    },

    async login(
      _: any,
      { taxId, password }: { taxId: string; password: string },
    ) {
      const user = await User.findOne({ taxId })
      if (!user) {
        throw new Error('Invalid credentials')
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        throw new Error('Invalid credentials')
      }

      if (process.env.JWT_SECRET_KEY) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: '1h',
        })
        return { token }
      } else {
        throw new Error('Something went wrong')
      }
    },
  },

  Query: {
    async me(_: any, __: any, { user }: any) {
      if (!user) {
        throw new Error('Not authenticated')
      }
      return await User.findById(user.userId)
    },
  },
}

export { typeDefs, resolvers }
