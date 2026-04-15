import { Outlet } from 'react-router-dom'
import { useState } from 'react'

import Footer from '../../components/base/footer/footer'
import Header from '../../components/base/header/header'
import { PageContainer } from '../../components/base/page-container/page-container'
import Register from '../../pages/modals/register/register'

const DefaultLayout = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)

    return (
        <div className="min-h-screen bg-white">
            <section className="mx-auto flex min-h-screen w-full max-w-480 flex-col overflow-x-hidden bg-[#F5F5F5]">
                <Header onSignUpClick={() => setIsRegisterOpen(true)} />
                <PageContainer>
                    <Outlet />
                </PageContainer>
                <Footer />
            </section>

            <Register
                open={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
            />
        </div>
    )
}

export default DefaultLayout
