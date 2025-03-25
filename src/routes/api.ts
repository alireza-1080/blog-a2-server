import express from 'express'
import { Request, Response } from 'express-serve-static-core'
import { prisma } from '../services/prisma.service.js'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const testData = await prisma.blogPost.findMany()
  console.log(testData)
  res.cookie('test', 'testValue', {
    httpOnly: true,
    sameSite: 'none',
    path:"/",
    secure: true
  })
  res.json(testData)
})

export default router
