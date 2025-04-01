import multer from 'multer'
import path from 'path'
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/articlesAvatars')
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']

  if (allowedMimeTypes.includes(file.mimetype)) {
    return callback(null, true)
  } else {
    return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', '❌'))
  }
}

const articleImageUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
        files: 1
    }
})

export default articleImageUpload