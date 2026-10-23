import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ARTICLES } from '../data/index'
import { PROJECTS } from '../data/index'

const ITEMS = [
  ...ARTICLES.map(a => ({ type: 'Essay', title: a.title, subtitle: `${a.category} · ${a.readTime}`, path: `/writing/${a.slug}`, text: `${a.title} ${a.category} ${a.excerpt} ${(a.tags || []).join(' ')}` })),
  ...PROJECTS.map(s => ({ type: 'Project', title: s.title, subtitle: s.tag, path: `/showcase?project=${encodeURIComponent(s.slug)}`, text: `${s.title} ${s.tag} ${s.problem}` })),
  ...['Writing', 'Showcase', 'Thinking', 'About', 'Saved', 'Labs'].map(title => ({ type: 'Page', title, subtitle: 'Explore the site', path: `/${title.toLowerCase()}`, text: title })),
]
export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  const navigate = useNavigate()
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const results = ITEMS.filter(item => terms.every(term => item.text.toLowerCase().includes(term))).slice(0, 8)
  useEffect(() => {
    const trigger = () => setOpen(true)
    const shortcut = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setOpen(value => !value)
      }
    }
    window.addEventListener('journal:search', trigger)
    window.addEventListener('keydown', shortcut)
    return () => { window.removeEventListener('journal:search', trigger); window.removeEventListener('keydown', shortcut) }
  }, [])
  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const main = document.getElementById('main-content')
    const header = document.querySelector('.journal-header')
    const footer = document.querySelector('footer')
    const background = [main, header, footer, ...document.querySelectorAll('.article-toc, .toc-backdrop')].filter(Boolean)
    const previousInert = background.map(element => element.inert)
    background.forEach(element => { element.inert = true })
    document.body.style.overflow = 'hidden'
    setQuery(''); setSelected(0)
    inputRef.current?.focus()
    return () => {
      background.forEach((element, index) => { element.inert = previousInert[index] })
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open])
  useEffect(() => {
    if (open) document.getElementById(`search-result-${selected}`)?.scrollIntoView({ block: 'nearest' })
  }, [selected, open])
  function openResult(item) { setOpen(false); navigate(item.path) }
  function onKeyDown(event) {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false) }
    if (event.key === 'Tab') {
      const nodes = [...dialogRef.current.querySelectorAll('button, input')].filter(node => !node.disabled)
      const first = nodes[0], last = nodes.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
  }
  if (!open) return null
  return <div className="cmd-palette-overlay" onClick={() => setOpen(false)}>
    <div className="cmd-palette" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="search-title" onClick={e => e.stopPropagation()} onKeyDown={onKeyDown}>
      <div className="journal-search-heading"><h2 id="search-title">Find a thread.</h2><button aria-label="Close search" onClick={() => setOpen(false)}>Close ×</button></div>
      <div className="cmd-input-wrap"><input ref={inputRef} className="cmd-input" type="search" aria-label="Search writing and projects" placeholder="An idea, a pattern, a question…" value={query} onChange={e => { setQuery(e.target.value); setSelected(0) }} onKeyDown={e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setSelected(i => Math.max(0, Math.min(results.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))) }
        if (e.key === 'Enter' && results[selected]) { e.preventDefault(); openResult(results[selected]) }
      }} aria-describedby="search-selection" /></div>
      <span id="search-selection" className="sr-only" aria-live="polite">{results.length ? `${results.length} results. Selected: ${results[selected]?.title || results[0].title}` : 'No results'}</span>
      <div className="cmd-results">{!results.length && <div className="cmd-empty">No matches. Try a broader topic, like architecture or agents.</div>}{results.map((item, i) => <button id={`search-result-${i}`} key={item.path} className={`cmd-result ${selected === i ? 'active' : ''}`} onClick={() => openResult(item)} onMouseEnter={() => setSelected(i)}><span className="cmd-result-text"><span className="cmd-result-title">{item.title}</span><span className="cmd-result-sub">{item.subtitle}</span></span><span className="cmd-result-type">{item.type} ↗</span></button>)}</div>
      <Link className="search-full-link" to={`/writing?q=${encodeURIComponent(query)}`} onClick={() => setOpen(false)}>Search inside all essays ↗</Link>
      <div className="cmd-footer"><span>↑ ↓ to explore</span><span>Enter to read</span><span>Esc to close</span></div>
    </div>
  </div>
}
