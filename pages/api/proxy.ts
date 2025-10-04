// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const url = process.env.N8N_WEBHOOK_URL
  if (!url) return res.status(500).json({ error: 'N8N_WEBHOOK_URL not set' })

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    })

    const text = await r.text()
    const ct = r.headers.get('content-type') || 'application/json'
    res.status(r.status).setHeader('content-type', ct).send(text)
  } catch (e: any) {
    res.status(502).json({ error: 'proxy_failed', detail: String(e) })
  }
}
