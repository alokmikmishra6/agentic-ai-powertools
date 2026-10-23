import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/index'
import { useReader, readerAction } from '../hooks/useReader'
import ArticleCard from '../components/ArticleCard'
export default function Saved() {
  const reader = useReader()
  const saved = ARTICLES.filter(a => reader.saved.includes(a.slug))
  const continuing = ARTICLES.filter(a => reader.reading[a.slug]?.progress > .03 && !reader.reading[a.slug]?.completed).sort((a,b) => reader.reading[b.slug].updatedAt - reader.reading[a.slug].updatedAt)
  return <div className="journal-container reader-shelf"><header className="editorial-heading"><span className="journal-kicker">Your reading corner</span><h1>Keep a few<br /><em>good ideas close.</em></h1><p>Your saved essays and reading progress stay in this browser. No account required.</p></header>
    {!!continuing.length && <section className="shelf-section"><h2>Pick up the thread</h2>{continuing.map(a => <Link className="shelf-resume" key={a.slug} to={`/writing/${a.slug}`}><span>{a.title}</span><span>{Math.round(reader.reading[a.slug].progress * 100)}% read ↗</span></Link>)}</section>}
    <section className="shelf-section"><h2>Saved for a quieter moment <span>{saved.length}</span></h2>{saved.length ? <div className="journal-grid">{saved.map((a,i) => <ArticleCard key={a.slug} article={a} number={i+1} />)}</div> : <div className="library-empty"><p>Save an essay from the library or while reading. It will be waiting here.</p><Link className="journal-button" to="/writing">Find an essay ↗</Link></div>}</section>
    {(reader.saved.length > 0 || Object.keys(reader.reading).length > 0) && <details className="reader-data"><summary>Manage this browser’s reading data</summary><p>Clearing removes saved essays, progress, and completed marks from this browser.</p><button className="journal-text-link" onClick={() => readerAction({type:'clear'})}>Clear reading data</button></details>}
  </div>
}
