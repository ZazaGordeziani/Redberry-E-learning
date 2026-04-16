import axios from 'axios'

import { httpClient } from '@/api'

import {
    type Category,
    type Course,
    type CourseDetail,
    type CourseTimeSlotOption,
    type Instructor,
    type ListResponse,
    parseCourseSessionTypeOption,
    type Topic,
    type WeeklySchedule,
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

export async function getCourseById(id: number) {
    const res = await httpClient.get<{ data: CourseDetail }>(`/courses/${id}`)
    return res.data.data
}

export async function getCourseWeeklySchedules(courseId: number) {
    const res = await httpClient.get<ListResponse<WeeklySchedule>>(
        `/courses/${courseId}/weekly-schedules`,
    )
    return res.data.data
}

export async function getCourseTimeSlots(
    courseId: number,
    weeklyScheduleId: number,
) {
    const res = await httpClient.get<ListResponse<CourseTimeSlotOption>>(
        `/courses/${courseId}/time-slots`,
        {
            params: {
                weekly_schedule_id: weeklyScheduleId,
            },
        },
    )
    return res.data.data
}

/**
 * Submits a rating for the course. Sends `enrollment_id` when provided so the backend
 * can record a review for a specific enrollment (e.g. after retake + complete again).
 * If POST fails with “already rated”, retries with PUT (update existing review).
 */
export async function submitCourseReview(
    courseId: number,
    rating: number,
    enrollmentId?: number,
) {
    const payload: { rating: number; enrollment_id?: number } = { rating }
    if (enrollmentId != null) payload.enrollment_id = enrollmentId

    try {
        await httpClient.post(`/courses/${courseId}/reviews`, payload)
    } catch (e) {
        if (!axios.isAxiosError(e) || e.response?.status !== 422) throw e
        const raw = e.response?.data as { message?: unknown } | undefined
        const msg =
            typeof raw?.message === 'string' ? raw.message : ''
        if (!/already\s+rated/i.test(msg)) throw e
        await httpClient.put(`/courses/${courseId}/reviews`, payload)
    }
}

export async function getCourseSessionTypes(
    courseId: number,
    weeklyScheduleId: number,
    timeSlotId: number,
) {
    const res = await httpClient.get<ListResponse<Record<string, unknown>>>(
        `/courses/${courseId}/session-types`,
        {
            params: {
                weekly_schedule_id: weeklyScheduleId,
                time_slot_id: timeSlotId,
            },
        },
    )
    const rows = res.data.data ?? []
    return rows.map((row) => parseCourseSessionTypeOption(row))
}
