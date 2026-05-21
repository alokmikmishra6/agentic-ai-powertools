import { useLocation } from 'react-router-dom'

export default function ParallaxOverlays() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === ''
  if (!isHome) return null

  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-orb ambient-orb--1" />
      <div className="ambient-orb ambient-orb--2" />
      <div className="ambient-orb ambient-orb--3" />
      <div className="ambient-noise" />
    </div>
  )
}
