import { MainPageSlider } from './slider/slider'
import StartLearning from './start-learning/start-learning'
import ContinueLearningSection from './continue-learning-section/continue-learning'

const mainPage = () => {
    return (
        <>
            <MainPageSlider />
            <StartLearning />
            <ContinueLearningSection />
        </>
    )
}

export default mainPage
