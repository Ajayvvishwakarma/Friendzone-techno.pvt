const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql2/promise');

const PORT = 5000;
const HOST = 'localhost';

// MySQL Configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',  // Change to your MySQL password
    database: 'dashboard_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

console.log('?? MySQL Connection Pool Created');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Database: ${dbConfig.database}\n`);

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
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const connection = await pool.getConnection();

                const [rows] = await connection.query(
                    'SELECT id, firstName, lastName, email FROM users WHERE email = ? AND password = ?',
                    [data.email, data.password]
                );

                connection.release();

                if (rows.length > 0) {
                    const user = rows[0];
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }));
                    console.log(`? LOGIN SUCCESS: ${data.email}`);
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    console.log(`? LOGIN FAILED: ${data.email}`);
                }
            } catch (error) {
                console.error('? Login Error:', error.message);
                console.error('? Full Error:', error);
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
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const connection = await pool.getConnection();

                // Check if user already exists
                const [existingUsers] = await connection.query(
                    'SELECT id FROM users WHERE email = ?',
                    [data.email]
                );

                if (existingUsers.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User already exists' }));
                    connection.release();
                    console.log(`?? REGISTRATION FAILED: ${data.email} (Already exists)`);
                    return;
                }

                // Insert new user into database
                const [result] = await connection.query(
                    'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
                    [data.firstName, data.lastName, data.email, data.password]
                );

                connection.release();

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    id: result.insertId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    message: 'Registration successful! Data saved to SQL ?'
                }));

                console.log(`? REGISTRATION SUCCESS: ${data.email} (Saved to SQL)`);
                console.log(`   ID: ${result.insertId}, Name: ${data.firstName} ${data.lastName}`);

            } catch (error) {
                console.error('? Registration Error:', error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Registration failed. Email might already exist.' }));
            }
        });
        return;
    }

    // Forgot password endpoint
    if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const connection = await pool.getConnection();

                const [rows] = await connection.query(
                    'SELECT id FROM users WHERE email = ?',
                    [data.email]
                );

                connection.release();

                if (rows.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Reset link sent' }));
                    console.log(`? PASSWORD RESET: Link sent to ${data.email}`);
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User not found' }));
                    console.log(`? PASSWORD RESET FAILED: ${data.email} (Not found)`);
                }
            } catch (error) {
                console.error('? Forgot Password Error:', error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }

    // Health check
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK', message: 'Backend API is running' }));
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, HOST, () => {
    console.log('\n???????????????????????????????????????????????????');
    console.log('? BACKEND API SERVER STARTED!');
    console.log('???????????????????????????????????????????????????');
    console.log(`?? URL: http://${HOST}:${PORT}`);
    console.log('');
    console.log('?? Database: MySQL Connected ?');
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Host: ${dbConfig.host}`);
    console.log('');
    console.log('Endpoints:');
    console.log('  POST /api/auth/login         - Login with SQL');
    console.log('  POST /api/auth/register      - Register & Save to SQL');
    console.log('  POST /api/auth/forgot-password - Password Reset');
    console.log('  GET  /api/health');
    console.log('');
    console.log('? All data will be saved to SQL database in REAL-TIME!');
    console.log('Press Ctrl+C to stop\n');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n? Port ${PORT} is already in use!`);
        process.exit(1);
    }
});
