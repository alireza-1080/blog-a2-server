import express from 'express'
import { Request, Response } from 'express-serve-static-core'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  res.json(`Session has been updated`)
})

router.get('/test', async (req: Request, res: Response) => {
  res.cookie('chocolate_cookie', 'chocolate_almond_etc', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 14 * 24 * 60 * 60 * 1000
  })
  res.json(`Session has been updated`)
})

export default router