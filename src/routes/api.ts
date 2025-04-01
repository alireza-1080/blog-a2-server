import express from 'express'
import userRouter from './user.js'
import articleRouter from './article.js'

const router = express.Router()

router.use('/user', userRouter)

router.use('/article', articleRouter)

export default router