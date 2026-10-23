import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { ARTICLES, THINKING } from '../src/data/content.js'
import { PROJECTS } from '../src/lib/showcase.js'
import { LEGACY_INQUIRIES, selectInquiry } from '../src/lib/thinking.js'

const start = Date.parse('2026-07-25T00:00:00Z')
const end = Date.parse('2026-10-17T00:00:00Z')
const weekly = [...ARTICLES, ...PROJECTS, ...THINKING]
  .filter(item => Date.parse(item.date) >= start && Date.parse(item.date) <= end)
  .sort((a, b) => a.date.localeCompare(b.date))

test('the July to October series has one dated entry per week across all three sections', () => {
  assert.equal(weekly.length, 13)
  weekly.forEach((item, index) => assert.equal(Date.parse(item.date), start + index * 7 * 86400000, item.slug))
  assert.equal(weekly.filter(item => ARTICLES.includes(item)).length, 7)
  assert.equal(weekly.filter(item => PROJECTS.includes(item)).length, 3)
  assert.equal(weekly.filter(item => THINKING.includes(item)).length, 3)
  for (const item of weekly) {
    assert.ok(!JSON.stringify(item).includes('—'), item.slug + ' contains an em dash')
    if (item.relatedWriting) assert.ok(ARTICLES.some(article => article.slug === item.relatedWriting))
  }
})
test('new inquiries are the default and historic numeric links still select archived questions', () => {
  assert.equal(new Set(THINKING.map(item => item.slug)).size, THINKING.length)
  assert.equal(selectInquiry(THINKING, null).slug, 'what-belongs-in-work-receipt')
  LEGACY_INQUIRIES.forEach((slug, index) => {
    assert.equal(selectInquiry(THINKING, String(index + 1)).slug, slug)
    assert.equal(selectInquiry(THINKING, slug).status, 'archived')
  })
})
for (const project of PROJECTS.filter(item => item.runnable)) {
  test('downloadable showcase executes its synthetic checks: ' + project.slug, () => {
    const result = spawnSync('python3', ['-c', project.code], { encoding: 'utf8', timeout: 10000 })
    assert.equal(result.status, 0, result.stderr || result.error?.message)
    assert.match(result.stdout, /checks passed|expectations passed/i)
    assert.ok(project.runInstructions.includes(project.slug + '.py'))
  })
}
