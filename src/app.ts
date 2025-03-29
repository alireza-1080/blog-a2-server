import express from 'express'
import { Request, Response } from 'express-serve-static-core'
import cors from 'cors'
import helmet from 'helmet'
import apiRouter from './routes/api.js'
import cookieParser from 'cookie-parser'
import { CorsOptions } from 'cors'

const app = express()
const allowedOrigins = ['https://blog-a2.vercel.app', 'http://localhost:3000', 'https://blog-a2-server.up.railway.app']
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, cb: (error: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      return cb(null, true)
    }

    if (allowedOrigins.indexOf(origin as string) !== -1) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

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
