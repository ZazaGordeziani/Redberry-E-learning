import type { AxiosError } from 'axios'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'

import type { RegisterResponse } from '@/api/auth/index.types'
import { register } from '@/api/auth'
import type { RegisterFormValues } from '@/pages/modals/register/index.typs'

export const useRegister = (
    options?: UseMutationOptions<
        RegisterResponse,
        AxiosError,
        RegisterFormValues
    >,
) => {
    return useMutation<RegisterResponse, AxiosError, RegisterFormValues>({
        mutationFn: (formData: RegisterFormValues) =>
            register({
                ...formData,
                avatar: formData.avatar ?? null,
            }),
        ...options,
    })
}
