import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/index'
const configured = import.meta.env.VITE_NEWSLETTER_URL || ''
// Only a Google-hosted signup URL is enabled; old paid-provider settings are ignored.
const NEWSLETTER_URL = /^https:\/\/script\.google\.com\/macros\/s\/[^/?#]+\/exec$/.test(configured) ? configured : ''
export default function Subscribe({ compact = false }) {
  const [copied,setCopied] = useState(false)
  async function copyFeed() {
    try { await navigator.clipboard.writeText(new URL(`${import.meta.env.BASE_URL}feed.xml`,window.location.origin).href);setCopied(true) }
    catch { setCopied(false) }
  }
  return <div className={`subscribe ${compact ? 'subscribe--compact' : ''}`}>
    <div className="subscribe-header"><h3 className="subscribe-title">Stay in the loop</h3><p className="subscribe-desc">New writing, revised ideas, and projects. A digest when there’s something new to explore.</p></div>
    <div className="subscribe-options">{NEWSLETTER_URL && <a className="journal-button" href={NEWSLETTER_URL} target="_blank" rel="noopener noreferrer">Get updates by email →</a>}<a className="journal-text-link" href={`${import.meta.env.BASE_URL}feed.xml`}>Subscribe via RSS →</a><button className="journal-text-link" onClick={copyFeed}>{copied?'Feed link copied ✓':'Copy feed link'}</button></div>
    <p className="subscribe-note">{NEWSLETTER_URL ? 'Confirm your address to join. Unsubscribe from any email.' : 'Email updates are coming soon. You can follow every new post through RSS today.'}</p>
    {copied && <span role="status" className="sr-only">Feed link copied</span>}
    <details className="subscribe-sample"><summary>A taste of the newsletter</summary><p>A short note from Alok, a few ideas worth exploring, and links to read them at your own pace.</p><ul>{ARTICLES.slice(0,3).map(a=><li key={a.slug}><Link to={`/writing/${a.slug}`}>{a.title} →</Link></li>)}</ul><p>No account is needed for RSS. Add the feed URL to your preferred reader.</p></details>
  </div>
}
