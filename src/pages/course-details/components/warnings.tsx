import warningIcon from '@/pages/course-details/components/assets/warning.svg'
import rightArrowIcon from '@/pages/course-details/components/assets/right-arrow.svg'

const headingClass =
    'font-inter text-[16px] leading-6 font-medium tracking-normal text-[#292929]'
const bodyClass =
    'font-inter  mt-2 -ml-7 max-w-[283px] text-[12px] leading-tight font-normal tracking-normal text-[#8A8A8A]'
const buttonClass =
    'font-inter inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-[#B7B3F4] bg-[#EEEDFC] px-3 py-2 text-center text-[14px] leading-[26px] font-normal tracking-normal text-[#281ED2] transition-colors hover:bg-[#E4E0FA]'

export type EnrollmentWarningProps = {
    variant: 'auth' | 'profile'
    onAction: () => void
}

const copy: Record<
    EnrollmentWarningProps['variant'],
    { title: string; body: string; action: string }
> = {
    auth: {
        title: 'Authentication Required',
        body: 'You need sign in to your profile before enrolling in this course.',
        action: 'Sign In',
    },
    profile: {
        title: 'Complete Your Profile',
        body: 'You need to fill in your profile details before enrolling in this course.',
        action: 'Complete',
    },
}

export function EnrollmentWarning({
    variant,
    onAction,
}: EnrollmentWarningProps) {
    const c = copy[variant]

    return (
        <div className="-mt-4 flex w-full items-center justify-between gap-4 rounded-xl border border-[#E5E5E5] bg-[#F8FAFC] px-4 py-4">
            <div className="flex min-w-0 flex-1 items-start gap-3">
                <img
                    src={warningIcon}
                    alt=""
                    aria-hidden
                    width={16}
                    height={16}
                    className="mt-1.5 ml-1.5 shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1">
                    <h3 className={headingClass}>{c.title}</h3>
                    <p className={bodyClass}>{c.body}</p>
                </div>
            </div>
            <button type="button" onClick={onAction} className={buttonClass}>
                <span>{c.action}</span>
                <img
                    src={rightArrowIcon}
                    alt=""
                    aria-hidden
                    width={12}
                    height={10}
                    className="shrink-0 object-contain"
                />
            </button>
        </div>
    )
}

export default EnrollmentWarning
