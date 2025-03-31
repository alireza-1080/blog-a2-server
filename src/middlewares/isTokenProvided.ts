import { Request, Response, NextFunction } from 'express-serve-static-core'

const isTokenProvided = (req: Request, res: Response, next: NextFunction) => {
  const auth_token = req.headers.authorization?.split(' ')[1] || req.cookies?.auth_token || ""

  if (!auth_token) {
    req.isTokenProvided = false
    req.auth_token = ''
    return next()
  }

  req.isTokenProvided = true
  req.auth_token = auth_token
  return next()
}

export default isTokenProvided
