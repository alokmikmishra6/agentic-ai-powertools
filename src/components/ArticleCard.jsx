import { Link } from 'react-router-dom'
import SaveButton from './SaveButton'
import { useReader } from '../hooks/useReader'
import GenerativeCover from './GenerativeCover'
import { TOPICS, isRecent } from '../lib/articles'

export default function ArticleCard({ article, number, passage }) {
  const reader = useReader()
  const topic = TOPICS.find(t => t.name === article.category)
  return (
    <article className="journal-card" style={{ '--topic-color': topic?.color }}>
      <Link to={`/writing/${article.slug}`} className="journal-card-link">
        <div className="journal-card-art">
          <GenerativeCover slug={article.slug} category={article.category} height={190} />
          <span className="journal-card-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
          <span className="journal-card-open" aria-hidden="true">↗</span>
        </div>
        <div className="journal-card-content">
          <div className="journal-meta"><span>{article.category}</span>{isRecent(article.date) && <span className="journal-new">New</span>}</div>
          <h3>{article.title}</h3>
          <p>{passage || article.excerpt}</p>
          <div className="journal-card-foot"><time dateTime={article.date}>{article.dateDisplay}</time><span>{article.readTime}</span></div>
        </div>
      </Link>
      <div className="card-reader-actions"><SaveButton slug={article.slug} title={article.title} /><span>{reader.reading[article.slug]?.completed ? "✓ Read" : article.format}</span></div>
    </article>
  )
}
