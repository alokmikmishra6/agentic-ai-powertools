#!/usr/bin/env node
/**
 * Content authoring helper for the portfolio site.
 *
 * Usage:
 *   node scripts/add-content.mjs writing
 *   node scripts/add-content.mjs showcase
 *   node scripts/add-content.mjs thinking
 *
 * It will prompt you for fields and append a new entry to src/data/content.js.
 * You can also pass --json <file> to load fields from a JSON file.
 */

import { createInterface } from 'readline'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT_FILE = resolve(__dirname, '..', 'src', 'data', 'content.js')

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q, def = '') => new Promise(r => rl.question(`${q}${def ? ` [${def}]` : ''}: `, a => r(a.trim() || def)))

const type = process.argv[2]
if (!['writing', 'showcase', 'thinking'].includes(type)) {
  console.log(`\nUsage: node scripts/add-content.mjs <writing|showcase|thinking>\n`)
  process.exit(1)
}

// Check for --json flag
const jsonIdx = process.argv.indexOf('--json')
let jsonData = null
if (jsonIdx !== -1 && process.argv[jsonIdx + 1]) {
  jsonData = JSON.parse(readFileSync(process.argv[jsonIdx + 1], 'utf-8'))
}

async function addWriting() {
  const data = jsonData || {}
  const title = data.title || await ask('Title')
  const slug = data.slug || (await ask('Slug (auto from title)', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')))
  const category = data.category || await ask('Category (AI Systems / Architecture / Reflection / Leadership)', 'AI Systems')
  const date = data.date || new Date().toISOString().split('T')[0]
  const dateDisplay = data.dateDisplay || new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const readTime = data.readTime || await ask('Read time', '8 min read')
  const featured = data.featured !== undefined ? data.featured : (await ask('Featured? (y/n)', 'n')).toLowerCase() === 'y'
  const cover = data.cover || await ask('Cover image URL', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=600&fit=crop')
  const excerpt = data.excerpt || await ask('Excerpt (one-liner)')

  console.log('\nPaste the article body HTML (type END on a new line when done):')
  let body = ''
  if (data.body) {
    body = data.body
  } else {
    for await (const line of rl) {
      if (line === 'END') break
      body += line + '\n'
    }
    body = body.trim()
  }

  const entry = `  {
    slug: ${JSON.stringify(slug)},
    title: ${JSON.stringify(title)},
    category: ${JSON.stringify(category)},
    date: ${JSON.stringify(date)},
    dateDisplay: ${JSON.stringify(dateDisplay)},
    readTime: ${JSON.stringify(readTime)},
    featured: ${featured},
    cover: ${JSON.stringify(cover)},
    excerpt: ${JSON.stringify(excerpt)},
    body: \`${body.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
  },`

  insertEntry('ARTICLES', entry)
  console.log(`\n✅ Writing "${title}" added to content.js`)
  console.log(`   Slug: ${slug}`)
  console.log(`   Featured: ${featured}`)
}

async function addShowcase() {
  const data = jsonData || {}
  const title = data.title || await ask('Title')
  const tag = data.tag || await ask('Tag (e.g. Agentic AI, AI Infrastructure)', 'AI Infrastructure')
  const tagClass = data.tagClass || await ask('Tag class (ai / sys)', 'ai')
  const featured = data.featured !== undefined ? data.featured : (await ask('Featured? (y/n)', 'n')).toLowerCase() === 'y'
  const description = data.description || await ask('Description')

  console.log('\nPaste the code (type END on a new line when done):')
  let code = ''
  if (data.code) {
    code = data.code
  } else {
    for await (const line of rl) {
      if (line === 'END') break
      code += line + '\n'
    }
    code = code.trim()
  }
  const lang = data.lang || await ask('Language', 'python')

  const entry = `  {
    title: ${JSON.stringify(title)},
    tag: ${JSON.stringify(tag)},
    tagClass: ${JSON.stringify(tagClass)},
    featured: ${featured},
    description: ${JSON.stringify(description)},
    code: \`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
    lang: ${JSON.stringify(lang)}
  },`

  insertEntry('SHOWCASE', entry)
  console.log(`\n✅ Showcase "${title}" added to content.js`)
}

async function addThinking() {
  const data = jsonData || {}
  const title = data.title || await ask('Title (question form)')
  const tag = data.tag || await ask('Tag (e.g. AI Architecture, Cloud & Edge)', 'AI Architecture')
  const tagClass = data.tagClass || await ask('Tag class (ai / cl / sys)', 'ai')
  const featured = data.featured !== undefined ? data.featured : (await ask('Featured? (y/n)', 'n')).toLowerCase() === 'y'
  const sidebarText = data.sidebarText || await ask('Sidebar text')
  const body = data.body || await ask('Body text')

  const entry = `  {
    title: ${JSON.stringify(title)},
    tag: ${JSON.stringify(tag)},
    tagClass: ${JSON.stringify(tagClass)},
    featured: ${featured},
    sidebarText: ${JSON.stringify(sidebarText)},
    body: ${JSON.stringify(body)}
  },`

  insertEntry('THINKING', entry)
  console.log(`\n✅ Thinking "${title}" added to content.js`)
}

function insertEntry(arrayName, entry) {
  let content = readFileSync(CONTENT_FILE, 'utf-8')

  // Find the array declaration and insert at the top (after the opening bracket)
  const pattern = new RegExp(`(export const ${arrayName} = \\[)`)
  const match = content.match(pattern)
  if (!match) {
    console.error(`Could not find ${arrayName} array in content.js`)
    process.exit(1)
  }

  content = content.replace(pattern, `$1\n${entry}`)
  writeFileSync(CONTENT_FILE, content, 'utf-8')
}

// Run
try {
  if (type === 'writing') await addWriting()
  else if (type === 'showcase') await addShowcase()
  else if (type === 'thinking') await addThinking()
} catch (e) {
  console.error('Error:', e.message)
} finally {
  rl.close()
}
