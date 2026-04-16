import type { ReactNode } from 'react'

import type { CourseEnrollmentDetail } from '@/api/courses/index.types'
import {
    displaySessionTitle,
    normalizeSessionKind,
    SessionTypeKindIcon,
} from '@/pages/course-details/components/session-type'

import calendar2Icon from '@/pages/course-details/components/assets/calendar2.svg'
import clockIcon from '@/pages/course-details/components/assets/clock.svg'
import locationIcon from '@/pages/course-details/components/assets/location.svg'
import checkmarkIcon from '@/pages/course-details/components/assets/checkmark.svg'
import progressBarSvg from '@/pages/course-details/components/assets/progress-bar.svg'

const ENROLLED_PROGRESS_PCT = 65

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

function InfoRow({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-3">
            {icon}
            <span className="font-inter text-[20px] leading-[100%] font-medium text-[#525252]">
                {label}
            </span>
        </div>
    )
}

export type EnrolledStateProps = {
    enrollment: CourseEnrollmentDetail
}

export default function EnrolledState({ enrollment }: EnrolledStateProps) {
    const schedule = enrollment.schedule
    const sessionNameRaw = schedule?.sessionType?.name?.trim() ?? ''

    return (
        <div className="flex w-full flex-col">
            <span className="font-inter inline-flex w-fit rounded-full bg-[#736BEA]/10 px-4 py-2 text-[20px] leading-6 font-semibold text-[#736BEA]">
                Enrolled
            </span>

            <div className="mt-6 mb-5 flex flex-col gap-7">
                <InfoRow
                    icon={
                        <img
                            src={calendar2Icon}
                            alt=""
                            aria-hidden
                            className="h-6 w-6 shrink-0"
                        />
                    }
                    label={enrollmentWeekLabel(schedule)}
                />
                <InfoRow
                    icon={
                        <img
                            src={clockIcon}
                            alt=""
                            aria-hidden
                            className="h-6 w-6 shrink-0"
                        />
                    }
                    label={enrollmentTimeLabel(schedule)}
                />
                <div className="flex items-center gap-3">
                    {sessionNameRaw.length > 0 ? (
                        <SessionTypeKindIcon name={sessionNameRaw} />
                    ) : (
                        <span
                            className="inline-block h-6 w-6 shrink-0"
                            aria-hidden
                        />
                    )}
                    <span className="font-inter text-[20px] leading-[100%] font-medium text-[#525252]">
                        {sessionNameRaw.length > 0
                            ? enrollmentSessionName(schedule)
                            : '—'}
                    </span>
                </div>
                <InfoRow
                    icon={
                        <img
                            src={locationIcon}
                            alt=""
                            aria-hidden
                            className="h-6 w-6 shrink-0"
                        />
                    }
                    label={enrollmentLocationLine(schedule)}
                />
            </div>

            <p className="font-inter mt-8 mb-4 align-middle text-[20px] leading-6 font-semibold text-[#666666]">
                {ENROLLED_PROGRESS_PCT}% Complete
            </p>

            <div
                className="mt-1 w-full"
                role="progressbar"
                aria-valuenow={ENROLLED_PROGRESS_PCT}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <img
                    src={progressBarSvg}
                    alt=""
                    aria-hidden
                    className="block h-auto w-full max-w-full"
                />
            </div>

            <button
                type="button"
                className="font-inter mt-9 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4F46E5] py-4 text-[20px] leading-[100%] font-medium text-white transition-colors hover:bg-[#4338CA]"
            >
                Complete Course
                <img
                    src={checkmarkIcon}
                    alt=""
                    aria-hidden
                    className="h-5.5 w-5.5 shrink-0"
                />
            </button>
        </div>
    )
}
