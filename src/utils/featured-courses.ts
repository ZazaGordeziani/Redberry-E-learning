import { httpClient } from '@/api'

export type FeaturedCourse = {
    id: number
    title: string
    description: string
    image: string
    basePrice: string
    durationWeeks: number
    isFeatured: boolean
    avgRating: number
    reviewCount: number
    category: {
        id: number
        name: string
        icon: string
    }
    topic: {
        id: number
        name: string
    }
    instructor: {
        id: number
        name: string
        avatar: string
    }
}

export type FeaturedCoursesResponse = {
    data: FeaturedCourse[]
}

export async function getFeaturedCourses() {
    const res = await httpClient.get<FeaturedCoursesResponse>(
        '/courses/featured',
    )
    return res.data.data
}


