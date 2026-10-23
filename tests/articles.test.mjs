import test from 'node:test'
import assert from 'node:assert/strict'
import { findArticles, isRecent, topicPath } from '../src/lib/articles.js'

const articles = [
  { slug: 'older', title: 'Agent recovery', excerpt: 'Reliable workflows', category: 'AI Systems', tags: ['Checkpoints'], date: '2026-01-01' },
  { slug: 'newer', title: 'Design decisions', excerpt: 'Reliable architecture', category: 'Architecture', date: '2026-02-01' },
  { slug: 'middle', title: 'AI evaluation', excerpt: 'Reliable production agents', category: 'AI Systems', date: '2026-01-15' },
]
test('the library defaults to all articles, newest first, without mutating the source', () => {
  assert.deepEqual(findArticles(articles).map(a => a.slug), ['newer', 'middle', 'older'])
  assert.equal(articles[0].slug, 'older')
})
test('topic and multi-word search intersect across title, tags, and excerpt', () => {
  assert.deepEqual(findArticles(articles, { topic: 'AI Systems', query: '  RELIABLE checkpoints ' }).map(a => a.slug), ['older'])
  assert.equal(findArticles(articles, { topic: 'Architecture', query: 'agents' }).length, 0)
})
test('oldest-first sorting and no-results searches', () => {
  assert.deepEqual(findArticles(articles, { sort: 'oldest' }).map(a => a.slug), ['older', 'middle', 'newer'])
  assert.deepEqual(findArticles(articles, { query: 'nonexistent' }), [])
})
test('new badges reject future dates, invalid dates, and articles older than two weeks', () => {
  const now = Date.parse('2026-06-15T00:00:00Z')
  assert.equal(isRecent('2026-06-14', now), true)
  assert.equal(isRecent('2026-06-01', now), false)
  assert.equal(isRecent('2026-06-16', now), false)
  assert.equal(isRecent('invalid', now), false)
})
test('topic URLs round-trip names with spaces', () => {
  assert.equal(new URLSearchParams(topicPath('AI Systems').split('?')[1]).get('topic'), 'AI Systems')
})
