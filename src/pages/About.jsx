import { Link } from 'react-router-dom'
import { DOMAINS, PILLARS } from '../data/index'

export default function About() {
  return <div className="journal-about journal-container">
    <header className="editorial-heading">
      <Link to="/" className="journal-breadcrumb">Home / About</Link>
      <span className="journal-kicker">The person behind the notes</span>
      <h1>A builder.<br />An observer.<br /><em>Always a student.</em></h1>
    </header>
    <section className="about-introduction" aria-labelledby="about-name">
      <aside className="author-sheet">
        <div className="author-signet" aria-hidden="true"><span>am.</span><svg viewBox="0 0 240 240"><circle cx="120" cy="120" r="105" /><ellipse cx="120" cy="120" rx="105" ry="44" transform="rotate(-40 120 120)" /><circle cx="200" cy="53" r="5" /></svg></div>
        <span className="journal-kicker">Architecture / AI / Craft</span>
        <h2 id="about-name">Alok Mishra</h2>
        <p>Senior Software Architect</p>
        <div className="author-sheet-facts"><span>~20 years <small>building production systems</small></span><span>One enduring question <small>How can we build this better?</small></span></div>
        <a className="journal-text-link" href="https://www.linkedin.com/in/alokmishra6/" target="_blank" rel="noopener noreferrer">Start a conversation <span aria-hidden="true">→</span></a>
      </aside>
      <div className="about-narrative">
        <p className="about-opening">I’m Alok. I build systems.<br />And I write to understand them better.</p>
        <p>I'm a Senior Software Architect with close to two decades of hands-on experience building production systems at scale. My work sits at the intersection of <strong>AI/ML infrastructure</strong>, <strong>cloud-native distributed systems</strong>, and <strong>IoT platforms</strong> that serve millions of devices.</p>
        <p>Currently I focus on designing agentic AI workflows, RAG pipelines, and LLM integrations that go beyond demos into systems that are reliable, auditable, and safe to run autonomously. I care deeply about the architecture that surrounds intelligence — the trust boundaries, the evaluation frameworks, the operational scaffolding.</p>
        <p>Before AI became the centre of gravity, I spent years architecting real-time data platforms, event-driven microservice ecosystems, and large-scale IoT infrastructure across healthcare, industrial, and enterprise domains.</p>
        <Link className="journal-text-link" to="/writing">Spend some time in the notebook <span aria-hidden="true">→</span></Link>
      </div>
    </section>
    <section className="about-perspective journal-section" aria-labelledby="perspective-title">
      <span className="journal-kicker">A working philosophy</span>
      <h2 id="perspective-title">The decisions <em>before the code.</em></h2>
      <blockquote>Great architecture is not about the technologies you choose. It is about the decisions you make before you choose them.</blockquote>
      <p>The most consequential engineering work happens before the first line of code. It lives in the space between a requirement and a design — where the real question is not what to build, but what it will cost to be wrong.</p>
      <p>My practice is grounded in systems thinking: understanding the whole before optimising the parts, designing for change rather than against it, and treating complexity as something to be managed honestly.</p>
      <div className="about-principles">{PILLARS.map(p => <article className="about-principle" key={p.num}><span>{p.num}</span><h3>{p.title}</h3><p>{p.desc}</p></article>)}</div>
    </section>
    <section className="about-domains journal-section" aria-labelledby="domains-title">
      <div className="journal-section-heading"><div><span className="journal-kicker">Where experience becomes perspective</span><h2 id="domains-title">Areas of deep work<span className="gold-period">.</span></h2></div><Link className="journal-text-link" to="/showcase">See the practice <span aria-hidden="true">→</span></Link></div>
      <div className="domain-index">{DOMAINS.map((d, i) => <details key={d.title}><summary><span className="domain-index-number">{String(i + 1).padStart(2, '0')}</span><h3>{d.title}</h3><span className="domain-expand" aria-hidden="true">+</span></summary><p>{d.desc}</p></details>)}</div>
    </section>
  </div>
}
