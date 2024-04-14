import { z } from 'zod'

export const messageSchema = z.object({
    content: z.string().min(10, 'Message must be at least 2 characters long').max(100, 'Message must be at most 100 characters long')
})