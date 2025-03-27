import { Request, Response } from 'express-serve-static-core'
import { z } from 'zod'
import { createUserSchema } from '../schemas/user.js'

const createUser = async (req: Request<object, object, z.infer<typeof createUserSchema>>, res: Response) => {
  //   const { username, password, email } = req.body

  const file = req.file

  res.json(file)
}

export { createUser }
