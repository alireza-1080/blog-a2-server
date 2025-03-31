import bcrypt from 'bcryptjs'

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword)
}

export default comparePassword
