import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { narrationBlocks, narrationHash, pronunciation, splitSpeech, validNarrations } from '../scripts/lib/narration.mjs'
import { safeAudioPosition, chapterSegments, chapterAtTime } from '../src/lib/audio-position.js'

test('narration preserves prose and headings without reading code, tables, or duplicate nested text', () => {
  const article = { title: 'Test', body: '<h2>A section</h2><p>Use the <a href="https://example.com">guide</a> for MCP.</p><pre>secret command</pre><table><tr><td>cells</td></tr></table><blockquote><p>One quotation.</p></blockquote><ul><li>One item.</li></ul>' }
  const blocks = narrationBlocks(article)
  assert.equal(blocks[1].heading, 'A section')
  assert.ok(blocks.some(b => b.text === 'Use the guide for M C P.'))
  assert.equal(blocks.filter(b => b.text === 'One quotation.').length, 1)
  assert.ok(!blocks.some(b => /secret command|cells/.test(b.text)))
})
test('speech chunks preserve all ordinary text and bound long identifiers', () => {
  const text = 'This is a sentence. ' + 'The quick brown fox crosses the field. '.repeat(30)
  const parts = splitSpeech(text, 80)
  assert.ok(parts.every(p => p.length <= 80))
  assert.equal(parts.join(' '), text.trim())
  assert.ok(splitSpeech('x'.repeat(900), 100).every(p => p.length <= 100))
  assert.equal(pronunciation('AI uses an API with SQL.'), 'A I uses an A P I with S Q L.')
})
test('changed articles and missing files cannot advertise stale narration', () => {
  const article = { slug: 'essay', title: 'Title', body: '<p>Original</p>' }
  const entry = { sourceHash: narrationHash(article), recordings: [{ src: 'audio/essay.m4a', duration: 20, kind: 'full' }] }
  assert.ok(validNarrations({ essay: entry }, [article], () => true).essay)
  assert.deepEqual(validNarrations({ essay: entry }, [{ ...article, body: 'Edited' }], () => true), {})
  assert.deepEqual(validNarrations({ essay: entry }, [article], () => false), {})
  assert.deepEqual(validNarrations({ essay: { ...entry, recordings: [{ src: '../private.m4a', duration: 20 }] } }, [article], () => true), {})
})
test('resume rejects invalid, finished, or out-of-range saved positions', () => {
  assert.equal(safeAudioPosition('45', 100), 45)
  for (const value of ['NaN', '-1', '99', '10000', null]) assert.equal(safeAudioPosition(value, 100), 0)
  assert.equal(safeAudioPosition('45', NaN), 0)
})

test('published recording files and chapter timestamps are usable', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/audio/manifest.json', import.meta.url), 'utf8'))
  for (const [slug, entry] of Object.entries(manifest)) {
    for (const recording of entry.recordings) {
      assert.ok(Number.isFinite(recording.duration) && recording.duration > 0, slug)
      assert.match(recording.src, /^audio\/[a-z0-9-]+\.m4a$/)
      assert.ok(statSync(new URL('../public/' + recording.src, import.meta.url)).size > 1024, slug)
      let previous = -1
      for (const chapter of recording.chapters) {
        assert.ok(chapter.title && Number.isFinite(chapter.start), slug)
        assert.ok(chapter.start >= 0 && chapter.start > previous && chapter.start < recording.duration, slug)
        previous = chapter.start
      }
    }
  }
})

test('chapter bars use exact time proportions and advance at chapter boundaries', () => {
  const segments = chapterSegments([{ title: 'Essay', start: 0 }, { title: 'Middle', start: 20 }, { title: 'End', start: 75 }], 100)
  assert.deepEqual(segments.map(s => [s.left, Number(s.width.toFixed(8)), s.end]), [[0, 20, 20], [20, 55, 75], [75, 25, 100]])
  assert.equal(chapterAtTime(segments, 19.9).title, 'Introduction')
  assert.equal(chapterAtTime(segments, 20).title, 'Middle')
  assert.equal(chapterAtTime(segments, 75).title, 'End')
  assert.equal(chapterAtTime(segments, 100).title, 'End')
  assert.deepEqual(chapterSegments([], NaN), [])
  const sanitized = chapterSegments([{ title: 'Later', start: 30 }, { title: 'Duplicate', start: 30 }, { start: -1 }, { start: 100 }], 60)
  assert.deepEqual(sanitized.map(s => [s.start, s.end]), [[0, 30], [30, 60]])
})
