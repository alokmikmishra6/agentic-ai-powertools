import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Writing, { ArticlePage } from './pages/Writing'
import Showcase from './pages/Showcase'
import Thinking from './pages/Thinking'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<ArticlePage />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/thinking" element={<Thinking />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
