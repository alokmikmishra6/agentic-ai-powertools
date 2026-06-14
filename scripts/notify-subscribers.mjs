/**
 * Beehiiv newsletter auto-publisher.
 * Detects new content from the latest commit and sends a newsletter to subscribers.
 *
 * Env vars required:
 *   BEEHIIV_API_KEY - Beehiiv API key
 *   SITE_URL       - Base URL of the site (e.g. https://alokmishra.github.io/agentic-ai-powertools)
 *
 * Usage: node scripts/notify-subscribers.mjs
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const BEEHIIV_PUB_ID = 'pub_af7aba00-0993-4f40-9589-597bd53297de'
const BEEHIIV_API = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/posts`
const API_KEY = process.env.BEEHIIV_API_KEY
const SITE_URL = process.env.SITE_URL || 'https://alokmishra.github.io/agentic-ai-powertools'

if (!API_KEY) {
  console.log('⚠️  BEEHIIV_API_KEY not set — skipping newsletter.')
  process.exit(0)
}

// Detect new/changed content files in the latest commit
function getChangedContentFiles() {
  try {
    const diff = execSync('git diff --name-only --diff-filter=A HEAD~1 HEAD', {
      encoding: 'utf-8',
    }).trim()

    if (!diff) return []

    return diff
      .split('\n')
      .filter(f => f.startsWith('content/') && f.endsWith('.md'))
  } catch {
    // If there's no previous commit (initial push), check all content files
    const all = execSync('git ls-files content/', { encoding: 'utf-8' }).trim()
    return all ? all.split('\n').filter(f => f.endsWith('.md')) : []
  }
}

// Parse frontmatter from markdown file
function parseFrontmatter(filePath) {
  const content = readFileSync(resolve(filePath), 'utf-8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null

  const meta = {}
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':')
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      meta[key] = val
    }
  })
  return meta
}

// Determine content type and URL path from file path
function getContentInfo(filePath) {
  if (filePath.startsWith('content/writings/')) {
    return { type: 'Writing', section: 'writing' }
  } else if (filePath.startsWith('content/showcase/')) {
    return { type: 'Showcase', section: 'showcase' }
  } else if (filePath.startsWith('content/thinking/')) {
    return { type: 'Thinking', section: 'thinking' }
  }
  return { type: 'Update', section: '' }
}

// Build newsletter HTML for a batch of new items
function buildNewsletterHTML(items) {
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #1a1a1a;">
        <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: rgba(201,168,124,0.15); color: #c9a87c; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">${item.type}</span>
        <h2 style="margin: 8px 0 6px; font-size: 18px; font-weight: 600; color: #f0f0f0;">
          <a href="${item.url}" style="color: #f0f0f0; text-decoration: none;">${item.title}</a>
        </h2>
        ${item.excerpt ? `<p style="margin: 0 0 12px; color: #999; font-size: 14px; line-height: 1.5;">${item.excerpt}</p>` : ''}
        <a href="${item.url}" style="color: #c9a87c; font-size: 13px; text-decoration: none; font-weight: 500;">Read →</a>
      </td>
    </tr>
  `).join('')

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0;">
      <tr>
        <td style="padding: 32px 24px 16px;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.08em;">New from Alok Mishra</p>
          <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #f5f5f5;">Fresh thinking, just published</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHTML}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px 24px; text-align: center;">
          <a href="${SITE_URL}" style="display: inline-block; padding: 10px 24px; background: rgba(201,168,124,0.15); border: 1px solid rgba(201,168,124,0.4); border-radius: 6px; color: #c9a87c; text-decoration: none; font-size: 13px; font-weight: 500;">Visit the site →</a>
        </td>
      </tr>
    </table>
  `
}

// Send newsletter via Beehiiv API
async function sendNewsletter(title, html) {
  const res = await fetch(BEEHIIV_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      title,
      subtitle: 'New content just published on alokmishra.github.io',
      status: 'confirmed',
      content_html: html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Beehiiv API error ${res.status}: ${err}`)
  }

  return res.json()
}

// Main
async function main() {
  const changedFiles = getChangedContentFiles()

  if (changedFiles.length === 0) {
    console.log('📭 No new content detected — no newsletter to send.')
    process.exit(0)
  }

  console.log(`📬 Found ${changedFiles.length} new content file(s):`)
  changedFiles.forEach(f => console.log(`   • ${f}`))

  const items = []

  for (const file of changedFiles) {
    const meta = parseFrontmatter(file)
    if (!meta || !meta.title) {
      console.log(`   ⚠️  Skipping ${file} (no frontmatter)`)
      continue
    }

    const info = getContentInfo(file)
    const slug = meta.slug || file.split('/').pop().replace('.md', '')
    const url = `${SITE_URL}/#/${info.section}/${slug}`

    items.push({
      type: info.type,
      title: meta.title,
      excerpt: meta.excerpt || '',
      url,
    })
  }

  if (items.length === 0) {
    console.log('📭 No valid content to send.')
    process.exit(0)
  }

  // Build newsletter
  const subject = items.length === 1
    ? `New: ${items[0].title}`
    : `${items.length} new posts just published`

  const html = buildNewsletterHTML(items)

  console.log(`\n📨 Sending newsletter: "${subject}"`)
  const result = await sendNewsletter(subject, html)
  console.log(`✅ Newsletter sent! Post ID: ${result?.data?.id || 'unknown'}`)
}

main().catch(err => {
  console.error('❌ Newsletter failed:', err.message)
  process.exit(1)
})
