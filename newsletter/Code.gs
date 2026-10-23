/* Free Google Apps Script mailing service. Store configuration in Script Properties.
 * OWNER_EMAIL: owner notification address
 * SITE_URL: https://alokmikmishra6.github.io/agentic-ai-powertools
 * WEB_APP_URL: deployed /exec URL
 * SPREADSHEET_ID: created by setupNewsletter_(); keep the sheet private.
 * No paid API, billing account, or email provider credentials are used.
 */
const SUB_HEADERS = ['email','status','confirmationHash','requestedAt','confirmedAt','unsubscribeToken'];
const QUEUE_HEADERS = ['id','email','kind','subject','body','status','createdAt','attempts'];
function settings_() {
  const props = PropertiesService.getScriptProperties();
  const config = props.getProperties();
  if (!config.OWNER_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.OWNER_EMAIL)) throw new Error('Set OWNER_EMAIL in Script Properties.');
  config.SITE_URL = (config.SITE_URL || 'https://alokmikmishra6.github.io/agentic-ai-powertools').replace(/\/$/,'');
  return config;
}
function sheet_(name, headers) {
  const config = settings_();
  const book = SpreadsheetApp.openById(config.SPREADSHEET_ID);
  let sheet = book.getSheetByName(name);
  if (!sheet) { sheet = book.insertSheet(name); sheet.appendRow(headers); sheet.setFrozenRows(1); }
  return sheet;
}
function rows_(sheet) { return sheet.getLastRow() < 2 ? [] : sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues(); }
function hash_(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join(''); }
function token_() { return Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,''); }
function lock_(fn) { const lock = LockService.getScriptLock();lock.waitLock(10000);try{return fn();}finally{lock.releaseLock();} }
function queue_(id,email,kind,subject,body) {
  const sheet=sheet_('Queue',QUEUE_HEADERS);
  if(rows_(sheet).some(row=>row[0]===id))return;
  sheet.appendRow([id,email,kind,subject,body,'queued',Date.now(),0]);
}
function fetchUpdates_() {
  const response=UrlFetchApp.fetch(settings_().SITE_URL+'/updates.json',{muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw new Error('Deploy the website with updates.json before initializing the newsletter.');
  const data=JSON.parse(response.getContentText());
  if(data.version!==1 || !Array.isArray(data.items))throw new Error('Invalid update manifest.');
  return data.items.filter(item=>typeof item.id==='string' && typeof item.revision==='string' && typeof item.title==='string' && typeof item.url==='string' && item.url.startsWith(settings_().SITE_URL+'/'));
}
// Run once from the Apps Script editor after the web app and website are deployed.
function setupNewsletter_() {
  const config=settings_(),props=PropertiesService.getScriptProperties();
  if(!config.WEB_APP_URL || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(config.WEB_APP_URL))throw new Error('Set WEB_APP_URL to your deployed /exec URL first.');
  if(!config.SPREADSHEET_ID)props.setProperty('SPREADSHEET_ID',SpreadsheetApp.create('Field Notes — private subscriber list').getId());
  return lock_(()=>{
    sheet_('Subscribers',SUB_HEADERS);sheet_('Queue',QUEUE_HEADERS);
    const seen=sheet_('Published',['id','revision']);
    if(!props.getProperty('INITIALIZED')){
      const items=fetchUpdates_();
      items.forEach(item=>seen.appendRow([item.id,item.revision]));
      props.setProperty('INITIALIZED','true');
    }
    if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='newsletterTick_'))ScriptApp.newTrigger('newsletterTick_').timeBased().everyHours(1).create();
    console.log('Ready. Existing content was baselined; future published changes will be queued. Subscriber sheet: '+props.getProperty('SPREADSHEET_ID'));
  });
}
function subscribe(email, website) {
  if(website)return 'If this address can subscribe, a confirmation email will arrive shortly.';
  email=String(email||'').trim().toLowerCase();
  if(email.length>254 || !/^[a-z0-9][a-z0-9.!#$%&'*+\/=?^_`{|}~-]*@[^\s@]+\.[^\s@]+$/i.test(email))throw new Error('Please enter a valid email address.');
  return lock_(()=>{
    const config=settings_(),props=PropertiesService.getScriptProperties();
    if(props.getProperty('INITIALIZED')!=='true')throw new Error('Email signup is not open yet. Please try again later.');
    const sheet=sheet_('Subscribers',SUB_HEADERS),rows=rows_(sheet),index=rows.findIndex(row=>row[0]===email),now=Date.now();
    const old=index>=0?rows[index]:null;
    // Generic responses avoid revealing who is already on the list.
    if(old && (old[1]==='confirmed' || now-Number(old[3])<3600000))return 'If this address can subscribe, a confirmation email will arrive shortly.';
    const day=Utilities.formatDate(new Date(),'UTC','yyyy-MM-dd');
    const count=props.getProperty('SIGNUP_DAY')===day?Number(props.getProperty('SIGNUP_COUNT')||0):0;
    if(count>=20)throw new Error('Today’s signup limit has been reached. Please try again tomorrow, or follow the RSS feed.');
    props.setProperties({SIGNUP_DAY:day,SIGNUP_COUNT:String(count+1)});
    const token=token_(),unsubscribe=old?old[5]:token_();
    const row=[email,'pending',hash_(token),now,'',unsubscribe];
    if(index>=0)sheet.getRange(index+2,1,1,6).setValues([row]);else sheet.appendRow(row);
    queue_('confirm:'+hash_(email)+':'+now,email,'confirm','Confirm your subscription to Alok’s Field Notes',
      'You requested new essays and project updates from Alok Mishra.\n\nConfirm your address within 24 hours:\n'+config.WEB_APP_URL+'?action=confirm&token='+token+'\n\nIf you did not request this, ignore this email. You will not be subscribed.');
    return 'Check your inbox for a confirmation link. Delivery may take up to an hour; if the daily quota is full, please try again tomorrow.';
  });
}
function confirmSubscription(token) {
  if(!/^[a-f0-9]{64}$/.test(String(token)))throw new Error('This confirmation link is invalid.');
  return lock_(()=>{
    const config=settings_(),sheet=sheet_('Subscribers',SUB_HEADERS),rows=rows_(sheet),index=rows.findIndex(row=>row[2]===hash_(token));
    if(index<0)throw new Error('This confirmation link is invalid.');
    const row=rows[index];
    if(row[1]==='confirmed')return 'Your address is already confirmed. Thank you for reading.';
    if(row[1]!=='pending' || Date.now()-Number(row[3])>86400000)throw new Error('This link has expired. Please subscribe again for a fresh link.');
    // Queue before saving confirmation so a retry can finish an interrupted operation.
    const stamp=row[3];
    queue_('owner:'+hash_(row[0])+':'+stamp,config.OWNER_EMAIL,'owner','New confirmed Field Notes subscriber',row[0]+' confirmed their subscription.\n\nManage the private list in your Field Notes Google Sheet.');
    queue_('welcome:'+hash_(row[0])+':'+stamp,row[0],'welcome','Welcome to Field Notes',
      'Thanks for reading. Here are three places to begin:\n\n'+
      'The Invisible Architecture of an Agentic Workflow\n'+config.SITE_URL+'/writing/invisible-architecture-agentic-workflow/\n\n'+
      'The five questions I ask before signing off on any system design\n'+config.SITE_URL+'/writing/five-questions-system-design/\n\n'+
      'On knowing a system and understanding it\n'+config.SITE_URL+'/writing/knowing-vs-understanding-system/\n\n'+
      'You will receive a digest when new or revised writing and projects are published.\n\nUnsubscribe: '+config.WEB_APP_URL+'?action=unsubscribe&token='+row[5]);
    row[1]='confirmed';row[4]=Date.now();sheet.getRange(index+2,1,1,6).setValues([row]);
    return 'You’re subscribed. Your welcome note will arrive shortly. You can unsubscribe from any email.';
  });
}
function unsubscribe(token) {
  if(!/^[a-f0-9]{64}$/.test(String(token)))throw new Error('This unsubscribe link is invalid.');
  return lock_(()=>{
    const sheet=sheet_('Subscribers',SUB_HEADERS),rows=rows_(sheet),index=rows.findIndex(row=>row[5]===token);
    if(index<0)throw new Error('This unsubscribe link is invalid.');
    const row=rows[index];row[1]='unsubscribed';row[2]='';sheet.getRange(index+2,1,1,6).setValues([row]);
    return 'You have been unsubscribed. No further blog updates will be sent.';
  });
}
function newsletterTick_() {
  // This editor/trigger function is private to the web client (underscore suffix below).
  return tick_();
}
function tick_() {
  if(PropertiesService.getScriptProperties().getProperty('INITIALIZED')!=='true')return;
  // Fetch outside the lock so signups do not wait on the website.
  let items;
  try { items=fetchUpdates_(); } catch(error) { console.warn('Published updates unavailable; processing the existing mail queue.'); }
  lock_(()=>{
    const config=settings_(),seenSheet=sheet_('Published',['id','revision']),seen=rows_(seenSheet),known=new Map(seen.map(row=>[row[0],row[1]]));
    const changes=(items || []).filter(item=>known.get(item.id)!==item.revision);
    if(changes.length){
      const revision=hash_(changes.map(item=>item.id+':'+item.revision).sort().join('|'));
      const subscribers=rows_(sheet_('Subscribers',SUB_HEADERS)).filter(row=>row[1]==='confirmed');
      const summary=changes.map(item=>item.title+'\n'+(item.summary||'')+'\n'+item.url).join('\n\n');
      subscribers.forEach(row=>queue_('digest:'+revision+':'+hash_(row[0]),row[0],'update',changes.length===1?'New in Field Notes: '+changes[0].title:changes.length+' updates from Field Notes',
        'Here is what is new or revised in the notebook:\n\n'+summary+'\n\n— Alok\n\nUnsubscribe: '+config.WEB_APP_URL+'?action=unsubscribe&token='+row[5]));
      changes.forEach(item=>{const index=seen.findIndex(row=>row[0]===item.id);if(index>=0)seenSheet.getRange(index+2,2).setValue(item.revision);else seenSheet.appendRow([item.id,item.revision]);});
    }
    drainQueue_();
  });
}
function drainQueue_() {
  const sheet=sheet_('Queue',QUEUE_HEADERS),rows=rows_(sheet),subscribers=rows_(sheet_('Subscribers',SUB_HEADERS));
  let sent=0;
  // Always reserve five recipients for other uses of this Google account.
  for(let i=0;i<rows.length && sent<25;i++){
    const row=rows[i];
    if(row[5]!=='queued' || Number(row[7])>=5)continue;
    const subscriber=subscribers.find(sub=>sub[0]===row[1]);
    const eligible = row[2]==='owner' || (row[2]==='confirm'
      ? subscriber && subscriber[1]==='pending' && Number(subscriber[3])<=Number(row[6]) && Date.now()-Number(row[6])<=86400000
      : subscriber && subscriber[1]==='confirmed');
    if(!eligible){row[5]='cancelled';sheet.getRange(i+2,1,1,8).setValues([row]);continue;}
    if(MailApp.getRemainingDailyQuota()<=5)break;
    try {
      MailApp.sendEmail({to:row[1],subject:row[3],body:row[4],name:'Alok Mishra — Field Notes',replyTo:settings_().OWNER_EMAIL});
      row[5]='sent';sent++;
    } catch(error) { row[7]=Number(row[7])+1;if(row[7]>=5)row[5]='failed'; }
    sheet.getRange(i+2,1,1,8).setValues([row]);
  }
}
function doGet(e) {
  const template=HtmlService.createTemplateFromFile('Signup');
  template.action=['confirm','unsubscribe'].includes(e && e.parameter.action)?e.parameter.action:'signup';
  template.token=/^[a-f0-9]{64}$/.test(String(e && e.parameter.token))?e.parameter.token:'';
  template.site=settings_().SITE_URL;
  return template.evaluate().setTitle('Subscribe — Alok Mishra').addMetaTag('viewport','width=device-width, initial-scale=1');
}
