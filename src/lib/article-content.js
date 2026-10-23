export function plainText(html = '') {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" }
  return html.replace(/<[^>]*>/g, ' ').replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (all, code) => {
    if (entities[code]) return entities[code]
    if (code.startsWith('#')) { const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1)); return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : all }
    return all
  }).replace(/\s+/g, ' ').trim()
}
export function articleBody(html) {
  const used = new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]))
  return html.replace(/<h([234])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, title) => {
    if (/\bid\s*=/i.test(attrs)) return match
    const base = plainText(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'
    let id = base, count = 1
    while (used.has(id)) id = `${base}-${++count}`
    used.add(id)
    return `<h${level}${attrs} id="${id}">${title}</h${level}>`
  })
}
export function searchPassage(text, query, length = 190) {
  const term = query.toLowerCase().trim().split(/\s+/).filter(Boolean).find(t => text.toLowerCase().includes(t))
  if (!term) return ''
  const position = text.toLowerCase().indexOf(term)
  const start = Math.max(0, position - 55)
  return (start ? '…' : '') + text.slice(start, start + length).trim() + (start + length < text.length ? '…' : '')
}
