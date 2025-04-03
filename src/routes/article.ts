import e from 'express'
import { createArticle, getArticlesByUserId, getArticleById } from '../controllers/article.js'
import isTokenProvided from '../middlewares/isTokenProvided.js'
import isTokenValid from '../middlewares/isTokenValid.js'
import articleImageUploadMiddleware from '../middlewares/articleImageUploadMiddleware.js'

const router = e.Router()

router.post('/create', articleImageUploadMiddleware, isTokenProvided, isTokenValid, createArticle)

router.post('/get-articles-by-user-id', isTokenProvided, isTokenValid, getArticlesByUserId)

router.post('/get-article-by-id', isTokenProvided, isTokenValid, getArticleById)

export default router
