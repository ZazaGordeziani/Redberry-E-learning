import { httpClient } from '@/api'

import type { MeResponse, UpdateProfilePayload } from './index.types'

export async function getMe() {
    const response = await httpClient.get<MeResponse>('/me')
    return response.data.data
}

export async function updateProfile(payload: UpdateProfilePayload) {
    const formData = new FormData()

    // Backend expects snake_case keys.
    if (payload.fullName !== undefined)
        formData.append('full_name', payload.fullName ?? '')
    if (payload.mobileNumber !== undefined)
        formData.append('mobile_number', payload.mobileNumber ?? '')
    if (payload.age !== undefined)
        formData.append('age', payload.age === null ? '' : String(payload.age))
    if (payload.avatar instanceof File) formData.append('avatar', payload.avatar)

    const response = await httpClient.put<MeResponse>('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
}

