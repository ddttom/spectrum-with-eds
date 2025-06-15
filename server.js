import { createServer } from 'http';
import { readFile, access } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const PROXY_HOST = 'https://allabout.network';

// MIME type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Check if file exists locally
async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Serve local file
async function serveLocalFile(filePath, res) {
  try {
    const content = await readFile(filePath);
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
    return true;
  } catch (error) {
    console.error(`Error serving local file ${filePath}:`, error.message);
    return false;
  }
}

// Proxy request to allabout.network
async function proxyRequest(url, res) {
  try {
    const proxyUrl = `${PROXY_HOST}${url}`;
    console.log(`Proxying request to: ${proxyUrl}`);
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const content = await response.arrayBuffer();
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(Buffer.from(content));
    return true;
  } catch (error) {
    console.error(`Error proxying request for ${url}:`, error.message);
    return false;
  }
}

// Main request handler
async function handleRequest(req, res) {
  const url = req.url === '/' ? '/aem.html' : req.url;
  const filePath = join(__dirname, url.startsWith('/') ? url.slice(1) : url);
  
  console.log(`Request: ${req.method} ${url}`);
  
  // Try to serve local file first
  if (await fileExists(filePath)) {
    console.log(`Serving local file: ${filePath}`);
    const served = await serveLocalFile(filePath, res);
    if (served) return;
  }
  
  // If local file doesn't exist or failed to serve, try proxy
  console.log(`Local file not found, attempting proxy for: ${url}`);
  const proxied = await proxyRequest(url, res);
  
  if (!proxied) {
    // If both local and proxy fail, return 404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>404 Not Found</title></head>
        <body>
          <h1>404 Not Found</h1>
          <p>The requested resource <code>${url}</code> was not found locally or on the proxy server.</p>
        </body>
      </html>
    `);
  }
}

// Create and start server
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`🔗 Proxying missing files to: ${PROXY_HOST}`);
  console.log(`📄 Main page: http://localhost:${PORT}/aem.html`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
