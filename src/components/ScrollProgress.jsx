import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setProgress(maxScroll > 0 ? scrollY / maxScroll : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Vertical progress line — right edge */}
      <div className="scroll-progress-track">
        <div className="scroll-progress-fill" style={{ height: `${progress * 100}%` }} />
        <div className="scroll-progress-dot" style={{ top: `${progress * 100}%` }} />
      </div>
      {/* Percentage counter in nav area */}
      <div className="scroll-progress-pct" style={{ opacity: progress > 0.01 ? 1 : 0 }}>
        <span>{Math.round(progress * 100).toString().padStart(2, '0')}</span>%
      </div>
    </>
  )
}
