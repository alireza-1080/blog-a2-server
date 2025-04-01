import { MulterError } from 'multer'
import articleImageUpload from '../uploaders/articleImageUploader.js'
import { NextFunction, Request, Response } from 'express-serve-static-core'

const articleImageUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  articleImageUpload.single('image')(req, res, (err) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({ error: '❌ Only JPEG, JPG, and PNG images are accepted' })
        return
      }

      if (err.code === 'LIMIT_FILE_SIZE') {
        if (err.field === 'image') {
          res.status(400).json({ error: '❌ Avatar size limit is 10MB' })
          return
        }
      }

      if (err.code === 'LIMIT_FILE_COUNT') {
        res.status(400).json({ error: '❌ Only 1 avatar is allowed to be uploaded' })
        return
      }
    }

    next()
  })
}

export default articleImageUploadMiddleware
