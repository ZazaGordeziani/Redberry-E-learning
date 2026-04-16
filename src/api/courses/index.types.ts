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

export type CourseTimeSlotOption = {
    id: number
    label: string
    startTime: string
    endTime: string

    available?: boolean
}

export type CourseEnrollmentSchedule = {
    weeklySchedule?: {
        id: number
        label?: string
        days?: string[]
    }
    timeSlot?: {
        id: number
        label?: string
        startTime?: string
        endTime?: string
    }
    sessionType?: {
        id: number
        courseScheduleId?: number
        name?: string
        priceModifier?: number | string
        availableSeats?: number
        location?: string
    }
    location?: string
}

export type CourseEnrollmentDetail = {
    id: number
    totalPrice: number | string
    progress: number
    completedAt: string | null
    course?: {
        id: number
        title: string
        description?: string
        image?: string
        basePrice?: string
        avgRating?: number
        instructor?: Instructor
    }
    schedule?: CourseEnrollmentSchedule
}

export type CourseSessionTypeOption = {
    id: number
    courseScheduleId: number
    name: string
    priceModifier: string
    availableSeats: number
    location: string
}

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
        courseScheduleId: num(raw.courseScheduleId ?? raw.course_schedule_id),
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
