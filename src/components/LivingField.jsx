import { useEffect, useRef } from 'react'

// A small Canvas 2D sculpture. No WebGL dependency; render only while visible.
export default function LivingField({ color = '#bbd9d0', paused = false, selected = 0 }) {
  const ref = useRef(null)
  const phase = useRef(0)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const field = canvas.parentElement
    const labels = [...field.querySelectorAll('[data-atlas-node]')]
    let labelBounds = []
    const pointer = { x: 0, y: 0 }
    let visible = false, frame = 0, last = 0, angle = phase.current, width = 0, height = 0
    const rgb = color.match(/\w\w/g).map(v => parseInt(v, 16)).join(',')
    function draw() {
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)
      const scale = Math.min(width, height) * .28
      const cx = width / 2, cy = height / 2
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.7)
      glow.addColorStop(0, `rgba(${rgb},.10)`)
      glow.addColorStop(.65, `rgba(${rgb},.035)`)
      glow.addColorStop(1, `rgba(${rgb},0)`)
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
      const points = []
      const columns = 56, rows = 14
      const tilt = .68 + pointer.y * .08
      const spin = angle + pointer.x * .10
      // The labels and mesh share this projection, so every leader stays attached
      // to the surface as it moves. Anchors remain in their label's quadrant.
      function project(u, v) {
        const radius = .88 + .29 * Math.cos(v)
        const x = radius * Math.cos(u)
        const y = .29 * Math.sin(v) + .17 * Math.sin(u * 3 + angle)
        const z = radius * Math.sin(u)
        const xx = x * Math.cos(spin) - z * Math.sin(spin)
        const zz = x * Math.sin(spin) + z * Math.cos(spin)
        const yy = y * Math.cos(tilt) - zz * Math.sin(tilt)
        const depth = y * Math.sin(tilt) + zz * Math.cos(tilt)
        const perspective = 3.4 / (3.4 - depth)
        return { x: cx + xx * scale * perspective, y: cy + yy * scale * perspective, depth }
      }
      for (let i = 0; i < columns; i++) {
        const u = i / columns * Math.PI * 2
        for (let j = 0; j < rows; j++) {
          const v = j / rows * Math.PI * 2
          points.push(project(u, v))
        }
      }
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const p = points[i * rows + j]
          const next = points[((i + 1) % columns) * rows + j]
          const across = points[i * rows + (j + 1) % rows]
          const opacity = .08 + (p.depth + 1.3) / 2.6 * .35
          ctx.strokeStyle = `rgba(${rgb},${opacity})`
          ctx.lineWidth = .55
          ctx.beginPath()
          ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y)
          if (i % 2 === 0) { ctx.moveTo(p.x, p.y); ctx.lineTo(across.x, across.y) }
          ctx.stroke()
          if (i % 7 === 0 && j % 3 === 0) {
            ctx.fillStyle = `rgba(${rgb},${Math.min(opacity + .3, .8)})`
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fill()
          }
        }
      }
      const quadrants = [Math.PI / 4, -Math.PI / 4, -3 * Math.PI / 4, 3 * Math.PI / 4]
      labelBounds.forEach((box, index) => {
        const active = index === selected
        const u = quadrants[index] - spin
        const anchor = project(u, 0)
        const dx = anchor.x - box.x, dy = anchor.y - box.y
        const edge = 1 / Math.max(Math.abs(dx) / (box.width / 2), Math.abs(dy) / (box.height / 2), .001)
        ctx.strokeStyle = `rgba(${rgb},${active ? .9 : .42})`
        ctx.lineWidth = active ? 1.25 : .85
        ctx.beginPath()
        ctx.moveTo(box.x + dx * edge, box.y + dy * edge)
        ctx.lineTo(anchor.x, anchor.y)
        ctx.stroke()
        // Trace a short arc on the selected surface to make the attachment legible.
        if (active) {
          ctx.beginPath()
          for (let step = 0; step <= 24; step++) {
            const p = project(u + (step / 24 - .5) * .6, 0)
            if (step === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y)
          }
          ctx.stroke()
        }
        ctx.fillStyle = `rgba(${rgb},${active ? 1 : .7})`
        ctx.beginPath(); ctx.arc(anchor.x, anchor.y, active ? 3 : 2, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(anchor.x, anchor.y, active ? 8 : 5, 0, Math.PI * 2); ctx.stroke()
      })
    }
    function tick(time) {
      if (time - last > 32) {
        angle += .003
        phase.current = angle
        draw()
        last = time
      }
      frame = requestAnimationFrame(tick)
    }
    function sync() {
      cancelAnimationFrame(frame)
      draw()
      if (visible && !paused && !motion.matches && !document.hidden) frame = requestAnimationFrame(tick)
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      width = canvas.clientWidth; height = canvas.clientHeight
      canvas.width = width * dpr; canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const bounds = canvas.getBoundingClientRect()
      labelBounds = labels.map(label => {
        const box = label.getBoundingClientRect()
        return { x: box.left - bounds.left + box.width / 2, y: box.top - bounds.top + box.height / 2, width: box.width, height: box.height }
      })
      draw()
    }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync() })
    const resizeObserver = new ResizeObserver(resize)
    const move = e => {
      if (paused || motion.matches) return
      const rect = canvas.getBoundingClientRect()
      pointer.x = (e.clientX - rect.left) / rect.width - .5
      pointer.y = (e.clientY - rect.top) / rect.height - .5
    }
    observer.observe(canvas); resizeObserver.observe(canvas)
    labels.forEach(label => resizeObserver.observe(label))
    field.addEventListener('pointermove', move)
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    resize()
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect()
      field.removeEventListener('pointermove', move)
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [color, paused, selected])
  return <canvas ref={ref} className="living-field" aria-hidden="true" />
}
