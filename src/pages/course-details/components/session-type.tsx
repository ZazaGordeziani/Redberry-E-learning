import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getCourseSessionTypes } from '@/api/courses'
import type { CourseSessionTypeOption } from '@/api/courses/index.types'
import hybridSvgRaw from '@/pages/course-details/components/assets/hybrid.svg?raw'
import inpersonSvgRaw from '@/pages/course-details/components/assets/inperson.svg?raw'
import locationSvgRaw from '@/pages/course-details/components/assets/location.svg?raw'
import onlineSvgRaw from '@/pages/course-details/components/assets/online.svg?raw'
import warningSvgRaw from '@/pages/course-details/components/assets/warning.svg?raw'

function svgWithCurrentColor(svgRaw: string): string {
    return svgRaw
        .replace(/fill="#[0-9A-Fa-f]+"/g, 'fill="currentColor"')
        .replace(/fill='#[0-9A-Fa-f]+'/g, "fill='currentColor'")
        .replace(/stroke="#[0-9A-Fa-f]+"/g, 'stroke="currentColor"')
}

function SvgGlyph({
    raw,
    className,
    ariaHidden = true,
}: {
    raw: string
    className?: string
    ariaHidden?: boolean
}) {
    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center ${className ?? ''}`}
            aria-hidden={ariaHidden}
            dangerouslySetInnerHTML={{ __html: svgWithCurrentColor(raw) }}
        />
    )
}

//eslint-disable-next-line
export function normalizeSessionKind(
    name: string,
): 'online' | 'in_person' | 'hybrid' {
    const n = name.toLowerCase().replace(/-/g, '_')
    if (n.includes('online')) return 'online'
    if (n.includes('hybrid')) return 'hybrid'
    if (n.includes('person') || n.includes('in_person')) return 'in_person'
    return 'online'
}
//eslint-disable-next-line
export function displaySessionTitle(name: string): string {
    const k = normalizeSessionKind(name)
    if (k === 'online') return 'Online'
    if (k === 'in_person') return 'In-Person'
    return 'Hybrid'
}

function sessionKindIcon(kind: ReturnType<typeof normalizeSessionKind>) {
    if (kind === 'online') return onlineSvgRaw
    if (kind === 'in_person') return inpersonSvgRaw
    return hybridSvgRaw
}

/** Session kind icon for a raw API session name (e.g. enrollment schedule). */
export function SessionTypeKindIcon({
    name,
    className = 'h-6 w-6 shrink-0 text-[#525252]',
}: {
    name: string
    className?: string
}) {
    return (
        <SvgGlyph
            raw={sessionKindIcon(normalizeSessionKind(name))}
            className={className}
        />
    )
}

//eslint-disable-next-line
export function sessionSurchargeUsd(
    kind: 'online' | 'in_person' | 'hybrid',
): number {
    if (kind === 'online') return 0
    if (kind === 'in_person') return 30
    return 50
}

//eslint-disable-next-line
export function priceLineForSession(
    kind: 'online' | 'in_person' | 'hybrid',
): string {
    if (kind === 'online') return 'Included'
    if (kind === 'in_person') return '+ $30'
    return '+ $50'
}

export type SessionTypeRow = {
    kind: 'online' | 'in_person' | 'hybrid'
    id: number | null
    name: string
    priceModifier: string
    location: string
    availableSeats: number
    fromApi: boolean
}
//eslint-disable-next-line
export function mergeSessionTypesWithPresets(
    api: CourseSessionTypeOption[],
): SessionTypeRow[] {
    const byKind = new Map<
        'online' | 'in_person' | 'hybrid',
        CourseSessionTypeOption
    >()
    for (const item of api) {
        const k = normalizeSessionKind(item.name)
        if (k !== 'online' && k !== 'in_person' && k !== 'hybrid') continue
        if (!byKind.has(k)) {
            byKind.set(k, item)
        }
    }

    const kinds: Array<'online' | 'in_person' | 'hybrid'> = [
        'online',
        'in_person',
        'hybrid',
    ]

    return kinds.map((kind) => {
        const found = byKind.get(kind)
        if (found) {
            return {
                kind,
                id: found.id,
                name: found.name,
                priceModifier: found.priceModifier,
                location: found.location ?? '',
                availableSeats: found.availableSeats,
                fromApi: true,
            }
        }
        const defaultName =
            kind === 'online'
                ? 'online'
                : kind === 'in_person'
                  ? 'in_person'
                  : 'hybrid'
        return {
            kind,
            id: null,
            name: defaultName,
            priceModifier: '0',
            location: '',
            availableSeats: 0,
            fromApi: false,
        }
    })
}

function SeatsAvailability({ seats }: { seats: number }) {
    if (seats === 0) {
        return (
            <p className="font-inter mt-2 text-center text-[12px] leading-none font-medium text-[#525252]">
                Fully Booked
            </p>
        )
    }
    if (seats > 0 && seats < 5) {
        return (
            <div className="font-inter mt-2 flex items-center justify-center gap-1 text-[12px] leading-none font-medium text-[#F4A316]">
                <SvgGlyph
                    raw={warningSvgRaw}
                    className="h-4 w-4 text-[#F4A316]"
                />
                <span>Only {seats} Seats Remaining</span>
            </div>
        )
    }
    return (
        <p className="font-inter mt-2 text-center text-[12px] leading-none font-medium text-[#3D3D3D]">
            {seats} Seats Available
        </p>
    )
}

type SessionTypesPickerProps = {
    courseId: number
    weeklyScheduleId: number
    timeSlotId: number
    enabled: boolean
    selectedId: number | null
    onSelect: (id: number) => void
}

export function SessionTypesPicker({
    courseId,
    weeklyScheduleId,
    timeSlotId,
    enabled,
    selectedId,
    onSelect,
}: SessionTypesPickerProps) {
    const {
        data: sessionTypes = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: [
            'course',
            courseId,
            'session-types',
            weeklyScheduleId,
            timeSlotId,
        ],
        queryFn: () =>
            getCourseSessionTypes(courseId, weeklyScheduleId, timeSlotId),
        enabled:
            enabled &&
            courseId > 0 &&
            Number.isFinite(weeklyScheduleId) &&
            Number.isFinite(timeSlotId),
    })

    const rows = useMemo(
        () => mergeSessionTypesWithPresets(sessionTypes),
        [sessionTypes],
    )

    if (isLoading) {
        return (
            <p className="font-inter mt-6 text-[16px] font-medium text-[#666666]">
                Loading session types…
            </p>
        )
    }

    if (isError) {
        return (
            <p className="font-inter mt-6 text-[16px] font-medium text-[#666666]">
                Could not load session types.
            </p>
        )
    }

    return (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
            {rows.map((item) => {
                const kind = item.kind
                const title = displaySessionTitle(item.name)
                const price = priceLineForSession(item.kind)
                const hasSeats = item.availableSeats > 0
                const selectable = item.fromApi && item.id != null && hasSeats
                const selected =
                    selectable && item.id != null && selectedId === item.id

                const trimmedLocation = item.location?.trim() ?? ''
                const locationLabel =
                    kind === 'online'
                        ? 'Google Meet'
                        : trimmedLocation.length > 0
                          ? trimmedLocation
                          : '-'

                const locationLineClass = selectable
                    ? selected
                        ? 'text-[#4F46E5]'
                        : 'text-[#666666]'
                    : locationLabel.length > 0
                      ? 'text-[#666666]'
                      : 'text-[#D1D1D1]'

                return (
                    <div
                        key={item.kind}
                        className="flex min-w-0 flex-1 basis-35 flex-col items-center sm:basis-40"
                    >
                        <button
                            type="button"
                            disabled={!selectable}
                            onClick={() =>
                                selectable &&
                                item.id != null &&
                                onSelect(item.id)
                            }
                            className={`flex w-full flex-col items-center gap-2 rounded-xl border px-4 py-4 text-center transition-colors ${
                                selectable
                                    ? selected
                                        ? 'border-[#958FEF] bg-[#DDDBFA]'
                                        : 'border-[#D1D1D1] bg-white hover:border-[#958FEF]/60'
                                    : 'cursor-not-allowed border-[#D1D1D1] bg-transparent'
                            }`}
                        >
                            <SvgGlyph
                                raw={sessionKindIcon(kind)}
                                className={`h-6.5 w-6.5 ${
                                    selectable
                                        ? selected
                                            ? 'text-[#4F46E5]'
                                            : 'text-[#525252]'
                                        : 'text-[#D1D1D1]'
                                }`}
                            />
                            <span
                                className={`font-inter text-[16px] leading-none font-semibold ${
                                    selectable
                                        ? selected
                                            ? 'text-[#4F46E5]'
                                            : 'text-[#525252]'
                                        : 'text-[#D1D1D1]'
                                }`}
                            >
                                {title}
                            </span>

                            {kind === 'online' ? (
                                <span
                                    className={`font-inter min-w-0 truncate text-[14px] leading-none font-normal ${locationLineClass}`}
                                >
                                    {locationLabel}
                                </span>
                            ) : (
                                <div
                                    className={`flex min-w-0 items-center justify-center gap-1 text-[14px] leading-none ${locationLineClass}`}
                                >
                                    <SvgGlyph
                                        raw={locationSvgRaw}
                                        className="h-4 w-4 shrink-0"
                                    />
                                    <span className="font-inter min-w-0 truncate font-normal">
                                        {locationLabel}
                                    </span>
                                </div>
                            )}

                            <span
                                className={`font-inter text-[14px] leading-none font-medium ${
                                    selectable
                                        ? 'text-[#736BEA]'
                                        : 'text-[#D1D1D1]'
                                }`}
                            >
                                {price}
                            </span>
                        </button>

                        <SeatsAvailability seats={item.availableSeats} />
                    </div>
                )
            })}
        </div>
    )
}
