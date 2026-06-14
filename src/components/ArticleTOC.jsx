import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Auto-generated Table of Contents from article headings.
 * Fixed sidebar on desktop (always visible during scroll), collapsible on mobile.
 * Highlights current section based on scroll position.
 */
export default function ArticleTOC({ articleBody }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 1200)
  const [visible, setVisible] = useState(false)
  const observerRef = useRef(null)

  // Parse headings from the rendered article body
  useEffect(() => {
    // Wait for article body to render
    const timer = setTimeout(() => {
      const articleEl = document.querySelector('.article-body')
      if (!articleEl) return

      const elements = articleEl.querySelectorAll('h2, h3, h4')
      const items = Array.from(elements).map((el, i) => {
        // Assign an ID if missing
        if (!el.id) el.id = `toc-${i}-${el.textContent.trim().slice(0, 30).replace(/\s+/g, '-').toLowerCase()}`
        return {
          id: el.id,
          text: el.textContent.trim(),
          level: el.tagName === 'H2' ? 2 : el.tagName === 'H3' ? 3 : 4,
        }
      })
      setHeadings(items)
      setVisible(items.length >= 3)

      // Observe intersection for highlighting
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Find the first heading that is currently in view
          const visible = entries.filter(e => e.isIntersecting)
          if (visible.length > 0) {
            setActiveId(visible[0].target.id)
          }
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
      )

      elements.forEach(el => observerRef.current.observe(el))
    }, 300)

    return () => {
      clearTimeout(timer)
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [articleBody])

  if (!visible) return null

  return createPortal(
    <>
      {/* Backdrop scrim on mobile when TOC is open */}
      {!collapsed && (
        <div
          className="toc-backdrop"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}
      <nav className={`article-toc ${collapsed ? 'collapsed' : ''}`} aria-label="Table of contents">
        <button className="toc-toggle" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
          <span>Contents</span>
          <span className="toc-count">{headings.length}</span>
          <svg className="toc-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div className="toc-list">
          {headings.map(h => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`toc-item ${h.level === 4 ? 'toc-sub' : ''} ${h.level === 2 ? 'toc-h2' : ''} ${activeId === h.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setActiveId(h.id)
                if (window.innerWidth <= 1200) setCollapsed(true)
              }}
            >
              {h.text}
            </a>
          ))}
        </div>
      </nav>
    </>,
    document.body
  )
}
