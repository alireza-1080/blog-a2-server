import { Request, Response, NextFunction } from 'express-serve-static-core'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const jwtSecret = process.env.JWT_SECRET

const isTokenValid = (req: Request, res: Response, next: NextFunction) => {
  const isTokenProvided = req?.isTokenProvided

  if (!isTokenProvided) {
    req.isTokenValid = false
    req.userId = ''
    return next()
  }

  const auth_token = req.auth_token
  console.log('isTokenValid_Token', auth_token)
  console.log('isTokenValid_secret', jwtSecret)

  if (auth_token && jwtSecret) {
    jwt.verify(auth_token, jwtSecret, (error, decoded) => {
      if (error) {
        return console.log(error.message)
      }

      req.isTokenValid = true
      if (decoded && decoded.sub) {
        req.userId = decoded.sub as string
      }
    })
  }
}

export default isTokenValid
