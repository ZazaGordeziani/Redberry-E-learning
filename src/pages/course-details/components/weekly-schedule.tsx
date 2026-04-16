import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import {
    getCourseSessionTypes,
    getCourseTimeSlots,
    getCourseWeeklySchedules,
} from '@/api/courses'
import { SessionTypesPicker } from '@/pages/course-details/components/session-type'
import {
    mergeTimeSlotsWithPresets,
    TimeSlotsPicker,
} from '@/pages/course-details/components/time-slots'
import type { WeeklySchedule as WeeklyScheduleApi } from '@/api/courses/index.types'
import {
    mergeScheduleIntoSearchString,
    parseScheduleUrlSearch,
    type ScheduleUrlSelection,
} from '@/utils/scheduleSearchParams'

const HEADING_CLASS =
    'font-inter text-[24px] leading-none font-semibold tracking-normal'

const DAY_ABBREV: Record<string, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
}

function shortDay(day: string): string {
    const key = day.toLowerCase()
    return (
        DAY_ABBREV[key] ??
        day.slice(0, 3).charAt(0).toUpperCase() + day.slice(1, 3)
    )
}
//eslint-disable-next-line
export function formatWeeklyScheduleCardLabel(item: WeeklyScheduleApi): string {
    const labelLower = item.label.trim().toLowerCase()
    if (labelLower.includes('weekend only') || labelLower === 'weekend only') {
        return 'Weekend'
    }

    const days = item.days ?? []
    const norm = days.map((d) => d.toLowerCase())
    const isWeekendPair =
        norm.length === 2 &&
        norm.includes('saturday') &&
        norm.includes('sunday')
    if (isWeekendPair) {
        return 'Weekend'
    }

    if (days.length >= 2) {
        return `${shortDay(days[0])}-${shortDay(days[days.length - 1])}`
    }
    if (days.length === 1) {
        return shortDay(days[0])
    }
    return item.label
}

const WEEKLY_PRESETS = [
    {
        kind: 'mon-wed',
        label: 'Monday - Wednesday',
        days: ['monday', 'wednesday'],
    },
    {
        kind: 'tue-thu',
        label: 'Tuesday - Thursday',
        days: ['tuesday', 'thursday'],
    },
    {
        kind: 'fri-sat',
        label: 'Friday - Saturday',
        days: ['friday', 'saturday'],
    },
    {
        kind: 'weekend',
        label: 'Weekend Only',
        days: ['saturday', 'sunday'],
    },
] as const

function daysSignature(days: string[]): string {
    return [...days.map((d) => d.toLowerCase().trim())].sort().join(',')
}

export type WeeklyScheduleRow = {
    kind: string
    id: number | null
    label: string
    days: string[]
    available: boolean
}

function mergeWeeklySchedulesWithPresets(
    api: WeeklyScheduleApi[],
): WeeklyScheduleRow[] {
    const unmatched = new Map<string, WeeklyScheduleApi>()
    for (const item of api) {
        unmatched.set(daysSignature(item.days), item)
    }

    const rows: WeeklyScheduleRow[] = []

    for (const preset of WEEKLY_PRESETS) {
        const key = daysSignature([...preset.days])
        const found = unmatched.get(key)
        if (found) {
            unmatched.delete(key)
            rows.push({
                kind: preset.kind,
                id: found.id,
                label: found.label,
                days: found.days,
                available: found.available !== false,
            })
        } else {
            rows.push({
                kind: preset.kind,
                id: null,
                label: preset.label,
                days: [...preset.days],
                available: false,
            })
        }
    }

    for (const [, item] of unmatched) {
        rows.push({
            kind: `api-${item.id}`,
            id: item.id,
            label: item.label,
            days: item.days,
            available: item.available !== false,
        })
    }

    return rows
}

function isScheduleAvailableRow(row: WeeklyScheduleRow): boolean {
    return row.available && row.id != null
}

function StepBadge({
    step,
    isOpen,
    disabled,
}: {
    step: number
    isOpen: boolean
    disabled: boolean
}) {
    if (disabled) {
        return (
            <span
                className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#D1D1D1] text-[16px] leading-none font-semibold text-[#D1D1D1]"
                aria-hidden
            >
                {step}
            </span>
        )
    }
    if (isOpen) {
        return (
            <span
                className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#130E67] text-[16px] leading-none font-semibold text-[#130E67]"
                aria-hidden
            >
                {step}
            </span>
        )
    }
    return (
        <span
            className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full bg-[#0A0836] text-[16px] leading-none font-semibold text-white"
            aria-hidden
        >
            {step}
        </span>
    )
}

function AccordionChevron({
    expanded,
    disabled,
}: {
    expanded: boolean
    disabled: boolean
}) {
    const stroke = disabled ? '#D1D1D1' : '#130E67'
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`shrink-0 transition-transform ${expanded ? 'rotate-0' : 'rotate-180'}`}
            aria-hidden
        >
            <path
                d="M6 9L12 15L18 9"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

type AccordionHeaderProps = {
    step: number
    title: string
    expanded: boolean
    disabled: boolean
    onToggle: () => void
    badgeShowsOutline?: boolean
}

function AccordionHeader({
    step,
    title,
    expanded,
    disabled,
    onToggle,
    badgeShowsOutline,
}: AccordionHeaderProps) {
    const badgeOpen = badgeShowsOutline ?? expanded
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onToggle}
            aria-expanded={expanded}
            className="flex w-full items-center justify-between gap-4 text-left disabled:cursor-not-allowed"
        >
            <div className="flex items-center gap-2">
                <StepBadge step={step} isOpen={badgeOpen} disabled={disabled} />
                <span
                    className={`${HEADING_CLASS} ${
                        disabled ? 'text-[#D1D1D1]' : 'text-[#130E67]'
                    }`}
                >
                    {title}
                </span>
            </div>
            <AccordionChevron expanded={expanded} disabled={disabled} />
        </button>
    )
}

type WeeklyScheduleCardsProps = {
    items: WeeklyScheduleRow[]
    selectedId: number | null
    onSelect: (id: number) => void
}

function WeeklyScheduleCards({
    items,
    selectedId,
    onSelect,
}: WeeklyScheduleCardsProps) {
    return (
        <div className="mt-6 flex flex-wrap gap-2">
            {items.map((item) => {
                const available = isScheduleAvailableRow(item)
                const label = formatWeeklyScheduleCardLabel({
                    id: item.id ?? 0,
                    label: item.label,
                    days: item.days,
                })
                const selected = item.id != null && selectedId === item.id

                return (
                    <button
                        key={`${item.kind}-${item.id ?? 'off'}`}
                        type="button"
                        disabled={!available}
                        onClick={() =>
                            available && item.id != null && onSelect(item.id)
                        }
                        className={`flex h-22.75 w-31 shrink-0 flex-col items-center justify-center rounded-xl border text-center transition-colors ${
                            available
                                ? selected
                                    ? 'border-[#958FEF] bg-[#DDDBFA]'
                                    : 'border-[#D1D1D1] bg-white hover:border-[#130E67]/50'
                                : 'cursor-not-allowed border-[#D1D1D1] bg-transparent'
                        }`}
                    >
                        <span
                            className={`font-inter text-[16px] leading-none font-semibold tracking-normal ${
                                available ? 'text-[#292929]' : 'text-[#D1D1D1]'
                            }`}
                        >
                            {label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export type WeeklyScheduleProps = {
    courseId: number
    className?: string
}

export default function WeeklySchedule({
    courseId,
    className = '',
}: WeeklyScheduleProps) {
    const [searchParams, setSearchParams] = useSearchParams()

    const [weeklyOpen, setWeeklyOpen] = useState(true)
    const [timeSlotOpen, setTimeSlotOpen] = useState(false)
    const [sessionTypeOpen, setSessionTypeOpen] = useState(false)

    const pushScheduleToUrl = useCallback(
        (sel: ScheduleUrlSelection) => {
            setSearchParams(
                (prev) =>
                    new URLSearchParams(
                        mergeScheduleIntoSearchString(
                            `?${prev.toString()}`,
                            sel,
                        ),
                    ),
                { replace: true },
            )
        },
        [setSearchParams],
    )

    const {
        data: weeklySchedules = [],
        isLoading: weeklyLoading,
        isError: weeklyError,
    } = useQuery({
        queryKey: ['course', courseId, 'weekly-schedules'],
        queryFn: () => getCourseWeeklySchedules(courseId),
        enabled: courseId > 0,
    })

    const mergedWeeklyRows = useMemo(
        () => mergeWeeklySchedulesWithPresets(weeklySchedules),
        [weeklySchedules],
    )

    const parsedFromUrl = useMemo(
        () => parseScheduleUrlSearch(`?${searchParams.toString()}`),
        [searchParams],
    )

    const urlWeeklyOk =
        parsedFromUrl.weeklyScheduleId != null &&
        mergedWeeklyRows.some(
            (r) =>
                r.id === parsedFromUrl.weeklyScheduleId &&
                isScheduleAvailableRow(r),
        )

    const { data: timeSlotsForUrl = [], isPending: timeSlotsForUrlPending } =
        useQuery({
            queryKey: [
                'course',
                courseId,
                'time-slots',
                parsedFromUrl.weeklyScheduleId,
            ],
            queryFn: () =>
                getCourseTimeSlots(courseId, parsedFromUrl.weeklyScheduleId!),
            enabled:
                courseId > 0 &&
                parsedFromUrl.weeklyScheduleId != null &&
                urlWeeklyOk,
        })

    const timeSlotRowsForUrl = useMemo(
        () => mergeTimeSlotsWithPresets(timeSlotsForUrl),
        [timeSlotsForUrl],
    )

    const urlTimeSlotOk =
        parsedFromUrl.timeSlotId != null &&
        timeSlotRowsForUrl.some(
            (r) =>
                r.id === parsedFromUrl.timeSlotId &&
                r.available &&
                r.id != null,
        )

    const {
        data: sessionTypesForUrl = [],
        isPending: sessionTypesForUrlPending,
    } = useQuery({
        queryKey: [
            'course',
            courseId,
            'session-types',
            parsedFromUrl.weeklyScheduleId,
            parsedFromUrl.timeSlotId,
        ],
        queryFn: () =>
            getCourseSessionTypes(
                courseId,
                parsedFromUrl.weeklyScheduleId!,
                parsedFromUrl.timeSlotId!,
            ),
        enabled:
            courseId > 0 &&
            urlWeeklyOk &&
            urlTimeSlotOk &&
            parsedFromUrl.timeSlotId != null,
    })

    const urlSessionTypeOk =
        parsedFromUrl.sessionTypeId != null &&
        sessionTypesForUrl.some((s) => s.id === parsedFromUrl.sessionTypeId)

    /** Single source of truth: URL + validated API data (no effect-driven selection state). */
    const selectedWeeklyId = useMemo((): number | null => {
        if (weeklyLoading || parsedFromUrl.weeklyScheduleId == null) return null
        return urlWeeklyOk ? parsedFromUrl.weeklyScheduleId : null
    }, [weeklyLoading, parsedFromUrl.weeklyScheduleId, urlWeeklyOk])

    const selectedTimeSlotId = useMemo((): number | null => {
        if (selectedWeeklyId == null || parsedFromUrl.timeSlotId == null)
            return null
        if (timeSlotsForUrlPending) return null
        return urlTimeSlotOk ? parsedFromUrl.timeSlotId : null
    }, [
        selectedWeeklyId,
        parsedFromUrl.timeSlotId,
        urlTimeSlotOk,
        timeSlotsForUrlPending,
    ])

    const selectedSessionTypeId = useMemo((): number | null => {
        if (selectedTimeSlotId == null || parsedFromUrl.sessionTypeId == null)
            return null
        if (sessionTypesForUrlPending) return null
        return urlSessionTypeOk ? parsedFromUrl.sessionTypeId : null
    }, [
        selectedTimeSlotId,
        parsedFromUrl.sessionTypeId,
        urlSessionTypeOk,
        sessionTypesForUrlPending,
    ])

    const timeSlotUnlocked = selectedWeeklyId !== null
    const sessionTypeUnlocked = selectedTimeSlotId !== null

    const timeSlotExpanded = timeSlotUnlocked && timeSlotOpen
    const sessionTypeExpanded = sessionTypeUnlocked && sessionTypeOpen

    const weeklyBadgeOutline = weeklyOpen || selectedWeeklyId === null

    const timeSlotBadgeOutline = timeSlotOpen || selectedTimeSlotId === null

    const sessionTypeBadgeOutline =
        sessionTypeOpen || selectedSessionTypeId === null

    const toggleWeekly = () => {
        setWeeklyOpen((o) => !o)
    }

    const toggleTimeSlot = () => {
        if (!timeSlotUnlocked) return
        setTimeSlotOpen((o) => !o)
    }

    const toggleSessionType = () => {
        if (!sessionTypeUnlocked) return
        setSessionTypeOpen((o) => !o)
    }

    return (
        <div
            className={`flex w-full min-w-0 flex-col gap-8 ${className}`.trim()}
        >
            <div>
                <AccordionHeader
                    step={1}
                    title="Weekly Schedule"
                    expanded={weeklyOpen}
                    disabled={false}
                    onToggle={toggleWeekly}
                    badgeShowsOutline={weeklyBadgeOutline}
                />
                {weeklyOpen ? (
                    <div>
                        {weeklyLoading ? (
                            <p className="font-inter mt-6 text-[16px] font-medium text-[#666666]">
                                Loading schedules…
                            </p>
                        ) : weeklyError ? (
                            <p className="font-inter mt-6 text-[16px] font-medium text-[#666666]">
                                Could not load weekly schedules.
                            </p>
                        ) : (
                            <WeeklyScheduleCards
                                items={mergedWeeklyRows}
                                selectedId={selectedWeeklyId}
                                onSelect={(id) => {
                                    pushScheduleToUrl({
                                        weeklyScheduleId: id,
                                        timeSlotId: null,
                                        sessionTypeId: null,
                                    })
                                }}
                            />
                        )}
                    </div>
                ) : null}
            </div>

            <div>
                <AccordionHeader
                    step={2}
                    title="Time Slot"
                    expanded={timeSlotExpanded}
                    disabled={!timeSlotUnlocked}
                    onToggle={toggleTimeSlot}
                    badgeShowsOutline={timeSlotBadgeOutline}
                />
                {timeSlotExpanded && selectedWeeklyId != null ? (
                    <TimeSlotsPicker
                        courseId={courseId}
                        weeklyScheduleId={selectedWeeklyId}
                        enabled={timeSlotUnlocked}
                        selectedId={selectedTimeSlotId}
                        onSelect={(id) => {
                            if (selectedWeeklyId != null) {
                                pushScheduleToUrl({
                                    weeklyScheduleId: selectedWeeklyId,
                                    timeSlotId: id,
                                    sessionTypeId: null,
                                })
                            }
                        }}
                    />
                ) : null}
            </div>

            <div>
                <AccordionHeader
                    step={3}
                    title="Session Type"
                    expanded={sessionTypeExpanded}
                    disabled={!sessionTypeUnlocked}
                    onToggle={toggleSessionType}
                    badgeShowsOutline={sessionTypeBadgeOutline}
                />
                {sessionTypeExpanded &&
                selectedWeeklyId != null &&
                selectedTimeSlotId != null ? (
                    <SessionTypesPicker
                        courseId={courseId}
                        weeklyScheduleId={selectedWeeklyId}
                        timeSlotId={selectedTimeSlotId}
                        enabled={sessionTypeUnlocked}
                        selectedId={selectedSessionTypeId}
                        onSelect={(id) => {
                            if (
                                selectedWeeklyId != null &&
                                selectedTimeSlotId != null
                            ) {
                                pushScheduleToUrl({
                                    weeklyScheduleId: selectedWeeklyId,
                                    timeSlotId: selectedTimeSlotId,
                                    sessionTypeId: id,
                                })
                            }
                        }}
                    />
                ) : null}
            </div>
        </div>
    )
}
