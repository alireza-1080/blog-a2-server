import app from './app.js'
import 'dotenv/config'
import { connectDB } from './services/prisma.service.js'
/////////
import { Request, Response } from 'express';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT

connectDB()
////////////////
const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')
//eslint-disable-next-line
async function getDirStructure(dirPath: string): Promise<any[]> {
  const files = await readdir(dirPath, { withFileTypes: true })
  const structure = []
  for (const file of files) {
    const fullPath = join(dirPath, file.name)
    structure.push({
      name: file.name,
      type: file.isDirectory() ? 'directory' : 'file',
      ...(file.isDirectory() && { contents: await getDirStructure(fullPath) }),
    })
  }
  return structure
}

app.get('/folder-structure', async (req: Request, res: Response) => {
  try {
    const structure = await getDirStructure(__dirname)
    res.json(structure)
  } catch (err) {
    res.status(500).send(`Error: ${(err as Error).message}`)
  }
})
///////////////////
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
