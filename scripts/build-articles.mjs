#!/usr/bin/env node
/**
 * scripts/build-articles.mjs
 *
 * Compiles markdown articles from content/writings/ into src/data/content.js
 *
 * Workflow:
 *   1. Write articles in content/writings/my-article.md (Markdown + YAML frontmatter)
 *   2. Run: npm run build:content
 *   3. The generated src/data/content.js is used by the React app
 *
 * Frontmatter fields:
 *   title       (required) — Article title
 *   slug        (optional) — URL slug. Defaults to filename without .md
 *   category    (required) — "AI Systems" | "Architecture" | "Reflection" | "Leadership"
 *   date        (required) — YYYY-MM-DD
 *   readTime    (optional) — e.g. "8 min read". Auto-calculated if omitted
 *   featured    (optional) — true/false
 *   excerpt     (required) — Short 1-2 sentence description for listing cards
 *   theme       (optional) — Longer TL;DR (3-5 sentences) for article page
 *
 * The markdown body is converted to HTML automatically.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { marked } from 'marked'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const WRITINGS_DIR = resolve(ROOT, 'content', 'writings')
const OUTPUT = resolve(ROOT, 'src', 'data', 'content.js')

// ─── Configure marked for clean HTML output ───
marked.setOptions({
  gfm: true,
  breaks: false,
})

// ─── Read and parse all markdown articles ───
function getArticles() {
  if (!existsSync(WRITINGS_DIR)) {
    console.error(`Error: ${WRITINGS_DIR} does not exist`)
    process.exit(1)
  }

  const files = readdirSync(WRITINGS_DIR).filter(f => f.endsWith('.md'))
  const articles = []

  for (const file of files) {
    const filePath = resolve(WRITINGS_DIR, file)
    const raw = readFileSync(filePath, 'utf8')
    const { data: frontmatter, content } = matter(raw)

    // Validate required fields
    if (!frontmatter.title) {
      console.warn(`⚠ Skipping ${file}: missing 'title' in frontmatter`)
      continue
    }
    if (!frontmatter.date) {
      console.warn(`⚠ Skipping ${file}: missing 'date' in frontmatter`)
      continue
    }

    // Convert markdown body to HTML
    const html = marked.parse(content).trim()

    // Auto-calculate read time if not provided
    const wordCount = content.split(/\s+/).length
    const readTime = frontmatter.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`

    // Format date display
    const dateObj = new Date(frontmatter.date + 'T00:00:00')
    const dateDisplay = frontmatter.dateDisplay || dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    const slug = frontmatter.slug || basename(file, '.md')

    articles.push({
      slug,
      title: frontmatter.title,
      category: frontmatter.category || 'AI Systems',
      tags: frontmatter.tags || [],
      date: frontmatter.date,
      dateDisplay,
      readTime,
      featured: frontmatter.featured || false,
      excerpt: frontmatter.excerpt || '',
      theme: frontmatter.theme || '',
      body: html,
    })
  }

  // Sort by date descending (newest first)
  articles.sort((a, b) => b.date.localeCompare(a.date))
  return articles
}

// ─── Also read any .json articles (legacy format) ───
function getLegacyArticles() {
  const files = readdirSync(WRITINGS_DIR).filter(f => f.endsWith('.json'))
  const articles = []

  for (const file of files) {
    try {
      const raw = readFileSync(resolve(WRITINGS_DIR, file), 'utf8')
      const data = JSON.parse(raw)
      const slug = data.slug || basename(file, '.json')
      articles.push({ slug, ...data })
    } catch (e) {
      console.warn(`⚠ Skipping ${file}: ${e.message}`)
    }
  }

  return articles
}

// ─── Generate output ───
function build() {
  const mdArticles = getArticles()
  const jsonArticles = getLegacyArticles()

  // Merge: markdown takes precedence over JSON if same slug exists
  const mdSlugs = new Set(mdArticles.map(a => a.slug))
  const merged = [
    ...mdArticles,
    ...jsonArticles.filter(a => !mdSlugs.has(a.slug)),
  ]

  // Sort by date descending
  merged.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  // Read showcase data if it exists
  // Read showcase data
  const showcaseDir = resolve(ROOT, 'content', 'showcase')
  let showcaseItems = []
  if (existsSync(showcaseDir)) {
    const showcaseMdFiles = readdirSync(showcaseDir).filter(f => f.endsWith('.md'))
    for (const f of showcaseMdFiles) {
      try {
        const raw = readFileSync(resolve(showcaseDir, f), 'utf8')
        const { data: fm, content } = matter(raw)
        const parts = content.trim()
        const lang = fm.lang || 'python'

        // Parse sections by ## headings
        function getSection(name) {
          const re = new RegExp(`## ${name}\\n\\n([\\s\\S]*?)(?=\\n## |$)`)
          const m = parts.match(re)
          return m ? m[1].trim() : ''
        }

        // Extract problem & approach as plain text
        const problem = getSection('Problem')
        const approach = getSection('Approach')

        // Extract architecture (HTML block after <!-- architecture --> marker)
        const archSection = getSection('Architecture')
        const archHtml = archSection.replace(/^<!-- architecture -->\n?/, '').trim()

        // Extract code block from Code section
        const codeSection = getSection('Code')
        const codeMatch = codeSection.match(/```\w*\n([\s\S]*?)```/)
        const code = codeMatch ? codeMatch[1].trim() : codeSection

        // Extract run instructions
        const runSection = getSection('Run')
        const runMatch = runSection.match(/```\w*\n([\s\S]*?)```/)
        const runInstructions = runMatch ? runMatch[1].trim() : runSection

        // Extract outcomes & lessons as arrays
        function parseList(sectionName) {
          const text = getSection(sectionName)
          if (!text) return []
          return text.split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2))
        }
        const outcomes = parseList('Outcomes')
        const lessons = parseList('Lessons')

        showcaseItems.push({
          slug: fm.slug || f.replace('.md', ''),
          title: fm.title,
          tag: fm.tag,
          tagClass: fm.tagClass,
          featured: fm.featured || false,
          date: fm.date || '',
          problem,
          approach,
          architecture: archHtml,
          code,
          lang,
          runInstructions,
          outcomes,
          lessons,
        })
      } catch (e) {
        console.warn(`⚠ Skipping showcase/${f}: ${e.message}`)
      }
    }
    // Fallback: also read .json files if any remain
    const showcaseJsonFiles = readdirSync(showcaseDir).filter(f => f.endsWith('.json'))
    for (const f of showcaseJsonFiles) {
      try {
        showcaseItems.push(JSON.parse(readFileSync(resolve(showcaseDir, f), 'utf8')))
      } catch {}
    }
  }

  // Read thinking data
  const thinkingDir = resolve(ROOT, 'content', 'thinking')
  let thinkingItems = []
  if (existsSync(thinkingDir)) {
    const thinkingMdFiles = readdirSync(thinkingDir).filter(f => f.endsWith('.md'))
    for (const f of thinkingMdFiles) {
      try {
        const raw = readFileSync(resolve(thinkingDir, f), 'utf8')
        const { data: fm, content } = matter(raw)
        thinkingItems.push({
          title: fm.title,
          tag: fm.tag,
          tagClass: fm.tagClass,
          featured: fm.featured || false,
          sidebarText: fm.sidebarText || '',
          body: content.trim(),
        })
      } catch (e) {
        console.warn(`⚠ Skipping thinking/${f}: ${e.message}`)
      }
    }
    // Fallback: also read .json files if any remain
    const thinkingJsonFiles = readdirSync(thinkingDir).filter(f => f.endsWith('.json'))
    for (const f of thinkingJsonFiles) {
      try {
        thinkingItems.push(JSON.parse(readFileSync(resolve(thinkingDir, f), 'utf8')))
      } catch {}
    }
  }

  // Generate the JS module
  const output = `// Auto-generated by scripts/build-articles.mjs — do not edit manually
// To add/edit articles, modify files in content/writings/ and run: npm run build:content
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
const _isNew = (dateStr) => (Date.now() - new Date(dateStr).getTime()) < TWO_WEEKS;

export const ARTICLES = ${JSON.stringify(merged, null, 2)};

export const SHOWCASE = ${JSON.stringify(showcaseItems, null, 2)};

export const THINKING = ${JSON.stringify(thinkingItems, null, 2)};

export const DOMAINS = [
  { icon: "⬡", title: "Cloud Architecture & Distributed Systems", desc: "Fault-tolerant, cost-efficient cloud systems at scale. I reason deeply about consistency models, service boundaries, data gravity, and the organisational consequences of architectural choices." },
  { icon: "◈", title: "AI Systems & Agentic Workflows", desc: "Production AI beyond the prototype — orchestrating autonomous agents, designing retrieval-augmented pipelines, and reasoning about how intelligence reshapes architecture." },
  { icon: "△", title: "AI Evaluation & Safety Engineering", desc: "Building the guardrails that make autonomous AI trustworthy — evaluation frameworks, red-teaming pipelines, alignment monitoring, and the feedback loops that keep intelligence accountable in production." },
  { icon: "▣", title: "IoT & Edge Architecture", desc: "End-to-end device ecosystems from firmware lifecycle to fleet orchestration at scale. Bridging the physical and the cloud with integrity on both sides." },
  { icon: "⬘", title: "Real-Time Data Engineering", desc: "Streaming and batch pipelines that move data reliably from source to insight. Correctness, latency, and operational cost are all first-class requirements." },
  { icon: "◫", title: "Platform Engineering & Security", desc: "Internal platforms that let product teams move fast without breaking things. Immutable infrastructure, secrets management, and compliance automation." },
  { icon: "⬙", title: "Engineering Leadership & Design", desc: "Technical decision-making at the organisational level — defining standards, developing architectural thinking in teams, and translating between systems and business language." }
];

export const PILLARS = [
  { num: "01", title: "Clarity over cleverness", desc: "The best systems are ones a new engineer understands in an hour. Complexity that does not earn its keep gets removed." },
  { num: "02", title: "Design for the edge case", desc: "Happy paths are easy. I architect around failure modes, partial states, and the conditions that expose hidden assumptions." },
  { num: "03", title: "Intelligence as infrastructure", desc: "AI is not a feature to add — it is an architectural dimension that changes how you design data flow, feedback loops, and trust boundaries." },
  { num: "04", title: "Ship, observe, evolve", desc: "Every deployment is a hypothesis. I build systems instrumented to teach me. Observability is a first-class design concern." }
];
`

  writeFileSync(OUTPUT, output)
  console.log(`✓ Built ${OUTPUT}`)
  console.log(`  ${mdArticles.length} markdown + ${jsonArticles.filter(a => !mdSlugs.has(a.slug)).length} JSON = ${merged.length} total articles`)
  if (showcaseItems.length) console.log(`  ${showcaseItems.length} showcase items`)
  if (thinkingItems.length) console.log(`  ${thinkingItems.length} thinking items`)
}

build()
