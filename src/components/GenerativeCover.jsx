import { useRef, useEffect } from 'react'

/**
 * Custom thematic cover illustrations per article.
 * Each cover is a hand-crafted conceptual visualization that
 * communicates the article's core thesis visually.
 */

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawBackground(ctx, w, h, bgColor, glowColor) {
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, bgColor)
  bg.addColorStop(1, '#030308')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.globalAlpha = 0.015
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = '#fff'
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  ctx.globalAlpha = 1
  if (glowColor) {
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.5)
    glow.addColorStop(0, glowColor + '18')
    glow.addColorStop(0.5, glowColor + '08')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
  }
}

function drawVignette(ctx, w, h) {
  const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.7)
  vig.addColorStop(0, 'transparent')
  vig.addColorStop(1, 'rgba(0,0,0,0.5)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, w, h)
}

// ─── Per-article themed renderers ───
const COVERS = {
  'learning-loop-architecture': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0a0814', '#7b6cf0')
    const cx = w * 0.5, cy = h * 0.5
    const rx = Math.min(w * 0.22, 120), ry = Math.min(h * 0.3, 80)
    ctx.strokeStyle = '#e8a87c'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.ellipse(cx - rx * 0.6, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke()
    const ha = Math.PI * 0.25, hax = cx - rx * 0.6 + rx * Math.cos(ha), hay = cy + ry * Math.sin(ha)
    ctx.fillStyle = '#e8a87c'; ctx.beginPath(); ctx.moveTo(hax, hay); ctx.lineTo(hax - 8, hay - 10); ctx.lineTo(hax + 4, hay - 4); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#6cc8e8'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.ellipse(cx + rx * 0.6, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke()
    const ta = Math.PI * 1.25, tax = cx + rx * 0.6 + rx * Math.cos(ta), tay = cy + ry * Math.sin(ta)
    ctx.fillStyle = '#6cc8e8'; ctx.beginPath(); ctx.moveTo(tax, tay); ctx.lineTo(tax + 8, tay + 10); ctx.lineTo(tax - 4, tay + 4); ctx.closePath(); ctx.fill()
    const intGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx * 0.5)
    intGrad.addColorStop(0, 'rgba(200, 170, 240, 0.15)'); intGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = intGrad; ctx.fillRect(0, 0, w, h)
    ctx.font = '600 11px "Sora", sans-serif'; ctx.textAlign = 'center'
    ctx.fillStyle = '#e8a87c'; ctx.fillText('HUMAN', cx - rx * 1.1, cy - ry * 0.1); ctx.fillText('CAPITAL', cx - rx * 1.1, cy + ry * 0.15)
    ctx.fillStyle = '#6cc8e8'; ctx.fillText('TOKEN', cx + rx * 1.1, cy - ry * 0.1); ctx.fillText('CAPITAL', cx + rx * 1.1, cy + ry * 0.15)
    ctx.font = '700 14px "Sora", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillText('∞', cx, cy + 5)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(cx, cy - ry * 0.5); ctx.lineTo(cx, cy - ry * 1.1); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.moveTo(cx, cy - ry * 1.2); ctx.lineTo(cx - 5, cy - ry * 1.05); ctx.lineTo(cx + 5, cy - ry * 1.05); ctx.closePath(); ctx.fill()
    drawVignette(ctx, w, h)
  },

  'agentic-ai-harness-engineering': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080812', '#6366f1')
    const cx = w * 0.5, cy = h * 0.5, nodeR = 24
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nodeR)
    grad.addColorStop(0, '#a78bfa'); grad.addColorStop(0.7, '#6366f1'); grad.addColorStop(1, '#4338ca')
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, nodeR, 0, Math.PI * 2); ctx.fill()
    const arms = [
      { angle: -0.8, label: 'STATE', color: '#60a5fa' },
      { angle: -0.3, label: 'RETRY', color: '#34d399' },
      { angle: 0.3, label: 'EVAL', color: '#fbbf24' },
      { angle: 0.8, label: 'TOOLS', color: '#f87171' },
      { angle: Math.PI + 0.5, label: 'TELEMETRY', color: '#a78bfa' },
      { angle: Math.PI - 0.5, label: 'RECOVERY', color: '#22d3ee' },
    ]
    arms.forEach(arm => {
      const len = Math.min(w * 0.3, 140)
      const ex = cx + Math.cos(arm.angle) * len, ey = cy + Math.sin(arm.angle) * len
      ctx.strokeStyle = arm.color + '60'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(arm.angle) * nodeR, cy + Math.sin(arm.angle) * nodeR); ctx.lineTo(ex, ey); ctx.stroke()
      ctx.fillStyle = arm.color + '40'; ctx.beginPath(); ctx.arc(ex, ey, 8, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = arm.color + '90'; ctx.lineWidth = 1; ctx.stroke()
      ctx.font = '600 8px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = arm.color + 'cc'; ctx.fillText(arm.label, ex, ey + 18)
    })
    for (let i = 1; i <= 3; i++) { ctx.strokeStyle = `rgba(167, 139, 250, ${0.15 - i * 0.04})`; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(cx, cy, nodeR + i * 20, 0, Math.PI * 2); ctx.stroke() }
    ctx.font = '700 9px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillText('HARNESS', cx, cy + 4)
    drawVignette(ctx, w, h)
  },

  'security-principles-agentic-ai': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0a0810', '#8b5cf6')
    const cx = w * 0.5, cy = h * 0.5, shieldH = Math.min(h * 0.6, 130), shieldW = shieldH * 0.7
    ctx.beginPath(); ctx.moveTo(cx, cy - shieldH * 0.5)
    ctx.quadraticCurveTo(cx + shieldW * 0.6, cy - shieldH * 0.4, cx + shieldW * 0.5, cy)
    ctx.quadraticCurveTo(cx + shieldW * 0.3, cy + shieldH * 0.35, cx, cy + shieldH * 0.5)
    ctx.quadraticCurveTo(cx - shieldW * 0.3, cy + shieldH * 0.35, cx - shieldW * 0.5, cy)
    ctx.quadraticCurveTo(cx - shieldW * 0.6, cy - shieldH * 0.4, cx, cy - shieldH * 0.5)
    ctx.closePath(); ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = 'rgba(139, 92, 246, 0.08)'; ctx.fill()
    for (let i = 0; i < 4; i++) { const r = shieldH * 0.15 + i * (shieldH * 0.08); ctx.strokeStyle = `rgba(167, 139, 250, ${0.5 - i * 0.1})`; ctx.lineWidth = 0.8; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(cx, cy + 5, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]) }
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5
    drawRoundedRect(ctx, cx - 8, cy - 2, 16, 14, 3); ctx.stroke()
    ctx.beginPath(); ctx.arc(cx, cy - 5, 6, Math.PI, 0); ctx.stroke()
    drawVignette(ctx, w, h)
  },

  'token-economy-agentic-systems': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0a0a08', '#f59e0b')
    const cx = w * 0.5, cy = h * 0.5, pipeW = Math.min(w * 0.7, 360), pipeH = 20, px = cx - pipeW / 2
    ctx.fillStyle = 'rgba(245, 158, 11, 0.1)'; drawRoundedRect(ctx, px, cy - pipeH / 2, pipeW, pipeH, 10); ctx.fill()
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; ctx.lineWidth = 1; drawRoundedRect(ctx, px, cy - pipeH / 2, pipeW, pipeH, 10); ctx.stroke()
    for (let i = 0; i < 12; i++) { const tx = px + (pipeW / 12) * i + 15; ctx.fillStyle = `rgba(251, 191, 36, ${0.4 + (i / 12) * 0.4})`; ctx.beginPath(); ctx.arc(tx, cy + Math.sin(i * 1.2) * 4, 4, 0, Math.PI * 2); ctx.fill() }
    const bars = ['INPUT', 'REASON', 'TOOL', 'OUTPUT']
    bars.forEach((label, i) => {
      const bx = px + (pipeW / 4) * i + pipeW / 8, barH = 25 + i * 10
      ctx.fillStyle = `rgba(245, 158, 11, ${0.15 + i * 0.08})`; ctx.fillRect(bx - 8, cy - pipeH - barH - 10, 16, barH)
      ctx.font = '600 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'; ctx.fillText(label, bx, cy + pipeH + 18)
    })
    ctx.font = '700 18px "Sora", sans-serif'; ctx.fillStyle = 'rgba(251, 191, 36, 0.3)'; ctx.textAlign = 'center'; ctx.fillText('$', cx, cy - h * 0.3)
    drawVignette(ctx, w, h)
  },

  'developer-identity-ai-era': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0c0810', '#c084fc')
    const cx = w * 0.5, cy = h * 0.5
    ctx.strokeStyle = '#e8a87c'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(cx - 40, cy - 30, 12, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx - 40, cy - 18); ctx.lineTo(cx - 40, cy + 20); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx - 55, cy - 5); ctx.lineTo(cx - 40, cy - 10); ctx.lineTo(cx - 25, cy - 5); ctx.stroke()
    ctx.font = '500 10px "JetBrains Mono", monospace'; ctx.textAlign = 'left'
    const codeLines = ['fn think()', '  .reason()', '  .act()', '  .learn()']
    codeLines.forEach((line, i) => { ctx.fillStyle = `rgba(96, 165, 250, ${0.4 + i * 0.15})`; ctx.fillText(line, cx + 20, cy - 20 + i * 16) })
    const mergeGrad = ctx.createLinearGradient(cx - 15, 0, cx + 15, 0)
    mergeGrad.addColorStop(0, 'rgba(232, 168, 124, 0.2)'); mergeGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.15)'); mergeGrad.addColorStop(1, 'rgba(96, 165, 250, 0.2)')
    ctx.fillStyle = mergeGrad; ctx.fillRect(cx - 15, cy - h * 0.35, 30, h * 0.7)
    ctx.font = '700 20px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillText('⇋', cx, cy + 5)
    drawVignette(ctx, w, h)
  },

  'model-context-protocol-infrastructure': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a14', '#3b82f6')
    const cx = w * 0.5, cy = h * 0.5, boxW = 80, boxH = 36
    drawRoundedRect(ctx, cx - 140, cy - boxH / 2, boxW, boxH, 6); ctx.fillStyle = 'rgba(59, 130, 246, 0.12)'; ctx.fill(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5; drawRoundedRect(ctx, cx - 140, cy - boxH / 2, boxW, boxH, 6); ctx.stroke()
    ctx.font = '600 9px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#60a5fa'; ctx.fillText('CLIENT', cx - 100, cy + 4)
    drawRoundedRect(ctx, cx + 60, cy - boxH / 2, boxW, boxH, 6); ctx.fillStyle = 'rgba(34, 211, 238, 0.12)'; ctx.fill(); ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5; drawRoundedRect(ctx, cx + 60, cy - boxH / 2, boxW, boxH, 6); ctx.stroke()
    ctx.fillStyle = '#67e8f9'; ctx.fillText('SERVER', cx + 100, cy + 4)
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.moveTo(cx - 58, cy - 6); ctx.lineTo(cx + 58, cy - 6); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx + 58, cy + 6); ctx.lineTo(cx - 58, cy + 6); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.moveTo(cx + 58, cy - 6); ctx.lineTo(cx + 52, cy - 10); ctx.lineTo(cx + 52, cy - 2); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(cx - 58, cy + 6); ctx.lineTo(cx - 52, cy + 2); ctx.lineTo(cx - 52, cy + 10); ctx.closePath(); ctx.fill()
    ctx.font = '700 8px "Sora", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText('MCP', cx, cy - 16)
    const tools = ['tools/list', 'tools/call', 'resources/read']
    tools.forEach((t, i) => { ctx.font = '500 8px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(167, 139, 250, 0.6)'; ctx.fillText(t, cx, cy + 30 + i * 13) })
    drawVignette(ctx, w, h)
  },

  'ai-evaluation-production-systems': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a10', '#10b981')
    const cx = w * 0.5, cy = h * 0.5, gaugeR = Math.min(h * 0.3, 55)
    ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(cx, cy + 10, gaugeR, Math.PI, 0); ctx.stroke()
    ctx.strokeStyle = '#34d399'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy + 10, gaugeR, Math.PI, Math.PI + Math.PI * 0.75); ctx.stroke(); ctx.lineCap = 'butt'
    ctx.font = '700 22px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#34d399'; ctx.fillText('0.87', cx, cy + 15)
    ctx.font = '500 8px "Sora", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText('EVAL SCORE', cx, cy + 30)
    const criteria = ['Relevance', 'Accuracy', 'Safety', 'Latency']
    criteria.forEach((c, i) => { const a = Math.PI + (Math.PI / 5) * (i + 1); ctx.font = '500 7px "Sora", sans-serif'; ctx.fillStyle = 'rgba(52, 211, 153, 0.7)'; ctx.fillText(c, cx + Math.cos(a) * (gaugeR + 24), cy + 10 + Math.sin(a) * (gaugeR + 24)) })
    drawVignette(ctx, w, h)
  },

  'ai-token-cost-optimization': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a08', '#22c55e')
    const cx = w * 0.5, cy = h * 0.5, curveW = Math.min(w * 0.7, 340), startX = cx - curveW / 2
    const points = []; for (let i = 0; i <= 20; i++) { const t = i / 20; points.push({ x: startX + t * curveW, y: cy - 40 + (50 * Math.exp(-t * 2.5)) + t * 30 }) }
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y); ctx.stroke()
    const checkpoints = [4, 9, 14], labels = ['Cache', 'Route', 'Compress']
    checkpoints.forEach((idx, i) => { const p = points[idx]; ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.font = '500 8px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(74, 222, 128, 0.8)'; ctx.fillText(labels[i], p.x, p.y + 18) })
    ctx.font = '500 8px "Sora", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.textAlign = 'left'; ctx.fillText('$/query', startX - 5, cy - 50); ctx.textAlign = 'right'; ctx.fillText('time →', startX + curveW + 5, cy + 40)
    drawVignette(ctx, w, h)
  },

  'invisible-architecture-agentic-workflow': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#060a14', '#06b6d4')
    const cx = w * 0.5, cy = h * 0.5
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)'; ctx.lineWidth = 0.5
    for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
    drawRoundedRect(ctx, cx - 50, cy - 55, 100, 30, 4); ctx.fillStyle = 'rgba(6, 182, 212, 0.2)'; ctx.fill(); ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 1.5; drawRoundedRect(ctx, cx - 50, cy - 55, 100, 30, 4); ctx.stroke()
    ctx.font = '600 9px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#67e8f9'; ctx.fillText('AGENT', cx, cy - 36)
    const layers = ['ORCHESTRATOR', 'PERMISSIONS', 'AUDIT TRAIL']
    layers.forEach((label, i) => { const ly = cy - 10 + i * 35; const opacity = 0.6 - i * 0.15; ctx.setLineDash([4, 3]); ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`; ctx.lineWidth = 1; drawRoundedRect(ctx, cx - 60 - i * 8, ly, 120 + i * 16, 26, 4); ctx.stroke(); ctx.setLineDash([]); ctx.font = '500 8px "Sora", sans-serif'; ctx.fillStyle = `rgba(103, 232, 249, ${opacity})`; ctx.fillText(label, cx, ly + 16) })
    drawVignette(ctx, w, h)
  },

  'design-drift-not-technical-debt': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0a0810', '#a855f7')
    const cx = w * 0.5, cy = h * 0.5, pathW = Math.min(w * 0.7, 320), startX = cx - pathW / 2
    ctx.setLineDash([6, 4]); ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(startX, cy); ctx.lineTo(startX + pathW, cy); ctx.stroke(); ctx.setLineDash([])
    ctx.strokeStyle = '#e879a0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(startX, cy)
    ctx.bezierCurveTo(startX + pathW * 0.3, cy - 5, startX + pathW * 0.5, cy + 20, startX + pathW * 0.7, cy + 35)
    ctx.bezierCurveTo(startX + pathW * 0.85, cy + 45, startX + pathW * 0.95, cy + 50, startX + pathW, cy + 55); ctx.stroke()
    ;[0.4, 0.6, 0.85].forEach(t => { const mx = startX + pathW * t; ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 0.8; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(mx, cy); ctx.lineTo(mx, Math.min(cy + t * t * 60, cy + 50)); ctx.stroke(); ctx.setLineDash([]) })
    ctx.font = '600 8px "Sora", sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(168, 85, 247, 0.7)'; ctx.fillText('INTENDED', startX + pathW + 8, cy + 3)
    ctx.fillStyle = 'rgba(232, 121, 160, 0.8)'; ctx.fillText('ACTUAL', startX + pathW + 8, cy + 58)
    ctx.font = '500 7px "Sora", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.textAlign = 'center'; ctx.fillText('← drift →', startX + pathW * 0.7, cy + 68)
    drawVignette(ctx, w, h)
  },

  'rag-knowledge-architecture': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a14', '#6366f1')
    const cx = w * 0.5, cy = h * 0.5
    const nodes = [{ x: cx - 80, y: cy - 30, label: 'DOC', color: '#818cf8', r: 10 }, { x: cx - 40, y: cy + 25, label: 'CHUNK', color: '#a78bfa', r: 8 }, { x: cx + 20, y: cy - 40, label: 'EMBED', color: '#34d399', r: 9 }, { x: cx + 70, y: cy + 10, label: 'INDEX', color: '#60a5fa', r: 10 }, { x: cx + 120, y: cy - 20, label: 'RETRIEVE', color: '#f59e0b', r: 9 }, { x: cx - 100, y: cy + 40, label: 'SOURCE', color: '#94a3b8', r: 7 }]
    const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 1]]
    edges.forEach(([a, b]) => { ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke() })
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)'; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y); ;[1, 2, 3, 4].forEach(i => ctx.lineTo(nodes[i].x, nodes[i].y)); ctx.stroke(); ctx.setLineDash([])
    nodes.forEach(n => { ctx.fillStyle = n.color + '30'; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = n.color; ctx.lineWidth = 1.2; ctx.stroke(); ctx.font = '500 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = n.color; ctx.fillText(n.label, n.x, n.y + n.r + 12) })
    drawVignette(ctx, w, h)
  },

  'knowing-vs-understanding-system': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#060a14', '#3b82f6')
    const cx = w * 0.5, cy = h * 0.45
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'; ctx.lineWidth = 1; ctx.setLineDash([8, 4]); ctx.beginPath(); ctx.moveTo(w * 0.15, cy); ctx.lineTo(w * 0.85, cy); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = 'rgba(148, 163, 184, 0.3)'; ctx.beginPath(); ctx.moveTo(cx, cy - 35); ctx.lineTo(cx + 25, cy); ctx.lineTo(cx - 25, cy); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = 'rgba(59, 130, 246, 0.12)'; ctx.beginPath(); ctx.moveTo(cx - 25, cy); ctx.lineTo(cx + 25, cy); ctx.lineTo(cx + 55, cy + 50); ctx.lineTo(cx + 30, cy + 80); ctx.lineTo(cx - 30, cy + 80); ctx.lineTo(cx - 55, cy + 50); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'; ctx.lineWidth = 1.2; ctx.stroke()
    ctx.font = '600 9px "Sora", sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(148, 163, 184, 0.8)'; ctx.fillText('KNOWING', cx + 35, cy - 15)
    ctx.fillStyle = 'rgba(96, 165, 250, 0.8)'; ctx.fillText('UNDERSTANDING', cx + 60, cy + 45)
    drawVignette(ctx, w, h)
  },

  'complexity-budgets': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0a0808', '#ef4444')
    const cx = w * 0.5, cy = h * 0.5, barW = Math.min(w * 0.6, 280), barH = 24, bx = cx - barW / 2
    drawRoundedRect(ctx, bx, cy - barH / 2, barW, barH, 12); ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; drawRoundedRect(ctx, bx, cy - barH / 2, barW, barH, 12); ctx.stroke()
    const segments = [{ w: 0.25, color: '#22c55e', label: 'Essential' }, { w: 0.2, color: '#eab308', label: 'Necessary' }, { w: 0.2, color: '#f97316', label: 'Incidental' }, { w: 0.15, color: '#ef4444', label: 'Accidental' }]
    let sx = bx + 2
    segments.forEach((seg, i) => { const segW = barW * seg.w - 2; ctx.fillStyle = seg.color + '60'; if (i === 0) { drawRoundedRect(ctx, sx, cy - barH / 2 + 2, segW, barH - 4, 10); ctx.fill() } else { ctx.fillRect(sx, cy - barH / 2 + 2, segW, barH - 4) }; ctx.font = '500 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = seg.color + 'aa'; ctx.fillText(seg.label, sx + segW / 2, cy + barH / 2 + 14); sx += segW + 2 })
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.moveTo(sx, cy - barH / 2 - 5); ctx.lineTo(sx, cy + barH / 2 + 5); ctx.stroke(); ctx.setLineDash([])
    ctx.font = '600 8px "Sora", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'center'; ctx.fillText('BUDGET REMAINING', sx + (bx + barW - sx) / 2, cy + 3)
    ctx.font = '600 9px "Sora", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText('COMPLEXITY BUDGET', cx, cy - barH / 2 - 15)
    drawVignette(ctx, w, h)
  },

  'staff-level-engineering': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0a080c', '#c084fc')
    const cx = w * 0.5, cy = h * 0.5
    const rings = ['Code', 'Team', 'Org', 'Industry']
    rings.forEach((label, i) => { const r = 20 + i * 28; ctx.strokeStyle = `rgba(192, 132, 252, ${0.5 - i * 0.1})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.font = '500 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = `rgba(192, 132, 252, ${0.7 - i * 0.12})`; ctx.fillText(label, cx + r * 0.7, cy - r * 0.7) })
    ctx.fillStyle = '#c084fc'; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill()
    ;[0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(angle => { ctx.strokeStyle = 'rgba(192, 132, 252, 0.2)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20); ctx.lineTo(cx + Math.cos(angle) * 100, cy + Math.sin(angle) * 100); ctx.stroke() })
    drawVignette(ctx, w, h)
  },

  'llm-pipelines-production': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a10', '#6366f1')
    const cx = w * 0.5, cy = h * 0.5
    const stages = ['INGEST', 'TRANSFORM', 'GENERATE', 'VALIDATE', 'SERVE']
    const stageW = 52, gap = 12, totalW = stages.length * stageW + (stages.length - 1) * gap, startX = cx - totalW / 2
    stages.forEach((stage, i) => {
      const sx = startX + i * (stageW + gap)
      drawRoundedRect(ctx, sx, cy - 18, stageW, 36, 4); ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'; ctx.fill(); ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)'; ctx.lineWidth = 1; drawRoundedRect(ctx, sx, cy - 18, stageW, 36, 4); ctx.stroke()
      ctx.font = '600 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(165, 180, 252, 0.9)'; ctx.fillText(stage, sx + stageW / 2, cy + 4)
      ctx.fillStyle = i !== 3 ? '#34d399' : '#fbbf24'; ctx.beginPath(); ctx.arc(sx + stageW / 2, cy - 10, 3, 0, Math.PI * 2); ctx.fill()
      if (i < stages.length - 1) { ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx + stageW + 2, cy); ctx.lineTo(sx + stageW + gap - 2, cy); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.moveTo(sx + stageW + gap - 2, cy); ctx.lineTo(sx + stageW + gap - 6, cy - 3); ctx.lineTo(sx + stageW + gap - 6, cy + 3); ctx.closePath(); ctx.fill() }
    })
    drawVignette(ctx, w, h)
  },

  'event-driven-architecture-cultural': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0a0a08', '#f59e0b')
    const cx = w * 0.5, cy = h * 0.5
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(w * 0.15, cy); ctx.lineTo(w * 0.85, cy); ctx.stroke()
    ctx.font = '700 8px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(245, 158, 11, 0.6)'; ctx.fillText('EVENT BUS', cx, cy - 8)
    const pubs = ['Team A', 'Team B', 'Team C']
    pubs.forEach((label, i) => { const px = w * 0.25 + i * (w * 0.2); ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, cy - 15); ctx.lineTo(px, cy - 35); ctx.stroke(); ctx.beginPath(); ctx.arc(px, cy - 42, 5, 0, Math.PI * 2); ctx.stroke(); ctx.font = '500 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(251, 191, 36, 0.7)'; ctx.fillText(label, px, cy - 55) })
    const subs = ['Service X', 'Service Y', 'Analytics']
    subs.forEach((label, i) => { const sx2 = w * 0.25 + i * (w * 0.2); ctx.strokeStyle = 'rgba(34, 211, 153, 0.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx2, cy + 15); ctx.lineTo(sx2, cy + 35); ctx.stroke(); drawRoundedRect(ctx, sx2 - 12, cy + 35, 24, 16, 3); ctx.stroke(); ctx.font = '500 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(34, 211, 153, 0.7)'; ctx.fillText(label, sx2, cy + 65) })
    for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(251, 191, 36, 0.6)'; ctx.beginPath(); ctx.arc(w * 0.2 + i * (w * 0.15), cy, 3, 0, Math.PI * 2); ctx.fill() }
    drawVignette(ctx, w, h)
  },

  'fourteen-years-software': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0c0808', '#d4a574')
    const cx = w * 0.5, cy = h * 0.5
    for (let i = 1; i <= 14; i++) { ctx.strokeStyle = `rgba(212, 165, 116, ${0.1 + (i / 14) * 0.35})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, 6 + i * 6, 0, Math.PI * 2); ctx.stroke() }
    ctx.fillStyle = '#d4a574'; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill()
    const markers = [{ ring: 3, label: "'12" }, { ring: 7, label: "'16" }, { ring: 10, label: "'20" }, { ring: 14, label: "'26" }]
    markers.forEach(m => { const r = 6 + m.ring * 6, angle = -Math.PI / 4; const mx = cx + Math.cos(angle) * r, my = cy + Math.sin(angle) * r; ctx.fillStyle = '#d4a574'; ctx.beginPath(); ctx.arc(mx, my, 3, 0, Math.PI * 2); ctx.fill(); ctx.font = '500 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(212, 165, 116, 0.8)'; ctx.fillText(m.label, mx + 12, my - 4) })
    ctx.font = '600 8px "Sora", sans-serif'; ctx.fillStyle = 'rgba(212, 165, 116, 0.3)'; ctx.textAlign = 'center'; ctx.fillText('COMPOUNDING JUDGMENT', cx, cy + 100)
    drawVignette(ctx, w, h)
  },

  'five-questions-system-design': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a12', '#6366f1')
    const cx = w * 0.5, cy = h * 0.5, r = Math.min(h * 0.32, 65)
    const questions = ['WHY?', 'WHAT?', 'HOW?', 'WHO?', 'WHEN?']
    const nodes = questions.map((q, i) => { const angle = -Math.PI / 2 + (i * Math.PI * 2) / 5; return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, label: q } })
    nodes.forEach((a, i) => { nodes.forEach((b, j) => { if (j > i) { ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() } }) })
    nodes.forEach(n => { ctx.fillStyle = 'rgba(99, 102, 241, 0.2)'; ctx.beginPath(); ctx.arc(n.x, n.y, 16, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.font = '700 8px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#c7d2fe'; ctx.fillText(n.label, n.x, n.y + 3) })
    ctx.font = '700 18px "Sora", sans-serif'; ctx.fillStyle = 'rgba(99, 102, 241, 0.3)'; ctx.textAlign = 'center'; ctx.fillText('?', cx, cy + 7)
    drawVignette(ctx, w, h)
  },

  'ai-integrations-fail': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0c0808', '#ef4444')
    const cx = w * 0.5, cy = h * 0.5
    drawRoundedRect(ctx, cx - 100, cy - 18, 60, 36, 6); ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'; ctx.fill(); ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1.5; drawRoundedRect(ctx, cx - 100, cy - 18, 60, 36, 6); ctx.stroke()
    ctx.font = '600 8px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#93c5fd'; ctx.fillText('SYSTEM', cx - 70, cy + 4)
    drawRoundedRect(ctx, cx + 40, cy - 18, 60, 36, 6); ctx.fillStyle = 'rgba(168, 85, 247, 0.15)'; ctx.fill(); ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 1.5; drawRoundedRect(ctx, cx + 40, cy - 18, 60, 36, 6); ctx.stroke()
    ctx.fillStyle = '#c084fc'; ctx.fillText('AI', cx + 70, cy + 4)
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 38, cy); ctx.lineTo(cx - 15, cy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + 15, cy); ctx.lineTo(cx + 38, cy); ctx.stroke()
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - 8, cy - 8); ctx.lineTo(cx + 2, cy - 2); ctx.lineTo(cx - 4, cy + 2); ctx.lineTo(cx + 8, cy + 8); ctx.stroke()
    ctx.font = '700 16px "Sora", sans-serif'; ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'; ctx.textAlign = 'center'; ctx.fillText('×', cx, cy + 35)
    drawVignette(ctx, w, h)
  },

  'architecture-reviews-useful': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a10', '#06b6d4')
    const cx = w * 0.5, cy = h * 0.5
    const layers = [{ y: cy - 30, w: 160, label: 'PRESENTATION', color: '#60a5fa' }, { y: cy - 5, w: 180, label: 'BUSINESS LOGIC', color: '#818cf8' }, { y: cy + 20, w: 200, label: 'DATA LAYER', color: '#a78bfa' }, { y: cy + 45, w: 220, label: 'INFRASTRUCTURE', color: '#6366f1' }]
    layers.forEach(l => { ctx.fillStyle = l.color + '15'; ctx.fillRect(cx - l.w / 2, l.y, l.w, 20); ctx.strokeStyle = l.color + '40'; ctx.lineWidth = 0.8; ctx.strokeRect(cx - l.w / 2, l.y, l.w, 20); ctx.font = '500 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = l.color + '90'; ctx.fillText(l.label, cx, l.y + 13) })
    const lensX = cx + 50, lensY = cy - 10, lensR = 28
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(lensX + lensR * 0.7, lensY + lensR * 0.7); ctx.lineTo(lensX + lensR * 1.2, lensY + lensR * 1.2); ctx.stroke()
    const lensGlow = ctx.createRadialGradient(lensX, lensY, 0, lensX, lensY, lensR); lensGlow.addColorStop(0, 'rgba(6, 182, 212, 0.15)'); lensGlow.addColorStop(1, 'transparent'); ctx.fillStyle = lensGlow; ctx.beginPath(); ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2); ctx.fill()
    drawVignette(ctx, w, h)
  },

  'eventual-consistency-hidden-costs': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a0c', '#f59e0b')
    const cx = w * 0.5, cy = h * 0.5, pathW = Math.min(w * 0.65, 300), sx = cx - pathW / 2
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx, cy); ctx.bezierCurveTo(sx + pathW * 0.3, cy - 25, sx + pathW * 0.5, cy - 30, sx + pathW * 0.7, cy - 15); ctx.bezierCurveTo(sx + pathW * 0.85, cy - 5, sx + pathW * 0.95, cy, sx + pathW, cy); ctx.stroke()
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx, cy); ctx.bezierCurveTo(sx + pathW * 0.3, cy + 25, sx + pathW * 0.5, cy + 30, sx + pathW * 0.7, cy + 15); ctx.bezierCurveTo(sx + pathW * 0.85, cy + 5, sx + pathW * 0.95, cy, sx + pathW, cy); ctx.stroke()
    ctx.fillStyle = '#34d399'; ctx.beginPath(); ctx.arc(sx + pathW, cy, 5, 0, Math.PI * 2); ctx.fill()
    ;[0.35, 0.5, 0.65].forEach(t => { ctx.font = '700 11px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(245, 158, 11, 0.5)'; ctx.fillText('$', sx + pathW * t, cy + 3) })
    ctx.font = '500 8px "Sora", sans-serif'; ctx.fillStyle = 'rgba(96, 165, 250, 0.7)'; ctx.textAlign = 'left'; ctx.fillText('Replica A', sx - 5, cy - 35)
    ctx.fillStyle = 'rgba(167, 139, 250, 0.7)'; ctx.fillText('Replica B', sx - 5, cy + 42)
    ctx.fillStyle = 'rgba(52, 211, 153, 0.7)'; ctx.textAlign = 'right'; ctx.fillText('Converge', sx + pathW + 5, cy - 10)
    drawVignette(ctx, w, h)
  },

  'agent-harness-framework': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080812', '#8b5cf6')
    const cx = w * 0.5, cy = h * 0.5
    // Framework layers stacked
    const layers = [{ label: 'OBSERVE', color: '#60a5fa', y: cy - 40 }, { label: 'DECIDE', color: '#a78bfa', y: cy - 10 }, { label: 'ACT', color: '#f59e0b', y: cy + 20 }, { label: 'LEARN', color: '#34d399', y: cy + 50 }]
    layers.forEach((l, i) => { const lw = 120 - i * 10; drawRoundedRect(ctx, cx - lw / 2, l.y, lw, 22, 4); ctx.fillStyle = l.color + '15'; ctx.fill(); ctx.strokeStyle = l.color + '50'; ctx.lineWidth = 1; drawRoundedRect(ctx, cx - lw / 2, l.y, lw, 22, 4); ctx.stroke(); ctx.font = '600 8px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = l.color + 'cc'; ctx.fillText(l.label, cx, l.y + 14) })
    // Cycle arrow on side
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx + 80, cy + 5, 40, -Math.PI * 0.7, Math.PI * 0.7); ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.moveTo(cx + 80 + 40 * Math.cos(Math.PI * 0.7), cy + 5 + 40 * Math.sin(Math.PI * 0.7)); ctx.lineTo(cx + 80 + 34 * Math.cos(Math.PI * 0.7), cy + 5 + 34 * Math.sin(Math.PI * 0.7) - 5); ctx.lineTo(cx + 80 + 46 * Math.cos(Math.PI * 0.7), cy + 5 + 34 * Math.sin(Math.PI * 0.7)); ctx.closePath(); ctx.fill()
    drawVignette(ctx, w, h)
  },

  'prompt-injection-firewall': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#0a0808', '#ef4444')
    const cx = w * 0.5, cy = h * 0.5
    // Firewall wall
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(cx, cy - 50); ctx.lineTo(cx, cy + 50); ctx.stroke()
    // Bricks pattern on wall
    for (let i = 0; i < 5; i++) { ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)'; ctx.lineWidth = 0.8; ctx.strokeRect(cx - 4, cy - 45 + i * 20, 8, 18) }
    // Incoming arrows (left, blocked)
    for (let i = 0; i < 3; i++) { const ay = cy - 20 + i * 20; ctx.strokeStyle = 'rgba(248, 113, 113, 0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - 80, ay); ctx.lineTo(cx - 12, ay); ctx.stroke(); ctx.font = '700 10px "Sora", sans-serif'; ctx.fillStyle = '#ef4444'; ctx.textAlign = 'center'; ctx.fillText('×', cx - 8, ay + 4) }
    // Safe arrow (passes through)
    ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - 80, cy + 40); ctx.lineTo(cx + 80, cy + 40); ctx.stroke()
    ctx.fillStyle = '#34d399'; ctx.beginPath(); ctx.moveTo(cx + 80, cy + 40); ctx.lineTo(cx + 74, cy + 37); ctx.lineTo(cx + 74, cy + 43); ctx.closePath(); ctx.fill()
    ctx.font = '600 8px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(239, 68, 68, 0.7)'; ctx.fillText('INJECTION', cx - 50, cy - 45)
    ctx.fillStyle = 'rgba(52, 211, 153, 0.7)'; ctx.fillText('SAFE', cx + 50, cy + 35)
    drawVignette(ctx, w, h)
  },

  'a2a-protocol-gateway': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a12', '#3b82f6')
    const cx = w * 0.5, cy = h * 0.5
    // Multiple agents connecting through a gateway
    const agents = [{ x: cx - 90, y: cy - 30 }, { x: cx - 90, y: cy + 30 }, { x: cx + 90, y: cy - 30 }, { x: cx + 90, y: cy + 30 }]
    agents.forEach((a, i) => { ctx.fillStyle = 'rgba(99, 102, 241, 0.2)'; ctx.beginPath(); ctx.arc(a.x, a.y, 14, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.font = '600 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#c7d2fe'; ctx.fillText(`A${i + 1}`, a.x, a.y + 3) })
    // Gateway in center
    drawRoundedRect(ctx, cx - 25, cy - 20, 50, 40, 8); ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'; ctx.fill(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; drawRoundedRect(ctx, cx - 25, cy - 20, 50, 40, 8); ctx.stroke()
    ctx.font = '700 8px "Sora", sans-serif'; ctx.fillStyle = '#60a5fa'; ctx.textAlign = 'center'; ctx.fillText('A2A', cx, cy - 3); ctx.fillText('GW', cx, cy + 9)
    // Connections
    agents.forEach(a => { ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(a.x + (a.x < cx ? 14 : -14), a.y); ctx.lineTo(cx + (a.x < cx ? -25 : 25), cy); ctx.stroke(); ctx.setLineDash([]) })
    drawVignette(ctx, w, h)
  },

  'eval-pipeline-drift': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a0c', '#f59e0b')
    const cx = w * 0.5, cy = h * 0.5
    // Eval score declining over time
    const lineW = Math.min(w * 0.65, 300), sx = cx - lineW / 2
    // Threshold line
    ctx.setLineDash([4, 3]); ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, cy + 20); ctx.lineTo(sx + lineW, cy + 20); ctx.stroke(); ctx.setLineDash([])
    ctx.font = '500 7px "Sora", sans-serif'; ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'; ctx.textAlign = 'right'; ctx.fillText('threshold', sx - 5, cy + 23)
    // Score line drifting down
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, cy - 30)
    ctx.bezierCurveTo(sx + lineW * 0.2, cy - 28, sx + lineW * 0.4, cy - 20, sx + lineW * 0.6, cy + 5)
    ctx.bezierCurveTo(sx + lineW * 0.75, cy + 15, sx + lineW * 0.9, cy + 25, sx + lineW, cy + 35); ctx.stroke()
    // Alert marker where it crosses threshold
    const crossX = sx + lineW * 0.65
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(crossX, cy + 20, 5, 0, Math.PI * 2); ctx.fill()
    ctx.font = '600 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ef4444'; ctx.fillText('DRIFT ALERT', crossX, cy + 35)
    ctx.font = '500 7px "Sora", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.textAlign = 'left'; ctx.fillText('eval score', sx, cy - 40); ctx.textAlign = 'right'; ctx.fillText('time →', sx + lineW, cy + 50)
    drawVignette(ctx, w, h)
  },

  'qmd-query-documents': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a10', '#06b6d4')
    const cx = w * 0.5, cy = h * 0.5
    // Query flowing through documents
    ctx.font = '500 9px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#67e8f9'
    ctx.fillText('SELECT * FROM knowledge', cx, cy - 35)
    // Arrow down
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy - 25); ctx.lineTo(cx, cy - 10); ctx.stroke()
    ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'; ctx.beginPath(); ctx.moveTo(cx, cy - 8); ctx.lineTo(cx - 4, cy - 14); ctx.lineTo(cx + 4, cy - 14); ctx.closePath(); ctx.fill()
    // Document icons
    const docs = [{ x: cx - 60, y: cy }, { x: cx - 20, y: cy }, { x: cx + 20, y: cy }, { x: cx + 60, y: cy }]
    docs.forEach((d, i) => { ctx.fillStyle = `rgba(6, 182, 212, ${0.1 + i * 0.05})`; ctx.fillRect(d.x - 12, d.y, 24, 30); ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + i * 0.1})`; ctx.lineWidth = 0.8; ctx.strokeRect(d.x - 12, d.y, 24, 30); for (let l = 0; l < 3; l++) { ctx.fillStyle = `rgba(103, 232, 249, ${0.2 + i * 0.05})`; ctx.fillRect(d.x - 8, d.y + 6 + l * 8, 16, 2) } })
    // Result arrow down
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy + 35); ctx.lineTo(cx, cy + 50); ctx.stroke()
    ctx.font = '600 8px "Sora", sans-serif'; ctx.fillStyle = '#34d399'; ctx.fillText('RESULT', cx, cy + 65)
    drawVignette(ctx, w, h)
  },

  'rag-semantic-chunking': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a10', '#8b5cf6')
    const cx = w * 0.5, cy = h * 0.5
    // Document being split into semantic chunks
    // Full document on left
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)'; ctx.lineWidth = 1.2; ctx.strokeRect(cx - 100, cy - 40, 50, 80)
    for (let i = 0; i < 8; i++) { ctx.fillStyle = 'rgba(139, 92, 246, 0.2)'; ctx.fillRect(cx - 94, cy - 34 + i * 9, 38, 3) }
    // Arrow
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - 42, cy); ctx.lineTo(cx - 20, cy); ctx.stroke()
    // Chunks on right (different colors = semantic boundaries)
    const chunks = [{ y: cy - 35, h: 20, color: '#a78bfa' }, { y: cy - 10, h: 25, color: '#818cf8' }, { y: cy + 20, h: 18, color: '#6366f1' }]
    chunks.forEach(c => { drawRoundedRect(ctx, cx - 10, c.y, 60, c.h, 4); ctx.fillStyle = c.color + '20'; ctx.fill(); ctx.strokeStyle = c.color + '60'; ctx.lineWidth = 1; drawRoundedRect(ctx, cx - 10, c.y, 60, c.h, 4); ctx.stroke() })
    // Embedding vectors on far right
    ctx.font = '500 7px "JetBrains Mono", monospace'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(167, 139, 250, 0.6)'
    ctx.fillText('[0.82, 0.11, ...]', cx + 65, cy - 25); ctx.fillText('[0.34, 0.77, ...]', cx + 65, cy + 3); ctx.fillText('[0.56, 0.43, ...]', cx + 65, cy + 30)
    ctx.font = '600 8px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(139, 92, 246, 0.5)'; ctx.fillText('SEMANTIC BOUNDARIES', cx, cy + 60)
    drawVignette(ctx, w, h)
  },

  'agent-orchestrator': (ctx, w, h) => {
    drawBackground(ctx, w, h, '#080a14', '#6366f1')
    const cx = w * 0.5, cy = h * 0.5
    // Central orchestrator with agents around it
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)'; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2; ctx.stroke()
    ctx.font = '700 7px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#c7d2fe'; ctx.fillText('ORCH', cx, cy + 3)
    const agents = [
      { angle: 0, label: 'PLANNER', color: '#60a5fa' },
      { angle: Math.PI * 0.5, label: 'EXECUTOR', color: '#34d399' },
      { angle: Math.PI, label: 'CRITIC', color: '#f87171' },
      { angle: Math.PI * 1.5, label: 'MEMORY', color: '#fbbf24' },
    ]
    agents.forEach(a => {
      const dist = 65, ax = cx + Math.cos(a.angle) * dist, ay = cy + Math.sin(a.angle) * dist
      ctx.strokeStyle = a.color + '40'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a.angle) * 22, cy + Math.sin(a.angle) * 22); ctx.lineTo(ax - Math.cos(a.angle) * 12, ay - Math.sin(a.angle) * 12); ctx.stroke(); ctx.setLineDash([])
      ctx.fillStyle = a.color + '25'; ctx.beginPath(); ctx.arc(ax, ay, 12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = a.color; ctx.lineWidth = 1; ctx.stroke()
      ctx.font = '500 6px "Sora", sans-serif'; ctx.fillStyle = a.color; ctx.fillText(a.label, ax, ay + 22)
    })
    drawVignette(ctx, w, h)
  },
}

// ─── Fallback for unmapped articles ───
function drawFallback(ctx, w, h, slug, category) {
  const pals = { 'AI Systems': { bg: '#080818', c1: '#7b6cf0', c2: '#22d3c8' }, 'Architecture': { bg: '#081018', c1: '#06b6d4', c2: '#3b82f6' }, 'Reflection': { bg: '#100818', c1: '#e879a0', c2: '#a855f7' }, 'Leadership': { bg: '#0f0a04', c1: '#f59e0b', c2: '#ef4444' } }
  const pal = pals[category] || { bg: '#080810', c1: '#7b6cf0', c2: '#22d3c8' }
  drawBackground(ctx, w, h, pal.bg, pal.c1)
  const cx = w * 0.5, cy = h * 0.5
  const seed = slug.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)
  const count = 5 + Math.abs(seed % 4)
  for (let i = 0; i < count; i++) { const r = 20 + i * 18; const startAngle = (Math.abs(seed) + i * 47) % 360 * Math.PI / 180; const arcLen = Math.PI * (0.4 + (i % 3) * 0.3); ctx.strokeStyle = `rgba(${hexToRgb(i % 2 === 0 ? pal.c1 : pal.c2).join(',')}, ${0.3 - i * 0.03})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, startAngle + arcLen); ctx.stroke() }
  const initials = slug.split('-').slice(0, 3).map(w2 => w2[0].toUpperCase()).join('')
  ctx.font = '700 16px "Sora", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillText(initials, cx, cy + 6)
  drawVignette(ctx, w, h)
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

    const renderer = COVERS[slug]
    if (renderer) {
      renderer(ctx, w, h)
    } else {
      drawFallback(ctx, w, h, slug, category)
    }
  }, [slug, category, height])

  return (
    <canvas
      ref={canvasRef}
      className={`generative-cover ${className}`}
      style={{ width: '100%', height, display: 'block', borderRadius: 'var(--radius)' }}
    />
  )
}
