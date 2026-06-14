import { useState } from 'react'

const SUBSCRIBE_PROXY = import.meta.env.VITE_SUBSCRIBE_PROXY_URL || ''

/**
 * Email subscribe form — connects to Beehiiv via Cloudflare Worker proxy.
 * Placement: Footer + end of articles.
 * Proxy URL set via VITE_SUBSCRIBE_PROXY_URL env variable.
 */
export default function Subscribe({ compact = false, source = 'website' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    setErrorMsg('')

    if (!SUBSCRIBE_PROXY) {
      // Demo mode — no proxy configured yet
      setStatus('success')
      return
    }

    try {
      const res = await fetch(SUBSCRIBE_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          utm_source: source,
          utm_medium: compact ? 'article-inline' : 'footer',
        }),
      })

      if (res.ok || res.status === 201) {
        setStatus('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        if (res.status === 409 || data?.message?.includes('already')) {
          setStatus('success') // Already subscribed is still a win
        } else {
          setErrorMsg(data?.message || 'Something went wrong. Try again.')
          setStatus('error')
        }
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`subscribe ${compact ? 'subscribe--compact' : ''}`}>
        <div className="subscribe-success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4b896" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>You're in. You'll hear from me when something new drops.</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`subscribe ${compact ? 'subscribe--compact' : ''}`}>
      {!compact && (
        <div className="subscribe-header">
          <h3 className="subscribe-title">Stay in the loop</h3>
          <p className="subscribe-desc">
            New essays on AI systems, architecture, and engineering craft. No spam, no fluff — just signal.
          </p>
        </div>
      )}
      {compact && (
        <span className="subscribe-inline-label">Get notified on new posts →</span>
      )}
      <form className="subscribe-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="subscribe-input"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className="subscribe-btn"
          disabled={status === 'loading' || !email}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className="subscribe-error">{errorMsg}</p>}
      <p className="subscribe-privacy">No spam. Unsubscribe anytime.</p>
    </div>
  )
}
