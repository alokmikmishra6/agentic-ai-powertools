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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '1px',
        width: `${progress * 100}%`,
        background: 'rgba(255,255,255,0.6)',
        zIndex: 1000,
        transition: 'width 0.1s linear',
      }}
    />
  )
}
