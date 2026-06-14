#!/usr/bin/env node
/**
 * scripts/new-writing.mjs
 *
 * Scaffolds a new markdown article file.
 *
 * Usage:
 *   npm run new:writing
 *   npm run new:writing -- --slug my-article-slug
 */

import { writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WRITINGS_DIR = resolve(__dirname, '..', 'content', 'writings')

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(r => rl.question(q, a => r(a.trim())))

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function main() {
  console.log('\n📝 New Writing Article\n')

  const title = await ask('Title: ')
  if (!title) { console.log('Aborted.'); process.exit(0) }

  const slugDefault = slugify(title)
  const slugInput = await ask(`Slug [${slugDefault}]: `)
  const slug = slugInput || slugDefault

  const category = await ask('Category (AI Systems / Architecture / Reflection / Leadership) [AI Systems]: ')
  const excerpt = await ask('Excerpt (1-2 sentences for listing card): ')

  const today = new Date().toISOString().split('T')[0]

  const template = `---
title: "${title}"
slug: ${slug}
category: ${category || 'AI Systems'}
date: "${today}"
featured: false
excerpt: "${excerpt}"
theme: ""
---

Write your article here in Markdown.

## First Section

Your content...

## Second Section

More content...
`

  const filePath = resolve(WRITINGS_DIR, `${slug}.md`)

  if (existsSync(filePath)) {
    console.log(`\n⚠ File already exists: ${filePath}`)
    rl.close()
    process.exit(1)
  }

  writeFileSync(filePath, template)
  console.log(`\n✓ Created: content/writings/${slug}.md`)
  console.log(`\nNext steps:`)
  console.log(`  1. Edit the file with your article content`)
  console.log(`  2. Run: npm run build:content`)
  console.log(`  3. Your article will appear on the site\n`)

  rl.close()
}

main()
