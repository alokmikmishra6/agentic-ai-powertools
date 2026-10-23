import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import { searchPassage } from '../lib/article-content'
import { ARTICLES } from '../data/index'
import ArticleCard from '../components/ArticleCard'
import { TOPICS, findArticles } from '../lib/articles'

export default function Writing() {
  const [params, setParams] = useSearchParams()
  const [bodies, setBodies] = useState({})
  const [searchState, setSearchState] = useState('idle')
  const [retry, setRetry] = useState(0)
  const requestedTopic = params.get('topic') || 'All'
  const topic = TOPICS.some(t => t.name === requestedTopic) ? requestedTopic : 'All'
  const query = params.get('q') || ''
  const view = params.get('view') === 'list' ? 'list' : 'grid'
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest'
  const maxMinutes = ['5','10','15'].includes(params.get('minutes')) ? Number(params.get('minutes')) : 0
  const formats = ['Concept','Deep dive','Implementation','Perspective']
  const format = formats.includes(params.get('format')) ? params.get('format') : 'All'
  useEffect(() => {
    if (!query.trim() || Object.keys(bodies).length) return
    let cancelled = false
    setSearchState('loading')
    import('../data/search-index.json').then(module => { if (!cancelled) { setBodies(module.default); setSearchState('ready') } }).catch(() => { if (!cancelled) setSearchState('error') })
    return () => { cancelled = true }
  }, [query, retry, bodies])
  const filtered = findArticles(ARTICLES, { topic, query, sort, maxMinutes, format, bodies })
  const page = Math.max(1, Math.min(Math.ceil(filtered.length / 9) || 1, Number.parseInt(params.get('page'), 10) || 1))
  const visible = filtered.slice(0, page * 9)
  function update(key, value) {
    setParams(previous => {
      const next = new URLSearchParams(previous)
      if (value && value !== 'All') next.set(key, value); else next.delete(key)
      if (key !== 'page' && key !== 'view') next.delete('page')
      return next
    }, { replace: key === 'q' })
  }
  return (
    <div className="journal-library journal-container">
      <header className="journal-library-heading">
        <Link to="/" className="journal-breadcrumb">Home <span aria-hidden="true">/</span> The writing</Link>
        <span className="journal-kicker">The collected notes / {ARTICLES.length} essays</span>
        <h1>A little deeper.<br /><em>A little clearer.</em></h1>
        <p>Ideas, patterns, and hard-earned lessons on building intelligent systems. Pick a thread. Follow your curiosity.</p>
      </header>
      <div className="library-controls">
        <div className="library-topics" role="group" aria-label="Filter by topic">
          {['All', ...TOPICS.map(t => t.name)].map(name => <button key={name} aria-pressed={topic === name} onClick={() => update('topic', name)}>{name === 'All' ? 'All writing' : name}<span>{name === 'All' ? ARTICLES.length : ARTICLES.filter(a => a.category === name).length}</span></button>)}
        </div>
        <div className="library-tools">
          <label className="library-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg><span className="sr-only">Search articles</span><input type="search" value={query} onChange={event => update('q', event.target.value)} placeholder="Search an idea, topic, or title…" /></label>
          <label className="library-sort"><span className="sr-only">Sort articles</span><select value={sort} onChange={event => update('sort', event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
          <div className="library-view" role="group" aria-label="Article layout"><button aria-pressed={view === 'grid'} onClick={() => update('view', 'grid')}><span aria-hidden="true">▦</span> Gallery</button><button aria-pressed={view === 'list'} onClick={() => update('view', 'list')}><span aria-hidden="true">☰</span> List</button></div>
        </div>
      </div>
      <div className="library-extra-filters"><label>Time available<select value={maxMinutes} onChange={e=>update('minutes', e.target.value==='0'?'':e.target.value)}><option value="0">Any length</option><option value="5">Up to 5 minutes</option><option value="10">Up to 10 minutes</option><option value="15">Up to 15 minutes</option></select></label><label>Kind of reading<select value={format} onChange={e=>update('format',e.target.value)}><option>All</option>{formats.map(f=><option key={f}>{f}</option>)}</select></label><RouterLink className="journal-text-link" to="/saved">Your saved essays →</RouterLink></div>
      {query && searchState==='loading' && <p role="status" className="feature-note">Searching inside the essays…</p>}
      {query && searchState==='error' && <p role="status" className="feature-note">Showing title and summary matches. Full-text search couldn’t load. <button onClick={()=>setRetry(v=>v+1)}>Retry</button></p>}
      <div className="library-results-line" aria-live="polite"><span>{filtered.length} {filtered.length === 1 ? 'essay' : 'essays'}{topic !== 'All' ? ` on ${topic}` : ' to explore'}{query ? ` matching “${query}”` : ''}</span><span>Take your time. Good ideas reward it.</span></div>
      {filtered.length ? <div className={`journal-grid ${view === 'list' ? 'journal-list' : ''}`}>{visible.map((article, index) => <ArticleCard key={article.slug} article={article} number={index + 1} passage={query ? searchPassage(bodies[article.slug] || "", query) : undefined} />)}</div> : <div className="library-empty"><span aria-hidden="true">⌕</span><h2>No essays found.</h2><p>Try a broader phrase or explore a different topic.</p><button className="journal-button" onClick={() => setParams({})}>Show all writing →</button></div>}
      {visible.length < filtered.length && <div className="library-load-more"><button className="journal-button journal-button-outline" onClick={() => update('page', String(page + 1))}>More from the notebook <span aria-hidden="true">↓</span></button><p>Showing {visible.length} of {filtered.length} essays</p></div>}
    </div>
  )
}
