import { httpClient } from '@/api'
import { AUTH_ENDPONTS } from '@/api/auth/index.enum'
import type { LoginPayload } from '@/api/auth/index.types'
import type { RegisterFormValues } from '@/pages/modals/register/index.typs'

export const login = async ({ payload }: LoginPayload) => {
    const response = await httpClient.post(AUTH_ENDPONTS.LOGIN, payload)
    return response.data
}

export const register = async (form: RegisterFormValues) => {
    const formData = new FormData()
    formData.append('username', form.username)
    formData.append('email', form.email)
    formData.append('password', form.password)
    formData.append('password_confirmation', form.confirmPassword)
    if (form.avatar) formData.append('avatar', form.avatar)

    const response = await httpClient.post(AUTH_ENDPONTS.REGISTER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
}

