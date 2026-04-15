import { MainPageSlider } from './slider/slider'
import StartLearning from './start-learning/start-learning'
import ContinueLearningSection from './continue-learning-section/continue-learning'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/store/auth'

const MainPage = () => {
    const user = useAtomValue(userAtom)
    const isLoggedIn = !!user?.token
    const hasEnrollment = false

    return (
        <>
            <MainPageSlider />
            <StartLearning extraBottomPadding={isLoggedIn && !hasEnrollment} />
            {isLoggedIn ? null : <ContinueLearningSection />}
        </>
    )
}

export default MainPage
