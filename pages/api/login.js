export const config = { api: { bodyParser: true } };

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const input = (req.body && req.body.password) || '';
  const expected = process.env.SITE_PASSWORD || 'password';

  if (input !== expected) {
    return res.status(401).json({ ok: false, error: 'Wrong password' });
  }

  // 1-day auth cookie
  res.setHeader('Set-Cookie',
    'site_auth=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; Secure'
  );
  return res.status(200).json({ ok: true });
}
