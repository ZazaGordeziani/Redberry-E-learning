import axios from 'axios'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import ratingFullStar from '@/assets/rating-full-star.svg'
import { getCourseById } from '@/api/courses'
import { CategoryFilterGlyph } from '@/pages/courses/components/categoryFilterGlyph'

import calendarIcon from '@/pages/course-details/components/assets/calendar.svg'
import clockIcon from '@/pages/course-details/components/assets/clock.svg'

import { CourseDescriptionBreadCrumbs } from '@/pages/course-details/components/course-description-breadcrumbs'
import NotFoundPage from '@/pages/404'
import WeeklySchedule from '@/pages/course-details/components/weekly-schedule'

function averageRatingFromReviews(
    reviews: { rating: number }[] | undefined,
): number {
    if (!reviews?.length) return 0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return sum / reviews.length
}

const CourseDescription = () => {
    const { id: idParam } = useParams<{ id: string }>()
    const courseId = Number(idParam)
    const idValid = Number.isFinite(courseId) && courseId > 0

    const {
        data: course,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        enabled: idValid,
    })

    const avgRating = useMemo(
        () => (course ? averageRatingFromReviews(course.reviews) : 0),
        [course],
    )

    if (!idValid) {
        return (
            <section className="w-full flex-1 self-stretch">
                <div className="mx-auto w-full max-w-391.5 pt-10 pb-5">
                    <p className="font-inter text-[16px] text-[#666666]">
                        Invalid course.
                    </p>
                </div>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section className="w-full flex-1 self-stretch">
                <div className="mx-auto w-full max-w-391.5 pt-10 pb-5">
                    <p className="font-inter text-[16px] font-medium text-[#666666]">
                        Loading...
                    </p>
                </div>
            </section>
        )
    }

    if (isError || !course) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return <NotFoundPage />
        }
        return (
            <section className="w-full flex-1 self-stretch">
                <div className="mx-auto w-full max-w-391.5 pt-10 pb-5">
                    <p className="font-inter text-[16px] font-medium text-[#666666]">
                        Could not load this course.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="flex w-full flex-1 flex-col self-stretch">
            <div className="mx-auto flex w-full max-w-391.5 flex-1 flex-col px-4 pt-10 pb-5 sm:px-0">
                <div className="w-full max-w-full">
                    <div className="flex flex-col gap-7.5 lg:flex-row lg:items-start">
                        <div className="w-full max-w-225.75 min-w-0 shrink-0">
                            <CourseDescriptionBreadCrumbs
                                categoryName={course.category.name}
                            />

                            <h1 className="font-inter mt-8 text-[40px] leading-none font-semibold tracking-normal text-[#141414]">
                                {course.title}
                            </h1>

                            <div className="mt-6 overflow-hidden rounded-[10px]">
                                <img
                                    src={course.image}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-118.5 w-full max-w-225.75 object-cover"
                                />
                            </div>

                            <div className="mt-4 flex w-full max-w-225.75 flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={calendarIcon}
                                            alt=""
                                            aria-hidden="true"
                                            className="h-5 w-5 shrink-0"
                                        />
                                        <span className="font-inter text-[14px] leading-6 font-medium text-[#525252]">
                                            {course.durationWeeks} Weeks
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={clockIcon}
                                            alt=""
                                            aria-hidden="true"
                                            className="h-5 w-5 shrink-0"
                                        />
                                        <span className="font-inter text-[14px] leading-6 font-medium text-[#525252]">
                                            {course.hours != null &&
                                            Number.isFinite(course.hours)
                                                ? `${course.hours} hours`
                                                : '—'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-1">
                                        <img
                                            src={ratingFullStar}
                                            alt=""
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                        />
                                        <span className="font-inter text-[14px] leading-3.5 font-medium text-[#525252]">
                                            {avgRating > 0
                                                ? avgRating.toFixed(1)
                                                : '0.0'}
                                        </span>
                                    </div>
                                    <span className="font-inter inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-1 text-center text-[16px] leading-6 font-medium text-[#666666]">
                                        {course.category?.icon ? (
                                            <CategoryFilterGlyph
                                                iconKey={course.category.icon}
                                                className="text-[#666666]"
                                            />
                                        ) : null}
                                        <span>{course.category?.name}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="font-inter mt-5 flex h-11.5 w-fit max-w-225.75 items-center gap-2 rounded-xl border border-transparent bg-white p-3 text-left text-[16px] leading-6 font-medium text-[#666666]">
                                <img
                                    src={course.instructor.avatar}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-7.5 w-7.5 rounded-sm object-cover"
                                />
                                <span>{course.instructor.name}</span>
                            </div>

                            <div className="mt-5 w-full">
                                <h2 className="font-inter text-[20px] leading-6 font-semibold tracking-normal text-[#8A8A8A]">
                                    Course Description
                                </h2>
                                <p className="font-inter mt-6 text-[16px] leading-6 font-medium tracking-normal text-[#525252]">
                                    {course.description}
                                </p>
                            </div>
                        </div>

                        <aside className="w-132.5 min-w-0 shrink-0">
                            <WeeklySchedule
                                courseId={course.id}
                                className="mt-28 ml-25 w-full max-w-full"
                            />
                        </aside>
                    </div>

                    <div className="h-50 shrink-0" aria-hidden="true" />
                </div>
            </div>
        </section>
    )
}

export default CourseDescription
