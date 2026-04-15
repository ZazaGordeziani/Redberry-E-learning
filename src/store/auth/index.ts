import { atom } from 'jotai'

export type User = {
    username?: string
    avatar?: string
    email?: string
    token?: string
} | null

export const userAtom = atom<User>(null)
