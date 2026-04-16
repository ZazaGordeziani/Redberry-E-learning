import qs from 'qs'

export const SCHEDULE_QUERY_KEYS = {
    weeklyScheduleId: 'weekly_schedule_id',
    timeSlotId: 'time_slot_id',
    sessionTypeId: 'session_type_id',
} as const

export type ScheduleUrlSelection = {
    weeklyScheduleId: number | null
    timeSlotId: number | null
    sessionTypeId: number | null
}

function parsePositiveInt(v: unknown): number | null {
    if (v == null || v === '') return null
    const n = Number(Array.isArray(v) ? v[0] : v)
    return Number.isFinite(n) && n > 0 ? n : null
}

export function parseScheduleUrlSearch(search: string): ScheduleUrlSelection {
    const q = search.startsWith('?') ? search.slice(1) : search
    const parsed = qs.parse(q, { ignoreQueryPrefix: true })
    return {
        weeklyScheduleId: parsePositiveInt(
            parsed[SCHEDULE_QUERY_KEYS.weeklyScheduleId],
        ),
        timeSlotId: parsePositiveInt(parsed[SCHEDULE_QUERY_KEYS.timeSlotId]),
        sessionTypeId: parsePositiveInt(
            parsed[SCHEDULE_QUERY_KEYS.sessionTypeId],
        ),
    }
}

export function mergeScheduleIntoSearchString(
    currentSearch: string,
    sel: ScheduleUrlSelection,
): string {
    const q = currentSearch.startsWith('?')
        ? currentSearch.slice(1)
        : currentSearch
    const parsed = qs.parse(q, { ignoreQueryPrefix: true }) as Record<
        string,
        unknown
    >

    delete parsed[SCHEDULE_QUERY_KEYS.weeklyScheduleId]
    delete parsed[SCHEDULE_QUERY_KEYS.timeSlotId]
    delete parsed[SCHEDULE_QUERY_KEYS.sessionTypeId]

    if (sel.weeklyScheduleId != null) {
        parsed[SCHEDULE_QUERY_KEYS.weeklyScheduleId] = sel.weeklyScheduleId
    }
    if (sel.timeSlotId != null) {
        parsed[SCHEDULE_QUERY_KEYS.timeSlotId] = sel.timeSlotId
    }
    if (sel.sessionTypeId != null) {
        parsed[SCHEDULE_QUERY_KEYS.sessionTypeId] = sel.sessionTypeId
    }

    return qs.stringify(parsed, { encodeValuesOnly: true, skipNulls: true })
}
