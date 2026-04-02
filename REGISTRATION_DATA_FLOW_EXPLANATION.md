# ?? Registration Data Flow - Where Is It Going?

## Current Status: ?? IN-MEMORY STORAGE (NOT DATABASE)

---

## The Problem

Your registration data is **NOT going to SQL database** - it's being stored in **in-memory** (RAM) only!

### Current Flow:
```
User Registration ? API ? In-Memory Array ? Lost on Server Restart ?
```

### What happens:
1. User fills registration form
2. Data sent to `http://localhost:5000/api/auth/register`
3. Data stored in `users[]` array (in RAM)
4. When server restarts ? **ALL DATA IS LOST** ?

---

## Where Is Registration Data Going NOW?

### Location: `api-server.js` (lines 9-21)

```javascript
let users = [
    {
        id: 1,
        firstName: 'Ajay',
        lastName: 'Vishwakrma',
        email: 'ajayvishwakrma2021@gmail.com',
        password: '7068009780'
    },
    {
        id: 2,
        firstName: 'Soni',
        lastName: 'Rai',
        email: 'soni@gmail.com',
        password: '12345678'
    }
];
```

**This is just a JavaScript array in memory - NOT a real database!**

---

## How Registration Currently Works

### Registration Endpoint (Lines 65-94):
```javascript
if (pathname === '/api/auth/register' && req.method === 'POST') {
    // 1. Parse form data from frontend
    const data = JSON.parse(body);

    // 2. Check if email already exists
    const existingUser = users.find(u => u.email === data.email);

    // 3. If not exists, create new user
    const newUser = {
        id: users.length + 1,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
    };

    // 4. Add to in-memory array
    users.push(newUser);

    // 5. Send response back to frontend
    res.end(JSON.stringify({...}));
}
```

---

## Data Flow Diagram

```
??????????????????????????????????????????????????????????????
?           CURRENT REGISTRATION DATA FLOW                    ?
??????????????????????????????????????????????????????????????

FRONTEND (index.html)
    ?
registerForm submit
    ?
script.js - POST to localhost:5000/api/auth/register
    ?
JSON: { firstName, lastName, email, password }
    ?
api-server.js - /api/auth/register endpoint
    ?
Parsed as JavaScript object
    ?
Added to `users[]` array in RAM
    ?
Response sent back to frontend
    ?
Frontend shows success notification
    ?
Data stored in browser localStorage ?

BUT... When server restarts ? DATA LOST! ?
```

---

## The Problem Explained

| Aspect | Current (In-Memory) | Needed (Database) |
|--------|-------------------|------------------|
| **Storage** | RAM (JavaScript array) | Hard disk (SQL database) |
| **Persistence** | Lost on restart | Permanent ? |
| **Scalability** | Only while server running | Can handle millions of users |
| **Data Integrity** | No backup | Backed up |
| **Server Restart** | All data deleted ? | Data survives ? |

---

## How To Fix: Setup SQL Database

### Step 1: Install MySQL/SQL Server
- Windows: Install MySQL or SQL Server
- Or use: `npm install mysql2` for Node.js

### Step 2: Create Database Schema

Run this SQL:
```sql
CREATE DATABASE dashboard_db;

USE dashboard_db;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (firstName, lastName, email, password) VALUES
('Ajay', 'Vishwakrma', 'ajayvishwakrma2021@gmail.com', '7068009780'),
('Soni', 'Rai', 'soni@gmail.com', '12345678');
```

### Step 3: Update api-server.js to Use Database

```javascript
const mysql = require('mysql2/promise');

// Connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'dashboard_db'
});

// Update register endpoint
if (pathname === '/api/auth/register' && req.method === 'POST') {
    const data = JSON.parse(body);

    try {
        const connection = await pool.getConnection();

        // Check if user exists
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [data.email]
        );

        if (rows.length > 0) {
            // User already exists
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User already exists' }));
        } else {
            // Insert new user
            const [result] = await connection.execute(
                'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
                [data.firstName, data.lastName, data.email, data.password]
            );

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                id: result.insertId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            }));
        }

        connection.release();
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database error' }));
    }
}
```

---

## Data Journey Summary

### Current Flow (In-Memory):
```
Frontend Input 
  ?
API Endpoint 
  ?
JavaScript Array (users[])
  ?
RAM Memory ??
  ?
LOST ON RESTART ?
```

### What Should Happen (With Database):
```
Frontend Input
  ?
API Endpoint
  ?
SQL INSERT Query
  ?
Database Server (MySQL/SQL Server)
  ?
Hard Disk ??
  ?
PERSISTS PERMANENTLY ?
```

---

## Next Steps

1. **Install MySQL**: Download and install MySQL
2. **Run the SQL schema**: Execute the CREATE TABLE queries
3. **Install npm package**: `npm install mysql2`
4. **Update api-server.js**: Connect to database
5. **Test registration**: New registrations will be saved in database
6. **Verify**: Check database using MySQL Workbench or command line

---

## Quick Command to Check Data

### In MySQL:
```sql
USE dashboard_db;
SELECT * FROM users;
```

### In Node.js (to test connection):
```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({...});

async function testConnection() {
    const [rows] = await pool.execute('SELECT * FROM users');
    console.log(rows);
}
```

---

## Security Note ??

Current code has security issues:
- Passwords stored as plain text (should be hashed)
- No encryption
- Vulnerable to SQL injection

**Fix needed:**
```javascript
const bcrypt = require('bcrypt');

// Hash password before storing
const hashedPassword = await bcrypt.hash(data.password, 10);

// Store hashedPassword instead of plain text
await connection.execute(
    'INSERT INTO users (..., password) VALUES (..., ?)',
    [..., hashedPassword]
);
```

---

## Summary

**Your registration data is currently:**
- ? Being received correctly
- ? Being added to in-memory array
- ? **NOT being saved to database**
- ? **LOST when server restarts**

**To fix:** Implement proper SQL database integration as described above.
