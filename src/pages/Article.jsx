import { useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { articleBody } from '../lib/article-content'
import SaveButton from '../components/SaveButton'
import ReadingMemory from '../components/ReadingMemory'
import SystemLab from '../components/labs/SystemLab'
import GenerativeCover from '../components/GenerativeCover'
import ArticleAudioPlayer from '../components/ArticleAudioPlayer'
import ArticleTOC from '../components/ArticleTOC'
import ReadingProgress from '../components/ReadingProgress'
import ReadingControls from '../components/ReadingControls'
import CopyCodeBlocks from '../components/CopyCodeBlocks'
import RelatedArticles from '../components/RelatedArticles'
import Subscribe from '../components/Subscribe'
import { ARTICLES } from '../data/content'
import { topicPath } from '../lib/articles'
import { journeyPosition } from '../data/journeys'

export default function ArticlePage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const article = ARTICLES.find(a => a.slug === slug)
  const body = useMemo(() => articleBody(article?.body || ""), [article])
  const lab = ({"agents-survive-failure-checkpointing":"recovery", "rag-knowledge-architecture":"chunking", "token-economy-agentic-systems":"budget"})[slug]
  const trail = journeyPosition(params.get('trail'), slug, ARTICLES)
  useEffect(() => {
    if (!article) return
    const original = document.title
    document.title = `${article.title} — Alok Mishra`
    return () => { document.title = original }
  }, [article])
  if (!article) return <div className="journal-container journal-not-found"><span className="journal-kicker">A missing page in the notebook</span><h1>Essay not found.</h1><p>This link may have changed. There’s more to explore in the library.</p><Link className="journal-button" to="/writing">Browse the writing →</Link></div>

  return (
    <article className="article-page journal-article">
      <div className="article-page-inner">
        <Link to="/writing" className="journal-breadcrumb">← All writing</Link>
        {trail && <nav className="article-trail" aria-label="Reading path"><span className="journal-kicker">{trail.journey.label} / Essay {trail.index + 1} of {trail.entries.length}</span><ol>{trail.entries.map((entry, i) => <li key={entry.slug}><Link to={`/writing/${entry.slug}?trail=${trail.journey.id}`} aria-current={i === trail.index ? 'step' : undefined} aria-label={`Essay ${i + 1}: ${entry.title}`}><span>0{i + 1}</span><span>{entry.title}</span></Link></li>)}</ol></nav>}
        <header className="journal-article-heading">
          <div className="journal-meta"><Link to={topicPath(article.category)}>{article.category}</Link><span>{article.readTime}</span></div>
          <h1>{article.title}</h1>
          <div className="journal-article-byline"><span className="journal-monogram" aria-hidden="true">am.</span><div><Link to="/about">Alok Mishra</Link><time dateTime={article.date}>{article.dateDisplay}</time></div><span>Notes from the field</span></div>
        </header>
        {(article.theme || article.excerpt) && <div className="article-tldr"><div className="article-tldr-label">The idea in brief</div><p className="article-tldr-text">{article.theme || article.excerpt}</p></div>}
        <GenerativeCover slug={article.slug} category={article.category} height={280} className="article-cover" />
        <div className="article-save"><SaveButton slug={slug} title={article.title}/><Link to="/saved">Your reading corner →</Link></div>
        <ReadingControls key={slug} />
        <ReadingMemory key={slug} slug={slug} />
        <ArticleAudioPlayer key={slug} slug={slug} articleBody={body} title={article.title} />
        {lab && <SystemLab key={slug} kind={lab} />}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: body }} />
        {trail && <aside className="article-trail-next"><span className="journal-kicker">{trail.next ? 'Next along this thread' : 'You’ve reached the end of this reading path'}</span><h2>{trail.next?.title || 'Keep following your curiosity.'}</h2><Link className="journal-text-link" to={trail.next ? `/writing/${trail.next.slug}?trail=${trail.journey.id}` : '/writing'}>{trail.next ? `Continue · ${trail.next.readTime}` : 'Explore more essays'} <span aria-hidden="true">→</span></Link></aside>}
        <div className="article-footer-nav"><span className="journal-kicker">Thanks for reading.</span><Link to="/writing" className="journal-text-link">Back to the notebook <span aria-hidden="true">→</span></Link></div>
      </div>
      <div className="article-footer-section"><RelatedArticles currentSlug={article.slug} category={article.category} /><Subscribe source="article" /></div>
      <ArticleTOC key={slug} articleBody={body} />
      <ReadingProgress key={slug} readTime={article.readTime} />
      <CopyCodeBlocks key={slug} />
    </article>
  )
}
