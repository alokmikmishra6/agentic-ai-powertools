import { Link } from 'react-router-dom'
import SystemLab, { LABS } from '../components/labs/SystemLab'
export default function Labs() {
  return <div className="journal-container labs-page"><header className="editorial-heading"><span className="journal-kicker">The hands-on notebook</span><h1>Less imagining.<br /><em>More experimenting.</em></h1><p>Small, interactive models of the systems behind the essays. Everything runs in your browser.</p></header>{Object.entries(LABS).map(([kind,lab])=><div key={kind} id={kind}><SystemLab kind={kind}/><Link className="journal-text-link" to={`/writing/${lab.slug}`}>Read the thinking behind it <span aria-hidden="true">↗</span></Link></div>)}</div>
}
