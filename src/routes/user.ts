import e from 'express'
import { createUser, userLogin } from '../controllers/user.js'
import userAvatarUploadMiddleware from '../middlewares/userAvatarUploadMiddleware.js'
import isTokenProvided from '../middlewares/isTokenProvided.js'
import isTokenValid from '../middlewares/isTokenValid.js'
import { Request, Response } from 'express'

const router = e.Router()

router.post('/create', userAvatarUploadMiddleware, createUser)

router.post('/login', userLogin)

router.post('/test', isTokenProvided, isTokenValid, (req: Request, res: Response) => {
  res.json({
    isTokenProvided: req.isTokenProvided,
    auth_token: req.auth_token,
    isTokenValid: req.isTokenValid,
    userId: req.userId,
  })
})

export default router
