import e from 'express'
import { createUser } from '../controllers/user.js'
import userAvatarUploadMiddleware from '../middlewares/userAvatarUploadMiddleware.js'

const router = e.Router()

router.post('/create', userAvatarUploadMiddleware, createUser)

export default router
