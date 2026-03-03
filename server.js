const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  const parsed   = url.parse(req.url);
  const pathname = parsed.pathname;

  // Decide which file to serve
  let filePath;

  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (pathname === '/qr' || pathname === '/qr.html') {
    filePath = path.join(__dirname, 'public', 'qr.html');
  } else {
    // Try to serve any file inside /public
    filePath = path.join(__dirname, 'public', pathname);
  }

  const ext  = path.extname(filePath) || '.html';
  const mime = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // File not found — serve index.html as fallback
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, data2) => {
        if (err2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data2);
      });
    } else {
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   🏥  MediQueue Server Started           ║');
  console.log(`  ║   Main app : http://localhost:${PORT}          ║`);
  console.log(`  ║   QR page  : http://localhost:${PORT}/qr       ║`);
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});