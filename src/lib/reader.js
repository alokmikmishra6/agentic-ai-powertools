export const EMPTY_READER = Object.freeze({ saved: [], reading: {} })
export function normalizeReader(value) {
  const valid = slug => typeof slug === 'string' && /^[a-z0-9-]{1,160}$/.test(slug)
  if (!value || typeof value !== 'object') return { saved: [], reading: {} }
  const saved = [...new Set((Array.isArray(value.saved) ? value.saved : []).filter(valid))].slice(0, 1000)
  const reading = {}
  for (const [slug, entry] of Object.entries(value.reading || {}).slice(0, 1000)) {
    if (!valid(slug) || !entry || typeof entry !== 'object') continue
    reading[slug] = { section: typeof entry.section === 'string' ? entry.section.slice(0, 200) : '', progress: Math.min(1, Math.max(0, Number(entry.progress) || 0)), completed: entry.completed === true, updatedAt: Number(entry.updatedAt) || 0 }
  }
  return { saved, reading }
}
export function updateReader(state, action) {
  if (action.type === 'clear') return { saved: [], reading: {} }
  if (action.type === 'save') return normalizeReader({ ...state, saved: state.saved.includes(action.slug) ? state.saved.filter(s => s !== action.slug) : [...state.saved, action.slug] })
  const previous = state.reading[action.slug] || {}
  return normalizeReader({ ...state, reading: { ...state.reading, [action.slug]: { ...previous, ...action.entry, updatedAt: action.now || Date.now() } } })
}
