import { sessionSurchargeUsd } from '@/pages/course-details/components/session-type'

function parsePrice(value: string): number {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
}

function formatMoneyAmount(n: number): string {
    const rounded = Math.round(n * 100) / 100
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
}

function formatUsd(n: number): string {
    return `$${formatMoneyAmount(n)}`
}

function formatSignedSurcharge(n: number): string {
    if (n === 0) return '+ $0'
    return `+ $${formatMoneyAmount(n)}`
}

export type TotalPriceProps = {
    basePrice: string

    selectionComplete: boolean
    sessionKind: 'online' | 'in_person' | 'hybrid' | null
    isLoggedIn: boolean
    profileComplete: boolean
    onNeedCompleteProfile?: () => void
    onEnroll?: () => void
    enrollPending?: boolean
}

export function TotalPrice({
    basePrice,
    selectionComplete,
    sessionKind,
    isLoggedIn,
    profileComplete,
    onNeedCompleteProfile,
    onEnroll,
    enrollPending = false,
}: TotalPriceProps) {
    const baseNum = selectionComplete ? parsePrice(basePrice) : 0
    const sessionAddon =
        selectionComplete && sessionKind != null
            ? sessionSurchargeUsd(sessionKind)
            : 0
    const total = baseNum + sessionAddon

    const canUseEnrollButton = selectionComplete && isLoggedIn && !enrollPending
    const enrollDisabled = !selectionComplete || !isLoggedIn || enrollPending
    const needsProfileOnly = canUseEnrollButton && !profileComplete

    return (
        <div className="w-full rounded-xl border border-[#F5F5F5] bg-white p-6">
            <div className="mt-6 flex items-start justify-between gap-4">
                <span className="font-inter text-[20px] leading-6 font-semibold text-[#8A8A8A]">
                    Total Price
                </span>
                <span className="font-inter shrink-0 text-right text-[32px] leading-none font-semibold text-[#333333]">
                    {formatUsd(total)}
                </span>
            </div>

            <div className="mt-7 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-inter text-[16px] leading-6 font-medium text-[#8A8A8A]">
                        Base Price
                    </span>
                    <span className="font-inter text-right text-[16px] leading-6 font-medium text-[#292929]">
                        {formatSignedSurcharge(baseNum)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-inter text-[16px] leading-6 font-medium text-[#8A8A8A]">
                        Session Type
                    </span>
                    <span className="font-inter text-right text-[16px] leading-6 font-medium text-[#292929]">
                        {formatSignedSurcharge(sessionAddon)}
                    </span>
                </div>
            </div>

            <button
                type="button"
                disabled={enrollDisabled}
                onClick={() => {
                    if (!canUseEnrollButton) return
                    if (!profileComplete) {
                        onNeedCompleteProfile?.()
                        return
                    }
                    onEnroll?.()
                }}
                className={`font-inter mt-8 mb-3 w-full rounded-xl py-4 text-center text-[20px] leading-6 font-semibold transition-colors ${
                    enrollDisabled
                        ? 'cursor-not-allowed bg-[#EEEDFC] text-[#B7B3F4]'
                        : needsProfileOnly
                          ? 'cursor-pointer bg-[#EEEDFC] text-[#B7B3F4]'
                          : 'cursor-pointer bg-[#281ED2] text-white hover:bg-[#4F46E5]'
                }`}
            >
                {enrollPending ? 'Enrolling…' : 'Enroll Now'}
            </button>
        </div>
    )
}

export default TotalPrice
