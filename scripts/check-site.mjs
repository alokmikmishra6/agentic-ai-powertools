import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createServer } from 'vite'
import { ARTICLES, SHOWCASE, THINKING, DOMAINS, PILLARS } from '../src/data/content.js'
import { JOURNEYS } from '../src/data/journeys.js'
import narrations from '../src/data/narration.json' with { type: 'json' }

const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')
function render(Component, path, route = '*') {
  return renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] },
    React.createElement(Routes, null, React.createElement(Route, { path: route, element: React.createElement(Component) }))))
}
try {
  const { default: Home } = await vite.ssrLoadModule('/src/pages/Home.jsx')
  const { default: Writing } = await vite.ssrLoadModule('/src/pages/Writing.jsx')
  const { default: Article } = await vite.ssrLoadModule('/src/pages/Article.jsx')
  const { default: Showcase } = await vite.ssrLoadModule('/src/pages/Showcase.jsx')
  const { default: Saved } = await vite.ssrLoadModule('/src/pages/Saved.jsx')
  const { default: Labs } = await vite.ssrLoadModule('/src/pages/Labs.jsx')
  const { default: About } = await vite.ssrLoadModule('/src/pages/About.jsx')
  const { default: Thinking } = await vite.ssrLoadModule('/src/pages/Thinking.jsx')
  const { PROJECTS } = await vite.ssrLoadModule('/src/lib/showcase.js')
  const { default: Nav } = await vite.ssrLoadModule('/src/components/Nav.jsx')
  const { default: Subscribe } = await vite.ssrLoadModule('/src/components/Subscribe.jsx')
  assert.match(render(Saved, '/saved'), /Your reading corner/)
  const labs = render(Labs, '/labs')
  assert.match(labs, /Run and inject failure/)
  assert.match(labs, /Chunk size/)
  assert.match(labs, /Requests per day/)
  const home = render(Home, '/')
  assert.match(home, /Notes on/)
  assert.match(home, /A map of connected ideas/)
  assert.match(home, /The featured essay/)
  assert.match(home, /Follow a thread/)
  assert.match(home, /See the connections/)
  assert.match(home, /Pause motion/)
  assert.ok(home.includes('/writing/' + JOURNEYS[0].slugs[0] + '?trail=agents'))
  assert.equal((home.match(/class="atlas-node /g) || []).length, 4)
  assert.equal((home.match(/<h1/g) || []).length, 1)
  assert.match(render(Nav, '/writing/some-essay'), /aria-current="page"/)
  assert.match(render(Nav, '/'), /Search writing and projects/)
  for (const category of new Set(ARTICLES.map(a => a.category))) {
    const html = render(Writing, '/writing?topic=' + encodeURIComponent(category))
    for (const article of ARTICLES.filter(a => a.category !== category)) assert.ok(!html.includes('/writing/' + article.slug))
    assert.ok(html.includes('aria-pressed="true"'))
  }
  const all = render(Writing, '/writing?page=99')
  for (const article of ARTICLES) assert.ok(all.includes('/writing/' + article.slug), article.slug + ' is missing from the archive')
  assert.match(render(Writing, '/writing?q=zzzznoresults'), /No essays found/)
  assert.match(render(Writing, '/writing?topic=unknown'), /All writing/)
  assert.match(render(Writing, '/writing?view=list'), /class="journal-grid journal-list"/)
  const about = render(About, '/about')
  assert.equal((about.match(/<h1/g) || []).length, 1)
  for (const entry of [...DOMAINS, ...PILLARS]) assert.ok(about.includes(escape(entry.title)))
  const inquiries = THINKING.filter((item, index, all) => all.findIndex(other => other.title === item.title && other.body === item.body) === index)
  for (const [index, inquiry] of inquiries.entries()) {
    const html = render(Thinking, '/thinking?idea=' + inquiry.slug)
    for (const paragraph of inquiry.body.split(/\n\s*\n/)) assert.ok(html.includes(escape(paragraph)))
    assert.equal((html.match(/<h2/g) || []).length, 1)
    assert.equal((html.match(/aria-pressed=/g) || []).length, inquiries.length)
  }
  for (const journey of JOURNEYS) {
    for (const [index, slug] of journey.slugs.entries()) {
      const html = render(Article, '/writing/' + slug + '?trail=' + journey.id, '/writing/:slug')
      assert.match(html, new RegExp('Essay ' + (index + 1) + ' of 3'))
      assert.ok(html.includes(index < 2 ? 'Next along this thread' : 'Keep following your curiosity.'))
      if (index < 2) assert.ok(html.includes('/writing/' + journey.slugs[index + 1] + '?trail=' + journey.id))
    }
  }
  assert.ok(!render(Article, '/writing/' + ARTICLES[0].slug + '?trail=invalid', '/writing/:slug').includes('class="article-trail"'))
  for (const article of ARTICLES) {
    const html = render(Article, '/writing/' + article.slug, '/writing/:slug')
    assert.ok(html.includes(escape(article.title)), article.slug + ' did not render')
    assert.equal((html.match(/<h1/g) || []).length, 1, article.slug + ' heading structure')
    assert.match(html, /class="article-body"/)
    const recording = narrations[article.slug]?.recordings.find(r => r.kind === 'full' && r.voice === 'af_heart')
    if (recording) {
      assert.match(html, /aria-label="Article narration"/)
      assert.match(html, /preload="none"/)
      assert.ok(html.includes('/agentic-ai-powertools/' + recording.src), article.slug + ' narration URL')
      assert.equal((html.match(/<audio /g) || []).length, 1)
      assert.doesNotMatch(html, /autoplay=|Compare narrator voices|Michael · American English/)
    }
    assert.ok(html.indexOf('<h1') < html.indexOf('class="generative-cover article-cover"'))
  }
  const narrated = render(Article, '/writing/agents-need-stop-rules', '/writing/:slug')
  assert.match(narrated, /aria-label="Article narration"/)
  assert.match(narrated, /preload="none"/)
  assert.doesNotMatch(narrated, /Compare narrator voices/)
  assert.doesNotMatch(narrated, /Heart · American English|Kokoro · AI narration|Generated from the article|Use device voice|Listening position saved on this browser/)
  assert.doesNotMatch(narrated, /Michael · American English/)
  assert.match(render(Article, '/writing/not-an-article', '/writing/:slug'), /Essay not found/)
  for (const project of PROJECTS) {
    const html = render(Showcase, '/showcase?project=' + encodeURIComponent(project.slug))
    assert.ok(html.includes('<h2 class="showcase-title" tabindex="-1">' + escape(project.title)), 'Project deep link failed: ' + project.slug)
  }
  assert.match(render(Writing, '/writing?minutes=5'), /Up to 5 minutes/)
  const subscribe = render(Subscribe, '/')
  assert.ok(!subscribe.includes("You're in"))
  assert.ok(subscribe.includes('Email address') || subscribe.includes('Subscribe via RSS'))
  console.log('Site checks passed: homepage, navigation, four topics, gallery/list archive, About, all inquiries, three reading paths, empty states, ' + ARTICLES.length + ' articles, ' + SHOWCASE.length + ' project deep links, and subscription state.')
} finally {
  await vite.close()
}
