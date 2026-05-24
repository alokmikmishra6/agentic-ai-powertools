import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal'
import CodeBlock from '../components/CodeBlock'
import { SHOWCASE } from '../data/content'

export default function Showcase() {
  const [activeSlug, setActiveSlug] = useState(SHOWCASE[0].slug)
  const item = SHOWCASE.find(s => s.slug === activeSlug) || SHOWCASE[0]

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="section-eyebrow">Engineering in Practice</div>
            <h2 className="section-title">Hands-on <span className="gradient-text">Showcase</span></h2>
            <p className="page-lead">Deep-dive walkthroughs of production patterns — the problem, the architecture, the code, and what I learned building it.</p>
          </Reveal>
        </div>
      </section>

      {/* Project Selector */}
      <section className="showcase-selector" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="sc-tabs">
              {SHOWCASE.map((s) => (
                <button
                  key={s.slug}
                  className={`sc-tab ${activeSlug === s.slug ? 'active' : ''} ${s.featured ? 'featured' : ''}`}
                  onClick={() => setActiveSlug(s.slug)}
                >
                  {s.featured && <span className="sc-badge">★</span>}
                  {s.title}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Project Detail */}
      <section className="showcase-detail" key={activeSlug}>
        <div className="container">

          {/* Header */}
          <Reveal>
            <div className="showcase-header">
              <span className={`showcase-tag showcase-tag--${item.tagClass}`}>{item.tag}</span>
              <h3 className="showcase-title">{item.title}</h3>
            </div>
          </Reveal>

          {/* Problem */}
          <Reveal>
            <div className="showcase-block">
              <div className="showcase-block-label">The Problem</div>
              <p className="showcase-block-text">{item.problem}</p>
            </div>
          </Reveal>

          {/* Approach */}
          <Reveal>
            <div className="showcase-block">
              <div className="showcase-block-label">Approach</div>
              <p className="showcase-block-text">{item.approach}</p>
            </div>
          </Reveal>

          {/* Architecture Diagram */}
          <Reveal>
            <div className="showcase-block">
              <div className="showcase-block-label">Architecture</div>
              <div className="showcase-diagram" dangerouslySetInnerHTML={{ __html: item.architecture }} />
            </div>
          </Reveal>

          {/* Code */}
          <Reveal>
            <div className="showcase-block">
              <div className="showcase-block-label">Implementation</div>
              <CodeBlock code={item.code} lang={item.lang} />
            </div>
          </Reveal>

          {/* How to Run */}
          <Reveal>
            <div className="showcase-block">
              <div className="showcase-block-label">How to Run</div>
              <CodeBlock code={item.runInstructions} lang="bash" />
            </div>
          </Reveal>

          {/* Outcomes & Lessons */}
          <div className="showcase-outcomes-grid">
            <Reveal>
              <div className="showcase-block">
                <div className="showcase-block-label">Outcomes</div>
                <ul className="showcase-list showcase-list--outcomes">
                  {item.outcomes.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal>
              <div className="showcase-block">
                <div className="showcase-block-label">Lessons Learned</div>
                <ul className="showcase-list showcase-list--lessons">
                  {item.lessons.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>

        </div>
      </section>
    </>
  )
}
