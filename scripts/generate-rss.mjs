/** Build RSS from the same published content used by the site. */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { ARTICLES, THINKING } from '../src/data/content.js'
import { PROJECTS } from '../src/lib/showcase.js'

export const SITE_URL = 'https://alokmikmishra6.github.io/agentic-ai-powertools'
const escapeXml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
const timestamp = date => Number.isFinite(Date.parse(date)) ? Date.parse(date) : 0

export function feedItems() {
  const inquiries = THINKING.filter((item, index, all) => all.findIndex(other => other.title === item.title && other.body === item.body) === index)
  return [
    ...ARTICLES.map(a => ({ title: a.title, description: a.excerpt, category: a.category, date: a.date, link: `${SITE_URL}/writing/${encodeURIComponent(a.slug)}` })),
    ...PROJECTS.map(p => ({ title: p.title, description: p.problem, category: 'Showcase', date: p.date, link: `${SITE_URL}/showcase/?project=${encodeURIComponent(p.slug)}` })),
    ...inquiries.map((t, index) => ({ title: t.title, description: t.body, category: 'Thinking', date: t.date, link: `${SITE_URL}/thinking/?idea=${index + 1}` })),
  ].sort((a, b) => timestamp(b.date) - timestamp(a.date))
}

export function renderFeed(items = feedItems(), now = new Date()) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Alok Mishra — Field Notes on AI &amp; Architecture</title>
    <link>${SITE_URL}</link>
    <description>Notes on AI systems, architecture, and the craft of building software that endures.</description>
    <language>en-us</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.slice(0, 20).map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description || '')}</description>
      <category>${escapeXml(item.category)}</category>${timestamp(item.date) ? `\n      <pubDate>${new Date(item.date).toUTCString()}</pubDate>` : ''}
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
    </item>`).join('\n')}
  </channel>
</rss>
`
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const items = feedItems()
  writeFileSync(resolve('dist', 'feed.xml'), renderFeed(items))
  console.log(`RSS feed generated with ${Math.min(items.length, 20)} items → dist/feed.xml`)
}
