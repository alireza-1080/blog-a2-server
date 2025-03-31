import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_SECRET as string

const generateToken = (id: string, remember?: boolean) => {
  console.log("generateTokenSecret",secret)
  return jwt.sign({ sub: id }, secret, {
    expiresIn: remember ? '14d' : '1d',
  })
}

export default generateToken
