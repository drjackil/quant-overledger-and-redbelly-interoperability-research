// Minimal static server for previewing site/ locally: node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { ROOT } from './lib/content.mjs';

const SITE = join(ROOT, 'site');
const PORT = Number(process.argv[2]) || 8080;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  const file = join(SITE, normalize(path).replace(/^(\.\.[/\\])+/, ''));
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    res.end(await readFile(join(SITE, '404.html')).catch(() => 'Not found'));
  }
}).listen(PORT, () => console.log(`serving site/ on http://localhost:${PORT}`));
