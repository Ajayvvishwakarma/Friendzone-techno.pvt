const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const HOST = 'localhost';

const server = http.createServer((req, res) => {
    let filePath = req.url;
    
    // Default to index.html for root
    if (filePath === '/' || filePath === '') {
        filePath = '/index.html';
    }
    
    // Remove query parameters
    filePath = filePath.split('?')[0];
    
    // Full file path
    const fullPath = path.join(__dirname, filePath);
    
    // Get file extension
    const ext = path.extname(fullPath).toLowerCase();
    
    // Set content type
    let contentType = 'application/octet-stream';
    if (ext === '.html') contentType = 'text/html; charset=UTF-8';
    else if (ext === '.css') contentType = 'text/css; charset=UTF-8';
    else if (ext === '.js') contentType = 'application/javascript; charset=UTF-8';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    
    // Read and serve file
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            // If file not found, serve index.html for SPA routing
            if (err.code === 'ENOENT' && req.url !== '/index.html') {
                fs.readFile(path.join(__dirname, 'index.html'), (indexErr, indexData) => {
                    if (indexErr) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('File not found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
                        res.end(indexData);
                    }
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log('\n???????????????????????????????????????????????????');
    console.log('? FRONTEND SERVER STARTED!');
    console.log('???????????????????????????????????????????????????');
    console.log(`?? URL: http://${HOST}:${PORT}`);
    console.log('');
    console.log('Files being served:');
    console.log('  ? index.html');
    console.log('  ? style.css');
    console.log('  ? script.js');
    console.log('');
    console.log('Press Ctrl+C to stop\n');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n? Port ${PORT} is already in use!`);
        console.error('Kill the process using port 8000 or use a different port');
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});
