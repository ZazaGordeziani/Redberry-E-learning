import type { PrimitiveAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type User = {
    id?: number
    username?: string
    avatar?: string
    email?: string
    token?: string
    fullName?: string | null
    mobileNumber?: string | null
    age?: number | null
    profileComplete?: boolean
} | null

export const userAtom: PrimitiveAtom<User> = atomWithStorage<User>('user', null)
