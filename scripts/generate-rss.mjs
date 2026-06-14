/**
 * Generates an RSS feed (dist/feed.xml) from the content at build time.
 * Beehiiv's RSS-to-Email automation watches this feed and sends newsletters
 * automatically when new items appear.
 *
 * Run: node scripts/generate-rss.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'

const SITE_URL = 'https://alokmishra.github.io/agentic-ai-powertools'
const FEED_TITLE = "Alok Mishra — AI Architect & Systems Thinker"
const FEED_DESC = 'Notes on AI systems, architecture decisions, engineering leadership, and the craft of building software that endures.'

function parseFrontmatter(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null

  const meta = {}
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':')
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      meta[key] = val
    }
  })
  return meta
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRFC822(dateStr) {
  return new Date(dateStr).toUTCString()
}

// Collect all content items
const items = []
const contentDir = resolve('content')

// Writings
const writingsDir = join(contentDir, 'writings')
for (const file of readdirSync(writingsDir).filter(f => f.endsWith('.md'))) {
  const meta = parseFrontmatter(join(writingsDir, file))
  if (!meta || !meta.title) continue
  const slug = meta.slug || file.replace('.md', '')
  items.push({
    title: meta.title,
    link: `${SITE_URL}/#/writing/${slug}`,
    description: meta.excerpt || '',
    category: meta.category || 'Writing',
    pubDate: meta.date || '2025-01-01',
  })
}

// Showcase
const showcaseDir = join(contentDir, 'showcase')
for (const file of readdirSync(showcaseDir).filter(f => f.endsWith('.md'))) {
  const meta = parseFrontmatter(join(showcaseDir, file))
  if (!meta || !meta.title) continue
  const slug = meta.slug || file.replace('.md', '')
  items.push({
    title: meta.title,
    link: `${SITE_URL}/#/showcase/${slug}`,
    description: meta.excerpt || `${meta.tag || 'Showcase'} project`,
    category: 'Showcase',
    pubDate: meta.date || '2025-01-01',
  })
}

// Thinking
const thinkingDir = join(contentDir, 'thinking')
for (const file of readdirSync(thinkingDir).filter(f => f.endsWith('.md'))) {
  const meta = parseFrontmatter(join(thinkingDir, file))
  if (!meta || !meta.title) continue
  const slug = meta.slug || file.replace('.md', '')
  items.push({
    title: meta.title,
    link: `${SITE_URL}/#/thinking/${slug}`,
    description: meta.excerpt || `${meta.tag || 'Thinking'} piece`,
    category: 'Thinking',
    pubDate: meta.date || '2025-01-01',
  })
}

// Sort by date descending
items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

// Generate RSS XML
const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.slice(0, 20).map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${toRFC822(item.pubDate)}</pubDate>
      <guid isPermaLink="true">${item.link}</guid>
    </item>`).join('\n')}
  </channel>
</rss>
`

writeFileSync(resolve('dist', 'feed.xml'), rssXml)
console.log(`✅ RSS feed generated with ${Math.min(items.length, 20)} items → dist/feed.xml`)
