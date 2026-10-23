import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReader } from '../hooks/useReader'
import { ARTICLES } from '../data/index'
import { JOURNEYS, journeyArticles } from '../data/journeys'

export default function ReadingJourneys() {
  const reader = useReader()
  const [selected, setSelected] = useState(0)
  const journey = JOURNEYS[selected]
  const entries = journeyArticles(journey, ARTICLES)
  const completed = entries.filter(a => reader.reading[a.slug]?.completed).length
  const reasons = ["Start with the core ideas and vocabulary.", "Turn the foundation into practical decisions.", "Examine the consequences and tradeoffs."]
  const minutes = entries.reduce((sum, article) => sum + (parseInt(article.readTime, 10) || 0), 0)
  return <section className="journey-section journal-container" aria-labelledby="journeys-title">
    <div className="journal-section-heading"><div><span className="journal-kicker">A few good places to begin</span><h2 id="journeys-title">Follow a thread<span className="gold-period">.</span></h2></div><span className="journal-side-note">Three essays. A deeper perspective.</span></div>
    <div className="journey-tabs" role="group" aria-label="Choose a reading path">{JOURNEYS.map((j, i) => <button key={j.id} aria-pressed={i === selected} onClick={() => setSelected(i)}><span>0{i + 1}</span>{j.label}</button>)}</div>
    <div className="journey-panel" style={{ '--journey-color': journey.color }}>
      <div className="journey-intro"><div className="journey-glyph" aria-hidden="true"><i /><i /><i /><span>→</span></div><span className="journal-kicker">A curated reading path</span><h3>{journey.title}</h3><p>{journey.description}</p><p className="journey-prerequisite">Suggested background: {journey.id === 'agents' ? 'basic familiarity with LLMs and tool calls.' : journey.id === 'systems' ? 'experience reading or designing software systems.' : 'curiosity about the engineering craft.'}</p><span className="journey-duration">{completed} of {entries.length} read <span aria-hidden="true">·</span> About {minutes} minutes</span></div>
      <ol className="journey-steps">{entries.map((article, i) => <li key={article.slug}><Link to={`/writing/${article.slug}?trail=${journey.id}`}><span className="journey-step-number">0{i + 1}</span><div><span className="journal-kicker">{['Begin here', 'Go deeper', 'Bring it together'][i]}</span><h4>{article.title}</h4><span>{article.readTime}{reader.reading[article.slug]?.completed ? " · ✓ Read" : ""}</span><p className="journey-reason">{reasons[i]}</p></div><span className="journey-step-arrow" aria-hidden="true">→</span></Link></li>)}</ol>
    </div>
  </section>
}
