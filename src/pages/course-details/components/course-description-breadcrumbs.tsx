import { Link } from 'react-router-dom'

type CourseDescriptionProps = {
    categoryName: string
}

export function CourseDescriptionBreadCrumbs({
    categoryName,
}: CourseDescriptionProps) {
    return (
        <nav
            className="font-inter text-[18px] leading-4.5 font-medium"
            aria-label="Breadcrumb"
        >
            <Link to="/" className="text-[#666666] hover:text-[#4F46E5]">
                Home
            </Link>
            <span className="mx-2 text-[#666666]">{'>'}</span>
            <Link to="/courses" className="text-[#666666] hover:text-[#4F46E5]">
                Browse
            </Link>
            <span className="mx-2 text-[#666666]">{'>'}</span>
            <span className="text-[#736BEA]">{categoryName}</span>
        </nav>
    )
}

export default CourseDescriptionBreadCrumbs
