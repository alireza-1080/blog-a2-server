import { Request, Response } from 'express-serve-static-core'
import { prisma } from '../services/prisma.service.js'
import articleSchema from '../schemas/articleSchema.js'
import { unlink } from 'fs/promises'
import { Prisma } from '@prisma/client'

type CreateArticleType = {
  title: string | undefined
  content: string | undefined
}

const createArticle = async (req: Request<object, object, CreateArticleType>, res: Response) => {
  try {
    const isTokenValid = req.isTokenValid

    if (!isTokenValid) {
      throw new Error('User is not logged in')
    }

    const userId = req.userId

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error('User is not logged in')
    }

    const { title, content } = req.body
    console.log({ title, content })
    const { success, data, error } = articleSchema.safeParse({ title, content })

    if (!success) {
      throw new Error(error.errors[0].message)
    }

    const file = req.file
    console.log(file)
    if (!file) {
      throw new Error('Article image is required')
    }

    const { path, filename } = file
    const imagePath = path
    const image = `articlesAvatars/${filename}`

    await prisma.blogPost.create({
      data: {
        title: data.title,
        content: data.content,
        image,
        imagePath,
        authorId: userId,
      },
    })

    res.status(200).json({ message: 'Article is successfully created' })
  } catch (error) {
    if (req.file) {
      await unlink(req.file.path)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.meta?.target === 'BlogPost_title_key') {
        res.status(400).json({ error: 'Title is already taken' })
        return
      }
    }

    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
      return
    }

    console.log(error)
  }
}

const getArticlesByUserId = async (req: Request, res: Response) => {
  try {
    const isTokenValid = req.isTokenValid
    
    if (!isTokenValid) {
      throw new Error(`User is not logged in`)
    }

    const userId = req.userId
    
    if (!userId) {
      throw new Error(`User is not logged in`)
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        username: true,
        role: true,
        image: true,
        id: true,
      },
    })
    
    if (!user) {
      throw new Error(`User is not logged in`)
    }
    
    const posts = await prisma.blogPost.findMany({
      where: {
        authorId: userId
      },
      select: {
        title: true,
        content: true,
        image: true,
      }
    })

    const postsWithAuthor = posts.map(post => {
      return {...post, author: user}
    })
    
    res.json({blogPosts: postsWithAuthor})
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    }
  }
}

export { createArticle, getArticlesByUserId }
