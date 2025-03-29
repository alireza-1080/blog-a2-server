import multer from 'multer'
import path from 'path'
import { Request } from 'express-serve-static-core'

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/usersAvatars/')
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
  },
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png']

  if (allowedMimeTypes.includes(file.mimetype)) {
    return callback(null, true)
  } else {
    return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', '❌'))
  }
}

const userAvatarUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
})

export default userAvatarUpload
