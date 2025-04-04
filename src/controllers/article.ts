import { Request, Response } from 'express-serve-static-core'
import { prisma } from '../services/prisma.service.js'
import articleSchema from '../schemas/article.js'
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
    const image = `articlesImages/${filename}`

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
        id: userId,
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
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const postsWithAuthor = posts.map((post) => {
      return { ...post, author: user }
    })

    res.json({ blogPosts: postsWithAuthor })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    }
  }
}

type GetArticleByIdRequestBody = {
  postId: string
}

const getArticleById = async (req: Request<object, object, GetArticleByIdRequestBody>, res: Response) => {
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
        role: true,
      },
    })

    if (!user) {
      throw new Error('User is not logged in')
    }

    const { postId } = req.body

    if (!postId) {
      throw new Error('Post id is not provided')
    }

    const blogPost = await prisma.blogPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        authorId: true,
        content: true,
        createdAt: true,
        image: true,
        title: true,
      },
    })

    if (!blogPost) {
      throw new Error('Post not found')
    }

    const author = await prisma.user.findUnique({
      where: {
        id: blogPost.authorId,
      },
      select: {
        id: true,
        image: true,
        role: true,
        username: true,
      },
    })

    const post = { ...blogPost, author }

    res.status(200).json({ post, userRole: user.role, userId })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message)
      return
    }
    console.log(error)
  }
}

type DeleteArticleByIdRequestBody = {
  articleId: string
  authorId: string
  userId: string
}

const deleteArticleById = async (req: Request<object, object, DeleteArticleByIdRequestBody>, res: Response) => {
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
      select: {
        id: true,
        role: true,
      },
    })

    if (!user) {
      throw new Error('User is not logged in')
    }

    const { articleId } = req.body

    if (!articleId) {
      throw new Error("Article id is not provided")
    }

    const article = await prisma.blogPost.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        authorId: true,
      },
    })

    if (!article) {
      throw new Error('Article not found')
    }

    if (user.role !== 'admin' && user.id !== article.authorId) {
      throw new Error('You are not authorized to delete the article')
    }

    await prisma.blogPost.delete({
      where: {
        id: article.id,
      },
    })

    res.status(200).json({message: 'Article successfully removed from database'})
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
      return
    }

    console.log(error)
  }
}

export { createArticle, getArticlesByUserId, getArticleById, deleteArticleById }
