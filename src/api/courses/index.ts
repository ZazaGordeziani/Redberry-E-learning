import { httpClient } from '@/api'

import type {
    Category,
    Course,
    Instructor,
    ListResponse,
    Topic,
} from './index.types'

export async function getCategories() {
    const res = await httpClient.get<ListResponse<Category>>('/categories')
    return res.data
}

export async function getTopics() {
    const res = await httpClient.get<ListResponse<Topic>>('/topics')
    return res.data
}

export async function getInstructors() {
    const res = await httpClient.get<ListResponse<Instructor>>('/instructors')
    return res.data
}

export async function getCourses(params?: { page?: number; perPage?: number }) {
    const res = await httpClient.get<ListResponse<Course>>('/courses', {
        params: {
            page: params?.page,
            per_page: params?.perPage,
        },
    })
    return res.data
}

