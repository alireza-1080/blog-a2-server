import { Request, Response } from 'express-serve-static-core'
import { z, ZodError } from 'zod'
import { createUserSchema, loginUserSchema } from '../schemas/user.js'
import hashPassword from '../utils/hashPassword.js'
import { prisma } from '../services/prisma.service.js'
import { Prisma } from '@prisma/client'
import { unlink } from 'fs/promises'
import generateToken from '../utils/generateToke.js'
import comparePassword from '../utils/comparePassword.js'
import dotenv from 'dotenv'

dotenv.config()

const envLevel = process.env.ENV_LEVEL

const createUser = async (
  req: Request<object, object, z.infer<typeof createUserSchema> & { confirmPassword: string }>,
  res: Response
) => {
  try {
    const { username, email, password, confirmPassword } = req.body
    const file = req.file

    const newUserSample = {
      username,
      email,
      password,
      confirmPassword,
    }

    const zodValidatedUser = createUserSchema.parse(newUserSample)

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }

    const hashedPassword = await hashPassword(password)
    zodValidatedUser.password = hashedPassword

    const usersCount = await prisma.user.count()
    if (!usersCount) {
      zodValidatedUser.role = 'admin'
    }

    const user = await prisma.user.create({
      data: {
        username: zodValidatedUser.username,
        email: zodValidatedUser.email,
        image: file ? `usersAvatars/${file.filename}` : '',
        password: zodValidatedUser.password,
        imagePath: file ? file.path : '',
        role: zodValidatedUser.role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        role: true,
      },
    })

    const token = generateToken(user.id)

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: envLevel === 'development' ? false : true,
      sameSite: envLevel === 'development' ? 'lax' : 'none', // 'lax' for dev, 'none' for prod
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 Days
    })

    res.json({ message: 'User is successfully registered' })
  } catch (error) {
    // Delete avatar if it's available
    if (req.file) {
      await unlink(req.file.path)
    }

    // Handle zod validation errors
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.issues[0].message })
      return
    }

    //Handle prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.meta?.target === 'User_username_key') {
        res.status(400).json({ error: 'Username is already taken' })
        return
      }

      if (error.meta?.target === 'User_email_key') {
        res.status(400).json({ error: 'Email is already taken' })
        return
      }
    }

    if (error instanceof Error) {
      console.log(error.message)
      res.status(400).json({ error: error.message })
      return
    }
  }
}

const userLogin = async (req: Request<object, object, z.infer<typeof loginUserSchema>>, res: Response) => {
  try {
    const { identifier, password } = req.body

    const zodValidatedCredentials = loginUserSchema.parse({ identifier, password })

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: zodValidatedCredentials.identifier }, { username: zodValidatedCredentials.identifier }],
      },
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const token = generateToken(user.id)

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: envLevel === 'development' ? false : true,
      sameSite: envLevel === 'development' ? 'lax' : 'none', // 'lax' for dev, 'none' for prod
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 Days
    })

    res.json({ message: 'User is successfully logged in' })
  } catch (error) {
    // Handle zod validation errors
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.issues[0].message })
      return
    }

    if (error instanceof Error) {
      console.log(error.message)
      res.status(400).json({ error: error.message })
      return
    }
  }
}

const isUserLoggedIn = (req: Request, res: Response) => {
  const isUserLoggedIn = req.isTokenValid

  if (!isUserLoggedIn) {
    res.status(400).json({ isUserLoggedIn })
    return
  }

  res.status(200).json({ isUserLoggedIn })
  return
}

const userLogout = (req: Request, res: Response) => {
  res.clearCookie('auth_token')
  res.status(200).json({
    message: 'User Logged out successfully',
  })
}

const userGetMe = async (req: Request, res: Response) => {
  try {
    const isTokenValid = req.isTokenValid

    if (!isTokenValid) {
      throw new Error('User is not logged in')
    }

    const userId = req.userId

    if (!userId) {
      throw new Error('User is not logged in')
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        image: true,
        role: true,
        username: true,
      },
    })

    if (!user) {
      throw new Error('User is not logged in')
    }

    res.status(200).json({ user })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    }
  }
}

export { createUser, userLogin, isUserLoggedIn, userLogout, userGetMe }
