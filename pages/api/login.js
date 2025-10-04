// pages/api/login.js

export const config = { api: { bodyParser: true } };

export default function handler(req, res) {
  const method = req.method || 'GET';

  // Allow simple preflight if ever called
  if (method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(204).end();
  }

  // Only GET (for quick tests) and POST (from the form) are supported
  if (method !== 'POST' && method !== 'GET') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).end('Method Not Allowed');
  }

  // Read password from body (POST) or query (GET)
  const input =
    (method === 'POST'
      ? (req.body?.password || req.body?.pass || '')
      : (req.query?.pass || req.query?.password || '')).toString().trim();

  // Secret comes from env (prefer SITE_PASSWORD; fallback to CHATBOT_PASS)
  const secret = (process.env.SITE_PASSWORD || process.env.CHATBOT_PASS || '').trim();
  if (!secret) {
    return res.status(500).json({ ok: false, error: 'SITE_PASSWORD (or CHATBOT_PASS) not set' });
  }

  if (input !== secret) {
    return res.status(403).json({ ok: false, error: 'Wrong password' });
  }

  // Set auth cookie for middleware to allow access
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  res.setHeader(
    'Set-Cookie',
    `site_auth=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Secure`
  );

  return res.status(200).json({ ok: true });
}
