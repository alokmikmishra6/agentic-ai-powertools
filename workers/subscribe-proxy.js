/**
 * Cloudflare Worker — Beehiiv Subscribe Proxy
 * 
 * Proxies subscription requests from the frontend to Beehiiv's API,
 * keeping the API key server-side and avoiding CORS issues.
 * 
 * Deploy: https://workers.cloudflare.com
 * 
 * Environment variables (set in Worker settings):
 *   BEEHIIV_API_KEY - Your Beehiiv API key
 * 
 * Allowed origins (update ALLOWED_ORIGINS below with your domain)
 */

const BEEHIIV_PUB_ID = 'pub_af7aba00-0993-4f40-9589-597bd53297de'
const BEEHIIV_API = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`

const ALLOWED_ORIGINS = [
  'https://alokmishra.github.io',
  'http://localhost:5175',
  'http://localhost:5173',
]

function corsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      })
    }

    // Validate origin
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    try {
      const body = await request.json()

      // Only allow email field — prevent abuse
      if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
        return new Response(JSON.stringify({ error: 'Invalid email' }), {
          status: 400,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        })
      }

      // Forward to Beehiiv
      const res = await fetch(BEEHIIV_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email: body.email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: body.utm_source || 'website',
          utm_medium: body.utm_medium || 'subscribe-form',
        }),
      })

      const data = await res.json()

      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      })
    }
  },
}
