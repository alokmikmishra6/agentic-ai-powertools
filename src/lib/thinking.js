// Preserve numeric links shared before the dated notebook.
export const LEGACY_INQUIRIES = ['agent-trust-architecture', 'edge-cloud-continuum', 'observability-epistemology']
export function orderedInquiries(items) {
  return [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}
export function selectInquiry(items, value) {
  const slug = /^\d+$/.test(value || '') ? LEGACY_INQUIRIES[Number(value) - 1] : value
  return items.find(item => item.slug === slug) || orderedInquiries(items).find(item => item.status !== 'archived') || items[0]
}
