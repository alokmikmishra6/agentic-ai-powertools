import { Link } from 'react-router-dom'
import { Reveal } from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import { THINKING } from '../data/content'

export default function Thinking() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="section-eyebrow">Current Inquiry</div>
            <h2 className="section-title">What I am <span className="gradient-text">thinking about</span></h2>
            <p className="page-lead">The questions and ideas I'm currently exploring — at the intersection of architecture, AI systems, and the craft of building software.</p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="thinking-layout">
            <Reveal>
              <div className="thinking-sidebar">
                <p className="t-sb-label">Areas of Focus</p>
                {THINKING.map((t, i) => (
                  <span key={i} className="t-sb-item">{t.sidebarText}</span>
                ))}
              </div>
            </Reveal>
            <div>
              {THINKING.map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="thinking-card">
                    <GlassCard>
                      <span className={`tc-tag ${t.tagClass}`}>{t.tag}</span>
                      <h3>{t.title}</h3>
                      <p>{t.body}</p>
                    </GlassCard>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
