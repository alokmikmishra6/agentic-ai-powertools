import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeReader, updateReader } from '../src/lib/reader.js'
import { recoveryTrace, chunkWords, tokenBudget } from '../src/lib/labs.js'
import { articleBody, plainText, searchPassage } from '../src/lib/article-content.js'
import { findArticles } from '../src/lib/articles.js'
import { ARTICLES } from '../src/data/index.js'
import { CONNECTIONS, FORMATS } from '../src/data/editorial.js'

test('saved state toggles without losing reading progress and sanitizes persisted data',()=>{
  let state=normalizeReader({saved:['first','first','../invalid'],reading:{first:{progress:9,completed:true}}})
  assert.deepEqual(state.saved,['first']);assert.equal(state.reading.first.progress,1)
  state=updateReader(state,{type:'save',slug:'second'});assert.deepEqual(state.saved,['first','second'])
  state=updateReader(state,{type:'save',slug:'first'});assert.deepEqual(state.saved,['second']);assert.equal(state.reading.first.completed,true)
  state=updateReader(state,{type:'progress',slug:'first',entry:{section:'failure',progress:.4},now:100})
  assert.equal(state.reading.first.completed,true);assert.equal(state.reading.first.section,'failure')
  assert.deepEqual(updateReader(state,{type:'clear'}),{saved:[],reading:{}})
})
test('full text, time, topic, and editorial format filters intersect',()=>{
  const a={slug:'test',title:'Example',excerpt:'',category:'AI Systems',format:'Implementation',readTime:'8 min read',date:'2026-01-01'}
  assert.equal(findArticles([a],{query:'idempotent',bodies:{test:'Use an idempotent operation.'},maxMinutes:10,format:'Implementation'}).length,1)
  assert.equal(findArticles([a],{maxMinutes:5}).length,0)
  assert.equal(findArticles([a],{format:'Concept'}).length,0)
  assert.match(searchPassage('Before durable recovery after failure','recovery'),/durable recovery/)
})
test('section anchors are deterministic, unique, and do not overwrite existing authored anchors',()=>{
  const html=articleBody('<h2>Why &amp; how?</h2><h2>Why &amp; how?</h2><h3 id="custom">Keep me</h3>')
  assert.match(html,/id="why-how"/);assert.match(html,/id="why-how-2"/);assert.match(html,/id="custom"/)
  assert.equal(plainText('<p>A &amp; B &#x2192; C</p>'),'A & B → C')
  assert.equal(articleBody('<h2>Custom</h2><h3 id="custom">Authored</h3><h2>Custom</h2>'),'<h2 id="custom-2">Custom</h2><h3 id="custom">Authored</h3><h2 id="custom-3">Custom</h2>')
})
test('recovery replays only the interrupted step onward with checkpointing',()=>{
  assert.deepEqual(recoveryTrace(3,true).after,[3,4,5]);assert.equal(recoveryTrace(3,true).attempts,6)
  assert.deepEqual(recoveryTrace(3,false).after,[1,2,3,4,5]);assert.equal(recoveryTrace(3,false).repeatedCompleted,2)
  assert.equal(recoveryTrace(1,true).attempts,recoveryTrace(1,false).attempts)
})
test('chunk overlap preserves boundaries without empty or infinite chunks',()=>{
  const chunks=chunkWords('a b c d e f g h',4,2)
  assert.deepEqual(chunks.map(c=>c.words.join(' ')),['a b c d','c d e f','e f g h'])
  assert.equal(chunks[1].shared,2);assert.equal(chunkWords('',4,2).length,0)
  assert.ok(chunkWords('a b c',2,99).length<=3)
})
test('token budget math removes only reused input and treats invalid input as zero',()=>{
  const result=tokenBudget({requests:1000,input:3000,output:500,inputRate:1,outputRate:5,cache:100})
  assert.equal(result.daily,2.5);assert.equal(result.saved,3);assert.equal(result.monthly,75)
  assert.equal(tokenBudget({requests:-1}).daily,0)
})
test('all editorial labels and knowledge edges resolve to published essays',()=>{
  const slugs=new Set(ARTICLES.map(a=>a.slug))
  for(const slug of Object.keys(FORMATS))assert.ok(slugs.has(slug),slug)
  for(const edge of CONNECTIONS){assert.ok(slugs.has(edge.from));assert.ok(slugs.has(edge.to));assert.notEqual(edge.from,edge.to);assert.ok(edge.label.length>10)}
})
