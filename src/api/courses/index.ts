import { httpClient } from '@/api'

import type {
    Category,
    Course,
    CourseDetail,
    CourseTimeSlotOption,
    Instructor,
    ListResponse,
    Topic,
    WeeklySchedule,
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

