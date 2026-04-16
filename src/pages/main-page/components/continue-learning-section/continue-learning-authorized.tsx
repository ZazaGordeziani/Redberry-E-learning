import type { CourseEnrollmentDetail } from '@/api/courses/index.types'

import ContinueLearningAuthorizedCard from './continue-learning-authorized-card'

export type ContinueLearningAuthorizedProps = {
    enrollments: CourseEnrollmentDetail[]
    isLoading?: boolean
}

export default function ContinueLearningAuthorized({
    enrollments,
    isLoading = false,
}: ContinueLearningAuthorizedProps) {
    const items = enrollments.slice(0, 4)

    if (isLoading || items.length === 0) {
        return null
    }

    return (
        <section className="w-full pt-2 pb-10">
            <div className="mx-auto w-full max-w-391.5">
                <div className="flex flex-col gap-1.5 text-left">
                    <h2 className="font-inter text-[40px] leading-[100%] font-semibold text-[#0A0A0A]">
                        Continue Learning
                    </h2>
                    <p className="font-inter text-[18px] leading-[100%] font-medium text-[#3D3D3D]">
                        Pick up where you left
                    </p>
                </div>

                <div className="mt-7 overflow-x-auto pb-2">
                    <ul className="flex w-max flex-nowrap items-stretch gap-6">
                        {items.map((enrollment) => (
                            <li
                                key={enrollment.id}
                                className="flex w-126.5 shrink-0 justify-start"
                            >
                                <ContinueLearningAuthorizedCard
                                    enrollment={enrollment}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
