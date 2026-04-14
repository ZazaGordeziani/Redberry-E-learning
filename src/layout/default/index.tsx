import { Outlet } from 'react-router-dom'

import Footer from '../../components/base/footer/footer'
import Header from '../../components/base/header/header'
import { PageContainer } from '../../components/base/page-container/page-container'

const DefaultLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <section className="mx-auto flex max-h-270 min-h-screen w-full max-w-480 flex-col overflow-x-hidden bg-[#F5F5F5]">
                <Header />
                <PageContainer>
                    <Outlet />
                </PageContainer>
                <Footer />
            </section>
        </div>
    )
}

export default DefaultLayout
