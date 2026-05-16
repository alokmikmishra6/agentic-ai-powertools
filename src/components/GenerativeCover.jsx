import { useRef, useEffect } from 'react'

/**
 * High-fidelity procedural generative cover art.
 * Techniques: simplex noise flow fields, topographic contours,
 * connected particle networks, light caustics, and layered depth.
 * Each article gets a unique, deterministic visual based on slug + category.
 * No animation — single static render.
 */

// ── Simplex noise (compact 2D implementation) ──
const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6
const GRAD = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]

function createNoise(seed) {
  const perm = new Uint8Array(512)
  const r = seededRandom(seed)
  const p = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]

  return function noise2D(x, y) {
    const s = (x + y) * F2
    const i = Math.floor(x + s), j = Math.floor(y + s)
    const t = (i + j) * G2
    const x0 = x - (i - t), y0 = y - (j - t)
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2
    const ii = i & 255, jj = j & 255
    let n = 0
    let t0 = 0.5 - x0*x0 - y0*y0
    if (t0 > 0) { t0 *= t0; const g = GRAD[perm[ii + perm[jj]] & 7]; n += t0*t0*(g[0]*x0+g[1]*y0) }
    let t1 = 0.5 - x1*x1 - y1*y1
    if (t1 > 0) { t1 *= t1; const g = GRAD[perm[ii+i1 + perm[jj+j1]] & 7]; n += t1*t1*(g[0]*x1+g[1]*y1) }
    let t2 = 0.5 - x2*x2 - y2*y2
    if (t2 > 0) { t2 *= t2; const g = GRAD[perm[ii+1 + perm[jj+1]] & 7]; n += t2*t2*(g[0]*x2+g[1]*y2) }
    return 70 * n // range ~[-1, 1]
  }
}

// Deterministic hash from string
function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// Seeded pseudo-random
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const PALETTES = {
  'AI Systems':  { bg: '#06071a', c1: '#7b6cf0', c2: '#22d3c8', c3: '#a599f7', c4: '#4834d4', glow: '#7b6cf0' },
  'Architecture': { bg: '#060d1a', c1: '#22d3c8', c2: '#7b6cf0', c3: '#1ce4d4', c4: '#0e6b63', glow: '#22d3c8' },
  'Reflection':  { bg: '#0f0610', c1: '#e879a0', c2: '#7b6cf0', c3: '#f0a0c0', c4: '#a04070', glow: '#e879a0' },
  'Leadership':  { bg: '#0f0a04', c1: '#f59e0b', c2: '#e879a0', c3: '#ffbe4d', c4: '#c07020', glow: '#f59e0b' },
}

const DEFAULT_PAL = { bg: '#060611', c1: '#7b6cf0', c2: '#22d3c8', c3: '#e879a0', c4: '#4834d4', glow: '#7b6cf0' }

// Parse hex to [r,g,b]
function hexRgb(hex) {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

export default function GenerativeCover({ slug, category, height = 320, className = '' }) {
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
    const noise = createNoise(seed)
    const pal = PALETTES[category] || DEFAULT_PAL

    // ── 1. Deep background ──
    const bg = ctx.createLinearGradient(0, 0, w * 0.3, h)
    bg.addColorStop(0, pal.bg)
    bg.addColorStop(1, '#060611')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // ── 2. Large ambient glows (2-3 overlapping radials) ──
    const glowCount = 2 + (seed % 2)
    for (let g = 0; g < glowCount; g++) {
      const gx = w * (0.2 + rand() * 0.6)
      const gy = h * (0.15 + rand() * 0.7)
      const gr = Math.max(w, h) * (0.35 + rand() * 0.35)
      const gc = g === 0 ? pal.c1 : g === 1 ? pal.c2 : pal.c4
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr)
      grad.addColorStop(0, gc + '20')
      grad.addColorStop(0.4, gc + '0c')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    }

    // ── 3. Noise-based topographic contour field ──
    // Sample noise across the canvas and draw iso-lines
    const noiseScale = 0.003 + rand() * 0.003
    const contourLevels = 10 + Math.floor(rand() * 8)
    const offsetX = rand() * 1000
    const offsetY = rand() * 1000

    // Build noise field at reduced resolution
    const res = 3
    const cols = Math.ceil(w / res)
    const rows = Math.ceil(h / res)
    const field = new Float32Array(cols * rows)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = (c * res + offsetX) * noiseScale
        const ny = (r * res + offsetY) * noiseScale
        // Fractal noise (3 octaves)
        field[r * cols + c] =
          noise(nx, ny) * 0.6 +
          noise(nx * 2, ny * 2) * 0.3 +
          noise(nx * 4, ny * 4) * 0.1
      }
    }

    // Marching squares contour tracing
    const rgb1 = hexRgb(pal.c1)
    const rgb2 = hexRgb(pal.c2)

    for (let level = 0; level < contourLevels; level++) {
      const threshold = -0.8 + (level / contourLevels) * 1.6
      const t = level / contourLevels
      // Blend between c1 and c2 across levels
      const cr = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t)
      const cg = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t)
      const cb = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t)
      const alpha = 0.08 + t * 0.12

      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`
      ctx.lineWidth = 0.6 + t * 0.4
      ctx.beginPath()

      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const tl = field[r * cols + c] >= threshold ? 1 : 0
          const tr = field[r * cols + c + 1] >= threshold ? 1 : 0
          const br = field[(r+1) * cols + c + 1] >= threshold ? 1 : 0
          const bl = field[(r+1) * cols + c] >= threshold ? 1 : 0
          const cell = tl * 8 + tr * 4 + br * 2 + bl

          if (cell === 0 || cell === 15) continue

          const x = c * res, y = r * res
          const lerp = (a, b, ta, tb) => a + ((threshold - ta) / (tb - ta)) * (b - a)
          const vTL = field[r * cols + c], vTR = field[r * cols + c + 1]
          const vBR = field[(r+1) * cols + c + 1], vBL = field[(r+1) * cols + c]

          const top = [lerp(x, x + res, vTL, vTR), y]
          const right = [x + res, lerp(y, y + res, vTR, vBR)]
          const bottom = [lerp(x, x + res, vBL, vBR), y + res]
          const left = [x, lerp(y, y + res, vTL, vBL)]

          const segments = {
            1: [left, bottom], 2: [bottom, right], 3: [left, right],
            4: [top, right], 5: [[top, left], [bottom, right]], 6: [top, bottom],
            7: [top, left], 8: [top, left], 9: [top, bottom],
            10: [[top, right], [bottom, left]], 11: [top, right],
            12: [left, right], 13: [bottom, right], 14: [left, bottom],
          }

          const seg = segments[cell]
          if (!seg) continue

          if (Array.isArray(seg[0]) && Array.isArray(seg[0][0])) {
            // Ambiguous case — two segments
            for (const s of seg) {
              ctx.moveTo(s[0][0], s[0][1])
              ctx.lineTo(s[1][0], s[1][1])
            }
          } else {
            ctx.moveTo(seg[0][0], seg[0][1])
            ctx.lineTo(seg[1][0], seg[1][1])
          }
        }
      }
      ctx.stroke()
    }

    // ── 4. Flow field streamlines ──
    const flowScale = 0.005 + rand() * 0.004
    const flowOffset = rand() * 500
    const streamCount = 40 + Math.floor(rand() * 30)
    const stepLen = 3
    const steps = 50 + Math.floor(rand() * 40)

    ctx.lineWidth = 0.5
    for (let s = 0; s < streamCount; s++) {
      let x = rand() * w
      let y = rand() * h
      const t = s / streamCount
      const cr = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t)
      const cg = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t)
      const cb = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t)

      ctx.beginPath()
      ctx.moveTo(x, y)

      for (let i = 0; i < steps; i++) {
        const angle = noise(
          (x + flowOffset) * flowScale,
          (y + flowOffset) * flowScale
        ) * Math.PI * 2
        x += Math.cos(angle) * stepLen
        y += Math.sin(angle) * stepLen
        if (x < 0 || x > w || y < 0 || y > h) break
        ctx.lineTo(x, y)
      }

      const fadeAlpha = 0.04 + rand() * 0.08
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${fadeAlpha})`
      ctx.stroke()
    }

    // ── 5. Connected particle network ──
    const nodeCount = 30 + Math.floor(rand() * 25)
    const nodes = []
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: rand() * w,
        y: rand() * h,
        r: 1 + rand() * 2.5,
        ci: i % 3,
      })
    }

    // Draw connections
    const maxDist = 120 + rand() * 80
    ctx.lineWidth = 0.3
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15
          const color = [pal.c1, pal.c2, pal.c3][nodes[i].ci]
          ctx.strokeStyle = color + Math.round(opacity * 255).toString(16).padStart(2, '0')
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw nodes with glow
    for (const node of nodes) {
      const color = [pal.c1, pal.c2, pal.c3][node.ci]
      // Outer glow
      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 4)
      glow.addColorStop(0, color + '30')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.r * 4, 0, Math.PI * 2)
      ctx.fill()
      // Core
      ctx.fillStyle = color + '90'
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
      ctx.fill()
      // Bright center
      ctx.fillStyle = '#fff' + '50'
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.r * 0.4, 0, Math.PI * 2)
      ctx.fill()
    }

    // ── 6. Light caustic arcs ──
    const arcCount = 3 + Math.floor(rand() * 4)
    for (let i = 0; i < arcCount; i++) {
      const cx = w * (rand() * 0.6 + 0.2)
      const cy = h * (rand() * 0.6 + 0.2)
      const r = 60 + rand() * 200
      const startAngle = rand() * Math.PI * 2
      const sweep = 0.5 + rand() * 2

      const arcGrad = ctx.createConicGradient(startAngle, cx, cy)
      const color = [pal.c1, pal.c2, pal.c3][i % 3]
      arcGrad.addColorStop(0, 'transparent')
      arcGrad.addColorStop(0.3, color + '10')
      arcGrad.addColorStop(0.5, color + '18')
      arcGrad.addColorStop(0.7, color + '10')
      arcGrad.addColorStop(1, 'transparent')

      ctx.strokeStyle = arcGrad
      ctx.lineWidth = 0.8 + rand() * 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, r, startAngle, startAngle + sweep)
      ctx.stroke()
    }

    // ── 7. Fine grain overlay ──
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data
    const grainRand = seededRandom(seed + 99)
    for (let i = 0; i < data.length; i += 4) {
      const grain = (grainRand() - 0.5) * 12
      data[i] = Math.min(255, Math.max(0, data[i] + grain))
      data[i+1] = Math.min(255, Math.max(0, data[i+1] + grain))
      data[i+2] = Math.min(255, Math.max(0, data[i+2] + grain))
    }
    ctx.putImageData(imgData, 0, 0)

    // ── 8. Vignette ──
    const vig = ctx.createRadialGradient(w/2, h/2, w * 0.25, w/2, h/2, w * 0.75)
    vig.addColorStop(0, 'transparent')
    vig.addColorStop(1, 'rgba(6,6,17,0.5)')
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
