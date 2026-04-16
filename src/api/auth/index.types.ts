export type LoginPayload = { payload: { email: string; password: string } }

export type LoginResponse = {
    user: {
        email: string
        username: string
        avatar: string | null
        id: number
    }
    token: string
}

export type RegisterPayload = {
    payload: {
        avatar: File | null
        username: string
        email: string
        password: string
        confirmPassword: string
    }
}

export type RegisterResponse = {
    user: {
        id: number
        username: string
        email: string
        avatar?: string | null
    }
    token: string
}
