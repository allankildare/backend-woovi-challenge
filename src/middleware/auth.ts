import { Context, Next } from 'koa'
import { getUser } from './../utils/jwt'

export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization || ''
  const user = getUser(token)

  if (!user) {
    ctx.status = 401
    ctx.body = 'Unauthorized'
    return
  }

  ctx.state.user = user
  await next()
}
