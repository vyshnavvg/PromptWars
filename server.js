const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const distDir = path.join(__dirname, 'dist', 'PromptWarsAngular', 'browser');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const reqPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

  if (reqPath === '/runtime-config.js') {
    const runtimeConfig = {
      geminiApiKey: process.env.GEMINI_API_KEY || process.env.AZURE_GEMINI_API_KEY || ''
    };

    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    res.end(`window.__ANCHORCARE_RUNTIME__ = ${JSON.stringify(runtimeConfig)};`);
    return;
  }

  const safePath = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.normalize(path.join(distDir, safePath));

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const indexFile = path.join(distDir, 'index.html');
    fs.readFile(indexFile, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
