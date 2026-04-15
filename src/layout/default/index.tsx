import { useAtomValue } from 'jotai'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Footer from '../../components/base/footer/footer'
import Header from '../../components/base/header/header'
import { PageContainer } from '../../components/base/page-container/page-container'
import Register from '../../pages/modals/register/register'
import Login from '../../pages/modals/login/login'
import Profile from '../../pages/modals/profile/profile'
import { userAtom } from '@/store/auth'

const DefaultLayout = () => {
    const location = useLocation()
    const user = useAtomValue(userAtom)
    const isLoggedIn = !!user?.token
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [location.pathname, location.key])

    const handleFooterMyProfileClick = () => {
        if (isLoggedIn) {
            window.scrollTo({ top: 0, behavior: 'auto' })
            setIsProfileOpen(true)
        } else {
            setIsLoginOpen(true)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="mx-auto flex min-h-screen w-full max-w-480 flex-col overflow-x-hidden bg-[#F5F5F5]">
                <Header
                    onLoginClick={() => setIsLoginOpen(true)}
                    onSignUpClick={() => setIsRegisterOpen(true)}
                    onProfileClick={() => setIsProfileOpen(true)}
                />
                <PageContainer>
                    <Outlet
                        context={{
                            openLoginModal: () => setIsLoginOpen(true),
                        }}
                    />
                </PageContainer>
                <Footer onMyProfileClick={handleFooterMyProfileClick} />
            </section>

            <Login
                open={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onOpenRegister={() => setIsRegisterOpen(true)}
            />
            <Register
                open={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onOpenLogin={() => setIsLoginOpen(true)}
            />
            <Profile open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    )
}

export default DefaultLayout
