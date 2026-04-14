import './App.css'
import Header from './components/base/header/header'
import Footer from './components/base/footer/footer'

function App() {
    return (
        <section className="mx-auto flex min-h-screen max-h-[1080px] w-full max-w-[1920px] flex-col overflow-x-hidden">
            <Header />
            <div className="flex-1" />
            <Footer />
        </section>
    )
}

export default App
