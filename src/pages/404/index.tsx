import { Link } from 'react-router-dom'


const NotFoundPage = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-5 text-2xl text-[#4F46E5]">
            <p>404 Ooops, Page Not Found</p>
            <Link to="/">
                <button className="cursor-pointer rounded-3xl bg-[#4F46E5] px-9 py-4 text-slate-100">
                    Go Back to Main Page
                </button>
            </Link>
        </div>
    )
}

export default NotFoundPage
