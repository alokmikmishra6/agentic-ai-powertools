import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Reveal, ScaleReveal, SlideIn, FloatIn, ScrollScale, StaggerContainer, StaggerItem, Parallax, TextMarquee, TextRevealByWord } from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import { DOMAINS, PILLARS, ARTICLES, SHOWCASE } from '../data/content'

const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000
const hasNewContent = (items, dateField = 'date') =>
  items.some(i => i.featured || (i[dateField] && (Date.now() - new Date(i[dateField]).getTime()) < TWO_WEEKS))

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const scrollTo = params.get('scrollTo')
    if (scrollTo) {
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.search])

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="hero-section" id="hero">
        <div className="hero-content">
          <Reveal>
            <div className="hero-tag">
              Senior Architect · AI Systems · Cloud Infrastructure
            </div>
          </Reveal>
          <ScaleReveal delay={0.1}>
            <h1 className="hero-title">
              <span className="hero-title-l1">Architect of</span>
              <span className="hero-title-l2 gradient-text">Intelligent Systems</span>
            </h1>
          </ScaleReveal>
          <Reveal delay={0.25}>
            <p className="hero-bio">
              I design <strong>systems that scale</strong>, <strong>platforms that endure</strong>, and <strong>AI workflows that ship to production</strong>. Close to two decades at the intersection of cloud architecture, intelligent automation, and large-scale IoT — bringing rigorous engineering thinking to problems where the stakes are high and the margins for error are low.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="hero-chips">
              <FloatIn delay={0.5} rotate={-2}><span className="chip v">AI Architecture</span></FloatIn>
              <FloatIn delay={0.6} rotate={2}><span className="chip t">Cloud Systems</span></FloatIn>
              <FloatIn delay={0.7} rotate={-3}><span className="chip r">IoT at Scale</span></FloatIn>
              <FloatIn delay={0.8} rotate={2}><span className="chip">Agentic Workflows</span></FloatIn>
              <FloatIn delay={0.9} rotate={-2}><span className="chip">Distributed Design</span></FloatIn>
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
          <Reveal delay={0.15}>
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
          </Reveal>
        </div>
      </section>

      {/* ═══ PHILOSOPHY ═══ */}
      <section id="philosophy" className="phi-section">
        <div className="container">
          <ScaleReveal>
            <div className="section-eyebrow">Perspective</div>
            <h2 className="section-title">How I think about <span className="gradient-text">building</span></h2>
          </ScaleReveal>
          <Reveal delay={0.15}>
            <p className="phi-quote">
              Great architecture is not about the technologies you choose. It is about the decisions you make before you choose them.
            </p>
          </Reveal>
          <TextRevealByWord
            text="The most consequential engineering work happens before the first line of code. It lives in the space between a requirement and a design — where the real question is not what to build, but what it will cost to be wrong."
            className="phi-body"
          />
          <TextRevealByWord
            text="My practice is grounded in systems thinking: understanding the whole before optimising the parts, designing for change rather than against it, and treating complexity as something to be managed honestly."
            className="phi-body"
          />
          <StaggerContainer className="pillars-grid">
            {PILLARS.map(p => (
              <StaggerItem key={p.num}>
                <div className="pillar">
                  <span className="pillar-num">{p.num}</span>
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
              <SlideIn key={d.title} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div className="domain-card">
                  <div className="domain-icon">{d.icon}</div>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              </SlideIn>
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
            <ScrollScale>
              <Link to="/showcase" className="explore-card">
                <span className="explore-icon">◈</span>
                {hasNewContent(SHOWCASE) && <span className="explore-new-dot" title="New content">New</span>}
                <h3>Showcase</h3>
                <p>Architecture diagrams and production code patterns from my work in agentic AI, RAG pipelines, and intelligent systems.</p>
                <span className="explore-arr">View showcase →</span>
              </Link>
            </ScrollScale>
            <ScrollScale>
              <Link to="/thinking" className="explore-card">
                <span className="explore-icon">⬡</span>
                <h3>Thinking</h3>
                <p>Current areas of inquiry — the questions and ideas I'm exploring at the intersection of architecture, AI, and systems design.</p>
                <span className="explore-arr">Read thinking →</span>
              </Link>
            </ScrollScale>
            <ScrollScale>
              <Link to="/writing" className="explore-card">
                <span className="explore-icon">▣</span>
                {hasNewContent(ARTICLES) && <span className="explore-new-dot" title="New content">New</span>}
                <h3>Writing</h3>
                <p>Long-form notes from the field on AI systems, architecture decisions, engineering leadership, and the craft of building well.</p>
                <span className="explore-arr">Read writing →</span>
              </Link>
            </ScrollScale>
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
          <Reveal delay={0.15}>
            <p className="connect-sub">I am genuinely interested in conversations about systems, intelligence, and the craft of building things well. Whether you have a hard problem, a collaboration in mind, or something worth discussing.</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="connect-links">
              <a className="connect-link" href="https://www.linkedin.com/in/alokmishra6/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
