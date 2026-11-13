// Lokaler Server (nur 127.0.0.1): nutzt dieselben Handler wie Vercel.
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(path.join(__dirname, 'public', 'index.html')));
  }
  const m = u.pathname.match(/^\/api\/([a-z]+)$/);
  const file = m && path.join(__dirname, 'api', m[1] + '.js');
  if (!file || !fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  req.query = Object.fromEntries(u.searchParams);
  res.status = c => { res.statusCode = c; return res; };
  res.json = d => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(d)); };
  require(file)(req, res);
}).listen(PORT, '127.0.0.1', () => console.log(`Läuft auf http://localhost:${PORT}`));
