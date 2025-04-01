import z from 'zod'

const articleSchema = z.object({
  title: z
    .string({
      required_error: 'Title field is required',
      invalid_type_error: 'Title should ba string'
    })
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),
  content: z
    .string({
      required_error: 'Content field is required',
      invalid_type_error: 'Content should ba string'
    })
    .trim()
    .min(1, { message: 'Content is required' })
    .max(10_000, { message: 'Content cannot exceed 10,000 characters' }),
})

export default articleSchema
