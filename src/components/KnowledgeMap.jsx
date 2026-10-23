import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/index'
import { CONNECTIONS } from '../data/editorial'
const roots = ['invisible-architecture-agentic-workflow','five-questions-system-design','rag-knowledge-architecture','knowing-vs-understanding-system']
const names = ['Reliable agents','Design decisions','Living knowledge','Engineering judgment']
export default function KnowledgeMap() {
  const [selected,setSelected] = useState(roots[0])
  const root = ARTICLES.find(a=>a.slug===selected)
  const connections = CONNECTIONS.filter(edge=>edge.from===selected || edge.to===selected)
  return <section className="knowledge-map journal-container" aria-labelledby="knowledge-title"><div className="journal-section-heading"><div><span className="journal-kicker">Ideas have neighbors</span><h2 id="knowledge-title">See the connections<span className="gold-period">.</span></h2></div></div><div className="knowledge-topics" role="group" aria-label="Choose a starting idea">{roots.map((slug,i)=><button key={slug} aria-pressed={selected===slug} onClick={()=>setSelected(slug)}>{names[i]}</button>)}</div><div className="knowledge-network"><div className="knowledge-root"><span className="journal-kicker">The idea in focus</span><Link to={`/writing/${root.slug}`}>{root.title} →</Link><p>{root.excerpt}</p></div><ul>{connections.map(edge=>{const slug=edge.from===selected?edge.to:edge.from;const a=ARTICLES.find(item=>item.slug===slug);return <li key={slug}><span className="knowledge-relationship">{edge.label}</span><Link to={`/writing/${slug}`}>{a.title} <span aria-hidden="true">→</span></Link><button onClick={()=>setSelected(slug)}>Explore its connections →</button></li>})}</ul></div><p className="feature-note">Connections are editorially selected to explain how one essay builds on another.</p></section>
}
