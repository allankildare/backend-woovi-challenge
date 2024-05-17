import http from 'http'
import Koa from 'koa'
import dotenv from 'dotenv'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { koaMiddleware } from '@as-integrations/koa'
import { typeDefs, resolvers } from './graphql/schema'

dotenv.config()

const app = new Koa()
const httpServer = http.createServer(app.callback())
// const router = new Router()

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
    context: async ({ ctx }) => ctx.headers.token,
  }),
)

await new Promise((resolve) => {
  httpServer.listen({
    port: 4000,
  })
  resolve()
})
console.log('Hi Dev!\nServer is ready at http://localhost:4000')
