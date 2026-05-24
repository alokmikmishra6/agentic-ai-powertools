import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, ScaleReveal, FloatIn, StaggerContainer, StaggerItem, ClipReveal, DepthReveal } from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import TiltCard from '../components/TiltCard'
import ExploreCardCanvas from '../components/ExploreCardCanvas'
import Subscribe from '../components/Subscribe'
import { ARTICLES, SHOWCASE } from '../data/content'

const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000
const hasNewContent = (items, dateField = 'date') =>
  items.some(i => i.featured || (i[dateField] && (Date.now() - new Date(i[dateField]).getTime()) < TWO_WEEKS))

export default function Home() {
  const location = useLocation()
  const [landingVisible, setLandingVisible] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const scrollTo = params.get('scrollTo')
    if (scrollTo) {
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.search])

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.15
      setLandingVisible(window.scrollY < threshold)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ═══ LANDING ═══ */}
      <section className="landing-screen" id="landing">
        <AnimatePresence>
          {landingVisible && (
            <motion.div
              className="landing-cosmos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <div className="cosmos-tagline">
                <motion.span
                  initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="cosmos-text-main cosmos-golden"
                >
                  Where Architecture<br />Meets Intelligence
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  className="cosmos-text-sub"
                >
                  Systems that think. Architecture that scales. Intelligence by design.
                </motion.span>
                <motion.div
                  className="cosmos-line-sony"
                  initial={{ scaleX: 0, opacity: 1 }}
                  animate={{ scaleX: 1, opacity: [1, 1, 1, 0] }}
                  transition={{ delay: 1.8, duration: 2.5, ease: [0.22, 1, 0.36, 1], opacity: { delay: 3.5, duration: 0.8 } }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="landing-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <span>Scroll</span>
          <div className="landing-arrow">
            <svg width="16" height="48" viewBox="0 0 16 48" fill="none">
              <line x1="8" y1="0" x2="8" y2="40" stroke="rgba(201,168,124,0.5)" strokeWidth="1"/>
              <path d="M4 36 L8 42 L12 36" stroke="rgba(201,168,124,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ═══ HERO ═══ */}
      <section className="hero-section" id="hero">
        <div className="hero-content">
          <Reveal>
            <div className="hero-tag">
              Senior Architect · AI Systems · Cloud Infrastructure
            </div>
          </Reveal>
          <h1 className="hero-title">
            <motion.span
              className="hero-title-l1"
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Architect of
            </motion.span>
            <motion.span
              className="hero-title-l2 gradient-text"
              initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Intelligent Systems
            </motion.span>
          </h1>
          <Reveal delay={0.8}>
            <p className="hero-bio">
              I design <strong>systems that scale</strong>, <strong>platforms that endure</strong>, and <strong>AI workflows that ship to production</strong>. Close to two decades at the intersection of cloud architecture, intelligent automation, and large-scale IoT — bringing rigorous engineering thinking to problems where the stakes are high and the margins for error are low.
            </p>
          </Reveal>
          <Reveal delay={1.0}>
            <div className="hero-chips">
              <FloatIn delay={1.1} rotate={-2}><span className="chip v">AI Architecture</span></FloatIn>
              <FloatIn delay={1.2} rotate={2}><span className="chip t">Cloud Systems</span></FloatIn>
              <FloatIn delay={1.3} rotate={-3}><span className="chip r">IoT at Scale</span></FloatIn>
              <FloatIn delay={1.4} rotate={2}><span className="chip">Agentic Workflows</span></FloatIn>
              <FloatIn delay={1.5} rotate={-2}><span className="chip">Distributed Design</span></FloatIn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SCROLL KEYWORDS ═══ */}
      <section className="scroll-keywords">
        <StaggerContainer className="scroll-keywords-track">
          {['Agentic AI', 'Distributed Systems', 'Cloud Architecture', 'RAG Pipelines', 'IoT at Scale', 'Engineering Craft'].map((item) => (
            <StaggerItem key={item} className="scroll-keyword">{item}</StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ═══ EXPLORE ═══ */}
      <section id="explore">
        <div className="container">
          <ScaleReveal>
            <div className="section-eyebrow">Explore</div>
            <h2 className="section-title">Go <span className="gradient-text">deeper</span></h2>
          </ScaleReveal>
          <div className="explore-grid">
            <DepthReveal delay={0}>
              <ExploreCard to="/showcase" type="showcase" icon="◈" title="Showcase" hasNew={hasNewContent(SHOWCASE)}>
                Architecture diagrams and production code patterns from my work in agentic AI, RAG pipelines, and intelligent systems.
              </ExploreCard>
            </DepthReveal>
            <DepthReveal delay={0.15}>
              <ExploreCard to="/thinking" type="thinking" icon="⬡" title="Thinking">
                Current areas of inquiry — the questions and ideas I'm exploring at the intersection of architecture, AI, and systems design.
              </ExploreCard>
            </DepthReveal>
            <DepthReveal delay={0.3}>
              <ExploreCard to="/writing" type="writing" icon="▣" title="Writing" hasNew={hasNewContent(ARTICLES)}>
                Long-form notes from the field on AI systems, architecture decisions, engineering leadership, and the craft of building well.
              </ExploreCard>
            </DepthReveal>
          </div>
        </div>
      </section>

      {/* ═══ CONNECT ═══ */}
      {/* ═══ SUBSCRIBE ═══ */}
      <section id="subscribe" className="subscribe-section">
        <div className="container">
          <ScaleReveal>
            <Subscribe />
          </ScaleReveal>
        </div>
      </section>

      <section id="connect" className="connect-section">
        <div className="container">
          <ScaleReveal>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Connect</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Let's think <span className="gradient-text">together</span></h2>
          </ScaleReveal>
          <ClipReveal direction="bottom" delay={0.1}>
            <p className="connect-sub">I am genuinely interested in conversations about systems, intelligence, and the craft of building things well. Whether you have a hard problem, a collaboration in mind, or something worth discussing.</p>
          </ClipReveal>
          <DepthReveal delay={0.2}>
            <div className="connect-links">
              <a className="connect-link" href="https://www.linkedin.com/in/alokmishra6/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </DepthReveal>
        </div>
      </section>
    </>
  )
}

// Interactive explore card with hover canvas preview
function ExploreCard({ to, type, icon, title, hasNew, children }) {
  const [hovered, setHovered] = useState(false)
  const labels = { showcase: 'View showcase', thinking: 'Read thinking', writing: 'Read writing' }

  return (
    <TiltCard className="explore-card-wrap">
      <Link
        to={to}
        className={`explore-card ${hovered ? 'explore-card--active' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="explore-icon">{icon}</span>
        {hasNew && <span className="explore-new-dot" title="New content">New</span>}
        <h3>{title}</h3>
        <p>{children}</p>
        <div className="explore-canvas-wrap">
          <ExploreCardCanvas type={type} active={hovered} />
        </div>
        <span className="explore-arr">{labels[type]} →</span>
      </Link>
    </TiltCard>
  )
}
