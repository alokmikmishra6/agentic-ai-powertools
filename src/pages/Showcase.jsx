import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProjectResources from '../components/ProjectResources'
import CodeBlock from '../components/CodeBlock'
import { PROJECTS } from '../lib/showcase'

export default function Showcase() {
  const [params, setParams] = useSearchParams()
  const titleRef = useRef(null)
  const item = PROJECTS.find(s => s.slug === params.get('project')) || PROJECTS[0]
  function selectProject(slug) {
    setParams({ project: slug })
    requestAnimationFrame(() => {
      const title = titleRef.current
      title?.focus({ preventScroll: true })
      if (title && (title.getBoundingClientRect().top < 100 || title.getBoundingClientRect().top > window.innerHeight)) title.scrollIntoView({ block: 'start', behavior: 'instant' })
    })
  }
  if (!item) return <div className="journal-container journal-not-found"><h1>More work is on the way.</h1><Link to="/writing">Explore the writing →</Link></div>
  return <div className="journal-showcase journal-container">
    <header className="editorial-heading">
      <Link to="/" className="journal-breadcrumb">Home / Showcase</Link>
      <span className="journal-kicker">Engineering in practice / {PROJECTS.length} explorations</span>
      <h1>Ideas, with<br /><em>their sleeves rolled up.</em></h1>
      <p>Architecture walkthroughs, implementation patterns, and lessons from building intelligent systems.</p>
    </header>
    <div className="project-workbench">
      <aside className="project-index">
        <span className="journal-kicker">Inside the workshop</span>
        <label className="project-mobile-select"><span>Choose a project</span><select value={item.slug} onChange={e => selectProject(e.target.value)}>{PROJECTS.map(project => <option key={project.slug} value={project.slug}>{project.title}</option>)}</select></label>
        <div className="project-index-list" role="group" aria-label="Choose a project">{PROJECTS.map((s, i) => <button key={s.slug} aria-pressed={item.slug === s.slug} onClick={() => selectProject(s.slug)}><span>{String(i + 1).padStart(2, '0')}</span><span>{s.title}<small>{s.tag}</small></span><span aria-hidden="true">↗</span></button>)}</div>
      </aside>
      <article className="project-detail" key={item.slug}>
        <header className="showcase-header"><span className="journal-kicker">{item.tag}</span><h2 className="showcase-title" ref={titleRef} tabIndex={-1}>{item.title}</h2></header>
        {item.problem && <div className="showcase-block"><h3 className="showcase-block-label">01 / The idea</h3><p className="showcase-block-text">{item.problem}</p></div>}
        {item.approach && <div className="showcase-block"><h3 className="showcase-block-label">The approach</h3><p className="showcase-block-text">{item.approach}</p></div>}
        {item.architecture && <div className="showcase-block"><h3 className="showcase-block-label">The architecture</h3><div className="project-diagram-frame" tabIndex={0} role="region" aria-label="Architecture diagram, scroll horizontally if needed"><div className="showcase-diagram" dangerouslySetInnerHTML={{ __html: item.architecture }} /></div></div>}
        {item.code && <details className="project-code-disclosure"><summary>Explore the implementation <span>{item.lang || 'python'} <b aria-hidden="true">+</b></span></summary><CodeBlock code={item.code} lang={item.lang} /></details>}
        {item.runInstructions && <details className="project-code-disclosure"><summary>Run it yourself <span>bash <b aria-hidden="true">+</b></span></summary><CodeBlock code={item.runInstructions} lang="bash" /></details>}
        <div className="showcase-outcomes-grid">
          {!!item.outcomes.length && <div className="showcase-block"><h3 className="showcase-block-label">Outcomes</h3><ul className="showcase-list showcase-list--outcomes">{item.outcomes.map((o, i) => <li key={i}>{o}</li>)}</ul></div>}
          {!!item.lessons.length && <div className="showcase-block"><h3 className="showcase-block-label">Lessons learned</h3><ul className="showcase-list showcase-list--lessons">{item.lessons.map((l, i) => <li key={i}>{l}</li>)}</ul></div>}
        </div>
        <ProjectResources project={item} />
        <Link className="journal-text-link" to="/writing">Explore the thinking behind the work <span aria-hidden="true">↗</span></Link>
      </article>
    </div>
  </div>
}
