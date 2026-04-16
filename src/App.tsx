import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import NotFoundPage from '@/pages/404'
import { BounceLoader } from 'react-spinners'

const LazyDefaultLayout = lazy(() => import('@/layout/default'))
const LazyMainPageView = lazy(() => import('@/pages/main-page/views'))
const LazyCoursesView = lazy(() => import('@/pages/courses/views'))
const LazyCourseDetailsView = lazy(() => import('@/pages/course-details/views'))

function App() {
    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div className="flex min-h-screen w-full items-center justify-center">
                        <BounceLoader color="#4F46E5" />
                    </div>
                }
            >
                <Routes>
                    <Route path="/" element={<LazyDefaultLayout />}>
                        <Route index element={<LazyMainPageView />} />
                        <Route path="courses" element={<LazyCoursesView />} />
                        <Route
                            path="courses/:id"
                            element={<LazyCourseDetailsView />}
                        />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App
