import test from 'node:test'
import assert from 'node:assert/strict'
import { ARTICLES } from '../src/data/content.js'
import { JOURNEYS, journeyArticles, journeyPosition } from '../src/data/journeys.js'

test('every curated path resolves to three distinct published essays in editorial order', () => {
  for (const journey of JOURNEYS) {
    const entries = journeyArticles(journey, ARTICLES)
    assert.equal(entries.length, 3, journey.id)
    assert.equal(new Set(entries.map(a => a.slug)).size, 3)
    assert.deepEqual(entries.map(a => a.slug), journey.slugs)
  }
})
test('reading paths advance correctly and finish without wrapping to the beginning', () => {
  for (const journey of JOURNEYS) {
    journey.slugs.forEach((slug, index) => {
      const position = journeyPosition(journey.id, slug, ARTICLES)
      assert.equal(position.index, index)
      assert.equal(position.next?.slug || null, journey.slugs[index + 1] || null)
    })
  }
})
test('invalid paths and missing essays cannot produce a misleading progress indicator', () => {
  assert.equal(journeyPosition('missing', JOURNEYS[0].slugs[0], ARTICLES), null)
  assert.equal(journeyPosition('agents', 'missing', ARTICLES), null)
  assert.equal(journeyPosition('agents', JOURNEYS[0].slugs[0], []), null)
})
