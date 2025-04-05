import { CorsOptions } from 'cors'

const allowedOrigins = ['https://blog-a2.vercel.app', 'https://blog-a2-server.up.railway.app']

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, cb: (error: Error | null, allow?: boolean) => void) => {
    // if (!origin) {
    //   return cb(null, true)
    // }

    if (allowedOrigins.indexOf(origin as string) !== -1) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

export default corsOptions
