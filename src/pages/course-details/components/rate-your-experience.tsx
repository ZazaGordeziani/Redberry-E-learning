import { useState } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { submitCourseReview } from '@/api/courses'

function messageFromReviewError(error: unknown): string | null {
    if (!axios.isAxiosError(error)) return null
    const data = error.response?.data as { message?: unknown } | undefined
    const msg = data?.message
    return typeof msg === 'string' && msg.trim().length > 0 ? msg.trim() : null
}

const STAR_PATH =
    'M29.8807 14.6595C30.0224 14.9614 30.3053 15.1728 30.6349 15.2231L44.0762 17.2764C44.8808 17.3993 45.2093 18.3807 44.6409 18.9633L34.8524 28.9962C34.6308 29.2233 34.5302 29.5422 34.5813 29.8555L36.8833 43.9676C37.0177 44.7914 36.1431 45.4076 35.4126 45.0037L23.4838 38.41C23.1827 38.2436 22.8173 38.2436 22.5162 38.41L10.5874 45.0037C9.85685 45.4076 8.9823 44.7914 9.1167 43.9676L11.4187 29.8555C11.4698 29.5422 11.3692 29.2233 11.1476 28.9962L1.35906 18.9633C0.790657 18.3807 1.11922 17.3993 1.92382 17.2764L15.3651 15.2231C15.6947 15.1728 15.9776 14.9614 16.1193 14.6595L22.0948 1.92862C22.4547 1.16181 23.5453 1.16181 23.9052 1.92862L29.8807 14.6595Z'

const STAR_GRAY = '#D1D1D1'
const STAR_ORANGE = '#F4A316'

function clamp01(n: number): number {
    if (!Number.isFinite(n)) return 0
    return Math.min(1, Math.max(0, n))
}

function fillForStar(average01to5: number, starIndex: number): number {
    return clamp01(average01to5 - starIndex)
}

/** Integer 1–5: stars 1…N fully orange, rest gray. */
function fillForDiscretePick(rating: number, starIndex: number): number {
    return rating > starIndex ? 1 : 0
}

type StarButtonProps = {
    clipId: string
    fillFraction: number
    value: number
    disabled: boolean
    onPick: (rating: number) => void
}

function StarButton({
    clipId,
    fillFraction,
    value,
    disabled,
    onPick,
}: StarButtonProps) {
    const w = 46 * clamp01(fillFraction)

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onPick(value)}
            aria-label={`Rate ${value} out of 5`}
            className="relative h-10 w-10 shrink-0 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-wait disabled:opacity-60"
        >
            <svg
                viewBox="0 0 46 46"
                className="block h-full w-full"
                aria-hidden
            >
                <defs>
                    <clipPath id={clipId}>
                        <rect x="0" y="0" width={w} height="46" />
                    </clipPath>
                </defs>
                <path d={STAR_PATH} fill={STAR_GRAY} />
                <g clipPath={`url(#${clipId})`}>
                    <path d={STAR_PATH} fill={STAR_ORANGE} />
                </g>
            </svg>
        </button>
    )
}

export type RateYourExperienceProps = {
    courseId: number
    averageRating: number
    /** Panel close (X). Unused when `showCloseButton` is false. */
    onDismiss?: () => void
    /** Default true. Set false when embedded (e.g. congratulations modal). */
    showCloseButton?: boolean
    /** Default card under the sidebar; `embedded` drops outer spacing and close control. */
    variant?: 'default' | 'embedded'
    /** Suffix for star clip-path ids when multiple instances exist. */
    instanceId?: string
}

export default function RateYourExperience({
    courseId,
    averageRating,
    onDismiss,
    showCloseButton = true,
    variant = 'default',
    instanceId = 'default',
}: RateYourExperienceProps) {
    const queryClient = useQueryClient()
    /**
     * `null` → show stars from course average (fractional).
     * 1–5 → show your rating (full orange stars); kept after a successful submit.
     */
    const [pickedRating, setPickedRating] = useState<number | null>(null)

    const avg = Number.isFinite(averageRating)
        ? Math.min(5, Math.max(0, averageRating))
        : 0

    const reviewMutation = useMutation({
        mutationFn: (rating: number) => submitCourseReview(courseId, rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', courseId] })
        },
        onError: () => {
            setPickedRating(null)
        },
    })

    const fillForStarDisplay = (starIndex: number): number => {
        if (pickedRating !== null) {
            return fillForDiscretePick(pickedRating, starIndex)
        }
        return fillForStar(avg, starIndex)
    }

    const handlePick = (rating: number) => {
        setPickedRating(rating)
        reviewMutation.mutate(rating)
    }

    const errorMessage =
        reviewMutation.isError ?
            messageFromReviewError(reviewMutation.error)
        :   null

    const clipKey = `${instanceId}`
    const isEmbedded = variant === 'embedded'

    return (
        <div
            className={`relative box-border rounded-lg bg-white ${
                isEmbedded ?
                    'w-full max-w-full px-6 py-4'
                :   'mt-6.25 min-h-43 w-132.5 max-w-full px-6 pb-6'
            }`}
        >
            {showCloseButton ?
                <button
                    type="button"
                    onClick={onDismiss}
                    aria-label="Close"
                    className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-[#F8FAFC] p-0 transition-opacity hover:opacity-90"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                    >
                        <path
                            d="M1 1L13 13M13 1L1 13"
                            stroke="#64748B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            :   null}

            <div
                className={`flex flex-col items-center ${isEmbedded ? 'pt-0' : 'pt-10'}`}
            >
                <h3 className="font-inter text-center text-[16px] leading-6 font-medium text-[#525252]">
                    Rate your experience
                </h3>

                <div
                    className="mt-5 flex items-center justify-center gap-2"
                    role="group"
                    aria-label="Course rating"
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <StarButton
                            key={n}
                            clipId={`rate-star-${courseId}-${n}-${clipKey}`}
                            fillFraction={fillForStarDisplay(n - 1)}
                            value={n}
                            disabled={reviewMutation.isPending}
                            onPick={handlePick}
                        />
                    ))}
                </div>

                {errorMessage ?
                    <p
                        role="alert"
                        className="font-inter mt-5 max-w-full text-center text-[16px] leading-6 font-medium text-[#DC2626]"
                    >
                        {errorMessage}
                    </p>
                :   null}
            </div>
        </div>
    )
}
