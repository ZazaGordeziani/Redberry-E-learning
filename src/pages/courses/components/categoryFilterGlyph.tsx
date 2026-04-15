import developmentSvg from '@/pages/courses/components/assets/development.svg?raw'
import designSvg from '@/pages/courses/components/assets/design.svg?raw'
import businessSvg from '@/pages/courses/components/assets/business.svg?raw'
import marketingSvg from '@/pages/courses/components/assets/marketing.svg?raw'
import dataScienceSvg from '@/pages/courses/components/assets/data-science.svg?raw'

const CATEGORY_SVG_BY_ICON: Record<string, string> = {
    development: developmentSvg,
    design: designSvg,
    business: businessSvg,
    marketing: marketingSvg,
    'data-science': dataScienceSvg,
}

type CategoryFilterGlyphProps = {
    iconKey: string
    className?: string
}

/** Renders category SVGs from `assets/` with `fill="currentColor"` so parent `color` controls tint. */
export function CategoryFilterGlyph({
    iconKey,
    className,
}: CategoryFilterGlyphProps) {
    const svg = CATEGORY_SVG_BY_ICON[iconKey]
    if (!svg) return null

    return (
        <span
            aria-hidden
            className={`inline-flex h-4 w-4 shrink-0 items-center justify-center text-inherit [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:shrink-0 ${className ?? ''}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    )
}
