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

