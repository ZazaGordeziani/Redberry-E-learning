export type RegisterFormValues = {
    avatar?: File | null
    username: string
    email: string
    password: string
    confirmPassword: string
}

export type BackendErrorResponse = {
    message: string
    errors?: Record<string, string[]>
}

export const RegisterFormDefaultValues = {
    avatar: null,
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
}
