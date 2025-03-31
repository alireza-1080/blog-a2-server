import e from 'express'
import { createUser, userLogin } from '../controllers/user.js'
import userAvatarUploadMiddleware from '../middlewares/userAvatarUploadMiddleware.js'
import isTokenProvided from '../middlewares/isTokenProvided.js'
import isTokenValid from '../middlewares/isTokenValid.js'

const router = e.Router()

router.post('/create', userAvatarUploadMiddleware, createUser)

router.post('/login', userLogin)

router.post('/test', isTokenProvided, isTokenValid)

export default router
