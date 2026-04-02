# ?? Quick Start: Database Setup Guide

## Problem Summary
Your registration data is currently stored **in RAM only** and gets lost when the server restarts. We need to move it to a **SQL Database**.

---

## ? Step 1: Install MySQL (if not already installed)

### For Windows:
1. Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Run the installer
3. Choose setup type: **Developer Default**
4. Install MySQL Server (port 3306)
5. Install MySQL Workbench (for GUI management)

### Check Installation:
```bash
mysql --version
```

---

## ? Step 2: Create Database

### Option A: Using Command Line
```bash
mysql -u root -p

# Enter password when prompted
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS dashboard_db;
USE dashboard_db;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (firstName, lastName, email, password) VALUES
('Ajay', 'Vishwakrma', 'ajayvishwakrma2021@gmail.com', '7068009780'),
('Soni', 'Rai', 'soni@gmail.com', '12345678');
```

### Option B: Using MySQL Workbench (GUI)
1. Open MySQL Workbench
2. Click your local connection
3. Copy-paste SQL from `setup_database.sql` file
4. Execute (Ctrl+Enter)

### Option C: Using Command Line with File
```bash
mysql -u root -p dashboard_db < setup_database.sql
```

---

## ? Step 3: Install Node.js MySQL Package

Open Terminal in your project folder and run:
```bash
npm install mysql2
```

Or if using yarn:
```bash
yarn add mysql2
```

---

## ? Step 4: Update Configuration

Create a file called `database-config.js`:

```javascript
// database-config.js
module.exports = {
    host: 'localhost',
    user: 'root',
    password: 'your_mysql_password',  // Enter your MySQL password here
    database: 'dashboard_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
```

---

## ? Step 5: Update api-server.js

Replace your current api-server.js with database version:

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql2/promise');
const config = require('./database-config.js');

const PORT = 5000;
const HOST = 'localhost';

// Create connection pool
const pool = mysql.createPool(config);

const server = http.createServer(async (req, res) => {
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

    try {
        // Login endpoint
        if (pathname === '/api/auth/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const connection = await pool.getConnection();

                    const [rows] = await connection.execute(
                        'SELECT id, firstName, lastName, email FROM users WHERE email = ? AND password = ?',
                        [data.email, data.password]
                    );

                    connection.release();

                    if (rows.length > 0) {
                        const user = rows[0];
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(user));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid request' }));
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

                    // Check if email already exists
                    const [existing] = await connection.execute(
                        'SELECT email FROM users WHERE email = ?',
                        [data.email]
                    );

                    if (existing.length > 0) {
                        connection.release();
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'User already exists' }));
                        return;
                    }

                    // Insert new user into database
                    const [result] = await connection.execute(
                        'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
                        [data.firstName, data.lastName, data.email, data.password]
                    );

                    connection.release();

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        id: result.insertId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email
                    }));
                } catch (error) {
                    console.error('Register error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database error' }));
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

                    const [rows] = await connection.execute(
                        'SELECT id FROM users WHERE email = ?',
                        [data.email]
                    );

                    connection.release();

                    if (rows.length > 0) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Reset link sent' }));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'User not found' }));
                    }
                } catch (error) {
                    console.error('Forgot password error:', error);
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
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
});

server.listen(PORT, HOST, () => {
    console.log('\n???????????????????????????????????????????????????');
    console.log('? BACKEND API SERVER WITH DATABASE!');
    console.log('???????????????????????????????????????????????????');
    console.log(`?? URL: http://${HOST}:${PORT}`);
    console.log(`?? Database: dashboard_db (MySQL)`);
    console.log('');
    console.log('Endpoints:');
    console.log('  POST /api/auth/login');
    console.log('  POST /api/auth/register');
    console.log('  POST /api/auth/forgot-password');
    console.log('  GET  /api/health');
    console.log('');
    console.log('Press Ctrl+C to stop\n');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n? Port ${PORT} is already in use!`);
        process.exit(1);
    }
});

module.exports = server;
```

---

## ? Step 6: Verify Database Connection

Run this test:
```bash
node api-server.js
```

You should see:
```
???????????????????????????????????????????????????
? BACKEND API SERVER WITH DATABASE!
???????????????????????????????????????????????????
?? URL: http://localhost:5000
?? Database: dashboard_db (MySQL)
```

---

## ? Step 7: Test Registration

1. Open browser: `http://localhost:8000`
2. Go to Register page
3. Fill form and submit
4. Check MySQL:

```sql
USE dashboard_db;
SELECT * FROM users;
```

You should see your new registered user! ?

---

## ?? Data Flow After Setup

```
Frontend Registration Form
    ?
POST to localhost:5000/api/auth/register
    ?
api-server.js receives data
    ?
INSERT query to MySQL
    ?
Data saved in users table
    ?
Response sent to frontend
    ?
Registration success message
    ?
Data PERSISTS in database ?
```

---

## ?? Monitor Database

### Using Command Line:
```bash
mysql -u root -p
USE dashboard_db;
SELECT * FROM users;
DESC users;  # See table structure
```

### Using MySQL Workbench:
1. Open MySQL Workbench
2. Connect to your server
3. Browse `dashboard_db` ? `tables` ? `users`
4. Right-click ? Select Rows

---

## ?? Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Check MySQL password in `database-config.js`
- Make sure MySQL service is running

### Error: "Unknown database 'dashboard_db'"
- Run the SQL setup commands to create database
- Or run: `mysql -u root -p < setup_database.sql`

### Error: "Cannot find module 'mysql2'"
- Run: `npm install mysql2`

### Data not being saved
- Check MySQL is running
- Check database connection in `database-config.js`
- Look for errors in server console

---

## ? Summary

| Before | After |
|--------|-------|
| In-Memory Array | SQL Database ? |
| Data Lost on Restart | Data Persistent ? |
| No Real Storage | Hard Disk Storage ? |
| Not Scalable | Production Ready ? |

Your registration data will now be safely stored in MySQL database! ??
