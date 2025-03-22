import express from 'express'
import { Request, Response } from 'express-serve-static-core'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import apiRouter from './routes/api.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.json(`Server is 🏃‍♂️‍➡️🏃‍♂️‍➡️🏃‍♂️‍➡️`)
})

app.use('/api', apiRouter)

export default app