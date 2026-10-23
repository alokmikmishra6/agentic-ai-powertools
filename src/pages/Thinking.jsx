import { Link, useSearchParams } from 'react-router-dom'
import { THINKING } from '../data/index'
import { orderedInquiries, selectInquiry } from '../lib/thinking'

const inquiries = orderedInquiries(THINKING)
const current = inquiries.filter(item => item.status !== 'archived')
const archived = inquiries.filter(item => item.status === 'archived')
const topics = { ai: 'AI Systems', cl: 'Architecture', sys: 'Architecture' }
const dateLabel = date => new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export default function Thinking() {
  const [params, setParams] = useSearchParams()
  const focus = selectInquiry(inquiries, params.get('idea'))
  const isArchived = focus?.status === 'archived'
  const buttons = items => items.map((item, index) => <button key={item.slug} aria-pressed={focus?.slug === item.slug} onClick={() => setParams({ idea: item.slug })}><span>{String(index + 1).padStart(2, '0')}</span><span>{item.sidebarText}</span><span aria-hidden="true">→</span></button>)
  return <div className="journal-thinking journal-container">
    <header className="editorial-heading">
      <Link to="/" className="journal-breadcrumb">Home / Thinking</Link>
      <span className="journal-kicker"><span className="status-spark" /> The open notebook</span>
      <h1>Good questions.<br /><em>Unfinished answers.</em></h1>
      <p>Current questions about agent memory, engineering judgment, and the evidence behind automated work.</p>
    </header>
    {focus && <section className="inquiry-layout" aria-label="Current and archived inquiries">
      <div className="inquiry-index"><span className="journal-kicker">On my mind / {String(current.length).padStart(2, '0')}</span><div role="group" aria-label="Choose a current inquiry">{buttons(current)}</div><p>A place for questions that deserve more than a quick answer.</p>
        {!!archived.length && <details className="inquiry-archive" open={isArchived}><summary>Earlier questions / {archived.length}</summary><p>Kept for reference, no longer on the active list.</p><div role="group" aria-label="Choose an archived inquiry">{buttons(archived)}</div></details>}
      </div>
      <article className="inquiry-card" key={focus.slug}>
        <div className="inquiry-card-top"><span className="journal-kicker">{focus.tag}</span><span>{isArchived ? 'ARCHIVED' : focus.featured ? 'FEATURED INQUIRY' : 'OPEN INQUIRY'}</span></div>
        {focus.date && <time className="inquiry-date" dateTime={focus.date}>{dateLabel(focus.date)}</time>}
        <span className="inquiry-mark" aria-hidden="true">{isArchived ? '→' : '?'}</span>
        <h2>{focus.title}</h2>{focus.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {isArchived && <p className="inquiry-archive-note">{focus.archiveNote || 'This entry has moved out of the active notebook.'}</p>}
        <div className="inquiry-card-footer"><span>{isArchived ? 'From the earlier notebook.' : 'Still exploring.'}</span><Link className="journal-text-link" to={focus.relatedWriting ? '/writing/' + focus.relatedWriting : '/writing?topic=' + encodeURIComponent(topics[focus.tagClass] || 'Architecture')}>{isArchived ? 'Continue in the writing' : 'Related writing'} <span aria-hidden="true">→</span></Link></div>
      </article>
    </section>}
    <div className="thinking-invitation"><span className="journal-kicker">Thinking is better together</span><p>What are you seeing differently?</p><a className="journal-text-link" href="https://www.linkedin.com/in/alokmishra6/" target="_blank" rel="noopener noreferrer">Let’s compare notes <span aria-hidden="true">→</span></a></div>
  </div>
}
