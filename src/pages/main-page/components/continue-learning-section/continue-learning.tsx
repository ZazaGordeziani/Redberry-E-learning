import lockIcon from '@/assets/lock.svg'

import previewImage from '@/pages/main-page/components/continue-learning-section/assets/continue-learning.png'

type ContinueLearningSectionProps = {
    onLoginClick: () => void
}

export const ContinueLearningSection = ({
    onLoginClick,
}: ContinueLearningSectionProps) => {
    return (
        <section className="pt-2 pb-43">
            <div className="mx-auto w-full max-w-391.5">
                <div className="flex flex-col gap-1.5">
                    <h2 className="font-inter text-[40px] leading-10 font-semibold text-black">
                        Continue Learning
                    </h2>
                    <p className="font-inter pt-2 text-[18px] leading-4.5 font-medium text-[#3D3D3D]">
                        Pick up where you left
                    </p>
                </div>

                <div className="relative mt-7">
                    <div className="flex gap-6">
                        {[0, 1, 2].map((i) => (
                            <img
                                key={i}
                                src={previewImage}
                                alt=""
                                aria-hidden="true"
                                className="h-54.75 w-126.5 flex-1 rounded-xl object-cover"
                            />
                        ))}
                    </div>

                    <div className="absolute top-1/2 left-1/2 h-58.25 w-104.5 -translate-x-58 -translate-y-1/2 rounded-xl border border-[#ADADAD] bg-white">
                        <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
                            <img
                                src={lockIcon}
                                alt=""
                                aria-hidden="true"
                                className="h-17 w-17"
                            />
                            <h3 className="font-inter mt-3 text-[16px] leading-6 font-medium text-[#0A0836]">
                                Sign in to track your learning progress
                            </h3>

                            <button
                                type="button"
                                onClick={onLoginClick}
                                className="font-inter mt-6 rounded-lg bg-[#4F46E5] px-6 py-3 text-[16px] leading-6 font-normal text-[#F5F5F5]"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContinueLearningSection
