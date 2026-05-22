import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/ScrollReveal'
import CodeBlock from '../components/CodeBlock'
import { SHOWCASE } from '../data/content'

export default function Showcase() {
  const [activeTab, setActiveTab] = useState(0)
  const item = SHOWCASE[activeTab]

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="section-eyebrow">Engineering in Practice</div>
            <h2 className="section-title">Real <span className="gradient-text">coding work</span></h2>
            <p className="page-lead">Architecture diagrams and production code patterns from my work in agentic AI, RAG pipelines, and intelligent systems infrastructure.</p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="sc-tabs">
              {SHOWCASE.map((s, i) => (
                <button
                  key={i}
                  className={`sc-tab ${activeTab === i ? 'active' : ''} ${s.featured ? 'featured' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {s.featured && <span className="sc-badge">★</span>}
                  {s.title}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal key={activeTab}>
            <div className="sc-item">
              <p className="sc-desc">{item.description}</p>
              <CodeBlock code={item.code} lang={item.lang} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
