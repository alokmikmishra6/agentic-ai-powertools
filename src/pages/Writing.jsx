import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Reveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import GenerativeCover from '../components/GenerativeCover'
import ArticleAudioPlayer from '../components/ArticleAudioPlayer'
import ArticleTOC from '../components/ArticleTOC'
import ReadingProgress from '../components/ReadingProgress'
import CopyCodeBlocks from '../components/CopyCodeBlocks'
import RelatedArticles from '../components/RelatedArticles'
import { ARTICLES } from '../data/content'

const CATEGORIES = ['All', 'Featured', 'New', 'AI Systems', 'Architecture', 'Reflection', 'Leadership']
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000
const isNew = (dateStr) => (Date.now() - new Date(dateStr).getTime()) < TWO_WEEKS

export default function Writing() {
  const [filter, setFilter] = useState('Featured')
  const [showCount, setShowCount] = useState(100)

  const filtered = filter === 'All' ? ARTICLES
    : filter === 'Featured' ? ARTICLES.filter(a => a.featured)
    : filter === 'New' ? ARTICLES.filter(a => isNew(a.date))
    : ARTICLES.filter(a => a.category === filter)

  // Sort: featured first, then new, then rest
  const sorted = [...filtered].sort((a, b) => {
    const aScore = (a.featured ? 2 : 0) + (isNew(a.date) ? 1 : 0)
    const bScore = (b.featured ? 2 : 0) + (isNew(b.date) ? 1 : 0)
    return bScore - aScore
  })
  const visible = sorted.slice(0, showCount)

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
                  onClick={() => { setFilter(c); setShowCount(100) }}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <StaggerContainer key={filter} className="writing-grid">
            {visible.map(article => (
              <StaggerItem key={article.slug} className={`writing-card${article.featured ? ' writing-card--featured' : ''}${isNew(article.date) ? ' writing-card--new' : ''}`}>
                <Link to={`/writing/${article.slug}`}>
                  <GlassCard>
                    <GenerativeCover slug={article.slug} category={article.category} height={article.featured ? 200 : 160} className="wc-cover" />
                    {(article.featured || isNew(article.date)) && (
                      <div className="wc-spotlight">
                        {article.featured && <span className="wc-spotlight-label">★ Featured</span>}
                        {isNew(article.date) && <span className="wc-spotlight-label wc-spotlight-new">New</span>}
                      </div>
                    )}
                    <div className="wc-meta">
                      <span className="wc-tag">{article.category}</span>
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
    <article className="article-page">
      <div className="article-page-inner">
        <Reveal>
          <Link to="/writing" className="article-back">← Back to writing</Link>
        </Reveal>
        <Reveal delay={0.1}>
          <GenerativeCover slug={article.slug} category={article.category} height={360} className="article-cover" />
        </Reveal>
        <Reveal delay={0.15}>
          <div className="article-meta-bar">
            <span className="wc-tag">{article.category}</span>
            <span>{article.dateDisplay}</span>
            <span>{article.readTime}</span>
          </div>
          <h1>{article.title}</h1>
        </Reveal>

        {/* TL;DR Summary Block */}
        {(article.theme || article.excerpt) && (
          <Reveal delay={0.18}>
            <div className="article-tldr">
              <div className="article-tldr-label">TL;DR</div>
              <p className="article-tldr-text">{article.theme || article.excerpt}</p>
            </div>
          </Reveal>
        )}

        {/* Audio Player */}
        <Reveal delay={0.19}>
          <ArticleAudioPlayer articleBody={article.body} title={article.title} />
        </Reveal>

        {/* Table of Contents — inline on mobile, fixed sidebar on desktop */}
        <div className="article-toc-inline">
          <ArticleTOC articleBody={article.body} />
        </div>

        <Reveal delay={0.2}>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.body }} />
        </Reveal>

        {/* Related Articles */}
        <Reveal delay={0.22}>
          <RelatedArticles currentSlug={article.slug} category={article.category} />
        </Reveal>

        <Reveal delay={0.25}>
          <div className="article-footer-nav">
            <Link to="/writing" className="article-back">← Back to all writing</Link>
          </div>
        </Reveal>
      </div>

      {/* Floating: Reading Progress */}
      <ReadingProgress readTime={article.readTime} />

      {/* Inject copy buttons on code blocks */}
      <CopyCodeBlocks />
    </article>
  )
}
