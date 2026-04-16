import { useOutletContext } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { userAtom } from '@/store/auth'

import ContinueLearningSection from './continue-learning-section/continue-learning'
import { MainPageSlider } from './slider/slider'
import StartLearning from './start-learning/start-learning'

type DefaultLayoutOutletContext = {
    openLoginModal: () => void
}

const MainPage = () => {
    const { openLoginModal } = useOutletContext<DefaultLayoutOutletContext>()
    const user = useAtomValue(userAtom)
    const isLoggedIn = !!user?.token
    const hasEnrollment = false

    return (
        <>
            <MainPageSlider />
            <StartLearning extraBottomPadding={isLoggedIn && !hasEnrollment} />
            {isLoggedIn ? null : (
                <ContinueLearningSection onLoginClick={openLoginModal} />
            )}
        </>
    )
}

export default MainPage
