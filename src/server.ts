import app from './app.js'
import 'dotenv/config'
import { connectDB } from './services/prisma.service.js'

const port = process.env.PORT

connectDB()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
