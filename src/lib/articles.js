export const TOPICS = [
  { name: 'AI Systems', number: '01', color: '#bbd9d0', description: 'From promising models to dependable systems.', short: 'Intelligence, engineered.' },
  { name: 'Architecture', number: '02', color: '#d8b987', description: 'The decisions that shape software over time.', short: 'Structure with intention.' },
  { name: 'Reflection', number: '03', color: '#bdb0d9', description: 'Lessons from the work, and the thinking behind it.', short: 'Perspective from practice.' },
  { name: 'Leadership', number: '04', color: '#dba795', description: 'Building judgment, teams, and engineering culture.', short: 'Better systems start with people.' },
]

export function isRecent(date, now = Date.now()) {
  const age = now - new Date(date).getTime()
  return age >= 0 && age < 14 * 24 * 60 * 60 * 1000
}

export function findArticles(articles, { topic = 'All', query = '', sort = 'newest', maxMinutes = 0, format = 'All', bodies = {} } = {}) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return articles.filter(article => {
    const text = [article.title, article.excerpt, article.category, ...(article.tags || []), bodies[article.slug] || ''].join(' ').toLowerCase()
    return (topic === 'All' || article.category === topic) && (!maxMinutes || parseInt(article.readTime, 10) <= Number(maxMinutes)) && (format === 'All' || article.format === format) && terms.every(term => text.includes(term))
  }).sort((a, b) => sort === 'oldest'
    ? new Date(a.date) - new Date(b.date)
    : new Date(b.date) - new Date(a.date))
}

export const topicPath = name => `/writing?topic=${encodeURIComponent(name)}`
