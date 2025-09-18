// ===== File: api/news.js (Vercel Serverless Function) =====
// Place this at the project root in the `api/` folder: api/news.js
// Set `NEWS_API_KEY` in Vercel project environment variables (not the VITE_ one).

let cached = null;
let cachedAt = 0;
const TTL = 1000 * 60 * 2; // 2 minutes

export default async function handler(req, res) {
  const q = typeof req.query.q === 'string' && req.query.q.length ? req.query.q : '"Royal Challengers Bangalore" OR "RCB cricket"';
  const pageSize = typeof req.query.pageSize === 'string' && req.query.pageSize.length ? req.query.pageSize : '50';

  const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'NEWS_API_KEY not set on the server' });
    return;
  }

  // Simple cache
  if (cached && Date.now() - cachedAt < TTL) {
    return res.status(200).json(cached);
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=${encodeURIComponent(pageSize)}&apiKey=${apiKey}`;

  try {
    const upstream = await fetch(url, { method: 'GET' });
    const text = await upstream.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      // Not JSON — forward raw text
      res.status(upstream.ok ? 200 : upstream.status).send(text);
      return;
    }

    if (!upstream.ok) {
      // Forward NewsAPI error
      res.status(upstream.status).json(data);
      return;
    }

    // Cache & respond
    cached = data;
    cachedAt = Date.now();
    res.status(200).json(data);
  } catch (err) {
    console.error('/api/news error:', err);
    res.status(500).json({ error: 'Error fetching news', details: String(err) });
  }
}
