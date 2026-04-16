export type Category = {
    id: number
    name: string
    icon: string
}

export type Topic = {
    id: number
    categoryId: number
    name: string
}

export type Instructor = {
    id: number
    name: string
    avatar: string
}

export type Course = {
    id: number
    title: string
    description: string
    image: string
    basePrice: string
    durationWeeks: number
    isFeatured: boolean
    avgRating: number
    reviewCount: number
    category: Category
    topic: {
        id: number
        name: string
    }
    instructor: Instructor
}

export type ListResponse<T> = {
    data: T[]
    meta?: {
        total?: number
        perPage?: number
        currentPage?: number
        lastPage?: number
        per_page?: number
        current_page?: number
        last_page?: number
    }
}

export type CourseReview = {
    userId: number
    rating: number
}

export type CourseTimeSlot = {
    id: number
    label: string
    startTime: string
    endTime: string
}

/** Time slot options from `GET /courses/:id/time-slots` */
export type CourseTimeSlotOption = {
    id: number
    label: string
    startTime: string
    endTime: string
    /** When false, card is shown but not selectable (same as unavailable weekly card). */
    available?: boolean
}

export type CourseEnrollmentSchedule = {
    weeklySchedule?: {
        id: number
        label: string
        days: string[]
    }
    timeSlot?: CourseTimeSlot
    sessionType?: {
        id: number
        courseScheduleId: number
        name: string
        priceModifier: number
        availableSeats: number
        location: string
    }
    location?: string
}

export type CourseEnrollmentDetail = {
    id: number
    quantity: number
    totalPrice: number
    progress: number
    completedAt: string | null
    schedule?: CourseEnrollmentSchedule
}

/** Session type options from `GET /courses/:id/session-types` */
export type CourseSessionTypeOption = {
    id: number
    courseScheduleId: number
    name: string
    priceModifier: string
    availableSeats: number
    location: string
}

/**
 * Maps Laravel / mixed JSON (camelCase or snake_case, optional venue keys) into our shape.
 */
export function parseCourseSessionTypeOption(
    raw: Record<string, unknown>,
): CourseSessionTypeOption {
    const num = (v: unknown, fallback = 0) => {
        const n = Number(v)
        return Number.isFinite(n) ? n : fallback
    }
    const str = (v: unknown) => (v == null ? '' : String(v))

    const locCandidates = [
        raw.location,
        raw.venue,
        raw.address,
        raw.campus,
        raw.campus_name,
    ]
    const location =
        locCandidates
            .map((v) => (v == null ? '' : String(v).trim()))
            .find((s) => s.length > 0) ?? ''

    return {
        id: num(raw.id),
        courseScheduleId: num(
            raw.courseScheduleId ?? raw.course_schedule_id,
        ),
        name: str(raw.name),
        priceModifier: str(raw.priceModifier ?? raw.price_modifier ?? '0'),
        availableSeats: num(raw.availableSeats ?? raw.available_seats),
        location,
    }
}

export type WeeklySchedule = {
    id: number
    label: string
    days: string[]
    /** When false, card uses disabled (grey) styling. Defaults to true if omitted. */
    available?: boolean
}

export type CourseDetail = {
    id: number
    title: string
    description: string
    image: string
    basePrice: string | number
    durationWeeks: number
    hours?: number
    isFeatured: boolean
    reviews: CourseReview[]
    isRated: boolean
    category: Category
    topic: {
        id: number
        name: string
        categoryId?: number
    }
    instructor: Instructor
    enrollment?: CourseEnrollmentDetail | null
}

