import fs from 'fs'

const checkOrCreatePublicFolder = () => {
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true })
  }
}

export default checkOrCreatePublicFolder
