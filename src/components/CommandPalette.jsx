import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ARTICLES, THINKING, SHOWCASE } from '../data/content'

const ALL_ITEMS = [
  ...ARTICLES.map(a => ({
    type: 'article',
    title: a.title,
    subtitle: `${a.category} · ${a.readTime}`,
    path: `/writing/${a.slug}`,
    keywords: `${a.title} ${a.category} ${a.excerpt || ''}`.toLowerCase(),
  })),
  ...THINKING.map((t, i) => ({
    type: 'thinking',
    title: t.title,
    subtitle: t.tag,
    path: '/thinking',
    keywords: `${t.title} ${t.tag} ${t.sidebarText || ''}`.toLowerCase(),
  })),
  ...SHOWCASE.map((s, i) => ({
    type: 'showcase',
    title: s.title,
    subtitle: s.tag,
    path: '/showcase',
    keywords: `${s.title} ${s.tag} ${s.description || ''}`.toLowerCase(),
  })),
  { type: 'page', title: 'Home', subtitle: 'Landing page', path: '/', keywords: 'home landing' },
  { type: 'page', title: 'About', subtitle: 'Bio, philosophy & expertise', path: '/about', keywords: 'about bio philosophy domains expertise' },
  { type: 'page', title: 'Writing', subtitle: 'All articles', path: '/writing', keywords: 'writing articles blog' },
  { type: 'page', title: 'Showcase', subtitle: 'Code gallery', path: '/showcase', keywords: 'showcase code projects' },
  { type: 'page', title: 'Thinking', subtitle: 'Philosophy & models', path: '/thinking', keywords: 'thinking philosophy mental models' },
]

const TYPE_ICONS = {
  article: '✍',
  thinking: '💭',
  showcase: '⚡',
  page: '📄',
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Fuzzy search
  const results = query.length === 0
    ? ALL_ITEMS.slice(0, 8)
    : ALL_ITEMS.filter(item => {
        const q = query.toLowerCase()
        return item.keywords.includes(q) || item.title.toLowerCase().includes(q)
      }).slice(0, 10)

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      e.preventDefault()
      navigateTo(results[selectedIdx])
    }
  }, [results, selectedIdx])

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIdx]
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIdx])

  const navigateTo = (item) => {
    setOpen(false)
    navigate(item.path)
  }

  if (!open) return null

  return (
    <div className="cmd-palette-overlay" onClick={() => setOpen(false)}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <svg className="cmd-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="cmd-input"
            type="text"
            placeholder="Search articles, pages, showcase..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0) }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="cmd-kbd">ESC</kbd>
        </div>

        <div className="cmd-results" ref={listRef}>
          {results.length === 0 && (
            <div className="cmd-empty">No results for "{query}"</div>
          )}
          {results.map((item, i) => (
            <button
              key={`${item.type}-${item.title}-${i}`}
              className={`cmd-result ${i === selectedIdx ? 'active' : ''}`}
              onClick={() => navigateTo(item)}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              <span className="cmd-result-icon">{TYPE_ICONS[item.type]}</span>
              <div className="cmd-result-text">
                <span className="cmd-result-title">{item.title}</span>
                <span className="cmd-result-sub">{item.subtitle}</span>
              </div>
              <span className="cmd-result-type">{item.type}</span>
            </button>
          ))}
        </div>

        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>esc</kbd> Close</span>
        </div>
      </div>
    </div>
  )
}
