import qs from 'qs'

export const COURSES_FILTER_KEYS = {
    categoryIds: 'category_ids',
    topicIds: 'topic_ids',
    instructorIds: 'instructor_ids',
    page: 'page',
    sort: 'sort',
} as const

export type CoursesFilterUrlState = {
    categoryIds: number[]
    topicIds: number[]
    instructorIds: number[]
    page: number
    sort: string | null
}

function splitIds(v: unknown): number[] {
    if (v == null || v === '') return []
    const s = Array.isArray(v) ? v.join(',') : String(v)
    return s
        .split(',')
        .map((x) => Number(String(x).trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
}

function parsePositiveInt(v: unknown, fallback: number): number {
    if (v == null || v === '') return fallback
    const n = Number(Array.isArray(v) ? v[0] : v)
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback
}

export function parseCoursesFilterSearch(
    search: string,
): CoursesFilterUrlState {
    const q = search.startsWith('?') ? search.slice(1) : search
    const parsed = qs.parse(q, { ignoreQueryPrefix: true })
    const sortRaw = parsed[COURSES_FILTER_KEYS.sort]
    const sortStr =
        sortRaw == null || sortRaw === ''
            ? null
            : String(Array.isArray(sortRaw) ? sortRaw[0] : sortRaw)

    return {
        categoryIds: splitIds(parsed[COURSES_FILTER_KEYS.categoryIds]),
        topicIds: splitIds(parsed[COURSES_FILTER_KEYS.topicIds]),
        instructorIds: splitIds(parsed[COURSES_FILTER_KEYS.instructorIds]),
        page: parsePositiveInt(parsed[COURSES_FILTER_KEYS.page], 1),
        sort: sortStr,
    }
}

export function mergeCoursesFiltersIntoSearchString(
    currentSearch: string,
    patch: Partial<CoursesFilterUrlState>,
): string {
    const search = currentSearch.startsWith('?')
        ? currentSearch
        : `?${currentSearch}`
    const full = parseCoursesFilterSearch(search)
    const merged: CoursesFilterUrlState = {
        categoryIds: patch.categoryIds ?? full.categoryIds,
        topicIds: patch.topicIds ?? full.topicIds,
        instructorIds: patch.instructorIds ?? full.instructorIds,
        page: patch.page ?? full.page,
        sort: patch.sort !== undefined ? patch.sort : full.sort,
    }

    const q = search.startsWith('?') ? search.slice(1) : search
    const rawParsed = qs.parse(q, { ignoreQueryPrefix: true }) as Record<
        string,
        unknown
    >

    for (const k of Object.values(COURSES_FILTER_KEYS)) {
        delete rawParsed[k]
    }

    if (merged.categoryIds.length > 0) {
        rawParsed[COURSES_FILTER_KEYS.categoryIds] =
            merged.categoryIds.join(',')
    }
    if (merged.topicIds.length > 0) {
        rawParsed[COURSES_FILTER_KEYS.topicIds] = merged.topicIds.join(',')
    }
    if (merged.instructorIds.length > 0) {
        rawParsed[COURSES_FILTER_KEYS.instructorIds] =
            merged.instructorIds.join(',')
    }
    if (merged.page > 1) {
        rawParsed[COURSES_FILTER_KEYS.page] = merged.page
    }
    if (merged.sort != null && merged.sort !== '') {
        rawParsed[COURSES_FILTER_KEYS.sort] = merged.sort
    }

    return qs.stringify(rawParsed, { encodeValuesOnly: true, skipNulls: true })
}
