import { useState } from 'react'
import { recoveryTrace, chunkWords, tokenBudget } from '../../lib/labs'
const STEPS = ['Plan', 'Retrieve', 'Draft', 'Review', 'Finish']
export const LABS = {
  recovery: { title: 'Make an agent fail. Then recover.', subtitle: 'See what a checkpoint saves when execution stops halfway.', slug: 'agents-survive-failure-checkpointing' },
  chunking: { title: 'Find the boundary of an idea.', subtitle: 'Explore how chunk size and overlap change the context available to retrieval.', slug: 'rag-knowledge-architecture' },
  budget: { title: 'Give your workflow a token budget.', subtitle: 'Adjust workload assumptions and see the effect before making an API call.', slug: 'token-economy-agentic-systems' },
}
function Recovery() {
  const [failure, setFailure] = useState(3)
  const [checkpoint, setCheckpoint] = useState(true)
  const [phase, setPhase] = useState('ready')
  const trace = recoveryTrace(failure, checkpoint)
  return <><div className="lab-controls"><label>Fail during<select value={failure} onChange={e => { setFailure(Number(e.target.value)); setPhase('ready') }}>{STEPS.map((step,i) => <option key={step} value={i+1}>{step}</option>)}</select></label><label className="lab-check"><input type="checkbox" checked={checkpoint} onChange={e => { setCheckpoint(e.target.checked); setPhase('ready') }} />Save a checkpoint after each completed step</label></div>
    <ol className="lab-pipeline">{STEPS.map((step,i) => <li key={step} className={phase === 'recovered' ? 'done' : phase === 'failed' && i + 1 === failure ? 'failed' : phase === 'failed' && i + 1 < failure ? 'done' : ''}><span>0{i+1}</span>{step}<small>{phase === 'recovered' ? 'Complete' : phase === 'failed' && i+1 === failure ? 'Interrupted' : phase === 'failed' && i+1 < failure ? 'Complete' : 'Waiting'}</small></li>)}</ol>
    <div className="lab-actions"><button className="journal-button" onClick={() => setPhase(phase === 'failed' ? 'recovered' : 'failed')}>{phase === 'failed' ? 'Recover execution →' : 'Run and inject failure →'}</button><button className="journal-text-link" onClick={() => setPhase('ready')}>Reset</button></div>
    <div className="lab-result" role="status">{phase === 'ready' ? 'The workflow is ready. Choose a failure point, then run it.' : phase === 'failed' ? `Execution stopped during ${STEPS[failure-1]}. ${checkpoint ? `${failure-1} completed steps are checkpointed.` : 'No durable state is available.'}` : `${trace.attempts} total step attempts. ${trace.repeatedCompleted} already-completed steps repeated. Recovery starts at ${STEPS[trace.after[0]-1]}.`}</div><p className="lab-note">Deterministic simulation. The interrupted step runs again; real side effects also need idempotency.</p></>
}
const SAMPLE = 'An agent begins with a plan. Each tool call changes the world around it. A checkpoint records the state after a completed step so the workflow can recover from an interruption. Recovery is only safe when repeated actions are idempotent. A payment request needs a stable operation identifier. A document write needs a version check. Retrieval has a related problem: a small fragment can lose the context that makes its meaning clear. Overlapping chunks preserve some neighboring words, while larger chunks carry more context at the cost of additional processing.'
function Chunking() {
  const [size, setSize] = useState(24), [overlap, setOverlap] = useState(5)
  const chunks = chunkWords(SAMPLE, size, overlap)
  return <><div className="lab-controls"><label>Chunk size · {size} words<input type="range" min="12" max="48" value={size} onChange={e=>setSize(Number(e.target.value))} /></label><label>Overlap · {overlap} words<input type="range" min="0" max="10" value={overlap} onChange={e=>setOverlap(Number(e.target.value))} /></label></div><p className="lab-result" role="status">{chunks.length} chunks · {chunks.reduce((sum,c)=>sum+c.words.length,0)} words indexed · highlighted words repeat from the preceding chunk.</p><div className="lab-chunks">{chunks.map((chunk,i)=><div key={chunk.start}><span>CHUNK {i+1}</span><p>{chunk.words.map((word,j)=>j<chunk.shared?<mark key={j}>{word} </mark>:word+' ')}</p></div>)}</div><p className="lab-note">This demonstration splits on words, not model tokens or semantic boundaries. It illustrates context duplication; it does not measure retrieval quality.</p></>
}
function Budget() {
  const [values, setValues] = useState({ requests: 1000, input: 3000, output: 500, inputRate: 1, outputRate: 5, cache: 30 })
  const result = tokenBudget(values)
  const fields = [['requests','Requests per day'],['input','Input tokens / request'],['output','Output tokens / request'],['inputRate','Input price / million tokens ($)'],['outputRate','Output price / million tokens ($)']]
  return <><div className="lab-budget-inputs">{fields.map(([key,label])=><label key={key}>{label}<input type="number" min="0" max={key.includes('Rate')?10000:1e9} step={key.includes('Rate')?.01:1} value={values[key]} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))} /></label>)}</div><label className="lab-range">Input tokens eliminated by reuse · {values.cache}%<input type="range" min="0" max="100" value={values.cache} onChange={e=>setValues(v=>({...v,cache:Number(e.target.value)}))} /></label><div className="lab-metrics" aria-live="polite"><div><strong>${result.daily.toFixed(2)}</strong><span>per day</span></div><div><strong>${result.monthly.toFixed(2)}</strong><span>per 30-day month</span></div><div><strong>${result.saved.toFixed(2)}</strong><span>daily reduction</span></div></div><p className="lab-note">Illustrative rates, not current provider prices. Assumes reused input tokens incur no charge. Excludes retries, tools, and infrastructure. No API calls are made.</p></>
}
export default function SystemLab({ kind }) {
  const lab = LABS[kind]
  if (!lab) return null
  return <section className="system-lab" aria-label={lab.title}><div className="journal-kicker">Try the idea / Interactive lab</div><h2>{lab.title}</h2><p className="lab-intro">{lab.subtitle}</p>{kind==='recovery'?<Recovery/>:kind==='chunking'?<Chunking/>:<Budget/>}</section>
}
