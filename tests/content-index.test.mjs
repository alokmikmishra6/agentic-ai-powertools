import test from 'node:test'
import { FORMATS } from '../src/data/editorial.js'
import assert from 'node:assert/strict'
import { ARTICLES as full, DOMAINS, PILLARS, THINKING } from '../src/data/content.js'
import { ARTICLES as index, PROJECTS, DOMAINS as domains, PILLARS as pillars, THINKING as thinking } from '../src/data/index.js'
import { PROJECTS as projects } from '../src/lib/showcase.js'

test('the browsing index preserves article metadata and excludes full bodies', () => {
  assert.deepEqual(index, full.map(({ body, ...metadata }) => ({ ...metadata, format: FORMATS[metadata.slug] || "Deep dive" })))
  assert.equal(new Set(index.map(a => a.slug)).size, index.length)
  assert.ok(index.every(a => !('body' in a)))
})
test('search projects point to the same unique projects as the full showcase', () => {
  assert.deepEqual(PROJECTS, projects.map(({ slug, title, tag, problem }) => ({ slug, title, tag, problem })))
  assert.equal(new Set(PROJECTS.map(p => p.slug)).size, PROJECTS.length)
  assert.ok(PROJECTS.every(p => !('code' in p) && !('architecture' in p)))
})
test('author and inquiry content stays in sync with the publishing source', () => {
  assert.deepEqual(domains, DOMAINS)
  assert.deepEqual(pillars, PILLARS)
  assert.deepEqual(thinking, THINKING)
})
