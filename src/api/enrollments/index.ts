import { httpClient } from '@/api'

import type {
    CourseEnrollmentDetail,
    ListResponse,
} from '@/api/courses/index.types'

export type CreateEnrollmentPayload = {
    courseId: number
    courseScheduleId: number
    force?: boolean
}

export async function createEnrollment(payload: CreateEnrollmentPayload) {
    const res = await httpClient.post<{
        data: CourseEnrollmentDetail
        message?: string
    }>('/enrollments', {
        courseId: payload.courseId,
        courseScheduleId: payload.courseScheduleId,
        force: payload.force === true,
    })
    return res.data.data
}

export async function getMyEnrollments() {
    const res =
        await httpClient.get<ListResponse<CourseEnrollmentDetail>>(
            '/enrollments',
        )
    return res.data.data ?? []
}

export async function completeEnrollment(enrollmentId: number) {
    const res = await httpClient.patch<{
        data: CourseEnrollmentDetail
        message?: string
    }>(`/enrollments/${enrollmentId}/complete`)
    return res.data.data
}

export async function deleteEnrollment(enrollmentId: number) {
    await httpClient.delete(`/enrollments/${enrollmentId}`)
}
