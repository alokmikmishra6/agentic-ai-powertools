import { useEffect, useState } from 'react'

function preference(name) {
  try { return typeof window !== 'undefined' && window.localStorage.getItem(`journal-reader-${name}`) === 'true' }
  catch { return false }
}

export default function ReadingControls() {
  const [large, setLarge] = useState(() => preference('large'))
  const [paper, setPaper] = useState(() => preference('paper'))
  const [copyStatus, setCopyStatus] = useState('')
  useEffect(() => {
    document.body.classList.toggle('reading-paper', paper)
    document.body.classList.toggle('reading-large', large)
    try {
      window.localStorage.setItem('journal-reader-large', String(large))
      window.localStorage.setItem('journal-reader-paper', String(paper))
    } catch { /* Reading preferences still work when storage is unavailable. */ }
    return () => { document.body.classList.remove('reading-paper', 'reading-large') }
  }, [paper, large])
  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.origin + window.location.pathname + window.location.hash); setCopyStatus('Link copied') }
    catch { setCopyStatus('Copy the address from your browser to share.') }
  }
  return <div className="reader-toolbar" role="group" aria-label="Reading preferences">
    <span>Make yourself comfortable</span>
    <div><button aria-pressed={large} onClick={() => setLarge(!large)} aria-label="Larger reading text">Aa <span>{large ? 'Larger' : 'Default'}</span></button><button aria-pressed={paper} onClick={() => setPaper(!paper)}>{paper ? '☾ Dark' : '☀ Paper'}</button><button onClick={copyLink}>Copy link</button></div>
    {copyStatus && <span className="reader-copy-status" role="status">{copyStatus}</span>}
  </div>
}
