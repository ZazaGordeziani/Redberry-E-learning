import { useOutletContext } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { getMyEnrollments } from '@/api/enrollments'
import { userAtom } from '@/store/auth'

import ContinueLearningAuthorized from './continue-learning-section/continue-learning-authorized'
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

    const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
        queryKey: ['enrollments'],
        queryFn: getMyEnrollments,
        enabled: isLoggedIn,
    })

    const hasEnrollments = enrollments.length > 0

    return (
        <>
            <MainPageSlider />
            {isLoggedIn ? (
                <>
                    <ContinueLearningAuthorized
                        enrollments={enrollments}
                        isLoading={enrollmentsLoading}
                    />
                    <StartLearning
                        extraBottomPadding={isLoggedIn && !hasEnrollments}
                    />
                </>
            ) : (
                <>
                    <StartLearning extraBottomPadding={false} />
                    <ContinueLearningSection onLoginClick={openLoginModal} />
                </>
            )}
        </>
    )
}

export default MainPage
