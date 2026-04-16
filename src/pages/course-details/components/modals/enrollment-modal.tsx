import enrollmentConfirmedIcon from '@/pages/course-details/components/assets/enrollment-confirmed.svg'

export type EnrollmentModalProps = {
    open: boolean
    onClose: () => void
    courseTitle: string
}

export default function EnrollmentModal({
    open,
    onClose,
    courseTitle,
}: EnrollmentModalProps) {
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
                className="relative flex h-117.75 max-h-[min(471px,calc(100vh-2rem))] w-119.25 max-w-full flex-col items-center justify-center rounded-2xl bg-white px-10 shadow-[0px_4px_24px_rgba(0,0,0,0.12)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="enrollment-modal-title"
            >
                <div className="flex w-full flex-col items-center">
                    <img
                        src={enrollmentConfirmedIcon}
                        alt=""
                        aria-hidden
                        className="h-23.5 w-23.5 shrink-0"
                    />

                    <h2
                        id="enrollment-modal-title"
                        className="font-inter mt-3.75 text-center text-[32px] leading-[100%] font-semibold text-[#3D3D3D]"
                    >
                        Enrollment Confirmed!
                    </h2>

                    <p className="font-inter mt-6.25 text-center text-[16px] leading-6 font-medium text-[#3D3D3D]">
                        You&apos;ve successfully enrolled to the{' '}
                        <span className="font-bold text-[#3D3D3D]">
                            {' '}
                            &ldquo;
                            {courseTitle}&rdquo;
                        </span>{' '}
                        Course!
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="font-inter mt-10 w-full max-w-full rounded-lg bg-[#4F46E5] py-3 text-center text-[16px] leading-6 font-medium text-[#F5F5F5] transition-colors hover:bg-[#4338CA]"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
