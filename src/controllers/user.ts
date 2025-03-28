import { Request, Response } from 'express-serve-static-core'
import { z } from 'zod'
import { createUserSchema } from '../schemas/user.js'

const createUser = async (req: Request<object, object, z.infer<typeof createUserSchema>>, res: Response) => {
  const {username, email, password} = req.body
  const file = req.file

  res.json(`usersAvatar/${file?.filename}`)

  // const newUserSample = {
  //   username,
  //   email,
  //   image: req.file,
  //   password
  // }
}

export { createUser }
