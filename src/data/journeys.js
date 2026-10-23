// Editorial reading sequences drawn from existing essays, not generated content.
export const JOURNEYS = [
  {
    id: 'agents', title: 'Build agents that endure.', label: 'Production AI', color: '#bbd9d0',
    description: 'Start with the architecture. Add control. Design for the moment something fails.',
    slugs: ['invisible-architecture-agentic-workflow', 'agentic-ai-harness-engineering', 'agents-survive-failure-checkpointing'],
  },
  {
    id: 'systems', title: 'See the whole system.', label: 'Architectural judgment', color: '#d8b987',
    description: 'A path through the questions, constraints, and tradeoffs behind better system design.',
    slugs: ['five-questions-system-design', 'complexity-budgets', 'eventual-consistency-hidden-costs'],
  },
  {
    id: 'craft', title: 'Grow beyond the code.', label: 'The engineering craft', color: '#bdb0d9',
    description: 'Explore how understanding, experience, and leadership change the way we build.',
    slugs: ['knowing-vs-understanding-system', 'staff-level-engineering', 'fourteen-years-software'],
  },
]

export function journeyArticles(journey, articles) {
  return journey.slugs.map(slug => articles.find(a => a.slug === slug)).filter(Boolean)
}

export function journeyPosition(id, slug, articles) {
  const journey = JOURNEYS.find(j => j.id === id && j.slugs.includes(slug))
  if (!journey) return null
  const entries = journeyArticles(journey, articles)
  const index = entries.findIndex(a => a.slug === slug)
  if (index < 0) return null
  return { journey, entries, index, next: entries[index + 1] || null }
}
