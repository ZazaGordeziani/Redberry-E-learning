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

