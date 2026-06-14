import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/content'
import GenerativeCover from './GenerativeCover'

/**
 * Shows 3 related articles at the bottom of an article page.
 * Matches by category first, then by recency.
 */
export default function RelatedArticles({ currentSlug, category }) {
  const related = ARTICLES
    .filter(a => a.slug !== currentSlug)
    .map(a => ({
      ...a,
      score: (a.category === category ? 10 : 0) + (a.featured ? 3 : 0),
    }))
    .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <div className="related-articles">
      <h3 className="related-title">Continue reading</h3>
      <div className="related-grid">
        {related.map(article => (
          <Link key={article.slug} to={`/writing/${article.slug}`} className="related-card">
            <GenerativeCover slug={article.slug} category={article.category} height={120} className="related-cover" />
            <div className="related-card-body">
              <span className="related-tag">{article.category}</span>
              <h4 className="related-card-title">{article.title}</h4>
              <span className="related-meta">{article.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
