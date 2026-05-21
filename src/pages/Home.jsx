import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, ScaleReveal, SlideIn, FloatIn, ScrollScale, StaggerContainer, StaggerItem, Parallax, TextMarquee, TextRevealByWord, PerspectiveReveal, ClipReveal, DepthReveal, FanReveal, HorizontalScroll } from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import TiltCard from '../components/TiltCard'
import ExploreCardCanvas from '../components/ExploreCardCanvas'
import { DOMAINS, PILLARS, ARTICLES, SHOWCASE } from '../data/content'

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
                  className="cosmos-text-main"
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
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="cosmos-line"
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

      {/* ═══ MARQUEE DIVIDER ═══ */}
      <TextMarquee text="Architecture · Intelligence · Systems · Scale · Production · " speed={400} />

      {/* ═══ ABOUT ═══ */}
      <section id="about">
        <div className="container">
          <ScaleReveal>
            <div className="section-eyebrow">About</div>
            <h2 className="section-title">What I <span className="gradient-text">do</span></h2>
          </ScaleReveal>
          <ClipReveal direction="left" delay={0.1}>
            <div className="about-wrap">
              <div className="about-text">
                <p>I'm Alok Mishra — a Senior Software Architect with close to two decades of hands-on experience building production systems at scale. My work sits at the intersection of <strong>AI/ML infrastructure</strong>, <strong>cloud-native distributed systems</strong>, and <strong>IoT platforms</strong> that serve millions of devices.</p>
                <p>Currently I focus on designing agentic AI workflows, RAG pipelines, and LLM integrations that go beyond demos into systems that are reliable, auditable, and safe to run autonomously. I care deeply about the architecture that surrounds intelligence — the trust boundaries, the evaluation frameworks, the operational scaffolding.</p>
                <p>Before AI became the centre of gravity, I spent years architecting real-time data platforms, event-driven microservice ecosystems, and large-scale IoT infrastructure across healthcare, industrial, and enterprise domains.</p>
              </div>
              <div className="about-stats">
                <div className="about-stat">
                  <span className="about-stat-num gradient-text">~20</span>
                  <span className="about-stat-label">Years in Software</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-num gradient-text">AI</span>
                  <span className="about-stat-label">Systems & Agentic Workflows</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-num gradient-text">Cloud</span>
                  <span className="about-stat-label">Native Architecture</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-num gradient-text">IoT</span>
                  <span className="about-stat-label">Platforms at Scale</span>
                </div>
              </div>
            </div>
          </ClipReveal>
        </div>
      </section>

      {/* ═══ PHILOSOPHY ═══ */}
      <section id="philosophy" className="phi-section">
        <div className="container">
          <ScaleReveal>
            <div className="section-eyebrow">Perspective</div>
            <h2 className="section-title">How I think about <span className="gradient-text">building</span></h2>
          </ScaleReveal>
          <ClipReveal direction="bottom" delay={0.1}>
            <p className="phi-quote">
              Great architecture is not about the technologies you choose. It is about the decisions you make before you choose them.
            </p>
          </ClipReveal>
          <TextRevealByWord
            text="The most consequential engineering work happens before the first line of code. It lives in the space between a requirement and a design — where the real question is not what to build, but what it will cost to be wrong."
            className="phi-body"
          />
          <TextRevealByWord
            text="My practice is grounded in systems thinking: understanding the whole before optimising the parts, designing for change rather than against it, and treating complexity as something to be managed honestly."
            className="phi-body"
          />
          <div className="pillars-grid">
            {PILLARS.map((p, i) => (
              <FanReveal key={p.num} index={i} total={PILLARS.length}>
                <div className="pillar">
                  <span className="pillar-num">{p.num}</span>
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                  </div>
                </div>
              </FanReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DOMAINS ═══ */}
      <section id="domains">
        <div className="container">
          <ScaleReveal>
            <div className="section-eyebrow">Expertise</div>
            <h2 className="section-title">Domains of <span className="gradient-text">deep work</span></h2>
            <p className="domains-lead">Across close to two decades my focus has crystallised into areas where I have developed both technical depth and architectural judgement — not just experience, but genuine design intuition earned through consequential decisions in production environments.</p>
          </ScaleReveal>
          <div className="domains-grid">
            {DOMAINS.map((d, i) => (
              <PerspectiveReveal key={d.title} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <TiltCard className="domain-card">
                  <div className="domain-icon">{d.icon}</div>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </TiltCard>
              </PerspectiveReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE DIVIDER ═══ */}
      <TextMarquee text="Deep Work · AI Systems · Cloud Native · Distributed Design · " speed={-350} />

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
