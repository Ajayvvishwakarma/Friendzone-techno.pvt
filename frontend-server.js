const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const HOST = 'localhost';

const server = http.createServer((req, res) => {
    // Default to index.html
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    // Get file extension
    const ext = path.extname(filePath);
    
    // Determine content type
    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.json') contentType = 'application/json';
    if (ext === '.svg') contentType = 'image/svg+xml';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    // Security check - prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname))) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log('\n🎨 Frontend Server Started');
    console.log(`📍 URL: http://${HOST}:${PORT}`);
    console.log(`📁 Serving from: ${__dirname}\n`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n✗ Port ${PORT} is already in use!`);
        process.exit(1);
    }
});
