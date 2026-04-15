import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL

if (!baseURL) {
    throw new Error('VITE_BASE_URL is not defined in .env')
}

export const httpClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
