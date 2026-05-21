import { useRef, useEffect, useState } from 'react'

// Lightweight canvas animation for explore card hover previews
export default function ExploreCardCanvas({ type = 'showcase', active = false }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const startTime = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = 280 * dpr
    canvas.height = 120 * dpr
    ctx.scale(dpr, dpr)

    startTime.current = performance.now()

    const draw = () => {
      const t = (performance.now() - startTime.current) / 1000
      ctx.clearRect(0, 0, 280, 120)

      if (!active) {
        animRef.current = null
        return
      }

      if (type === 'showcase') drawArchitecture(ctx, t)
      else if (type === 'thinking') drawNeural(ctx, t)
      else drawGraph(ctx, t)

      animRef.current = requestAnimationFrame(draw)
    }

    if (active) {
      animRef.current = requestAnimationFrame(draw)
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [active, type])

  return (
    <canvas
      ref={canvasRef}
      className="explore-canvas"
      style={{
        width: 280,
        height: 120,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.4s ease',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    />
  )
}

// Showcase: animated architecture diagram (boxes + arrows)
function drawArchitecture(ctx, t) {
  ctx.strokeStyle = 'rgba(201,168,124,0.6)'
  ctx.lineWidth = 1

  const boxes = [
    { x: 30, y: 30, w: 50, h: 25, label: 'Agent' },
    { x: 115, y: 15, w: 50, h: 25, label: 'RAG' },
    { x: 115, y: 55, w: 50, h: 25, label: 'LLM' },
    { x: 200, y: 35, w: 55, h: 25, label: 'Output' },
  ]

  boxes.forEach((b, i) => {
    const offset = Math.sin(t * 2 + i * 1.5) * 2
    ctx.strokeRect(b.x, b.y + offset, b.w, b.h)
    ctx.fillStyle = 'rgba(201,168,124,0.5)'
    ctx.font = '9px "DM Sans", sans-serif'
    ctx.fillText(b.label, b.x + 6, b.y + offset + 15)
  })

  // Animated arrows
  const progress = (t * 0.8) % 1
  ctx.setLineDash([4, 4])
  ctx.lineDashOffset = -t * 20

  ctx.beginPath()
  ctx.moveTo(80, 42); ctx.lineTo(115, 27)
  ctx.moveTo(80, 42); ctx.lineTo(115, 67)
  ctx.moveTo(165, 27); ctx.lineTo(200, 47)
  ctx.moveTo(165, 67); ctx.lineTo(200, 47)
  ctx.stroke()
  ctx.setLineDash([])

  // Data packet
  const packetX = 30 + progress * 230
  ctx.fillStyle = 'rgba(201,168,124,0.9)'
  ctx.beginPath()
  ctx.arc(packetX, 90 + Math.sin(t * 3) * 5, 3, 0, Math.PI * 2)
  ctx.fill()
}

// Thinking: neural network pattern
function drawNeural(ctx, t) {
  const nodes = []
  for (let layer = 0; layer < 4; layer++) {
    const count = [3, 5, 5, 2][layer]
    for (let i = 0; i < count; i++) {
      const x = 40 + layer * 70
      const y = 20 + (i / (count - 1 || 1)) * 80
      nodes.push({ x, y, layer })
    }
  }

  // Connections
  ctx.strokeStyle = 'rgba(201,168,124,0.2)'
  ctx.lineWidth = 0.5
  nodes.forEach((a, i) => {
    nodes.forEach((b, j) => {
      if (b.layer === a.layer + 1) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    })
  })

  // Nodes with pulse
  nodes.forEach((n, i) => {
    const pulse = 0.4 + Math.sin(t * 2 + i * 0.7) * 0.3
    ctx.fillStyle = `rgba(201,168,124,${pulse})`
    ctx.beginPath()
    ctx.arc(n.x, n.y, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  // Signal propagation
  const signalT = (t * 0.6) % 1
  const signalLayer = Math.floor(signalT * 3)
  ctx.fillStyle = 'rgba(201,168,124,0.9)'
  nodes.filter(n => n.layer === signalLayer).forEach(n => {
    ctx.beginPath()
    ctx.arc(n.x, n.y, 6, 0, Math.PI * 2)
    ctx.fill()
  })
}

// Writing: graph/timeline pattern
function drawGraph(ctx, t) {
  ctx.strokeStyle = 'rgba(201,168,124,0.4)'
  ctx.lineWidth = 1.5

  // Animated graph line
  ctx.beginPath()
  for (let x = 0; x < 280; x += 2) {
    const y = 60 + Math.sin((x * 0.03) + t * 1.5) * 20 + Math.sin((x * 0.07) + t * 0.8) * 10
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Dots along the line
  for (let i = 0; i < 6; i++) {
    const x = 30 + i * 45
    const y = 60 + Math.sin((x * 0.03) + t * 1.5) * 20 + Math.sin((x * 0.07) + t * 0.8) * 10
    const pulse = 0.5 + Math.sin(t * 3 + i) * 0.3
    ctx.fillStyle = `rgba(201,168,124,${pulse})`
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  // Horizontal scan line
  const scanX = ((t * 60) % 300) - 10
  ctx.strokeStyle = 'rgba(201,168,124,0.3)'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(scanX, 0)
  ctx.lineTo(scanX, 120)
  ctx.stroke()
}
