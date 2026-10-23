import { useEffect, useRef, useState } from 'react'
import { readerAction, useReader } from '../hooks/useReader'
export default function ReadingMemory({ slug }) {
  const reader = useReader()
  const [resume, setResume] = useState(() => reader.reading[slug])
  const completed = reader.reading[slug]?.completed || false
  const latest = useRef(null)
  useEffect(() => {
    const body = document.querySelector('.article-body')
    if (!body) return
    let timer
    const capture = () => {
      const rect = body.getBoundingClientRect()
      if (rect.top > window.innerHeight * .6 || rect.bottom < 0) return
      const headings = [...body.querySelectorAll('h2[id], h3[id], h4[id]')]
      const section = headings.filter(h => h.getBoundingClientRect().top <= 180).at(-1)?.id || ''
      const progress = Math.max(0, Math.min(1, (window.innerHeight * .3 - rect.top) / Math.max(1, rect.height)))
      latest.current = { section, progress }
    }
    const save = () => { if (latest.current) readerAction({ type: 'progress', slug, entry: latest.current }) }
    const onScroll = () => { capture(); if (!timer) timer = setTimeout(() => { timer = null; save() }, 1200) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', save)
    return () => { clearTimeout(timer); save(); window.removeEventListener('scroll', onScroll); window.removeEventListener('pagehide', save) }
  }, [slug])
  function continueReading() {
    const target = document.getElementById(resume?.section) || document.querySelector('.article-body')
    target?.scrollIntoView({ block: 'start', behavior: 'instant' })
    if (target && !resume?.section) window.scrollBy(0, target.getBoundingClientRect().height * (resume?.progress || 0))
    target?.setAttribute('tabindex', '-1'); target?.focus({ preventScroll: true }); setResume(null)
  }
  return <div className="reading-memory">
    {resume && resume.progress > .03 && !resume.completed && <button className="journal-text-link" onClick={continueReading}>Continue where you left off · {Math.round(resume.progress * 100)}% <span aria-hidden="true">→</span></button>}
    <button className="reading-complete" aria-pressed={completed} onClick={() => readerAction({ type: 'progress', slug, entry: { completed: !completed } })}>{completed ? '✓ Read — mark unread' : 'Mark as read'}</button>
    <span>Saved on this browser</span>
  </div>
}
