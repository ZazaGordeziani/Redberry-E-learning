import type { CourseEnrollmentDetail } from '@/api/courses/index.types'

export function scheduleDaysSignature(days: string[]): string {
    return [...days.map((d) => d.toLowerCase().trim())].sort().join(',')
}

export function findConflictingCourseTitleFromEnrollments(
    enrollments: CourseEnrollmentDetail[],
    currentCourseId: number,
    selectedWeeklyId: number,
    selectedTimeSlotId: number,
    selectedSessionTypeId: number,
    selectedCourseScheduleId: number,
): string | null {
    for (const e of enrollments) {
        const title = e.course?.title?.trim()
        if (!title) continue

        if (e.course != null && e.course.id === currentCourseId) {
            continue
        }

        const sch = e.schedule
        if (!sch) continue

        const wsId = sch.weeklySchedule?.id
        const tsId = sch.timeSlot?.id
        const stId = sch.sessionType?.id

        if (
            wsId != null &&
            tsId != null &&
            stId != null &&
            wsId === selectedWeeklyId &&
            tsId === selectedTimeSlotId &&
            stId === selectedSessionTypeId
        ) {
            return title
        }

        const cs = sch.sessionType?.courseScheduleId
        if (
            cs != null &&
            Number.isFinite(cs) &&
            cs === selectedCourseScheduleId
        ) {
            return title
        }
    }

    return null
}
