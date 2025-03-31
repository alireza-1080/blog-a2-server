import e from 'express'
import { createUser, userLogin } from '../controllers/user.js'
import userAvatarUploadMiddleware from '../middlewares/userAvatarUploadMiddleware.js'

const router = e.Router()

router.post('/create', userAvatarUploadMiddleware, createUser)

router.post('/login', userLogin)

export default router
