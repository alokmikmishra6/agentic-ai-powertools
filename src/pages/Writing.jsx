import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Reveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import GenerativeCover from '../components/GenerativeCover'
import { ARTICLES } from '../data/content'

const CATEGORIES = ['All', 'Featured', 'New', 'AI Systems', 'Architecture', 'Reflection', 'Leadership']
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000
const isNew = (dateStr) => (Date.now() - new Date(dateStr).getTime()) < TWO_WEEKS

export default function Writing() {
  const [filter, setFilter] = useState('All')
  const [showCount, setShowCount] = useState(6)

  const filtered = filter === 'All' ? ARTICLES
    : filter === 'Featured' ? ARTICLES.filter(a => a.featured)
    : filter === 'New' ? ARTICLES.filter(a => isNew(a.date))
    : ARTICLES.filter(a => a.category === filter)
  const visible = filtered.slice(0, showCount)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <Link to="/" className="back-link">← Back to Home</Link>
            <div className="section-eyebrow">Writing</div>
            <h2 className="section-title">Notes from the <span className="gradient-text">field</span></h2>
            <p className="page-lead">Long-form thinking on AI systems, architecture decisions, engineering leadership, and the craft of building software that endures.</p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="filters">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`filter-btn ${filter === c ? 'active' : ''}`}
                  onClick={() => { setFilter(c); setShowCount(6) }}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <StaggerContainer key={filter} className="writing-grid">
            {visible.map(article => (
              <StaggerItem key={article.slug} className="writing-card">
                <Link to={`/writing/${article.slug}`}>
                  <GlassCard>
                    <GenerativeCover slug={article.slug} category={article.category} height={160} className="wc-cover" />
                    <div className="wc-meta">
                      <span className="wc-tag">{article.category}</span>
                      {article.featured && <span className="wc-badge featured">Featured</span>}
                      {isNew(article.date) && <span className="wc-badge new">New</span>}
                      <span className="wc-date">{article.dateDisplay}</span>
                    </div>
                    <h3>{article.title}</h3>
                    {article.theme && (
                      <p className="wc-theme">{article.theme}</p>
                    )}
                    <p className="excerpt">{article.excerpt}</p>
                    <div className="wc-foot">
                      <span>{article.readTime}</span>
                      <span className="wc-arrow">→</span>
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {showCount < filtered.length && (
            <Reveal>
              <button className="load-more-btn" onClick={() => setShowCount(s => s + 6)}>
                Load more writing
              </button>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}

export function ArticlePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const article = ARTICLES.find(a => a.slug === slug)

  if (!article) {
    return (
      <div className="container article-page">
        <p>Article not found.</p>
        <Link to="/writing" className="article-back">← Back to writing</Link>
      </div>
    )
  }

  return (
    <div className="container article-page">
      <Reveal>
        <Link to="/writing" className="article-back">← Back to writing</Link>
      </Reveal>
      <Reveal delay={0.1}>
        <GenerativeCover slug={article.slug} category={article.category} height={320} className="article-cover" />
      </Reveal>
      <Reveal delay={0.15}>
        <div className="article-meta-bar">
          <span className="wc-tag">{article.category}</span>
          <span>{article.dateDisplay}</span>
          <span>{article.readTime}</span>
        </div>
        <h1>{article.title}</h1>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.body }} />
      </Reveal>
      <Reveal delay={0.25}>
        <div style={{ padding: '40px 0 80px' }}>
          <Link to="/writing" className="article-back">← Back to all writing</Link>
        </div>
      </Reveal>
    </div>
  )
}
