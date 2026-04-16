export type Me = {
    id: number
    username: string
    email: string
    avatar: string | null
    fullName: string | null
    mobileNumber: string | null
    age: number | null
    profileComplete: boolean
}

export type MeResponse = {
    data: Me
}

export type UpdateProfilePayload = {
    fullName?: string | null
    mobileNumber?: string | null
    age?: number | null
    avatar?: File | null
}
