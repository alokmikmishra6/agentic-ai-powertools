import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ARTICLES, SHOWCASE, THINKING } from '../data/content'

const STORAGE_KEY = 'alok-site-last-seen'
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000

/**
 * "What's New" notification panel.
 * Shows a floating bell icon with a badge count of new items since last visit.
 * Expands into a panel showing recent additions across Writing, Showcase, Thinking.
 */
export default function WhatsNew() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [newItems, setNewItems] = useState([])

  useEffect(() => {
    const lastSeen = localStorage.getItem(STORAGE_KEY)
    const lastDate = lastSeen ? new Date(lastSeen) : new Date(0)
    const now = Date.now()

    // Find all content newer than lastSeen or within 2 weeks
    const items = []

    ARTICLES.forEach(a => {
      const articleDate = new Date(a.date)
      if (articleDate > lastDate || (now - articleDate.getTime()) < TWO_WEEKS) {
        items.push({
          type: 'article',
          title: a.title,
          date: a.dateDisplay,
          path: `/writing/${a.slug}`,
          category: a.category,
        })
      }
    })

    SHOWCASE.forEach(s => {
      if (s.featured) {
        items.push({
          type: 'showcase',
          title: s.title,
          date: 'New',
          path: '/showcase',
          category: s.tag,
        })
      }
    })

    // Only show if there are new items and user hasn't dismissed this session
    if (items.length > 0) {
      setNewItems(items.slice(0, 6))
    }
  }, [])

  const handleDismiss = () => {
    setOpen(false)
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  }

  if (dismissed || newItems.length === 0) return null

  return (
    <div className="whats-new-wrapper">
      {/* Bell trigger */}
      <button
        className="whats-new-trigger"
        onClick={() => setOpen(!open)}
        aria-label={`${newItems.length} new items`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="whats-new-badge">{newItems.length}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="whats-new-panel">
          <div className="whats-new-header">
            <h3>What's New</h3>
            <button className="whats-new-close" onClick={handleDismiss}>
              Mark all read ✓
            </button>
          </div>
          <div className="whats-new-list">
            {newItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="whats-new-item"
                onClick={handleDismiss}
              >
                <span className={`whats-new-type whats-new-type--${item.type}`}>
                  {item.type === 'article' ? '✍' : item.type === 'showcase' ? '⚡' : '💭'}
                </span>
                <div className="whats-new-item-text">
                  <span className="whats-new-item-title">{item.title}</span>
                  <span className="whats-new-item-meta">{item.category} · {item.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
