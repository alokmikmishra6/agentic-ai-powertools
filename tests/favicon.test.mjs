import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createServer } from 'vite'
import { parseHTML } from 'linkedom'

test('development favicon URLs apply the site base once, including deep links', async () => {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
    for (const route of ['/agentic-ai-powertools/', '/agentic-ai-powertools/writing/agents-need-stop-rules/']) {
      const { document } = parseHTML(await vite.transformIndexHtml(route, source))
      const links = [...document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"]')]
      assert.equal(links.length, 3)
      for (const link of links) {
        const href = link.getAttribute('href')
        assert.match(href, /^\/agentic-ai-powertools\/(favicon\.svg|favicon-32\.png|apple-touch-icon\.png)\?v=field-notes-2$/)
        const asset = href.split('?')[0].replace('/agentic-ai-powertools/', '')
        assert.ok(existsSync(new URL('../public/' + asset, import.meta.url)))
      }
    }
  } finally { await vite.close() }
})
