import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import vm from 'node:vm'
const SOURCE=readFileSync(new URL('../newsletter/Code.gs',import.meta.url),'utf8')
function harness() {
  const props={OWNER_EMAIL:'owner@example.com',SITE_URL:'https://example.com/blog',WEB_APP_URL:'https://script.google.com/macros/s/test/exec'}
  const sheets=new Map(),sent=[],triggers=[]
  let quota=100,fail=false,offline=false
  let updates=[{id:'writing:existing',revision:'v1',title:'Existing essay',summary:'A summary',url:'https://example.com/blog/writing/existing/'}]
  function sheet(name) {
    const data=[]
    return {data,appendRow(row){data.push([...row])},setFrozenRows(){},getLastRow(){return data.length},getLastColumn(){return data[0]?.length||0},getRange(row,col,numRows=1,numCols=1){return {getValues(){return Array.from({length:numRows},(_,i)=>Array.from({length:numCols},(_,j)=>data[row-1+i]?.[col-1+j]??''))},setValues(values){values.forEach((r,i)=>r.forEach((v,j)=>{data[row-1+i]??=[];data[row-1+i][col-1+j]=v}))},setValue(value){data[row-1]??=[];data[row-1][col-1]=value}}}}
  }
  const properties={getProperties:()=>({...props}),getProperty:key=>props[key]||null,setProperty:(k,v)=>{props[k]=v},setProperties:value=>Object.assign(props,value)}
  const context=vm.createContext({console:{log(){},warn(){}},Date,Map,Set,JSON,Number,String,Array,Error,RegExp,
    PropertiesService:{getScriptProperties:()=>properties},
    SpreadsheetApp:{create:()=>({getId:()=> 'private-sheet'}),openById:()=>({getSheetByName:name=>sheets.get(name),insertSheet:name=>{const s=sheet(name);sheets.set(name,s);return s}})},
    LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
    Utilities:{getUuid:randomUUID,DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,value)=>[...createHash('sha256').update(value).digest()],formatDate:date=>date.toISOString().slice(0,10)},
    UrlFetchApp:{fetch:()=>({getResponseCode:()=>offline?503:200,getContentText:()=>JSON.stringify({version:1,items:updates})})},
    ScriptApp:{getProjectTriggers:()=>triggers,newTrigger:name=>({timeBased(){return this},everyHours(){return this},create(){triggers.push({getHandlerFunction:()=>name})}})},
    MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:message=>{if(fail)throw new Error('temporary failure');sent.push(message);quota--}},
  })
  vm.runInContext(SOURCE,context)
  context.setupNewsletter_()
  return {context,props,sheets,sent,triggers,setQuota:n=>{quota=n},setFailure:v=>{fail=v},setOffline:v=>{offline=v},setUpdates:value=>{updates=value},confirm(email){const job=sheets.get('Queue').data.find(row=>row[1]===email&&row[2]==='confirm');const token=job[4].match(/token=([a-f0-9]+)/)[1];return context.confirmSubscription(token)}}
}
test('setup is idempotent, baselines existing posts, and installs one hourly trigger without sending',()=>{
  const h=harness();h.context.setupNewsletter_();h.context.newsletterTick_()
  assert.equal(h.triggers.length,1);assert.equal(h.sent.length,0);assert.equal(h.sheets.get('Published').data.length,2)
})
test('signup sends confirmation immediately; confirmation immediately sends welcome and owner notice once',()=>{
  const h=harness();const result=h.context.subscribe('reader@example.com','')
  assert.match(result,/has been sent/)
  assert.equal(h.sent.length,1);assert.match(h.sent[0].subject,/Confirm/)
  assert.equal(h.sheets.get('Subscribers').data[1][1],'pending')
  h.confirm('reader@example.com')
  assert.equal(h.sent.length,3);assert.equal(h.sent.filter(m=>m.to==='owner@example.com').length,1)
  assert.match(h.sent.find(m=>/Welcome/.test(m.subject)).body,/Unsubscribe:/)
  h.confirm('reader@example.com');h.context.newsletterTick_();assert.equal(h.sent.length,3)
})
test('published changes are queued once, deferred at quota, then delivered; unsubscribed addresses are skipped',()=>{
  const h=harness();h.context.subscribe('reader@example.com','');h.confirm('reader@example.com');h.context.newsletterTick_()
  h.sent.length=0
  h.setUpdates([{id:'writing:existing',revision:'v2',title:'Revised essay',summary:'Changed',url:'https://example.com/blog/writing/existing/'}]);h.setQuota(5)
  h.context.newsletterTick_();assert.equal(h.sent.length,0)
  h.setQuota(100);h.context.newsletterTick_();h.context.newsletterTick_();assert.equal(h.sent.length,1)
  const token=h.sheets.get('Subscribers').data[1][5];h.context.unsubscribe(token)
  h.setUpdates([{id:'writing:existing',revision:'v3',title:'Again',url:'https://example.com/blog/writing/existing/'}]);h.context.newsletterTick_()
  assert.equal(h.sent.length,1)
})
test('unsubscribing cancels an already queued update before it can be sent',()=>{
  const h=harness();h.context.subscribe('reader@example.com','');h.confirm('reader@example.com');h.context.newsletterTick_();h.sent.length=0
  h.setQuota(5);h.setUpdates([{id:'writing:new',revision:'v1',title:'New',url:'https://example.com/blog/writing/new/'}]);h.context.newsletterTick_()
  h.context.unsubscribe(h.sheets.get('Subscribers').data[1][5]);h.setQuota(100);h.context.newsletterTick_()
  assert.equal(h.sent.length,0);assert.ok(h.sheets.get('Queue').data.some(row=>row[2]==='update'&&row[5]==='cancelled'))
})
test('honeypot, invalid tokens, and repeated pending requests cannot create extra mail jobs',()=>{
  const h=harness();h.context.subscribe('bot@example.com','filled');assert.equal(h.sheets.get('Subscribers').data.length,1)
  assert.throws(()=>h.context.subscribe('=formula@example.com',''))
  h.context.subscribe('reader@example.com','');h.context.subscribe('reader@example.com','');assert.equal(h.sheets.get('Queue').data.length,2)
  assert.throws(()=>h.context.confirmSubscription('a'.repeat(64)));assert.throws(()=>h.context.unsubscribe('wrong'))
})
test('mail delivery failures retry without success and existing jobs drain when the site is unavailable',()=>{
  const h=harness();h.setFailure(true);const result=h.context.subscribe('reader@example.com','');assert.equal(h.sent.length,0)
  assert.match(result,/is queued/)
  assert.equal(h.sheets.get('Queue').data[1][7],1)
  h.setFailure(false);h.setOffline(true);h.context.newsletterTick_();assert.equal(h.sent.length,1)
})
test('immediate delivery respects quota and deferred confirmation, owner, and welcome messages retry once',()=>{
  const h=harness();h.setQuota(5)
  assert.match(h.context.subscribe('reader@example.com',''),/is queued/)
  assert.equal(h.sent.length,0);assert.equal(h.sheets.get('Queue').data[1][7],0)
  h.setQuota(6);h.context.newsletterTick_();assert.equal(h.sent.length,1)
  h.confirm('reader@example.com');assert.equal(h.sent.length,1)
  assert.equal(h.sheets.get('Subscribers').data[1][1],'confirmed')
  h.setQuota(100);h.context.newsletterTick_();h.context.newsletterTick_()
  assert.equal(h.sent.length,3)
})
test('a new signup sends only its own message and does not drain unrelated queued mail',()=>{
  const h=harness();h.setQuota(5);h.context.subscribe('waiting@example.com','')
  h.setQuota(100);h.context.subscribe('new@example.com','')
  assert.equal(h.sent.length,1);assert.equal(h.sent[0].to,'new@example.com')
  assert.equal(h.sheets.get('Queue').data[1][5],'queued')
  h.context.newsletterTick_();assert.equal(h.sent.length,2)
})
test('privileged setup and trigger functions are private to google.script.run',()=>{
  const publicFunctions=[...SOURCE.matchAll(/^function (\w+)\(/gm)].map(m=>m[1]).filter(name=>!name.endsWith('_'))
  assert.deepEqual(publicFunctions.sort(),['confirmSubscription','doGet','subscribe','unsubscribe'].sort())
})
