import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import sharp from 'sharp'
import { ARTICLES, THINKING } from '../src/data/content.js'
import { PROJECTS } from '../src/lib/showcase.js'
const BASE = 'https://alokmikmishra6.github.io/agentic-ai-powertools'
const escape = text => String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
const template = readFileSync('dist/index.html','utf8')
const vite = await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'})
function wrapLines(text, limit=35) {
  const lines=[];let line=''
  for(const word of text.split(/\s+/)) { if((line+' '+word).trim().length>limit && line) {lines.push(line);line=word} else line=(line+' '+word).trim() }
  if(line)lines.push(line)
  return lines
}
function metadata(html, {title,description,url,image,type='website',article}) {
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(title)}</title>`)
  html=html.replace(/<meta (?:name="description"|property="og:[^"]+")[^>]*>/g,'')
  const json = article ? `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:article.title,description:article.excerpt,datePublished:article.date,author:{'@type':'Person',name:'Alok Mishra'},mainEntityOfPage:url,image}).replace(/</g,'\\u003c')}</script>` : ''
  return html.replace('</head>',`<link rel="canonical" href="${escape(url)}"><link rel="alternate" type="application/rss+xml" title="Field Notes" href="${BASE}/feed.xml"><meta name="description" content="${escape(description)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(url)}"><meta property="og:type" content="${type}"><meta property="og:image" content="${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">${json}</head>`)
}
try {
  const {default:Nav}=await vite.ssrLoadModule('/src/components/Nav.jsx')
  const {default:Footer}=await vite.ssrLoadModule('/src/components/Footer.jsx')
  const pages=[['/','Home','Field Notes on AI & Architecture'],['/writing','Writing','The writing'],['/showcase','Showcase','Ideas in practice'],['/thinking','Thinking','The open notebook'],['/about','About','About Alok'],['/saved','Saved','Your reading corner'],['/labs','Labs','Interactive systems labs']]
  const render = (Component,path,route='*') => renderToStaticMarkup(React.createElement(MemoryRouter,{initialEntries:['/agentic-ai-powertools'+path],basename:'/agentic-ai-powertools'},React.createElement(React.Fragment,null,React.createElement(Nav),React.createElement('main',{id:'main-content',tabIndex:-1},React.createElement(Routes,null,React.createElement(Route,{path:route,element:React.createElement(Component)}))),React.createElement(Footer))))
  const save = (path,html) => {const dir=resolve('dist',path.replace(/^\//,''));mkdirSync(dir,{recursive:true});writeFileSync(resolve(dir,'index.html'),html)}
  mkdirSync('dist/og',{recursive:true})
  for(const article of ARTICLES) {
    const lines=wrapLines(article.title)
    const titleSize=lines.length>4?45:54
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0c100f"/><circle cx="1050" cy="290" r="240" fill="none" stroke="#293c30" stroke-width="2"/><circle cx="1050" cy="290" r="180" fill="none" stroke="#293c30" stroke-width="2"/><circle cx="1050" cy="290" r="120" fill="none" stroke="#293c30" stroke-width="2"/><path d="M65 80H1135 M65 550H1135" stroke="#435044"/><text x="65" y="120" fill="#d7b98a" font-family="sans-serif" font-size="18" letter-spacing="3">${escape(article.category.toUpperCase())}</text>${lines.map((line,i)=>`<text x="65" y="${200+i*(titleSize+12)}" fill="#eeeae2" font-family="sans-serif" font-size="${titleSize}">${escape(line)}</text>`).join('')}<text x="65" y="595" fill="#d7b98a" font-family="serif" font-size="32">am.</text><text x="140" y="591" fill="#b9c4b9" font-family="sans-serif" font-size="18">ALOK MISHRA · FIELD NOTES</text></svg>`
    await sharp(Buffer.from(svg)).png().toFile(`dist/og/${article.slug}.png`)
    const {default:Article}=await vite.ssrLoadModule('/src/pages/Article.jsx')
    const path=`/writing/${article.slug}/`
    const html=metadata(template,{title:article.title+' — Alok Mishra',description:article.excerpt,url:BASE+path,image:BASE+`/og/${article.slug}.png`,type:'article',article})
    save(path,html.replace('<div id="root"></div>',`<div id="root">${render(Article,path,'/writing/:slug')}</div>`))
  }
  for(const [path,module,title] of pages) {
    const {default:Page}=await vite.ssrLoadModule(`/src/pages/${module}.jsx`)
    const html=metadata(template,{title:title+' — Alok Mishra',description:'Essays, experiments, and field notes on AI systems, software architecture, and engineering.',url:BASE+(path==='/'?'/':path+'/'),image:BASE+`/og/${ARTICLES[0].slug}.png`})
    save(path,html.replace('<div id="root"></div>',`<div id="root">${render(Page,path)}</div>`))
  }
  const urls=[...pages.filter(([p])=>p!=='/saved').map(([p])=>BASE+(p==='/'?'/':p+'/')),...ARTICLES.map(a=>BASE+`/writing/${a.slug}/`)]
  writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>`<url><loc>${url}</loc></url>`).join('')+'</urlset>')
  const revision = item => createHash('sha256').update(JSON.stringify(item)).digest('hex').slice(0,20)
  const inquiries=THINKING.filter(t=>t.status!=='archived')
  const updates=[...ARTICLES.map(a=>({id:'writing:'+a.slug,title:a.title,summary:a.excerpt,url:BASE+`/writing/${a.slug}/`,revision:revision(a)})),...PROJECTS.map(p=>({id:'showcase:'+p.slug,title:p.title,summary:p.problem,url:BASE+`/showcase/?project=${p.slug}`,revision:revision(p)})),...inquiries.map(t=>({id:'thinking:'+createHash('sha256').update(t.title).digest('hex').slice(0,16),title:t.title,summary:t.body,url:BASE+`/thinking/?idea=${encodeURIComponent(t.slug)}`,revision:revision(t)}))]
  writeFileSync('dist/updates.json',JSON.stringify({version:1,items:updates},null,2))
  // A generic fallback preserves deep links for future routes; known pages have static HTML.
  writeFileSync('dist/404.html',template)
  writeFileSync('dist/.nojekyll','')
  console.log(`Static pages ready: ${ARTICLES.length} essays, ${pages.length} pages, PNG previews, sitemap, and update manifest.`)
} finally { await vite.close() }
