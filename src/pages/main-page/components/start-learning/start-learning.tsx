import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
    getFeaturedCourses,
    type FeaturedCourse,
} from '@/utils/featured-courses'
import ratingFullStar from '@/assets/rating-full-star.svg'

const Star = () => (
    <img src={ratingFullStar} alt="" aria-hidden="true" className="h-4 w-4" />
)

type Props = {
    extraBottomPadding?: boolean
}

export const StartLearning = ({ extraBottomPadding }: Readonly<Props>) => {
    const [courses, setCourses] = useState<FeaturedCourse[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        getFeaturedCourses()
            .then((data) => {
                if (!isMounted) return
                setCourses(data.slice(0, 3))
            })
            .catch(() => {
                if (!isMounted) return
                setCourses([])
            })
            .finally(() => {
                if (!isMounted) return
                setIsLoading(false)
            })

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <section className={`pt-5 ${extraBottomPadding ? 'pb-45' : 'pb-30'}`}>
            <div className="mx-auto w-full max-w-391.5">
                <div className="flex flex-col gap-1.5">
                    <h2 className="font-inter pb-2 text-[40px] leading-10 font-semibold text-[#0A0A0A]">
                        Start Learning Today
                    </h2>
                    <p className="font-inter text-[18px] leading-4.5 font-medium text-[#3D3D3D]">
                        Choose from our most popular courses and begin your
                        journey
                    </p>
                </div>

                <div className="mt-7 flex gap-6">
                    {isLoading
                        ? ['a', 'b', 'c'].map((id) => (
                              <div
                                  key={`skeleton-${id}`}
                                  className="h-144 w-126.5 rounded-xl border border-[#F5F5F5] bg-white"
                              />
                          ))
                        : courses.map((course) => (
                              <Link
                                  key={course.id}
                                  to={`/courses/${course.id}`}
                                  aria-label={`Open course: ${course.title}`}
                                  className="flex h-144 w-126.5 flex-col rounded-xl border border-[#F5F5F5] bg-white p-5 pb-5 text-inherit no-underline transition-colors hover:border-[#E8E8E8] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                              >
                                  <img
                                      src={course.image}
                                      alt={course.title}
                                      className="h-65.5 w-116.5 rounded-xl object-cover"
                                  />

                                  <div className="mt-4 flex items-center justify-between">
                                      <p className="font-inter text-[14px] leading-3.5 font-medium text-[#666666]">
                                          Lecturer {course.instructor.name}
                                      </p>

                                      <div className="flex items-center gap-1">
                                          <Star />
                                          <p className="font-inter text-[14px] leading-3.5 font-medium text-[#141414]">
                                              {course.avgRating.toFixed(1)}
                                          </p>
                                      </div>
                                  </div>

                                  <div className="mt-4 min-h-0 flex-1">
                                      <h3 className="font-inter text-[24px] leading-6 font-semibold text-[#141414]">
                                          {course.title}
                                      </h3>
                                      <p className="font-inter mt-2.5 line-clamp-3 text-[16px] leading-6 font-medium text-[#666666]">
                                          {course.description}
                                      </p>
                                  </div>

                                  <div className="mt-auto flex items-end justify-between pt-2">
                                      <div className="flex flex-row items-center gap-2">
                                          <p className="font-inter text-[12px] leading-3 font-medium text-[#8A8A8A]">
                                              Starting from
                                          </p>
                                          <p className="font-inter text-[32px] leading-8 font-semibold text-[#141414]">
                                              ${course.basePrice}
                                          </p>
                                      </div>
                                  </div>
                              </Link>
                          ))}
                </div>
            </div>
        </section>
    )
}

export default StartLearning
