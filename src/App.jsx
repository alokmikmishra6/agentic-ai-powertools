import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Writing, { ArticlePage } from './pages/Writing'
import Showcase from './pages/Showcase'
import Thinking from './pages/Thinking'
import ScrollProgress from './components/ScrollProgress'
import ParallaxOverlays from './components/ParallaxOverlays'
import SmoothScroll from './components/SmoothScroll'
import CustomCursor from './components/CustomCursor'
import PageTransition from './components/PageTransition'
import CommandPalette from './components/CommandPalette'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <SmoothScroll>
      <CustomCursor />
      <ParallaxOverlays />
      <ScrollProgress />
      <ScrollToTop />
      <Nav />
      <CommandPalette />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/writing" element={<PageTransition><Writing /></PageTransition>} />
            <Route path="/writing/:slug" element={<PageTransition><ArticlePage /></PageTransition>} />
            <Route path="/showcase" element={<PageTransition><Showcase /></PageTransition>} />
            <Route path="/thinking" element={<PageTransition><Thinking /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
