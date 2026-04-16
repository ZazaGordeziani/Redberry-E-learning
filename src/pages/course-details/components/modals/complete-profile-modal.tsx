import profileIcon from '@/pages/course-details/components/assets/profile2.svg'

export type CompleteProfileModalProps = {
    open: boolean
    onClose: () => void
    onCompleteProfile: () => void
}

export default function CompleteProfileModal({
    open,
    onClose,
    onCompleteProfile,
}: CompleteProfileModalProps) {
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
                className="relative w-full max-w-120 rounded-2xl bg-white px-8 py-10"
                role="dialog"
                aria-modal="true"
                aria-labelledby="complete-profile-modal-title"
            >
                <div className="flex w-full flex-col items-center">
                    <img
                        src={profileIcon}
                        alt=""
                        aria-hidden
                        className="mt-10 h-23.5 w-23.5 shrink-0 object-contain"
                    />

                    <h2
                        id="complete-profile-modal-title"
                        className="font-inter mt-6.25 mb-3 text-center text-[32px] leading-[100%] font-semibold text-[#3D3D3D]"
                    >
                        Complete your profile to continue
                    </h2>

                    <p className="font-inter mt-6.25 max-w-full text-center text-[20px] leading-[100%] font-medium text-[#3D3D3D]">
                        You need to complete your profile before enrolling in
                        this course.
                    </p>

                    <div className="mt-11 mb-5 flex w-full max-w-full gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onCompleteProfile()
                            }}
                            className="font-inter flex min-h-12 flex-1 items-center justify-center rounded-lg border-2 border-[#958FEF] bg-white px-4 text-center text-[16px] leading-6 font-medium text-[#4F46E5] transition-colors hover:bg-[#FAFAFF]"
                        >
                            Complete Profile
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="font-inter flex min-h-12 flex-1 items-center justify-center rounded-lg bg-[#4F46E5] px-4 text-center text-[16px] leading-6 font-medium text-white transition-colors hover:bg-[#4338CA]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
