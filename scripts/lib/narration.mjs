import { createHash } from 'node:crypto'
import { parseHTML } from 'linkedom'

export const narrationHash = article => createHash('sha256').update(article.title + '\n' + article.body).digest('hex')
export function pronunciation(text) {
  const terms = { AI: 'A I', APIs: 'A P I s', API: 'A P I', LLM: 'L L M', MCP: 'M C P', SQL: 'S Q L', CPU: 'C P U', GPU: 'G P U', CI: 'C I', CD: 'C D', RAG: 'retrieval augmented generation' }
  return text.replace(/\b(AI|APIs|API|LLM|MCP|SQL|CPU|GPU|CI|CD|RAG)\b/g, word => terms[word])
    .replace(/https?:\/\/\S+/g, 'the linked resource').replace(/(\d+)%/g, '$1 percent')
    .replace(/\s+/g, ' ').trim()
}
export function narrationBlocks(article) {
  const { document } = parseHTML('<html><body><main>' + article.body + '</main></body></html>')
  const root = document.querySelector('main')
  // Skip visual implementations and non-prose content; keep linked anchor text.
  root.querySelectorAll('pre, table, svg, canvas, script, style, [aria-hidden="true"]').forEach(node => node.remove())
  const blocks = [{ text: pronunciation(article.title), heading: article.title }]
  for (const node of root.querySelectorAll('h2,h3,h4,p,li,blockquote')) {
    if (node.parentElement?.closest('li,blockquote')) continue
    const text = pronunciation(node.textContent)
    if (text) blocks.push({ text, heading: /^H[234]$/.test(node.tagName) ? node.textContent.trim() : null })
  }
  return blocks
}
export function splitSpeech(text, limit = 280) {
  if (limit < 40) throw new Error('Speech chunk limit is too small')
  const chunks = []
  for (const { segment } of new Intl.Segmenter('en', { granularity: 'sentence' }).segment(text)) {
    let chunk = ''
    for (const word of segment.trim().split(/\s+/)) {
      // Also bound unusually long identifiers rather than silently truncating them.
      const pieces = word.match(new RegExp(`.{1,${limit}}`, 'gu')) || []
      for (const piece of pieces) {
        if ((chunk + ' ' + piece).trim().length > limit && chunk) { chunks.push(chunk); chunk = '' }
        chunk = (chunk + ' ' + piece).trim()
      }
    }
    if (chunk) chunks.push(chunk)
  }
  return chunks
}
export function validNarrations(manifest, articles, fileExists) {
  return Object.fromEntries(articles.flatMap(article => {
    const entry = manifest[article.slug]
    if (!entry || entry.sourceHash !== narrationHash(article)) return []
    const recordings = (entry.recordings || []).filter(recording => /^audio\/[a-z0-9-]+\.(m4a|mp3|wav)$/.test(recording.src) && recording.duration > 0 && fileExists(recording.src))
    return recordings.length ? [[article.slug, { ...entry, recordings }]] : []
  }))
}
