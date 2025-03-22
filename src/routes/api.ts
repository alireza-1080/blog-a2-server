import express from 'express'
import { Request, Response } from 'express-serve-static-core'
import { prisma } from '../services/prisma.service.js'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const testData = await prisma.blogPost.findMany()
  console.log(testData)
  res.json(testData)
})

export default router
