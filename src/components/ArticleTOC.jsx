import { useState, useEffect, useRef } from 'react'

/**
 * Auto-generated Table of Contents from article headings.
 * Sticky sidebar on desktop, collapsible on mobile.
 * Highlights current section based on scroll position.
 */
export default function ArticleTOC({ articleBody }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const observerRef = useRef(null)

  // Parse headings from the rendered article body
  useEffect(() => {
    // Wait for article body to render
    const timer = setTimeout(() => {
      const articleEl = document.querySelector('.article-body')
      if (!articleEl) return

      const elements = articleEl.querySelectorAll('h3, h4')
      const items = Array.from(elements).map((el, i) => {
        // Assign an ID if missing
        if (!el.id) el.id = `toc-${i}-${el.textContent.trim().slice(0, 30).replace(/\s+/g, '-').toLowerCase()}`
        return {
          id: el.id,
          text: el.textContent.trim(),
          level: el.tagName === 'H3' ? 3 : 4,
        }
      })
      setHeadings(items)

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

  if (headings.length < 3) return null // Don't show for very short articles

  return (
    <nav className={`article-toc ${collapsed ? 'collapsed' : ''}`}>
      <button className="toc-toggle" onClick={() => setCollapsed(!collapsed)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="18" y2="18" />
        </svg>
        <span>Contents</span>
        <span className="toc-count">{headings.length}</span>
      </button>
      <div className="toc-list">
        {headings.map(h => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`toc-item ${h.level === 4 ? 'toc-sub' : ''} ${activeId === h.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setActiveId(h.id)
            }}
          >
            {h.text}
          </a>
        ))}
      </div>
    </nav>
  )
}
