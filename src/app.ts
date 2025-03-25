import express from 'express'
import { Request, Response } from 'express-serve-static-core'
import cors from 'cors'
import helmet from 'helmet'
import apiRouter from './routes/api.js'
import session from './middlewares/session.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(helmet())
app.use(cors({
  origin: 'https://blog-a2.vercel.app/api',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'))

app.use(session)

app.get('/', (req: Request, res: Response) => {
  res.json(`Server is 🏃‍♂️‍➡️🏃‍♂️‍➡️🏃‍♂️‍➡️`)
})

app.use('/api', apiRouter)

export default app
