import { SHOWCASE } from '../data/content.js'

export function normalizeShowcase(item) {
  return {
    ...item,
    slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    problem: item.problem || item.description || '',
    architecture: item.architecture || item.diagram || '',
    code: item.code || '',
    approach: item.approach || '',
    runInstructions: item.runInstructions || '',
    outcomes: item.outcomes || [],
    lessons: item.lessons || [],
  }
}

export const PROJECTS = SHOWCASE.map(normalizeShowcase).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
