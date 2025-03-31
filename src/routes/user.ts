import e from 'express'
import { createUser, isUserLoggedIn, userLogin } from '../controllers/user.js'
import userAvatarUploadMiddleware from '../middlewares/userAvatarUploadMiddleware.js'
import isTokenProvided from '../middlewares/isTokenProvided.js'
import isTokenValid from '../middlewares/isTokenValid.js'

const router = e.Router()

router.post('/create', userAvatarUploadMiddleware, createUser)

router.post('/login', userLogin)

router.post('/is-logged-in', isTokenProvided, isTokenValid, isUserLoggedIn)

export default router
