import jwt from 'jsonwebtoken'

export const getUser = (token: string) => {
  if (!token || typeof token !== 'string' || !process.env.JWT_SECRET_KEY)
    return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
  } catch (error) {
    return null
  }
}
