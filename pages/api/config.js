export default function handler(req, res) {
  const url = process.env.N8N_WEBHOOK_URL || '';
  res.status(200).json({
    hasUrl: Boolean(url),
    sample: url ? url.slice(0, 40) + '…' : null
  });
}
