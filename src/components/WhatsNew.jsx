import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ARTICLES, SHOWCASE, THINKING } from '../data/content'

const STORAGE_KEY = 'alok-site-last-seen'
const SUBSCRIBED_KEY = 'alok-site-subscribed'
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000

/**
 * Combined "What's New" + Subscribe panel.
 * Bell icon in nav — opens panel with recent items + inline subscribe form.
 */
export default function WhatsNew() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [newItems, setNewItems] = useState([])
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState(() =>
    localStorage.getItem(SUBSCRIBED_KEY) ? 'subscribed' : 'idle'
  ) // idle | loading | subscribed | error
  const [subError, setSubError] = useState('')

  useEffect(() => {
    const lastSeen = localStorage.getItem(STORAGE_KEY)
    const lastDate = lastSeen ? new Date(lastSeen) : new Date(0)
    const now = Date.now()

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

    if (items.length > 0) {
      setNewItems(items.slice(0, 5))
    }
  }, [])

  const handleDismiss = () => {
    setOpen(false)
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setSubStatus('loading')
    setSubError('')

    const proxyUrl = import.meta.env.VITE_SUBSCRIBE_PROXY_URL
    if (!proxyUrl) {
      setSubStatus('subscribed')
      localStorage.setItem(SUBSCRIBED_KEY, '1')
      return
    }

    try {
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          utm_source: 'nav-panel',
          utm_medium: 'bell-icon',
        }),
      })

      if (res.ok || res.status === 201 || res.status === 409) {
        setSubStatus('subscribed')
        localStorage.setItem(SUBSCRIBED_KEY, '1')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setSubError(data?.message || 'Something went wrong.')
        setSubStatus('error')
      }
    } catch {
      setSubError('Network error.')
      setSubStatus('error')
    }
  }

  // Always show (subscribe is always relevant even if no new items)
  const hasNew = !dismissed && newItems.length > 0

  return (
    <div className="whats-new-wrapper">
      <button
        className="whats-new-trigger"
        onClick={() => setOpen(!open)}
        aria-label={hasNew ? `${newItems.length} new items` : 'Subscribe & updates'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {hasNew && <span className="whats-new-badge">{newItems.length}</span>}
      </button>

      {open && (
        <div className="whats-new-panel">
          {/* New items section */}
          {hasNew && (
            <>
              <div className="whats-new-header">
                <h3>What's New</h3>
                <button className="whats-new-close" onClick={handleDismiss}>
                  Mark read ✓
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
            </>
          )}

          {/* Subscribe section */}
          <div className="whats-new-subscribe">
            {!hasNew && <h3 className="whats-new-sub-heading">Stay updated</h3>}
            {hasNew && <div className="whats-new-divider" />}
            {subStatus === 'subscribed' ? (
              <div className="whats-new-sub-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4b896" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Subscribed — you'll get notified on new posts.</span>
              </div>
            ) : (
              <form className="whats-new-sub-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="whats-new-sub-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={subStatus === 'loading'}
                />
                <button
                  type="submit"
                  className="whats-new-sub-btn"
                  disabled={subStatus === 'loading' || !email}
                >
                  {subStatus === 'loading' ? '...' : '→'}
                </button>
              </form>
            )}
            {subStatus === 'error' && <p className="whats-new-sub-error">{subError}</p>}
            {subStatus !== 'subscribed' && (
              <p className="whats-new-sub-note">Get notified on new essays. No spam.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
