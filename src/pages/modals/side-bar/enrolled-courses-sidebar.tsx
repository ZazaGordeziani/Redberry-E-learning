import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getMyEnrollments } from '@/api/enrollments'

import EnrolledCourseCard from '@/pages/modals/side-bar/enrolled-course-card'
import noEnrollmentsSvg from '@/pages/modals/side-bar/assets/no-enrollment.svg'

const HEADER_OFFSET_PX = 108

export type EnrolledCoursesSidebarProps = {
    open: boolean
    onClose: () => void
}

export default function EnrolledCoursesSidebar({
    open,
    onClose,
}: EnrolledCoursesSidebarProps) {
    const { data: enrollments = [], isLoading } = useQuery({
        queryKey: ['enrollments'],
        queryFn: getMyEnrollments,
        enabled: open,
    })

    const count = enrollments.length

    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [open])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <button
                type="button"
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
                aria-label="Close enrolled courses"
            />

            <aside
                className="relative z-10 flex w-198.5 shrink-0 flex-col bg-[#F5F5F5]"
                style={{
                    marginTop: HEADER_OFFSET_PX,
                    height: `calc(100vh - ${HEADER_OFFSET_PX}px)`,
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="enrolled-courses-heading"
            >
                <div className="flex shrink-0 flex-row items-start justify-between px-17 pt-20">
                    <h2
                        id="enrolled-courses-heading"
                        className="font-inter text-[40px] leading-[100%] font-semibold text-[#0A0A0A]"
                    >
                        Enrolled Courses
                    </h2>
                    <p className="font-inter mt-3 text-right text-[16px] leading-6 font-medium text-[#0A0A0A]">
                        Total Enrollments{' '}
                        <span className="font-semibold">
                            {isLoading ? '—' : count}
                        </span>
                    </p>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden pt-8 pb-8">
                    {isLoading ? (
                        <div className="flex flex-1 flex-col items-center justify-center">
                            <p className="font-inter text-center text-[16px] text-[#666666]">
                                Loading…
                            </p>
                        </div>
                    ) : count === 0 ? (
                        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
                            <img
                                src={noEnrollmentsSvg}
                                alt=""
                                aria-hidden
                                className="mx-auto h-auto w-full max-w-50 shrink-0"
                            />
                            <h3 className="font-inter mt-6.25 text-[24px] leading-[100%] font-semibold text-[#130E67]">
                                No Enrolled Courses Yet
                            </h3>
                            <p className="font-inter mt-3.75 max-w-70 text-[14px] leading-[100%] font-medium text-[#130E67]">
                                Your learning journey starts here! Browse
                                courses to get started.
                            </p>
                            <Link
                                to="/courses"
                                onClick={onClose}
                                className="font-inter mt-6.25 inline-flex items-center justify-center rounded-lg bg-[#4F46E5] px-8 py-3 text-[16px] leading-6 font-medium text-white hover:bg-[#4338CA]"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-6">
                            {enrollments.map((e) => (
                                <li key={e.id} className="flex justify-start">
                                    <EnrolledCourseCard
                                        enrollment={e}
                                        onNavigate={onClose}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
        </div>
    )
}
