import express from 'express'
import { Request, Response } from 'express-serve-static-core'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  res.json(`Session has been updated`)
})

router.get('/test', async (req: Request, res: Response) => {
  res.cookie('chocolate_cookie', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 14 * 24 * 60 * 60 * 1000,
    partitioned: true
  })
  res.json(`Session has been updated`)
})

export default router