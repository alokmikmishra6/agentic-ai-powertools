import { Link } from 'react-router-dom'
import { Reveal, ScaleReveal, ClipReveal, PerspectiveReveal, FanReveal, DepthReveal } from '../components/ScrollReveal'
import TiltCard from '../components/TiltCard'
import { DOMAINS, PILLARS } from '../data/content'

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="section-eyebrow">About</div>
            <h2 className="section-title">Building systems that <span className="gradient-text">endure</span></h2>
          </Reveal>
        </div>
      </section>

      {/* ═══ BIO ═══ */}
      <section id="bio">
        <div className="container">
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
            <p className="phi-quote gradient-text">
              Great architecture is not about the technologies you choose. It is about the decisions you make before you choose them.
            </p>
          </ClipReveal>
          <p className="phi-body">
            The most consequential engineering work happens before the first line of code. It lives in the space between a requirement and a design — where the real question is not what to build, but what it will cost to be wrong.
          </p>
          <p className="phi-body">
            My practice is grounded in systems thinking: understanding the whole before optimising the parts, designing for change rather than against it, and treating complexity as something to be managed honestly.
          </p>
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
    </>
  )
}
