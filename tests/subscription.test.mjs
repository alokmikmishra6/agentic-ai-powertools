import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../workers/subscribe-proxy.js'
import { ARTICLES } from '../src/data/content.js'
import { feedItems, renderFeed, SITE_URL } from '../scripts/generate-rss.mjs'

test('subscription preflight allows the actual published site and local preview', async () => {
  for (const origin of ['https://alokmikmishra6.github.io', 'http://127.0.0.1:5173', 'http://localhost:5173']) {
    const response = await worker.fetch(new Request('https://example.com', { method: 'OPTIONS', headers: { Origin: origin } }), {})
    assert.equal(response.status, 204)
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin)
    assert.equal(response.headers.get('Vary'), 'Origin')
  }
})
test('unrelated origins are rejected before any subscription can be sent', async () => {
  for (const method of ['OPTIONS', 'POST']) {
    const response = await worker.fetch(new Request('https://example.com', { method, headers: { Origin: 'https://example.org' } }), {})
    assert.equal(response.status, 403)
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null)
  }
})
test('RSS links use the actual site and routes understood by this app', () => {
  const items = feedItems()
  assert.equal(new Set(items.map(item => item.link)).size, items.length)
  for (const article of ARTICLES) assert.ok(items.some(item => item.link.endsWith('/writing/' + article.slug)))
  for (const item of items) {
    const url = new URL(item.link)
    assert.equal(url.origin, 'https://alokmikmishra6.github.io')
    if (item.category === 'Showcase') assert.match(url.pathname + url.search, /\/showcase\/\?project=/)
    if (item.category === 'Thinking') assert.match(url.pathname + url.search, /\/thinking\/\?idea=\d+$/)
  }
})
test('RSS escapes XML content and omits fabricated or invalid publication dates', () => {
  const xml = renderFeed([{title:'A & B < C',description:'"test"',category:'AI',link:SITE_URL + '/#/showcase?project=x&extra=y',date:'invalid'}])
  assert.match(xml, /A &amp; B &lt; C/)
  assert.match(xml, /project=x&amp;extra=y/)
  assert.ok(!xml.includes('<pubDate>'))
  assert.ok(!xml.includes('Invalid Date'))
})
