# ?? Quick Command Cheat Sheet

## Install & Setup (First Time Only)

```bash
# 1. Install MySQL driver
npm install mysql2

# 2. Setup database (run in MySQL)
mysql -u root -p < setup_database.sql

# 3. Verify database exists
mysql -u root -p
USE dashboard_db;
SHOW TABLES;
SELECT * FROM users;
EXIT;
```

## Run Your Application

```bash
# Terminal 1 - Start Backend API
node api-server.js

# Terminal 2 - Start Frontend
node server-new.js

# Then open browser
http://localhost:8000
```

## Check If Things Work

```bash
# Terminal 3 - Check MySQL for new users
mysql -u root -p dashboard_db
SELECT * FROM users;

# See all users with timestamps
SELECT id, firstName, lastName, email, createdAt FROM users;
```

## Reset Everything

```bash
# Delete all data and recreate tables
mysql -u root -p < setup_database.sql
```

## Common Issues & Fixes

```bash
# MySQL not found
# Fix: Add to PATH or use full path
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" -u root -p

# Port 5000 already in use
# Fix: Change in api-server.js line 7
const PORT = 5001;

# Wrong MySQL password
# Fix: Change in api-server.js line 14
password: 'your_password',

# mysql2 not installed
npm install mysql2

# Database doesn't exist
mysql -u root -p < setup_database.sql
```

## Monitor Operations

```bash
# Watch console for logs while running
# You should see:
# ? REGISTRATION SUCCESS: email@example.com
# ? LOGIN SUCCESS: email@example.com

# Check MySQL for new data in real-time
mysql -u root -p
USE dashboard_db;
SELECT * FROM users;
```

## Restart Services

```bash
# Windows - Restart MySQL service
net stop MySQL80
net start MySQL80

# Or use Services.msc GUI
```

---

That's it! You're all set! ??

