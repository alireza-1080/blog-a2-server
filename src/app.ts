import express from 'express'
import { Request, Response } from 'express-serve-static-core'
import cors from 'cors'
import helmet from 'helmet'
import apiRouter from './routes/api.js'
import cookieParser from 'cookie-parser'
import corsOptions from './utils/corsDependencies.js'
import checkOrCreatePublicFolder from './utils/checkOrCreatePublicFolder.js'

const app = express()

checkOrCreatePublicFolder()

app.use(cors(corsOptions))
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req: Request, res: Response) => {
  res.json(`Server is 🏃‍♂️‍➡️🏃‍♂️‍➡️🏃‍♂️‍➡️`)
})

app.use('/api', apiRouter)

export default app
