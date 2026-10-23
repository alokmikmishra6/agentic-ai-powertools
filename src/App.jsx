import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import CommandPalette from './components/CommandPalette'
import ExperienceEffects from './components/ExperienceEffects'

const Saved = lazy(() => import('./pages/Saved'))
const Labs = lazy(() => import('./pages/Labs'))
const Writing = lazy(() => import('./pages/Writing'))
const Article = lazy(() => import('./pages/Article'))
const Showcase = lazy(() => import('./pages/Showcase'))
const Thinking = lazy(() => import('./pages/Thinking'))
const About = lazy(() => import('./pages/About'))

function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Alok Mishra — Field Notes on AI & Architecture'
  }, [pathname])
  useEffect(() => {
    if (!hash) return
    let targetId
    try { targetId = decodeURIComponent(hash.slice(1)) } catch { return }
    let attempts = 0
    const timer = setInterval(() => {
      const target = document.getElementById(targetId)
      if (target) { target.scrollIntoView({block:"start",behavior:"instant"}); clearInterval(timer) }
      if (++attempts > 30) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [pathname, hash])
  return null
}
export default function App() {
  return <>
    <RouteEffects /><ExperienceEffects /><Nav /><CommandPalette />
    <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<div className="journal-container journal-loading" role="status">Opening the notebook…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<Article />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/thinking" element={<Thinking />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<div className="journal-container journal-not-found"><span className="journal-kicker">404 / Off the beaten path</span><h1>This page is unwritten.</h1><p>Find your next idea in the notebook.</p><Link className="journal-button" to="/writing">Explore the writing →</Link></div>} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </>
}
