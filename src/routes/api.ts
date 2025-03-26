import express from 'express'
import { Request, Response } from 'express-serve-static-core'
import { prisma } from '../services/prisma.service.js'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  res.json(`Session has been updated`)
})

export default router