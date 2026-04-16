import { Link } from 'react-router-dom'

import type { CourseEnrollmentDetail } from '@/api/courses/index.types'
import {
    displaySessionTitle,
    normalizeSessionKind,
    SessionTypeKindIcon,
} from '@/pages/course-details/components/session-type'

import calendar2Icon from '@/pages/course-details/components/assets/calendar2.svg'
import clockIcon from '@/pages/course-details/components/assets/clock.svg'
import locationIcon from '@/pages/course-details/components/assets/location.svg'
import ratingFullStar from '@/assets/rating-full-star.svg'

const DAY_TITLE: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
}

function titleCaseDay(d: string): string {
    const k = d.toLowerCase().trim()
    return DAY_TITLE[k] ?? d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()
}

function formatDaysRangeFullName(days: string[]): string {
    if (!days.length) return '—'
    if (days.length === 1) return titleCaseDay(days[0])
    return `${titleCaseDay(days[0])}-${titleCaseDay(days[days.length - 1])}`
}

function enrollmentWeekLabel(
    schedule: CourseEnrollmentDetail['schedule'],
): string {
    const ws = schedule?.weeklySchedule
    if (!ws) return '—'
    const days = ws.days
    if (days?.length) return formatDaysRangeFullName(days)
    const label = ws.label?.trim()
    return label && label.length > 0 ? label : '—'
}

function formatTimeSlotDisplay(label: string): string {
    const m = label.match(/^(.+?)\s*\((.+)\)\s*$/)
    if (m) return `${m[1].trim()} ${m[2].trim()}`
    return label
}

function enrollmentTimeLabel(
    schedule: CourseEnrollmentDetail['schedule'],
): string {
    const slot = schedule?.timeSlot
    if (!slot) return '—'
    const label = slot.label?.trim()
    if (!label?.length) return '—'
    return formatTimeSlotDisplay(label)
}

function enrollmentSessionName(
    schedule: CourseEnrollmentDetail['schedule'],
): string {
    const name = schedule?.sessionType?.name
    if (!name) return '—'
    return displaySessionTitle(name)
}

function enrollmentLocationLine(
    schedule: CourseEnrollmentDetail['schedule'],
): string {
    const sessionName = schedule?.sessionType?.name?.trim()
    if (sessionName && normalizeSessionKind(sessionName) === 'online') {
        return 'Google Meet'
    }
    const top = schedule?.location?.trim()
    if (top) return top
    const st = schedule?.sessionType?.location?.trim()
    if (st) return st
    return '—'
}

function MetaRow({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-start gap-2">
            <img
                src={icon}
                alt=""
                aria-hidden
                className="mt-1.25 size-4.5 shrink-0"
            />
            <span className="font-inter text-[14px] leading-6.5 font-normal text-[#666666]">
                {text}
            </span>
        </div>
    )
}

export type ContinueLearningAuthorizedCardProps = {
    enrollment: CourseEnrollmentDetail
}

export default function ContinueLearningAuthorizedCard({
    enrollment,
}: ContinueLearningAuthorizedCardProps) {
    const course = enrollment.course
    const schedule = enrollment.schedule
    const courseId = course?.id
    const title = course?.title?.trim() || 'Course'
    const imageUrl = course?.image?.trim()
    const lecturerName = course?.instructor?.name?.trim() ?? '—'
    const avgRating = course?.avgRating
    const ratingText =
        avgRating != null && Number.isFinite(Number(avgRating))
            ? Number(avgRating).toFixed(1)
            : '—'

    const completed = enrollment.completedAt != null
    const progressPct = completed
        ? 100
        : Math.min(100, Math.max(0, enrollment.progress))

    const sessionNameRaw = schedule?.sessionType?.name?.trim() ?? ''

    const weekLine = enrollmentWeekLabel(schedule)
    const timeLine = enrollmentTimeLabel(schedule)
    const sessionLine = enrollmentSessionName(schedule)
    const locationLine = enrollmentLocationLine(schedule)

    return (
        <article
            className="box-border flex h-54.75 w-126.5 flex-col justify-between gap-2 rounded-xl border border-[#F0F0F0] bg-white p-4"
            aria-label={title}
        >
            <div className="flex min-h-0 flex-row gap-3 overflow-hidden">
                <div className="relative h-31.75 w-45 shrink-0 overflow-hidden rounded-xl bg-[#F0F0F0]">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </div>

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <div className="flex flex-row items-start justify-between gap-2">
                        <p className="font-inter min-w-0 text-[14px] leading-5">
                            <span className="font-normal text-[#666666]">
                                Lecturer{' '}
                            </span>
                            <span className="font-medium text-[#141414]">
                                {lecturerName}
                            </span>
                        </p>
                        <div className="flex shrink-0 items-center gap-1">
                            <img
                                src={ratingFullStar}
                                alt=""
                                aria-hidden
                                className="h-4 w-4"
                            />
                            <span className="font-inter text-[14px] leading-5 font-medium text-[#141414]">
                                {ratingText}
                            </span>
                        </div>
                    </div>

                    <h3 className="font-inter mt-1 line-clamp-2 text-[20px] leading-6 font-semibold text-[#141414]">
                        {title}
                    </h3>

                    <div className="mt-1 flex min-h-0 flex-col overflow-hidden">
                        <MetaRow icon={calendar2Icon} text={weekLine} />
                        <MetaRow icon={clockIcon} text={timeLine} />
                        <div className="flex min-w-0 items-start gap-2">
                            {sessionNameRaw.length > 0 ? (
                                <SessionTypeKindIcon
                                    name={sessionNameRaw}
                                    className="mt-1.25 size-4.5 shrink-0 text-[#666666]"
                                />
                            ) : (
                                <span
                                    className="mt-1.25 inline-block size-4.5 shrink-0"
                                    aria-hidden
                                />
                            )}
                            <span className="font-inter min-w-0 truncate text-[14px] leading-6.5 font-normal text-[#666666]">
                                {sessionNameRaw.length > 0 ? sessionLine : '—'}
                            </span>
                        </div>
                        <MetaRow icon={locationIcon} text={locationLine} />
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 flex-row items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="font-inter text-[16px] leading-6 font-medium text-[#141414]">
                        {progressPct}% Complete
                    </p>
                    <div
                        className="mt-1 h-4 w-full max-w-70 overflow-hidden rounded-full bg-[#E8E7F9]"
                        role="progressbar"
                        aria-valuenow={progressPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div
                            className="h-full rounded-full bg-[#4F46E5]"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>

                {courseId != null ? (
                    <Link
                        to={`/courses/${courseId}`}
                        className="font-inter inline-flex h-12 w-29.25 shrink-0 items-center justify-center rounded-lg border border-[#958FEF] bg-white text-center text-[16px] leading-6 font-medium text-[#4F46E5] hover:bg-[#F5F5FF]"
                    >
                        View
                    </Link>
                ) : (
                    <span className="font-inter inline-flex h-12 w-29.25 shrink-0 items-center justify-center rounded-lg border border-[#958FEF] bg-white text-[16px] leading-6 font-medium text-[#4F46E5] opacity-50">
                        View
                    </span>
                )}
            </div>
        </article>
    )
}
