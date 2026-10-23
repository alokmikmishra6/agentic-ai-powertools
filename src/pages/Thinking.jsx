import { Link, useSearchParams } from 'react-router-dom'
import { THINKING } from '../data/index'

// The source includes repeated entries; show each distinct inquiry once.
const inquiries = THINKING.filter((item, index, all) => all.findIndex(other => other.title === item.title && other.body === item.body) === index)
const topics = { ai: 'AI Systems', cl: 'Architecture', sys: 'Architecture' }

export default function Thinking() {
  const [params, setParams] = useSearchParams()
  const requested = Number(params.get('idea'))
  const selected = Number.isInteger(requested) && requested >= 1 && requested <= inquiries.length ? requested - 1 : 0
  const focus = inquiries[selected]
  return <div className="journal-thinking journal-container">
    <header className="editorial-heading">
      <Link to="/" className="journal-breadcrumb">Home / Thinking</Link>
      <span className="journal-kicker"><span className="status-spark" /> The open notebook</span>
      <h1>Good questions.<br /><em>Unfinished answers.</em></h1>
      <p>What I’m thinking about at the intersection of architecture, AI systems, and the craft of building software.</p>
    </header>
    <section className="inquiry-layout" aria-label="Current inquiries">
      <div className="inquiry-index"><span className="journal-kicker">On my mind / {String(inquiries.length).padStart(2, '0')}</span><div role="group" aria-label="Choose an inquiry">{inquiries.map((item, index) => <button key={item.title} aria-pressed={selected === index} onClick={() => setParams({ idea: String(index + 1) })}><span>0{index + 1}</span><span>{item.sidebarText}</span><span aria-hidden="true">↗</span></button>)}</div><p>A place for questions that deserve more than a quick answer.</p></div>
      <article className="inquiry-card" key={selected}>
        <div className="inquiry-card-top"><span className="journal-kicker">{focus.tag}</span><span>INQUIRY / 0{selected + 1}</span></div>
        <span className="inquiry-mark" aria-hidden="true">?</span>
        <h2>{focus.title}</h2><p>{focus.body}</p>
        <div className="inquiry-card-footer"><span>Still exploring.</span><Link className="journal-text-link" to={'/writing?topic=' + encodeURIComponent(topics[focus.tagClass] || 'Architecture')}>Related writing <span aria-hidden="true">↗</span></Link></div>
      </article>
    </section>
    <div className="thinking-invitation"><span className="journal-kicker">Thinking is better together</span><p>What are you seeing differently?</p><a className="journal-text-link" href="https://www.linkedin.com/in/alokmishra6/" target="_blank" rel="noopener noreferrer">Let’s compare notes <span aria-hidden="true">↗</span></a></div>
  </div>
}
