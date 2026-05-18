import { useLocation } from 'react-router-dom'
import ImmersiveBackground from '../scenes/ImmersiveBackground'

export default function ParallaxOverlays() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === ''
  if (!isHome) return null
  return <ImmersiveBackground />
}
