import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL

if (!baseURL) {
    throw new Error('VITE_BASE_URL is not defined in .env')
}

export function getAuthToken(): string | null {
    const direct = localStorage.getItem('token')
    if (direct && direct.trim().length > 0) return direct.trim()

    try {
        const raw = localStorage.getItem('user')
        if (raw == null || raw === '' || raw === 'null') return null
        const parsed = JSON.parse(raw) as { token?: string } | null
        const t = parsed?.token
        if (typeof t === 'string' && t.trim().length > 0) return t.trim()
    } catch {
        /* nothing to catch */
    }
    return null
}

export const httpClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

httpClient.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
})
