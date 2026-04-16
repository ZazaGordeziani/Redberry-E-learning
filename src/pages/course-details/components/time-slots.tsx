import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getCourseTimeSlots } from '@/api/courses'
import type { CourseTimeSlotOption } from '@/api/courses/index.types'

import afternoonSvgRaw from '@/pages/course-details/components/assets/afternoon.svg?raw'
import eveningSvgRaw from '@/pages/course-details/components/assets/evening.svg?raw'
import morningSvgRaw from '@/pages/course-details/components/assets/morning.svg?raw'

function svgWithCurrentColor(svgRaw: string): string {
    return svgRaw
        .replace(/fill="#[0-9A-Fa-f]+"/g, 'fill="currentColor"')
        .replace(/fill='#[0-9A-Fa-f]+'/g, "fill='currentColor'")
}

function TimeSlotGlyph({
    period,
    className,
}: {
    period: 'morning' | 'afternoon' | 'evening'
    className?: string
}) {
    const raw =
        period === 'morning'
            ? morningSvgRaw
            : period === 'afternoon'
              ? afternoonSvgRaw
              : eveningSvgRaw
    return (
        <span
            className={`inline-flex h-6.5 w-6.5 shrink-0 items-center justify-center ${className ?? ''}`}
            dangerouslySetInnerHTML={{ __html: svgWithCurrentColor(raw) }}
        />
    )
}

function parseHm(t: string): { h: number; m: number } {
    const parts = t.split(':').map((x) => parseInt(x, 10))
    const h = parts[0] ?? 0
    const m = Number.isFinite(parts[1]) ? parts[1]! : 0
    return { h, m }
}

function format12h(hhmm: string): string {
    const { h, m } = parseHm(hhmm)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

//eslint-disable-next-line
export function formatTimeSlotRange(
    startTime: string,
    endTime: string,
): string {
    return `${format12h(startTime)} – ${format12h(endTime)}`
}

//eslint-disable-next-line
export function titleFromTimeSlotLabel(label: string): string {
    const i = label.indexOf('(')
    if (i === -1) return label.trim()
    return label.slice(0, i).trim()
}
//eslint-disable-next-line
export function periodFromTimeSlotLabel(
    label: string,
): 'morning' | 'afternoon' | 'evening' {
    const s = label.toLowerCase()
    if (s.includes('morning')) return 'morning'
    if (s.includes('afternoon')) return 'afternoon'
    if (s.includes('evening')) return 'evening'
    return 'morning'
}

function isTimeSlotAvailable(item: CourseTimeSlotOption): boolean {
    return item.available !== false
}

const TIME_SLOT_PRESETS = [
    { kind: 'morning' as const, title: 'Morning' },
    { kind: 'afternoon' as const, title: 'Afternoon' },
    { kind: 'evening' as const, title: 'Evening' },
] as const

export type TimeSlotRow = {
    kind: 'morning' | 'afternoon' | 'evening'
    id: number | null
    label: string
    startTime?: string
    endTime?: string
    available: boolean
}

//eslint-disable-next-line
export function mergeTimeSlotsWithPresets(
    api: CourseTimeSlotOption[],
): TimeSlotRow[] {
    const byPeriod = new Map<
        'morning' | 'afternoon' | 'evening',
        CourseTimeSlotOption
    >()
    for (const item of api) {
        const p = periodFromTimeSlotLabel(item.label)
        if (!byPeriod.has(p)) {
            byPeriod.set(p, item)
        }
    }

    return TIME_SLOT_PRESETS.map((preset) => {
        const found = byPeriod.get(preset.kind)
        if (found) {
            return {
                kind: preset.kind,
                id: found.id,
                label: found.label,
                startTime: found.startTime,
                endTime: found.endTime,
                available: isTimeSlotAvailable(found),
            }
        }
        return {
            kind: preset.kind,
            id: null,
            label: preset.title,
            available: false,
        }
    })
}

type TimeSlotsPickerProps = {
    courseId: number
    weeklyScheduleId: number
    enabled: boolean
    selectedId: number | null
    onSelect: (id: number) => void
}

export function TimeSlotsPicker({
    courseId,
    weeklyScheduleId,
    enabled,
    selectedId,
    onSelect,
}: TimeSlotsPickerProps) {
    const {
        data: slots = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['course', courseId, 'time-slots', weeklyScheduleId],
        queryFn: () => getCourseTimeSlots(courseId, weeklyScheduleId),
        enabled: enabled && courseId > 0 && Number.isFinite(weeklyScheduleId),
    })

    const rows = useMemo(() => mergeTimeSlotsWithPresets(slots), [slots])

    if (isLoading) {
        return (
            <p className="font-inter mt-6 text-[16px] font-medium text-[#666666]">
                Loading time slots…
            </p>
        )
    }

    if (isError) {
        return (
            <p className="font-inter mt-6 text-[16px] font-medium text-[#666666]">
                Could not load time slots.
            </p>
        )
    }

    return (
        <div className="mt-6 flex flex-wrap gap-2">
            {rows.map((item) => {
                const available = item.available && item.id != null
                const selected = item.id != null && selectedId === item.id
                const title = titleFromTimeSlotLabel(item.label)
                const period = item.kind
                const range =
                    item.startTime && item.endTime
                        ? formatTimeSlotRange(item.startTime, item.endTime)
                        : ''

                return (
                    <button
                        key={item.kind}
                        type="button"
                        disabled={!available}
                        onClick={() =>
                            available && item.id != null && onSelect(item.id)
                        }
                        className={`flex min-h-18 min-w-0 flex-1 basis-35 items-center gap-2 rounded-xl border px-3 py-3 text-left transition-colors ${
                            available
                                ? selected
                                    ? 'border-[#958FEF] bg-[#DDDBFA] text-[#4F46E5]'
                                    : 'border-[#D1D1D1] bg-white text-[#666666] hover:border-[#958FEF]/60'
                                : 'cursor-not-allowed border-[#D1D1D1] bg-transparent text-[#D1D1D1]'
                        }`}
                    >
                        <TimeSlotGlyph
                            period={period}
                            className={
                                available
                                    ? selected
                                        ? 'text-[#4F46E5]'
                                        : 'text-[#666666]'
                                    : 'text-[#D1D1D1]'
                            }
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span
                                className={`font-inter text-[14px] leading-none font-medium ${
                                    available
                                        ? selected
                                            ? 'text-[#4F46E5]'
                                            : 'text-[#666666]'
                                        : 'text-[#D1D1D1]'
                                }`}
                            >
                                {title}
                            </span>
                            {range ? (
                                <span
                                    className={`font-inter text-[10px] leading-none font-normal ${
                                        available
                                            ? selected
                                                ? 'text-[#4F46E5]'
                                                : 'text-[#666666]'
                                            : 'text-[#D1D1D1]'
                                    }`}
                                >
                                    {range}
                                </span>
                            ) : null}
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
