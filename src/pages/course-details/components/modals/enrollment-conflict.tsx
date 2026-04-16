import warningIcon from '@/pages/course-details/components/assets/warning.svg'

export type EnrollmentConflictModalProps = {
    open: boolean
    onClose: () => void
    onContinue: () => void

    conflictingCourseName: string
    scheduleSummary: string
    continuePending?: boolean
}

export default function EnrollmentConflictModal({
    open,
    onClose,
    onContinue,
    conflictingCourseName,
    scheduleSummary,
    continuePending = false,
}: EnrollmentConflictModalProps) {
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
                className="relative flex h-114 w-119.25 max-w-full flex-col items-center justify-center rounded-2xl bg-white px-10 py-10 shadow-[0px_4px_24px_rgba(0,0,0,0.12)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="enrollment-conflict-title"
            >
                <div className="flex w-full max-w-full flex-col items-center">
                    <img
                        src={warningIcon}
                        alt=""
                        aria-hidden
                        className="h-22 w-22 shrink-0 object-contain"
                    />

                    <h2
                        id="enrollment-conflict-title"
                        className="font-inter mt-6.25 text-center text-[32px] leading-[100%] font-semibold text-[#3D3D3D]"
                    >
                        Enrollment Conflict
                    </h2>

                    <p className="font-inter mt-7 mb-7 max-w-full text-center text-[20px] leading-[100%] font-medium text-[#3D3D3D]">
                        You are already enrolled in{' '}
                        <span className="font-inter text-[20px] leading-6 font-bold">
                            &ldquo;{conflictingCourseName.trim()}&rdquo;
                        </span>{' '}
                        with the same schedule: <br />{' '}
                        <span className="font-inter text-[20px] leading-6 font-semibold">
                            {scheduleSummary}
                        </span>
                    </p>

                    <div className="mt-5 flex w-full flex-row gap-3">
                        <button
                            type="button"
                            disabled={continuePending}
                            onClick={onContinue}
                            className="font-inter min-h-12 flex-1 rounded-lg border-2 border-[#958FEF] bg-transparent py-3 text-center text-[16px] leading-6 font-medium text-[#4F46E5] transition-colors hover:bg-[#F5F3FF] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {continuePending
                                ? 'Continuing…'
                                : 'Continue Anyway'}
                        </button>
                        <button
                            type="button"
                            disabled={continuePending}
                            onClick={onClose}
                            className="font-inter min-h-12 flex-1 rounded-lg bg-[#4F46E5] py-3 text-center text-[16px] leading-6 font-medium text-white transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
