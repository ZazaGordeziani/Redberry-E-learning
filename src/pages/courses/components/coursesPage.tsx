import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import ratingFullStar from '@/assets/rating-full-star.svg'
import dropdownArrowIcon from '@/pages/courses/components/assets/dropdow-arrow-sorting.svg'

import { CategoryFilterGlyph } from '@/pages/courses/components/categoryFilterGlyph'

import paginationLeftSvg from '@/pages/courses/components/assets/pagination-left-arrow.svg?raw'
import paginationRightSvg from '@/pages/courses/components/assets/pagination-right-arrow.svg?raw'

import {
    getCategories,
    getCourses,
    getInstructors,
    getTopics,
} from '@/api/courses'
import type {
    Category,
    Course,
    Instructor,
    Topic,
} from '@/api/courses/index.types'
import {
    mergeCoursesFiltersIntoSearchString,
    parseCoursesFilterSearch,
    type CoursesFilterUrlState,
} from '@/utils/coursesFilterSearchParams'

const formatPrice = (value: string) => {
    const num = Number(value)
    if (!Number.isFinite(num)) return value
    return num.toFixed(2).replace(/\.?0+$/, '')
}

type SortKey = 'newest' | 'rating' | 'price_asc' | 'price_desc' | 'title_asc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Most Popular' },
    { value: 'title_asc', label: 'Title: A-Z' },
]

const paginationBtnInactive =
    'font-inter flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#D1D1D1] bg-white text-[16px] leading-6 font-medium tracking-normal text-[#4F46E5] transition-colors hover:border-[#B7B3F4] hover:bg-[#DDDBFA] hover:text-[#281ED2]'

const paginationBtnActive =
    'border-[#4F46E5] bg-[#281ED2] text-white hover:border-[#4F46E5] hover:bg-[#281ED2] hover:text-white'

const paginationArrow = `group ${paginationBtnInactive} outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#D1D1D1] disabled:bg-white disabled:text-[#D1D1D1] disabled:hover:border-[#D1D1D1] disabled:hover:bg-white disabled:hover:text-[#D1D1D1]`

const paginationArrowIconClass =
    'inline-flex items-center justify-center text-[#4F46E5] group-hover:text-[#281ED2] group-disabled:text-[#D1D1D1] group-disabled:group-hover:text-[#D1D1D1] [&>svg]:block [&>svg]:h-[14px] [&>svg]:w-auto [&>svg]:outline-none'

function getVisiblePages(
    currentPage: number,
    totalPages: number,
): (number | 'ellipsis')[] {
    if (totalPages <= 0) return []
    if (totalPages <= 9) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const candidateSet = new Set<number>()
    candidateSet.add(1)
    candidateSet.add(totalPages)

    if (currentPage === 1) {
        if (totalPages >= 2) candidateSet.add(2)
        if (totalPages >= 3) candidateSet.add(3)
    } else if (currentPage === 2) {
        if (totalPages >= 2) candidateSet.add(2)
        if (totalPages >= 3) candidateSet.add(3)
        if (totalPages >= 4) candidateSet.add(4)
    } else if (currentPage === 3) {
        if (totalPages >= 2) candidateSet.add(2)
        if (totalPages >= 3) candidateSet.add(3)
        if (totalPages >= 4) candidateSet.add(4)
        if (totalPages >= 5) candidateSet.add(5)
    } else if (currentPage >= totalPages - 2) {
        if (totalPages - 2 >= 1) candidateSet.add(totalPages - 2)
        if (totalPages - 1 >= 1) candidateSet.add(totalPages - 1)
    } else {
        for (let p = currentPage - 2; p <= currentPage + 2; p++) {
            if (p >= 1 && p <= totalPages) candidateSet.add(p)
        }
    }

    const sortedPages = Array.from(candidateSet).sort((a, b) => a - b)
    const pages: (number | 'ellipsis')[] = []
    for (let i = 0; i < sortedPages.length; i++) {
        pages.push(sortedPages[i])
        if (
            i < sortedPages.length - 1 &&
            sortedPages[i + 1] - sortedPages[i] > 1
        ) {
            pages.push('ellipsis')
        }
    }
    return pages
}

const CoursesPagination = ({
    page,
    totalPages,
    onPageChange,
}: {
    page: number
    totalPages: number
    onPageChange: (p: number) => void
}) => {
    const items = useMemo(
        () => getVisiblePages(page, totalPages),
        [page, totalPages],
    )
    const canPrev = page > 1
    const canNext = page < totalPages

    return (
        <nav
            className="flex flex-wrap items-center justify-center gap-2"
            aria-label="Pagination"
        >
            <button
                type="button"
                disabled={!canPrev}
                aria-label="Previous page"
                onClick={() => canPrev && onPageChange(page - 1)}
                className={paginationArrow}
            >
                <span
                    aria-hidden
                    className={paginationArrowIconClass}
                    dangerouslySetInnerHTML={{ __html: paginationLeftSvg }}
                />
            </button>

            {items.map((item, idx) =>
                item === 'ellipsis' ? (
                    <span
                        key={`e-${idx}`}
                        className="font-inter flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#D1D1D1] bg-white text-[16px] leading-6 font-medium tracking-normal text-[#4F46E5]"
                        aria-hidden
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        aria-label={`Page ${item}`}
                        aria-current={item === page ? 'page' : undefined}
                        onClick={() => onPageChange(item)}
                        className={
                            item === page
                                ? `font-inter flex h-10 w-10 shrink-0 items-center justify-center rounded border text-[16px] leading-6 font-medium tracking-normal transition-colors ${paginationBtnActive}`
                                : paginationBtnInactive
                        }
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                type="button"
                disabled={!canNext}
                aria-label="Next page"
                onClick={() => canNext && onPageChange(page + 1)}
                className={paginationArrow}
            >
                <span
                    aria-hidden
                    className={paginationArrowIconClass}
                    dangerouslySetInnerHTML={{ __html: paginationRightSvg }}
                />
            </button>
        </nav>
    )
}

const FilterChip = ({
    label,
    categoryIconKey,
    selected,
    onClick,
}: {
    label: string
    categoryIconKey?: string
    selected: boolean
    onClick: () => void
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={
                selected
                    ? 'font-inter group inline-flex items-center justify-center gap-1.5 rounded-[999px] border border-[#281ED2] bg-[#EEEDFC] px-3 py-1 text-center text-[16px] leading-6 font-medium text-[#281ED2] transition-colors hover:border-transparent hover:bg-[#DDDBFA] hover:text-[#281ED2]'
                    : 'font-inter group inline-flex items-center justify-center gap-1.5 rounded-[999px] border border-[#D1D1D1] bg-white px-3 py-1 text-center text-[16px] leading-6 font-medium text-[#666666] transition-colors hover:border-transparent hover:bg-[#DDDBFA] hover:text-[#281ED2]'
            }
        >
            {categoryIconKey ? (
                <CategoryFilterGlyph iconKey={categoryIconKey} />
            ) : null}
            <span>{label}</span>
        </button>
    )
}

const InstructorItem = ({
    instructor,
    selected,
    onClick,
}: {
    instructor: Instructor
    selected: boolean
    onClick: () => void
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`font-inter flex h-11.5 w-fit items-center gap-2 rounded-xl border p-3 text-left text-[16px] leading-6 font-medium transition-colors ${
                selected
                    ? 'border-[#281ED2] bg-[#EEEDFC] text-[#281ED2] hover:border-transparent hover:bg-[#DDDBFA] hover:text-[#281ED2]'
                    : 'border-transparent bg-white text-[#666666] hover:border-transparent hover:bg-[#DDDBFA] hover:text-[#281ED2]'
            }`}
        >
            <img
                src={instructor.avatar}
                alt=""
                aria-hidden="true"
                className="h-7.5 w-7.5 object-cover"
            />
            <span>{instructor.name}</span>
        </button>
    )
}

const CourseCard = ({ course }: { course: Course }) => {
    return (
        <Link
            to={`/courses/${course.id}`}
            className="flex h-107 w-93.25 flex-col overflow-hidden rounded-xl border border-[#F5F5F5] bg-white p-5 text-left shadow-[0px_4px_20px_0px_#00000014] transition-shadow hover:shadow-[0px_8px_28px_0px_#0000001f]"
        >
            <div className="overflow-hidden">
                <img
                    src={course.image}
                    alt=""
                    aria-hidden="true"
                    className="h-45.25 w-83.25 rounded-[10px]"
                />
            </div>

            <div className="flex flex-1 flex-col pt-4">
                <div className="flex items-center justify-between">
                    <p className="font-inter text-[14px] leading-3.5 font-medium text-[#ADADAD]">
                        {course.instructor?.name} | {course.durationWeeks} Weeks
                    </p>
                    <div className="flex items-center gap-1">
                        <img
                            src={ratingFullStar}
                            alt=""
                            aria-hidden="true"
                            className="h-4 w-4"
                        />
                        <p className="font-inter text-[14px] leading-3.5 font-medium text-[#525252]">
                            {Number(course.avgRating).toFixed(1)}
                        </p>
                    </div>
                </div>

                <h3 className="font-inter mt-4 text-[24px] leading-6 font-semibold text-[#0A0A0A]">
                    {course.title}
                </h3>

                <div className="mt-5 mb-5">
                    <span className="font-inter inline-flex items-center gap-1.5 rounded-[999px] bg-[#F5F5F5] px-3 py-1 text-[16px] leading-6 font-medium text-[#525252]">
                        {course.category?.icon ? (
                            <CategoryFilterGlyph
                                iconKey={course.category.icon}
                                className="text-[#525252]"
                            />
                        ) : null}
                        {course.category?.name}
                    </span>
                </div>

                <div className="mt-auto flex justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="font-inter text-[12px] leading-3 font-medium text-[#ADADAD]">
                            Starting from
                        </p>
                        <p className="font-inter text-[24px] leading-6 font-semibold text-[#3D3D3D]">
                            ${formatPrice(course.basePrice)}
                        </p>
                    </div>

                    <span className="font-inter inline-flex shrink-0 items-center rounded-lg bg-[#4F46E5] px-4.25 py-2.5 text-center text-[16px] leading-6 font-medium text-white">
                        Details
                    </span>
                </div>
            </div>
        </Link>
    )
}

const CoursesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [sortOpen, setSortOpen] = useState(false)
    const sortDropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sortOpen) return
        const onDoc = (e: MouseEvent) => {
            if (!sortDropdownRef.current?.contains(e.target as Node)) {
                setSortOpen(false)
            }
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [sortOpen])

    const perPage = 10

    const parsedFilters = useMemo(
        () => parseCoursesFilterSearch(`?${searchParams.toString()}`),
        [searchParams],
    )

    const pushFilters = useCallback(
        (patch: Partial<CoursesFilterUrlState>) => {
            setSearchParams(
                (prev) =>
                    new URLSearchParams(
                        mergeCoursesFiltersIntoSearchString(
                            `?${prev.toString()}`,
                            patch,
                        ),
                    ),
                { replace: true },
            )
        },
        [setSearchParams],
    )

    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })
    const topicsQuery = useQuery({
        queryKey: ['topics'],
        queryFn: getTopics,
    })
    const instructorsQuery = useQuery({
        queryKey: ['instructors'],
        queryFn: getInstructors,
    })
    const coursesQuery = useQuery({
        queryKey: ['courses', 'all'],
        queryFn: async () => {
            const fetchPerPage = 10
            let currentPage = 1
            let lastPage = 1
            let total: number | undefined
            const all: Course[] = []

            while (currentPage <= lastPage) {
                const res = await getCourses({
                    page: currentPage,
                    perPage: fetchPerPage,
                })
                all.push(...(res.data ?? []))
                total = res.meta?.total ?? total
                lastPage = res.meta?.last_page ?? res.meta?.lastPage ?? lastPage
                currentPage += 1
            }

            return { data: all, meta: { total, last_page: lastPage } }
        },
    })

    const categories = useMemo(
        () => categoriesQuery.data?.data ?? [],
        [categoriesQuery.data?.data],
    )
    const topics = useMemo(
        () => topicsQuery.data?.data ?? [],
        [topicsQuery.data?.data],
    )
    const instructors = useMemo(
        () => instructorsQuery.data?.data ?? [],
        [instructorsQuery.data?.data],
    )
    const allCourses = useMemo(
        () => coursesQuery.data?.data ?? [],
        [coursesQuery.data?.data],
    )

    const meta = coursesQuery.data?.meta
    const totalCount = meta?.total ?? allCourses.length

    const categoryIdSet = useMemo(
        () => new Set(categories.map((c) => c.id)),
        [categories],
    )
    const topicIdSet = useMemo(() => new Set(topics.map((t) => t.id)), [topics])
    const instructorIdSet = useMemo(
        () => new Set(instructors.map((i) => i.id)),
        [instructors],
    )

    const selectedCategoryIds = useMemo(
        () => parsedFilters.categoryIds.filter((id) => categoryIdSet.has(id)),
        [parsedFilters.categoryIds, categoryIdSet],
    )

    const selectedTopicIds = useMemo(
        () => parsedFilters.topicIds.filter((id) => topicIdSet.has(id)),
        [parsedFilters.topicIds, topicIdSet],
    )

    const selectedInstructorIds = useMemo(
        () =>
            parsedFilters.instructorIds.filter((id) => instructorIdSet.has(id)),
        [parsedFilters.instructorIds, instructorIdSet],
    )

    const sort: SortKey = useMemo(() => {
        const s = parsedFilters.sort
        if (s && SORT_OPTIONS.some((o) => o.value === s)) {
            return s as SortKey
        }
        return 'newest'
    }, [parsedFilters.sort])

    const pageFromUrl = parsedFilters.page

    const appliedFiltersCount =
        selectedCategoryIds.length +
        selectedTopicIds.length +
        selectedInstructorIds.length

    const filteredCourses = useMemo(() => {
        let list = [...allCourses]

        if (selectedCategoryIds.length > 0) {
            list = list.filter((c) =>
                selectedCategoryIds.includes(c.category?.id),
            )
        }
        if (selectedTopicIds.length > 0) {
            list = list.filter((c) => selectedTopicIds.includes(c.topic?.id))
        }
        if (selectedInstructorIds.length > 0) {
            list = list.filter((c) =>
                selectedInstructorIds.includes(c.instructor?.id),
            )
        }

        switch (sort) {
            case 'rating':
                list.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
                break
            case 'price_asc':
                list.sort(
                    (a, b) =>
                        Number(a.basePrice ?? 0) - Number(b.basePrice ?? 0),
                )
                break
            case 'price_desc':
                list.sort(
                    (a, b) =>
                        Number(b.basePrice ?? 0) - Number(a.basePrice ?? 0),
                )
                break
            case 'title_asc':
                list.sort((a, b) => a.title.localeCompare(b.title))
                break
            case 'newest':
            default:
                break
        }

        return list
    }, [
        allCourses,
        selectedCategoryIds,
        selectedTopicIds,
        selectedInstructorIds,
        sort,
    ])

    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / perPage))
    const safePage = Math.min(Math.max(1, pageFromUrl), totalPages)
    const startIdx = (safePage - 1) * perPage
    const pagedCourses = filteredCourses.slice(startIdx, startIdx + perPage)
    const showingCount = pagedCourses.length

    const toggleId = (ids: number[], id: number) =>
        ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]

    const clearAll = () => {
        pushFilters({
            categoryIds: [],
            topicIds: [],
            instructorIds: [],
            page: 1,
            sort: null,
        })
    }

    const isLoading =
        categoriesQuery.isLoading ||
        topicsQuery.isLoading ||
        instructorsQuery.isLoading ||
        coursesQuery.isLoading

    return (
        <section className="flex w-full flex-1 flex-col self-stretch">
            <div className="mx-auto flex w-full max-w-391.5 flex-1 flex-col pt-10 pb-5">
                <div className="font-inter text-[18px] leading-4.5 font-medium">
                    <span className="text-[#666666]">Home</span>
                    <span className="mx-2 text-[#666666]">{'>'}</span>
                    <span className="text-[#736BEA]">Browse</span>
                </div>

                <div className="mt-8 flex w-full items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h2 className="font-inter text-[40px] leading-10 font-semibold text-black">
                            Filters
                        </h2>
                        <button
                            type="button"
                            onClick={clearAll}
                            className="font-inter mt-1 ml-6 cursor-pointer text-[16px] leading-6 font-medium text-[#8A8A8A] transition-colors hover:text-[#4F46E5]"
                        >
                            Clear All Filters <span className="ml-1">X</span>
                        </button>
                    </div>

                    <div className="flex w-285.75 items-center justify-between">
                        <p className="font-inter text-[16px] leading-6 font-medium text-[#666666]">
                            Showing {showingCount} out of {totalCount}
                        </p>

                        <div
                            ref={sortDropdownRef}
                            className="relative shrink-0"
                        >
                            <button
                                type="button"
                                id="courses-sort-trigger"
                                aria-haspopup="listbox"
                                aria-expanded={sortOpen}
                                aria-controls="courses-sort-listbox"
                                onClick={() => setSortOpen((o) => !o)}
                                className="flex h-12.25 w-58.5 items-center rounded-xl border border-[#D1D1D1] bg-white px-3 text-left"
                            >
                                <span className="font-inter shrink-0 pl-2 text-[16px] leading-6 font-medium tracking-normal text-[#666666]">
                                    Sort By:
                                </span>
                                <span className="font-inter ml-2 min-w-0 flex-1 truncate text-[16px] leading-6 font-medium tracking-normal text-[#4F46E5]">
                                    {
                                        SORT_OPTIONS.find(
                                            (o) => o.value === sort,
                                        )?.label
                                    }
                                </span>
                                <img
                                    src={dropdownArrowIcon}
                                    alt=""
                                    aria-hidden="true"
                                    className={`mr-2 ml-1 shrink-0 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {sortOpen ? (
                                <ul
                                    id="courses-sort-listbox"
                                    role="listbox"
                                    aria-labelledby="courses-sort-trigger"
                                    className="absolute top-[calc(100%+4px)] left-0 z-30 w-58.5 overflow-hidden rounded-xl border border-[#D1D1D1] bg-white py-1 shadow-[0px_4px_20px_0px_#00000014]"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <li key={opt.value} role="presentation">
                                            <button
                                                type="button"
                                                role="option"
                                                aria-selected={
                                                    sort === opt.value
                                                }
                                                className="font-inter flex w-full items-center px-3 py-2.5 text-left text-[16px] leading-6 font-medium tracking-normal text-[#666666] transition-colors hover:bg-[#EEEDFC] hover:text-[#4F46E5]"
                                                onClick={() => {
                                                    pushFilters({
                                                        sort: opt.value,
                                                        page: 1,
                                                    })
                                                    setSortOpen(false)
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex min-h-0 flex-1 gap-10">
                    <aside className="w-[25%] min-w-52.5">
                        <h3 className="font-inter text-[18px] leading-4.5 font-medium text-[#666666]">
                            Categories
                        </h3>

                        <div className="mt-4 flex max-w-75 flex-wrap gap-2 pb-9">
                            {categories.map((c: Category) => (
                                <FilterChip
                                    key={c.id}
                                    label={c.name}
                                    categoryIconKey={c.icon}
                                    selected={selectedCategoryIds.includes(
                                        c.id,
                                    )}
                                    onClick={() => {
                                        pushFilters({
                                            categoryIds: toggleId(
                                                selectedCategoryIds,
                                                c.id,
                                            ),
                                            page: 1,
                                        })
                                    }}
                                />
                            ))}
                        </div>

                        <h3 className="font-inter mt-6 text-[18px] leading-4.5 font-medium text-[#666666]">
                            Topics
                        </h3>
                        <div className="mt-4 flex max-w-75 flex-wrap gap-2 pb-9">
                            {topics.map((t: Topic) => (
                                <FilterChip
                                    key={t.id}
                                    label={t.name}
                                    selected={selectedTopicIds.includes(t.id)}
                                    onClick={() => {
                                        pushFilters({
                                            topicIds: toggleId(
                                                selectedTopicIds,
                                                t.id,
                                            ),
                                            page: 1,
                                        })
                                    }}
                                />
                            ))}
                        </div>

                        <h3 className="font-inter mt-6 text-[18px] leading-4.5 font-medium text-[#666666]">
                            Instructor
                        </h3>
                        <div className="mt-4 flex flex-col gap-3">
                            {instructors.map((i: Instructor) => (
                                <InstructorItem
                                    key={i.id}
                                    instructor={i}
                                    selected={selectedInstructorIds.includes(
                                        i.id,
                                    )}
                                    onClick={() => {
                                        pushFilters({
                                            instructorIds: toggleId(
                                                selectedInstructorIds,
                                                i.id,
                                            ),
                                            page: 1,
                                        })
                                    }}
                                />
                            ))}
                        </div>

                        <div className="mt-6 h-px w-full bg-[#ADADAD]" />
                        <p className="font-inter mt-4 text-[14px] leading-3.5 font-medium text-[#8A8A8A]">
                            {appliedFiltersCount} Filters Applied
                        </p>
                    </aside>

                    <div className="grow">
                        {isLoading ? (
                            <div className="font-inter text-[16px] leading-6 font-medium text-[#666666]">
                                Loading...
                            </div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="flex min-h-[min(50vh,28rem)] w-full flex-col items-center justify-center px-4 py-16">
                                <h2 className="font-inter text-center text-[28px] leading-tight font-semibold tracking-normal text-[#141414]">
                                    No Course to Display
                                </h2>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 content-start gap-6">
                                {pagedCourses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                    />
                                ))}
                                {Array.from({
                                    length: Math.max(
                                        0,
                                        perPage - pagedCourses.length,
                                    ),
                                }).map((_, i) => (
                                    <div
                                        key={`courses-grid-pad-${i}`}
                                        className="pointer-events-none invisible h-107 w-full select-none"
                                        aria-hidden
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {!isLoading && filteredCourses.length > 0 ? (
                    <div className="mt-auto flex w-full justify-center pt-8">
                        <CoursesPagination
                            page={safePage}
                            totalPages={totalPages}
                            onPageChange={(p) => {
                                pushFilters({ page: p })
                                window.scrollTo({ top: 0, behavior: 'auto' })
                            }}
                        />
                    </div>
                ) : null}
            </div>
        </section>
    )
}

export default CoursesPage
