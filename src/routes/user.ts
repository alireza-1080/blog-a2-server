import e from 'express'
import { createUser } from '../controllers/user.js'
import userAvatarUpload from '../uploaders/userAvatarUploader.js'

const router = e.Router()

router.post('/create', userAvatarUpload.single('avatar'), createUser)

export default router
