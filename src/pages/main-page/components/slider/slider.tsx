import { useMemo, useState } from 'react'

import leftArrow from '@/pages/main-page/components/slider/assets/left-arrow.svg'
import rightArrow from '@/pages/main-page/components/slider/assets/right-arrow.svg'
import slider1 from '@/pages/main-page/components/slider/assets/slider-1.svg'
import slider2 from '@/pages/main-page/components/slider/assets/slider-2.svg'
import slider3 from '@/pages/main-page/components/slider/assets/slider-3.svg'

export const MainPageSlider = () => {
    const slides = useMemo(
        () => [
            {
                id: 0,
                src: slider1,
                heading: 'Start learning something new today',
                paragraph:
                    'Explore a wide range of expert-led courses in design, development, business, and more. Find the skills you need to grow your career and learn at your own pace.',
                buttonText: 'Browse Courses',
            },
            {
                id: 1,
                src: slider2,
                heading: 'Pick up where you left off',
                paragraph:
                    'Your learning journey is already in progress. Continue your enrolled courses, track your progress, and stay on track toward completing your goals.',
                buttonText: 'Start Learning',
            },
            {
                id: 2,
                src: slider3,
                heading: 'Learn together, grow faster',
                paragraph: null,
                buttonText: 'Learn More',
            },
        ],
        [],
    )

    const [activeIndex, setActiveIndex] = useState(0)

    const isFirst = activeIndex === 0
    const isLast = activeIndex === slides.length - 1

    const goPrev = () => {
        if (!isFirst) setActiveIndex((i) => i - 1)
    }

    const goNext = () => {
        if (!isLast) setActiveIndex((i) => i + 1)
    }

    const activeSlide = slides[activeIndex]

    return (
        <section className="pt-14 pb-12">
            <div className="mx-auto w-full max-w-391.5">
                <div className="relative h-105 w-full overflow-hidden rounded-[30px]">
                    <img
                        src={activeSlide.src}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute top-12 left-12 max-w-225 text-white">
                        <div className="flex flex-col gap-6">
                            <h2 className="font-inter text-5xl leading-12 font-bold">
                                {activeSlide.heading}
                            </h2>

                            {activeSlide.paragraph ? (
                                <p className="font-inter w-275 pb-6 text-2xl leading-6 font-light">
                                    {activeSlide.paragraph}
                                </p>
                            ) : null}

                            {activeSlide.id === 2 ? (
                                <div className="h-12.5" />
                            ) : null}

                            <button
                                type="button"
                                className="font-inter h-16 w-51.5 rounded-lg bg-[#4F46E5] text-center text-[20px] leading-5 font-medium"
                            >
                                {activeSlide.buttonText}
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-17 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-3">
                            {slides.map((s, idx) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setActiveIndex(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className="h-2 w-14.25 rounded-[999px]"
                                    style={{
                                        backgroundColor:
                                            idx === activeIndex
                                                ? '#F5F5F5'
                                                : '#C1BCBC80',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="absolute right-12 bottom-12.5 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={isFirst}
                            className="disabled:pointer-events-none"
                            aria-label="Previous slide"
                        >
                            <img
                                src={leftArrow}
                                alt=""
                                aria-hidden="true"
                                className={
                                    isFirst ? 'opacity-50' : 'opacity-100'
                                }
                            />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={isLast}
                            className="disabled:pointer-events-none"
                            aria-label="Next slide"
                        >
                            <img
                                src={rightArrow}
                                alt=""
                                aria-hidden="true"
                                className={
                                    isLast ? 'opacity-50' : 'opacity-100'
                                }
                            />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MainPageSlider
