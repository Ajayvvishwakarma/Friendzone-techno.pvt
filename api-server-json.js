const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5000;
const HOST = 'localhost';
const DB_FILE = path.join(__dirname, 'users-db.json');

// Initialize database file if it doesn't exist
function initDB() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            users: [
                { id: 1, firstName: 'Ajay', lastName: 'Vishwakrma', email: 'ajayvishwakrma2021@gmail.com', password: '7068009780' },
                { id: 2, firstName: 'Soni', lastName: 'Rai', email: 'soni@gmail.com', password: '12345678' }
            ],
            nextId: 3
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log('✓ Database initialized with sample users');
    }
}

function readDB() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error.message);
        return { users: [], nextId: 1 };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing database:', error.message);
    }
}

initDB();

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Login endpoint
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const db = readDB();
                
                const user = db.users.find(u => u.email === data.email && u.password === data.password);
                
                if (user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }));
                    console.log(`✓ LOGIN SUCCESS: ${data.email}`);
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    console.log(`✗ LOGIN FAILED: ${data.email}`);
                }
            } catch (error) {
                console.error('✗ Login Error:', error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // Register endpoint
    if (pathname === '/api/auth/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                console.log('📥 Register Request Body:', body);
                
                if (!body) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Empty request body' }));
                    console.log('✗ REGISTER FAILED: Empty body');
                    return;
                }

                const data = JSON.parse(body);
                console.log('📦 Parsed Data:', data);
                
                const db = readDB();
                
                // Check if user already exists
                const exists = db.users.some(u => u.email === data.email);
                
                if (exists) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User already exists' }));
                    console.log(`✗ REGISTER FAILED: ${data.email} already exists`);
                    return;
                }

                // Add new user
                const newUser = {
                    id: db.nextId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password
                };
                
                db.users.push(newUser);
                db.nextId++;
                writeDB(db);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    id: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email
                }));
                console.log(`✓ REGISTER SUCCESS: ${data.email}`);
            } catch (error) {
                console.error('✗ Register Error:', error.message);
                console.error('✗ Body was:', body);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // Get all users (admin endpoint)
    if (pathname === '/api/users' && req.method === 'GET') {
        try {
            const db = readDB();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db.users));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' })); 
});

server.listen(PORT, HOST, () => {
    console.log('\n🚀 API Server Started');
    console.log(`📍 URL: http://${HOST}:${PORT}`);
    console.log(`💾 Database: JSON File (users-db.json)\n`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n✗ Port ${PORT} is already in use!`);
        process.exit(1);
    }
});
