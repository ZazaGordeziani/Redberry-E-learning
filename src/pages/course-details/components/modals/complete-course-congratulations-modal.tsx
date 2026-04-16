import congratulationsIllustration from '@/pages/course-details/components/assets/congretulation.svg'
import RateYourExperience from '@/pages/course-details/components/rate-your-experience'

export type CompleteCourseCongratulationsModalProps = {
    open: boolean
    onClose: () => void
    courseTitle: string
    courseId: number
    averageRating: number
}

export default function CompleteCourseCongratulationsModal({
    open,
    onClose,
    courseTitle,
    courseId,
    averageRating,
}: CompleteCourseCongratulationsModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
                aria-label="Close modal backdrop"
            />

            <div
                className="relative flex max-h-[min(90vh,calc(100vh-2rem))] w-full max-w-135 flex-col overflow-y-auto rounded-2xl bg-white px-8 py-10 shadow-[0px_4px_24px_rgba(0,0,0,0.12)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="complete-course-congrats-title"
            >
                <div className="flex w-full flex-col items-center">
                    <img
                        src={congratulationsIllustration}
                        alt=""
                        aria-hidden
                        className="h-auto w-full max-w-50 shrink-0 object-contain"
                    />

                    <h2
                        id="complete-course-congrats-title"
                        className="font-inter mt-5 text-center text-[32px] leading-[100%] font-semibold text-[#3D3D3D]"
                    >
                        Congratulations!
                    </h2>

                    <p className="font-inter mt-5 max-w-full text-center text-[16px] leading-6 font-medium text-[#3D3D3D]">
                        You&apos;ve completed &ldquo;{courseTitle}&rdquo;
                        Course!
                    </p>

                    <div className="mt-5 w-full max-w-118.25">
                        <RateYourExperience
                            averageRating={averageRating}
                            courseId={courseId}
                            instanceId="complete-modal"
                            showCloseButton={false}
                            variant="embedded"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="font-inter mt-5 w-full max-w-full rounded-lg bg-[#4F46E5] py-3 text-center text-[16px] leading-6 font-medium text-[#F5F5F5] transition-colors hover:bg-[#4338CA]"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
