import { z } from 'zod'

export const SignUpFormSchema = z
    .object({
        avatar: z
            .instanceof(File)
            .refine((file) => file.size <= 2 * 1024 * 1024, {
                message: 'File size must be less than 2MB',
            })
            .refine(
                (file) =>
                    ['image/jpeg', 'image/png', 'image/webp'].includes(
                        file.type,
                    ),
                {
                    message: 'Avatar should be JPG, PNG or Webp format',
                },
            )
            .nullable()
            .optional(),
        username: z.string().min(3, {
            message: 'Username should consist at least 3 characters',
        }),

        email: z.string().email({ message: 'Invalid E-mail' }),
        password: z.string().min(3, {
            message: 'Invalid password, should be at least 3 characters',
        }),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
