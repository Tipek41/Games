import http from 'node:http';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const routes = { '/': 'index.html', '/index.html': 'index.html', '/pofidik-tavsan/': 'pofidik-tavsan/index.html', '/pofidik-tavsan/index.html': 'pofidik-tavsan/index.html' };
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
  }
  const path = new URL(req.url, 'http://localhost').pathname;
  if (!Object.hasOwn(routes, path)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  try {
    const body = await readFile(new URL(routes[path], root));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500); res.end('Preview unavailable');
  }
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE') process.exit(0);
  console.error(error); process.exit(1);
});
server.listen(3000, '0.0.0.0', () => console.log('Games: http://localhost:3000'));
