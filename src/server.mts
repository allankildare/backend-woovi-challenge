import http from 'http'
import dotenv from 'dotenv'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { koaMiddleware } from '@as-integrations/koa'
import { typeDefs, resolvers } from './graphql/schema'
import { getUser } from './utils/jwt'
import { connectToDatabase } from './config/db'
import mongoose from 'mongoose'

dotenv.config()

connectToDatabase()

const app = new Koa()
const httpServer = http.createServer(app.callback())

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

app.use(cors())
app.use(bodyParser())

app.use(
  koaMiddleware(server, {
    context: async ({ ctx }) => {
      const token = ctx.headers.authorization || ''

      const user = getUser(token)
      return { user }
    },
  }),
)

await new Promise((resolve) => {
  httpServer.listen(
    {
      port: 4000,
    },
    resolve,
  )
})

console.log('Hi Dev!\nServer is ready at http://localhost:4000')

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Database connection closed');
  process.exit(0);
});
