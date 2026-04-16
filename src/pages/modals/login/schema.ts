import { z } from 'zod'

export const LoginFormSchema = z.object({
    email: z.string().email({ message: 'Invalid E-mail' }),
    // Don't enforce length rules here; backend determines credential validity.
    password: z.string().min(1, { message: 'Password is required' }),
})
