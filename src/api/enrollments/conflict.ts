import axios from 'axios'

export function isEnrollmentScheduleConflict(error: unknown): boolean {
    if (!axios.isAxiosError(error)) return false
    const status = error.response?.status
    const data = error.response?.data as
        | { message?: string; error?: string }
        | undefined
    const msg = (data?.message ?? '').toLowerCase()
    const code = (data?.error ?? '').toLowerCase()

    if (status === 409) return true
    if (
        status === 422 &&
        (msg.includes('conflict') ||
            msg.includes('already enrolled') ||
            msg.includes('same schedule') ||
            code.includes('conflict'))
    ) {
        return true
    }
    return false
}

function pickCourseTitle(v: unknown): string | null {
    if (typeof v === 'string' && v.trim().length > 0) return v.trim()
    if (v && typeof v === 'object' && 'title' in v) {
        const t = (v as { title?: unknown }).title
        if (typeof t === 'string' && t.trim().length > 0) return t.trim()
    }
    if (v && typeof v === 'object' && 'name' in v) {
        const n = (v as { name?: unknown }).name
        if (typeof n === 'string' && n.trim().length > 0) return n.trim()
    }
    if (v && typeof v === 'object' && 'course' in v) {
        const nested = pickCourseTitle((v as { course?: unknown }).course)
        if (nested) return nested
    }
    return null
}

function pickStructuredTitle(raw: Record<string, unknown>): string | null {
    const direct = [
        'conflictingCourseTitle',
        'conflicting_course_title',
        'existingCourseTitle',
        'existing_course_title',
    ] as const
    for (const key of direct) {
        const val = raw[key]
        if (typeof val === 'string' && val.trim().length > 0) return val.trim()
    }

    for (const key of [
        'conflictingCourse',
        'conflicting_course',
        'existingCourse',
        'existing_course',
        'course',
    ]) {
        const picked = pickCourseTitle(raw[key])
        if (picked) return picked
    }

    const data = raw.data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        return pickStructuredTitle(data as Record<string, unknown>)
    }

    return null
}

function titleFromMessageString(message: string): string | null {
    const trimmed = message.trim()
    if (!trimmed) return null

    const quoted = trimmed.match(
        /already\s+enrolled\s+in\s+[""'']([^""'']+)[""'']/i,
    )
    if (quoted?.[1]?.trim()) return quoted[1].trim()

    const sameSchedule = trimmed.match(
        /(?:already\s+)?enrolled\s+in\s+(.+?)\s+with\s+(?:the\s+)?same\s+schedule/i,
    )
    if (sameSchedule?.[1]) {
        const chunk = sameSchedule[1]
            .trim()
            .replace(/^[""''\s]+|[""''\s]+$/g, '')
        if (chunk.length > 0) return chunk
    }

    const forSchedule = trimmed.match(
        /(?:already\s+)?enrolled\s+in\s+(.+?)(?:\s+for\s+this\s+schedule|[.!]|\s*$)/i,
    )
    if (forSchedule?.[1]) {
        const chunk = forSchedule[1]
            .trim()
            .replace(/^[""''\s]+|[""''\s]+$/g, '')
        if (chunk.length > 0) return chunk
    }

    const doubleQuoted =
        trimmed.match(/[""]([^""]+)[""]/) ?? trimmed.match(/"([^"]+)"/)
    if (doubleQuoted?.[1]?.trim()) return doubleQuoted[1].trim()

    const loose = trimmed.match(
        /already\s+enrolled\s+in\s+(.+?)(?:\s+with|\s*$)/i,
    )
    if (loose?.[1]) {
        const chunk = loose[1].trim().replace(/^[""'']|[""'']$/g, '')
        if (chunk.length > 0) return chunk
    }

    return null
}

function pickTitleFromLaravelErrors(errors: unknown): string | null {
    if (!errors || typeof errors !== 'object') return null
    for (const v of Object.values(errors as Record<string, unknown>)) {
        const lines = Array.isArray(v) ? v : [v]
        for (const line of lines) {
            if (typeof line !== 'string' || !line.trim()) continue
            const fromLine = titleFromMessageString(line)
            if (fromLine) return fromLine
        }
    }
    return null
}

export function conflictingCourseTitleFromError(error: unknown): string | null {
    if (!axios.isAxiosError(error)) return null
    const raw = error.response?.data as Record<string, unknown> | undefined
    if (!raw) return null

    const innerData = raw.data
    if (
        innerData &&
        typeof innerData === 'object' &&
        !Array.isArray(innerData)
    ) {
        const c = (innerData as { course?: { title?: unknown } }).course
        if (typeof c?.title === 'string' && c.title.trim().length > 0) {
            return c.title.trim()
        }
    }

    const fromFields = pickStructuredTitle(raw)
    if (fromFields) return fromFields

    const meta = raw.meta
    if (meta && typeof meta === 'object') {
        const fromMeta = pickStructuredTitle(meta as Record<string, unknown>)
        if (fromMeta) return fromMeta
    }

    const fromErrors = pickTitleFromLaravelErrors(raw.errors)
    if (fromErrors) return fromErrors

    const msg = raw.message
    if (typeof msg === 'string' && msg.length > 0) {
        const fromMsg = titleFromMessageString(msg)
        if (fromMsg) return fromMsg
    }

    return null
}

export function conflictingCourseTitleForModal(error: unknown): string {
    return conflictingCourseTitleFromError(error)?.trim() ?? ''
}

export function conflictingScheduleSummaryFromError(
    error: unknown,
): string | null {
    if (!axios.isAxiosError(error)) return null
    const raw = error.response?.data as Record<string, unknown> | undefined
    if (!raw) return null

    const keys = [
        'scheduleSummary',
        'schedule_summary',
        'conflictingSchedule',
        'conflicting_schedule',
    ] as const

    const tryRecord = (rec: Record<string, unknown>): string | null => {
        for (const k of keys) {
            const v = rec[k]
            if (typeof v === 'string' && v.trim().length > 0) return v.trim()
        }
        const nested = rec.data
        if (nested && typeof nested === 'object') {
            return tryRecord(nested as Record<string, unknown>)
        }
        return null
    }

    return tryRecord(raw)
}
