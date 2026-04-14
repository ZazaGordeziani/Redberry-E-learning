import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import NotFoundPage from '@/pages/404'
import { BounceLoader } from 'react-spinners'

const LazyDefaultLayout = lazy(() => import('@/layout/default'))

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
                        <Route index element={<div />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App
