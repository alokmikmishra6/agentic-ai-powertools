import { useRef, useEffect } from 'react'

/**
 * 3D-style generative cover art using canvas.
 * Creates depth through: perspective grids, 3D orbs with specular highlights,
 * floating geometric solids, volumetric light rays, and bokeh.
 * Deterministic per slug — no animation.
 */

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const PALETTES = {
  'AI Systems':  { bg: '#080818', c1: '#7b6cf0', c2: '#22d3c8', c3: '#a78bfa', accent: '#c4b5fd' },
  'Architecture': { bg: '#081018', c1: '#06b6d4', c2: '#3b82f6', c3: '#67e8f9', accent: '#a5f3fc' },
  'Reflection':  { bg: '#100818', c1: '#e879a0', c2: '#a855f7', c3: '#f0abfc', accent: '#fce7f3' },
  'Leadership':  { bg: '#0f0a04', c1: '#f59e0b', c2: '#ef4444', c3: '#fbbf24', accent: '#fef3c7' },
}
const DEFAULT_PAL = { bg: '#080810', c1: '#7b6cf0', c2: '#22d3c8', c3: '#e879a0', accent: '#e2e8f0' }

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

export default function GenerativeCover({ slug, category, height = 180, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = height

    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const seed = hash(slug || 'default')
    const rand = seededRandom(seed)
    const pal = PALETTES[category] || DEFAULT_PAL

    // ── Background with depth gradient ──
    const bgGrad = ctx.createLinearGradient(0, 0, w, h)
    bgGrad.addColorStop(0, pal.bg)
    bgGrad.addColorStop(1, '#030308')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // ── Perspective grid ──
    const gridVariant = seed % 3
    ctx.save()
    if (gridVariant === 0) {
      const vanishY = h * 0.35
      const vanishX = w * (0.3 + rand() * 0.4)
      ctx.strokeStyle = pal.c1 + '18'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 12; i++) {
        ctx.beginPath()
        ctx.moveTo(w * (i / 12), h)
        ctx.lineTo(vanishX, vanishY)
        ctx.stroke()
      }
      for (let i = 1; i <= 8; i++) {
        const t = i / 8
        const y = h - (h - vanishY) * (t * t)
        const spread = 1 - t * 0.8
        ctx.beginPath()
        ctx.moveTo(vanishX - w * 0.6 * spread, y)
        ctx.lineTo(vanishX + w * 0.6 * spread, y)
        ctx.stroke()
      }
    } else if (gridVariant === 1) {
      const spacing = 30
      ctx.strokeStyle = pal.c2 + '10'
      ctx.lineWidth = 0.4
      for (let i = -20; i < 40; i++) {
        const x1 = i * spacing - h * 0.5
        ctx.beginPath()
        ctx.moveTo(x1, 0)
        ctx.lineTo(x1 + h * 0.5, h)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(w - x1, 0)
        ctx.lineTo(w - x1 - h * 0.5, h)
        ctx.stroke()
      }
    } else {
      const cx = w * (0.4 + rand() * 0.2)
      const cy = h * (0.4 + rand() * 0.2)
      for (let i = 1; i <= 6; i++) {
        ctx.strokeStyle = pal.c1 + Math.round((0.05 + 0.03 * (6 - i)) * 255).toString(16).padStart(2, '0')
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.ellipse(cx, cy, i * 35 * 1.5, i * 35 * 0.7, 0.3, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
    ctx.restore()

    // ── 3D Orbs with specular highlights ──
    const orbCount = 2 + (seed % 3)
    for (let i = 0; i < orbCount; i++) {
      const ox = w * (0.15 + rand() * 0.7)
      const oy = h * (0.2 + rand() * 0.6)
      const or = 20 + rand() * 45
      const color = hexToRgb(i === 0 ? pal.c1 : i === 1 ? pal.c2 : pal.c3)

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.beginPath()
      ctx.ellipse(ox + or * 0.2, oy + or * 0.6, or * 1.1, or * 0.35, 0, 0, Math.PI * 2)
      ctx.fill()

      // Main sphere with 3D gradient
      const grad = ctx.createRadialGradient(ox - or * 0.3, oy - or * 0.3, or * 0.1, ox, oy, or)
      grad.addColorStop(0, `rgba(${Math.min(255, color[0] + 80)},${Math.min(255, color[1] + 80)},${Math.min(255, color[2] + 80)},0.9)`)
      grad.addColorStop(0.5, `rgba(${color[0]},${color[1]},${color[2]},0.7)`)
      grad.addColorStop(0.8, `rgba(${Math.max(0, color[0] - 40)},${Math.max(0, color[1] - 40)},${Math.max(0, color[2] - 40)},0.6)`)
      grad.addColorStop(1, `rgba(${Math.max(0, color[0] - 80)},${Math.max(0, color[1] - 80)},${Math.max(0, color[2] - 80)},0.3)`)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(ox, oy, or, 0, Math.PI * 2)
      ctx.fill()

      // Specular highlight
      const spec = ctx.createRadialGradient(ox - or * 0.35, oy - or * 0.35, 0, ox - or * 0.2, oy - or * 0.2, or * 0.5)
      spec.addColorStop(0, 'rgba(255,255,255,0.7)')
      spec.addColorStop(0.4, 'rgba(255,255,255,0.15)')
      spec.addColorStop(1, 'transparent')
      ctx.fillStyle = spec
      ctx.beginPath()
      ctx.arc(ox, oy, or, 0, Math.PI * 2)
      ctx.fill()

      // Rim light
      const rim = ctx.createRadialGradient(ox + or * 0.4, oy + or * 0.3, or * 0.6, ox, oy, or)
      rim.addColorStop(0, 'transparent')
      rim.addColorStop(0.85, 'transparent')
      rim.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0.4)`)
      ctx.fillStyle = rim
      ctx.beginPath()
      ctx.arc(ox, oy, or, 0, Math.PI * 2)
      ctx.fill()
    }

    // ── Floating 3D geometric shapes ──
    const shapeCount = 3 + (seed % 3)
    for (let i = 0; i < shapeCount; i++) {
      const sx = w * (0.1 + rand() * 0.8)
      const sy = h * (0.1 + rand() * 0.8)
      const size = 12 + rand() * 30
      const rotation = rand() * Math.PI * 2
      const color = hexToRgb(i % 2 === 0 ? pal.c1 : pal.c3)
      const alpha = 0.15 + rand() * 0.25

      ctx.save()
      ctx.translate(sx, sy)
      ctx.rotate(rotation)
      const shapeType = Math.floor(rand() * 3)

      if (shapeType === 0) {
        // Diamond with face shading
        ctx.beginPath()
        ctx.moveTo(0, -size)
        ctx.lineTo(size * 0.6, 0)
        ctx.lineTo(0, size * 0.4)
        ctx.closePath()
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(0, -size)
        ctx.lineTo(-size * 0.6, 0)
        ctx.lineTo(0, size * 0.4)
        ctx.closePath()
        ctx.fillStyle = `rgba(${Math.max(0, color[0] - 40)},${Math.max(0, color[1] - 40)},${Math.max(0, color[2] - 40)},${alpha * 0.7})`
        ctx.fill()
      } else if (shapeType === 1) {
        // Isometric cube
        const s = size * 0.5
        ctx.beginPath()
        ctx.moveTo(0, -s); ctx.lineTo(s, -s * 0.5); ctx.lineTo(0, 0); ctx.lineTo(-s, -s * 0.5)
        ctx.closePath()
        ctx.fillStyle = `rgba(${Math.min(255, color[0] + 30)},${Math.min(255, color[1] + 30)},${Math.min(255, color[2] + 30)},${alpha})`
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(0, 0); ctx.lineTo(s, -s * 0.5); ctx.lineTo(s, s * 0.5); ctx.lineTo(0, s)
        ctx.closePath()
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.7})`
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(0, 0); ctx.lineTo(-s, -s * 0.5); ctx.lineTo(-s, s * 0.5); ctx.lineTo(0, s)
        ctx.closePath()
        ctx.fillStyle = `rgba(${Math.max(0, color[0] - 50)},${Math.max(0, color[1] - 50)},${Math.max(0, color[2] - 50)},${alpha * 0.5})`
        ctx.fill()
      } else {
        // Gradient triangle
        const triGrad = ctx.createLinearGradient(0, -size, 0, size * 0.5)
        triGrad.addColorStop(0, `rgba(${Math.min(255, color[0] + 50)},${Math.min(255, color[1] + 50)},${Math.min(255, color[2] + 50)},${alpha})`)
        triGrad.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.3})`)
        ctx.beginPath()
        ctx.moveTo(0, -size); ctx.lineTo(size * 0.8, size * 0.5); ctx.lineTo(-size * 0.8, size * 0.5)
        ctx.closePath()
        ctx.fillStyle = triGrad
        ctx.fill()
        ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.5})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
      ctx.restore()
    }

    // ── Volumetric light rays ──
    const rayX = w * (0.3 + rand() * 0.4)
    const rayCount = 4 + Math.floor(rand() * 3)
    for (let i = 0; i < rayCount; i++) {
      const angle = -0.3 + (i / rayCount) * 0.6
      const rayLen = h * 1.5
      const rayWidth = 20 + rand() * 40
      const color = hexToRgb(i % 2 === 0 ? pal.c1 : pal.c2)
      ctx.save()
      ctx.translate(rayX, -h * 0.2)
      ctx.rotate(angle)
      const rayGrad = ctx.createLinearGradient(0, 0, 0, rayLen)
      rayGrad.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},0.06)`)
      rayGrad.addColorStop(0.5, `rgba(${color[0]},${color[1]},${color[2]},0.03)`)
      rayGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = rayGrad
      ctx.beginPath()
      ctx.moveTo(-rayWidth * 0.1, 0); ctx.lineTo(-rayWidth, rayLen); ctx.lineTo(rayWidth, rayLen); ctx.lineTo(rayWidth * 0.1, 0)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    // ── Depth-of-field bokeh ──
    const bokehCount = 8 + Math.floor(rand() * 10)
    for (let i = 0; i < bokehCount; i++) {
      const bx = rand() * w, by = rand() * h
      const br = 3 + rand() * 15
      const color = hexToRgb([pal.c1, pal.c2, pal.c3, pal.accent][Math.floor(rand() * 4)])
      const alpha = 0.03 + rand() * 0.08
      ctx.beginPath()
      ctx.arc(bx, by, br, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`
      ctx.lineWidth = 0.8
      ctx.stroke()
      const bokGrad = ctx.createRadialGradient(bx, by, 0, bx, by, br * 0.6)
      bokGrad.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.5})`)
      bokGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = bokGrad
      ctx.beginPath()
      ctx.arc(bx, by, br * 0.6, 0, Math.PI * 2)
      ctx.fill()
    }

    // ── Top highlight ──
    const topGlow = ctx.createRadialGradient(w * 0.5, -h * 0.3, 0, w * 0.5, 0, h * 0.8)
    topGlow.addColorStop(0, pal.c1 + '12')
    topGlow.addColorStop(0.5, pal.c2 + '08')
    topGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = topGlow
    ctx.fillRect(0, 0, w, h)

    // ── Vignette ──
    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.7)
    vig.addColorStop(0, 'transparent')
    vig.addColorStop(1, 'rgba(0,0,0,0.4)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, w, h)

  }, [slug, category, height])

  return (
    <canvas
      ref={canvasRef}
      className={`generative-cover ${className}`}
      style={{ width: '100%', height, display: 'block', borderRadius: 'var(--radius)' }}
    />
  )
}
