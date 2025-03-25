import ExpressSession from 'express-session'
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.DATABASE_URL
const secret = process.env.SESSION_SECRET as string

const store = MongoStore.create({
    mongoUrl,
    collectionName: "session",
    autoRemove: 'native',
    ttl: 14 * 24 * 60 * 60 // 14 days ==> s
})

const session = ExpressSession({
    secret,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite:'none',
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days ==> ms
        domain: 'up.railway.app'
    }
})

export default session