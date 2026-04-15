import logo from '@/assets/logo.svg'
import browseCoursesIcon from '@/assets/browse-course-sign.svg'
import enrolledCoursesIcon from '@/assets/enrolled-courses-sign.svg'
import profileIcon from '@/assets/profile-sign.svg'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/store/auth'
// import { Link } from 'react-router-dom'

type Props = {
    onLoginClick?: () => void
    onSignUpClick?: () => void
}

export default function Header({
    onLoginClick,
    onSignUpClick,
}: Readonly<Props>) {
    const user = useAtomValue(userAtom)
    const isLoggedIn = !!user?.token

    return (
        <header className="mx-auto flex h-27 w-full max-w-480 items-center justify-center border-b border-[#D1D1D1] bg-[#f5f5f5]">
            <div className="flex h-15 w-full max-w-391.5 items-center justify-between">
                {/* <Link to="/"> */}
                <img
                    src={logo}
                    alt="Redberry E-learning"
                    className="h-15 w-auto cursor-pointer"
                />
                {/* </Link> */}

                <div className="flex items-center gap-9">
                    <button
                        type="button"
                        className="font-inter flex items-center gap-2 text-xl leading-6 font-normal text-[#525252]"
                    >
                        <img
                            src={browseCoursesIcon}
                            alt=""
                            aria-hidden="true"
                            className="h-5 w-5"
                        />
                        <span>Browse Courses</span>
                    </button>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-9">
                            <button
                                type="button"
                                className="font-inter flex items-center gap-2 text-xl leading-6 font-normal text-[#525252]"
                            >
                                <img
                                    src={enrolledCoursesIcon}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                />
                                <span>Enrolled Courses</span>
                            </button>

                            <button type="button" className="cursor-pointer">
                                <img src={profileIcon} alt="Profile" />
                            </button>
                        </div>
                    ) : (
                        <div className="font-inter flex items-center gap-3 text-xl leading-6 font-normal">
                            <button
                                type="button"
                                className="rounded-lg border-2 border-[#958FEF] bg-white px-5 py-4 text-[#958FEF]"
                                onClick={onLoginClick}
                            >
                                Log In
                            </button>
                            <button
                                type="button"
                                className="rounded-lg border-2 border-[#4F46E5] bg-[#4F46E5] px-5 py-4 text-white"
                                onClick={onSignUpClick}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
