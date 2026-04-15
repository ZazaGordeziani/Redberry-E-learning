import type { PrimitiveAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type User = {
    username?: string
    avatar?: string
    email?: string
    token?: string
} | null

export const userAtom: PrimitiveAtom<User> = atomWithStorage<User>('user', null)
