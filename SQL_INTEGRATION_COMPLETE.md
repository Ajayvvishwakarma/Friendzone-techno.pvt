# ?? SQL Database Integration - Complete Setup Guide

## ? What's Done

Your `api-server.js` has been **updated to save all registration data to MySQL database in REAL-TIME**! ?

### Changes Made:
? Replaced in-memory storage with MySQL queries
? Login now reads from SQL database
? Registration now saves to SQL database  
? Password reset now queries SQL database
? Added console logs to track all operations
? Real-time data persistence (data survives server restart)

---

## ?? Step-by-Step Setup

### Step 1: Install MySQL Driver
```bash
npm install mysql2
```

### Step 2: Verify MySQL is Running

**On Windows:**
```bash
# Check if MySQL service is running
sc query MySQL80
```

**Or use Command Prompt:**
```bash
mysql -u root -p
# Enter your password
```

If successful, you'll see:
```
mysql>
```

### Step 3: Create Database & Tables

Run the SQL setup file:
```bash
mysql -u root -p < setup_database.sql
```

Or manually in MySQL:
```bash
mysql -u root -p
password: root

USE dashboard_db;
SHOW TABLES;
```

You should see:
```
+----------------------+
| Tables_in_dashboard_db |
+----------------------+
| activity_log         |
| sessions             |
| users                |
+----------------------+
```

### Step 4: Update Database Password (If Different)

Edit `api-server.js` line 14:
```javascript
password: 'your_mysql_password',  // ? Change this if needed
```

### Step 5: Start the Backend Server

```bash
node api-server.js
```

You should see:
```
?? MySQL Connection Pool Created
   Host: localhost
   Database: dashboard_db

????????????????????????????????????????????????????????
? BACKEND API SERVER STARTED!
????????????????????????????????????????????????????????
?? URL: http://localhost:5000

?? Database: MySQL Connected ?
   Database: dashboard_db
   Host: localhost

Endpoints:
  POST /api/auth/login         - Login with SQL
  POST /api/auth/register      - Register & Save to SQL
  POST /api/auth/forgot-password - Password Reset
  GET  /api/health

? All data will be saved to SQL database in REAL-TIME!
```

---

## ?? Test It Out

### Test 1: Register New User

1. Go to `http://localhost:8000` (frontend)
2. Click "Sign Up"
3. Fill in the form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `testuser@example.com`
   - Password: `TestPass123!`
4. Click "Create Account"

### Check Server Console

You should see:
```
? REGISTRATION SUCCESS: testuser@example.com (Saved to SQL)
   ID: 3, Name: Test User
```

### Verify in MySQL

```bash
mysql -u root -p
USE dashboard_db;
SELECT * FROM users;
```

You should see:
```
+----+--------+----------+----------------------------+----------+---------------------+
| id | firstName | lastName | email                      | password | createdAt           |
+----+--------+----------+----------------------------+----------+---------------------+
| 1  | Ajay   | Vishwakrma | ajayvishwakrma2021@... | 7068009780 | 2024-01-15 10:30... |
| 2  | Soni   | Rai      | soni@gmail.com             | 12345678 | 2024-01-15 10:30... |
| 3  | Test   | User     | testuser@example.com       | TestPass123! | 2024-01-15 11:45... | ? NEW!
+----+--------+----------+----------------------------+----------+---------------------+
```

### Test 2: Login with New User

1. Go to `http://localhost:8000` (frontend)
2. Login with:
   - Email: `testuser@example.com`
   - Password: `TestPass123!`

### Check Server Console

You should see:
```
? LOGIN SUCCESS: testuser@example.com
```

---

## ?? Data Flow Now

```
????????????????????????????????????????????????????????????????
?                 REGISTRATION DATA FLOW                        ?
????????????????????????????????????????????????????????????????

1. FRONTEND (index.html)
   ??? User fills registration form
   ??? POST to http://localhost:5000/api/auth/register

2. BACKEND (api-server.js)
   ??? Receives data
   ??? Creates MySQL connection
   ??? Checks if email exists
   ??? Inserts into users table
   ??? ? Data saved to SQL!

3. DATABASE (MySQL)
   ??? dashboard_db.users table
   ??? Row with new user data
   ??? Persistent & secure

4. RESPONSE
   ??? Success message to frontend
   ??? User redirected to login
```

---

## ?? Important Files

| File | Purpose | Updated |
|------|---------|---------|
| `api-server.js` | Backend API | ? YES - Now uses MySQL |
| `database-config.js` | DB Config | ? Ready (optional, not used) |
| `setup_database.sql` | DB Schema | ? Must run this |
| `script.js` | Frontend | ? No changes needed |
| `index.html` | Frontend UI | ? No changes needed |

---

## ??? Troubleshooting

### Error: "Cannot find module 'mysql2'"
```bash
npm install mysql2
```

### Error: "ER_ACCESS_DENIED_FOR_USER"
The MySQL password is wrong. Edit `api-server.js` line 14:
```javascript
password: 'correct_password',
```

### Error: "ER_BAD_DB_ERROR: Unknown database 'dashboard_db'"
Run the setup file:
```bash
mysql -u root -p < setup_database.sql
```

### Error: "ECONNREFUSED"
MySQL server is not running. Start it:
```bash
# Windows
net start MySQL80

# Or use Services app
```

### Port 5000 Already in Use
Change port in `api-server.js`:
```javascript
const PORT = 5001;  // Use different port
```

---

## ? Key Features Now

? **Real-Time Data Storage** - Data saved immediately to SQL
? **Persistent Storage** - Data survives server restart
? **Duplicate Prevention** - Email uniqueness enforced in database
? **Connection Pool** - Efficient database connections
? **Error Handling** - Proper error messages
? **Console Logging** - Track every operation
? **CORS Support** - Frontend can communicate

---

## ?? Database Schema

### users table:
```sql
???????????????????????????????????????????
? users                                   ?
???????????????????????????????????????????
? id (INT, Primary Key, Auto Increment)   ?
? firstName (VARCHAR, 100)                ?
? lastName (VARCHAR, 100)                 ?
? email (VARCHAR, 100, UNIQUE)            ?
? password (VARCHAR, 255)                 ?
? createdAt (TIMESTAMP)                   ?
? updatedAt (TIMESTAMP)                   ?
???????????????????????????????????????????
```

---

## ?? Next Steps

1. ? Install mysql2: `npm install mysql2`
2. ? Setup database: `mysql -u root -p < setup_database.sql`
3. ? Start backend: `node api-server.js`
4. ? Start frontend: `node server-new.js`
5. ? Test registration at `http://localhost:8000`
6. ? Verify in MySQL: `SELECT * FROM dashboard_db.users;`

---

## ?? Summary

### Before (? In-Memory):
- Register user
- Data stored in RAM
- Server restarts
- ?? Data lost!

### After (? SQL Database):
- Register user
- Data saved to MySQL immediately
- Server restarts
- ? Data still there!

Your registration data is now **real-time persistent** in SQL! ??

---

## Questions?

If you get any errors:
1. Check MySQL is running
2. Verify password in `api-server.js`
3. Check console logs for specific errors
4. Make sure `setup_database.sql` was executed

Good luck! ??
