const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const url = require('url');
const fs = require('fs');

const PORT = 5000;
const HOST = 'localhost';
const DB_FILE = path.join(__dirname, 'users.db');

// Initialize SQLite Database
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('✗ Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('✓ SQLite Database Connected');
    console.log(`📁 Database file: ${DB_FILE}\n`);

    // Create tables
    db.serialize(() => {
        // Users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('✗ Error creating users table:', err.message);
            else console.log('✓ Users table ready');
        });

        // Sessions table
        db.run(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME,
                is_active BOOLEAN DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) console.error('✗ Error creating sessions table:', err.message);
            else console.log('✓ Sessions table ready');
        });

        // Insert sample data if users table is empty
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (!err && row.count === 0) {
                console.log('✓ Database ready - waiting for real-time user registration\n');
            } else if (row && row.count > 0) {
                console.log(`✓ Database has ${row.count} registered users\n`);
            }
        });
    });
});

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
                console.log('📥 LOGIN Request:', body);
                const data = JSON.parse(body);

                db.get(
                    'SELECT id, firstName, lastName, email FROM users WHERE email = ? AND password = ?',
                    [data.email, data.password],
                    (err, row) => {
                        if (err) {
                            console.error('✗ Login DB Error:', err.message);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: err.message }));
                            return;
                        }

                        if (row) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({
                                id: row.id,
                                firstName: row.firstName,
                                lastName: row.lastName,
                                email: row.email
                            }));
                            console.log(`✓ LOGIN SUCCESS: ${data.email}\n`);
                        } else {
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Invalid email or password' }));
                            console.log(`✗ LOGIN FAILED: Invalid credentials for ${data.email}\n`);
                        }
                    }
                );
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
                console.log('📥 REGISTER Request:', body);
                const data = JSON.parse(body);

                if (!data.firstName || !data.lastName || !data.email || !data.password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    console.log('✗ REGISTER FAILED: Missing fields\n');
                    return;
                }

                db.run(
                    'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
                    [data.firstName, data.lastName, data.email, data.password],
                    function(err) {
                        if (err) {
                            if (err.message.includes('UNIQUE')) {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Email already exists' }));
                                console.log(`✗ REGISTER FAILED: Email already exists - ${data.email}\n`);
                            } else {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: err.message }));
                                console.error('✗ Register DB Error:', err.message);
                            }
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({
                                id: this.lastID,
                                firstName: data.firstName,
                                lastName: data.lastName,
                                email: data.email
                            }));
                            console.log(`✓ REGISTER SUCCESS: ${data.email}\n`);
                        }
                    }
                );
            } catch (error) {
                console.error('✗ Register Parse Error:', error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }

    // Get all users (admin endpoint)
    if (pathname === '/api/users' && req.method === 'GET') {
        db.all('SELECT id, firstName, lastName, email, createdAt FROM users', (err, rows) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        });
        return;
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, HOST, () => {
    console.log('\n🚀 API Server Started');
    console.log(`📍 URL: http://${HOST}:${PORT}`);
    console.log(`💾 Database: SQLite (users.db)\n`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n✗ Port ${PORT} is already in use!`);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server...');
    db.close((err) => {
        if (err) console.error('✗ DB close error:', err.message);
        else console.log('✓ Database closed');
        process.exit(0);
    });
});
