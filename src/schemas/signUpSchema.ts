import { z } from 'zod'

export const usernameValidtion = z.string().min(2, 'Username must be at least 2 characters long').max(20, 'Username must be at most 20 characters long').max(20, 'Username must be at most 20 characters long').regex(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers')

export const signUpSchema = z.object({
    username: usernameValidtion,
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(20, 'Password must be at most 20 characters long'),
})