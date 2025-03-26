import express from 'express'
import { Request, Response } from 'express-serve-static-core'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  res.json(`Session has been updated`)
})

export default router