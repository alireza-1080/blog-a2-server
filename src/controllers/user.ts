import { Request, Response } from 'express-serve-static-core'
import { z, ZodError } from 'zod'
import { createUserSchema } from '../schemas/user.js'
import hashPassword from '../utils/hashPassword.js'
import { prisma } from '../services/prisma.service.js'
import { Prisma } from '@prisma/client'
import { unlink } from 'fs/promises'

const createUser = async (req: Request<object, object, z.infer<typeof createUserSchema>>, res: Response) => {
  try {
    const { username, email, password } = req.body
    const file = req.file

    const newUserSample = {
      username,
      email,
      password,
    }

    const zodValidatedUser = createUserSchema.parse(newUserSample)

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

    console.log(user)

    res.json({ message: 'User is successfully registered', user })
  } catch (error) {
    // Delete avatar if it's available
    if (req.file) {
      await unlink(req.file.path)
    }

    // Handle zod validation errors
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.issues[0].message })
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
  }
}

export { createUser }
