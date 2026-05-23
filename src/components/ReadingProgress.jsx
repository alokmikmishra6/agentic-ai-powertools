import { useState, useEffect } from 'react'

/**
 * Floating reading progress indicator that shows:
 * - Scroll % through the article
 * - Estimated time remaining
 */
export default function ReadingProgress({ readTime }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const articleEl = document.querySelector('.article-body')
    if (!articleEl) return

    const calculate = () => {
      const rect = articleEl.getBoundingClientRect()
      const articleTop = rect.top + window.scrollY
      const articleHeight = rect.height
      const scrolled = window.scrollY - articleTop + window.innerHeight * 0.3

      const pct = Math.max(0, Math.min(scrolled / articleHeight, 1))
      setProgress(pct)
      // Show after scrolling into article, hide when done
      setVisible(pct > 0.02 && pct < 0.98)
    }

    // Debounce scroll
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { calculate(); ticking = false })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    calculate()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Parse readTime string to get minutes
  const totalMinutes = parseInt(readTime) || 8
  const minutesDone = Math.max(0, Math.floor(totalMinutes * progress))
  const minutesLeft = Math.max(1, Math.ceil(totalMinutes * (1 - progress)))

  if (!visible) return null

  return (
    <div className="reading-progress-float">
      <div className="reading-progress-ring">
        <svg viewBox="0 0 36 36" width="32" height="32">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <circle
            cx="18" cy="18" r="15.5"
            fill="none"
            stroke="#d4b896"
            strokeWidth="2"
            strokeDasharray={`${progress * 97.4} 97.4`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <span className="reading-progress-pct">{Math.round(progress * 100)}%</span>
      </div>
      <div className="reading-progress-info">
        <span className="reading-progress-time">{minutesDone} of {totalMinutes} min</span>
        <span className="reading-progress-remaining">{minutesLeft} min left</span>
      </div>
    </div>
  )
}
