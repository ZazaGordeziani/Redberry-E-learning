import { useAtomValue } from 'jotai'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect } from 'react'

import Footer from '../../components/base/footer/footer'
import Header from '../../components/base/header/header'
import { PageContainer } from '../../components/base/page-container/page-container'
import Register from '../../pages/modals/register/register'
import Login from '../../pages/modals/login/login'
import Profile from '../../pages/modals/profile/profile'
import { userAtom } from '@/store/auth'

const PROFILE_QUERY = 'profile'
const AUTH_QUERY = 'auth'
const AUTH_LOGIN = 'login'
const AUTH_SIGNUP = 'signup'

const DefaultLayout = () => {
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const user = useAtomValue(userAtom)
    const isLoggedIn = !!user?.token

    const authParam = searchParams.get(AUTH_QUERY)
    const isLoginOpen = authParam === AUTH_LOGIN
    const isRegisterOpen = authParam === AUTH_SIGNUP

    const isProfileOpen = searchParams.get(PROFILE_QUERY) === '1'

    const openProfile = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev.toString())
                next.set(PROFILE_QUERY, '1')
                return next
            },
            { replace: true },
        )
    }, [setSearchParams])

    const closeProfile = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev.toString())
                next.delete(PROFILE_QUERY)
                return next
            },
            { replace: true },
        )
    }, [setSearchParams])

    const openLogin = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev.toString())
                next.set(AUTH_QUERY, AUTH_LOGIN)
                return next
            },
            { replace: true },
        )
    }, [setSearchParams])

    const openRegister = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev.toString())
                next.set(AUTH_QUERY, AUTH_SIGNUP)
                return next
            },
            { replace: true },
        )
    }, [setSearchParams])

    const closeAuthModal = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev.toString())
                next.delete(AUTH_QUERY)
                return next
            },
            { replace: true },
        )
    }, [setSearchParams])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [location.pathname, location.key])

    const handleFooterMyProfileClick = () => {
        if (isLoggedIn) {
            window.scrollTo({ top: 0, behavior: 'auto' })
            openProfile()
        } else {
            openLogin()
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="mx-auto flex min-h-screen w-full max-w-480 flex-col overflow-x-hidden bg-[#F5F5F5]">
                <Header
                    onLoginClick={openLogin}
                    onSignUpClick={openRegister}
                    onProfileClick={openProfile}
                />
                <PageContainer>
                    <Outlet
                        context={{
                            openLoginModal: openLogin,
                        }}
                    />
                </PageContainer>
                <Footer onMyProfileClick={handleFooterMyProfileClick} />
            </section>

            <Login
                open={isLoginOpen}
                onClose={closeAuthModal}
                onOpenRegister={openRegister}
            />
            <Register
                open={isRegisterOpen}
                onClose={closeAuthModal}
                onOpenLogin={openLogin}
            />
            <Profile open={isProfileOpen} onClose={closeProfile} />
        </div>
    )
}

export default DefaultLayout
