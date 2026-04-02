# ??? SQL DATABASE SETUP GUIDE - Step by Step

## ?? ???? Database Configuration

### Database Name
```
dashboard_db
```

### Tables
```
1. users - User registration data
2. activity_log - User activities
3. sessions - User sessions
```

### Sample Data
```
Ajay Vishwakrma - ajayvishwakrma2021@gmail.com - 7068009780
Soni Rai - soni@gmail.com - 12345678
```

---

## ?? Database Setup - 4 Easy Steps

### Step 1: Check if MySQL is Installed
```bash
# Open Command Prompt (Windows)
# Or PowerShell
mysql --version
```

**Expected Output:**
```
mysql Ver 8.0.xx for win64
```

If not found, download from: https://dev.mysql.com/downloads/mysql/

---

### Step 2: Start MySQL Service (Windows)

**Option A: From Services**
1. Press `Win + R`
2. Type: `services.msc`
3. Find: "MySQL80" (or your version)
4. Right-click ? Start

**Option B: Command Prompt**
```bash
net start MySQL80
```

**Check Status:**
```bash
net start MySQL80
# Should show: "The MySQL80 service is starting."
```

---

### Step 3: Create Database & Tables

**Copy-paste this command:**
```bash
mysql -u root -p < setup_database.sql
```

**When prompted:**
```
Enter password: root
(or your MySQL password)
```

**Expected Output:**
```
Query OK, statements processed successfully
```

---

### Step 4: Verify Database Created

**Run this:**
```bash
mysql -u root -p
```

**Then type these commands:**
```sql
SHOW DATABASES;
USE dashboard_db;
SHOW TABLES;
SELECT * FROM users;
EXIT;
```

**Expected Output:**
```
+----+----------+----------+-------------------------------+
| id | firstName | lastName | email                         |
+----+----------+----------+-------------------------------+
| 1  | Ajay     | Vishwakrma | ajayvishwakrma2021@gmail.com |
| 2  | Soni     | Rai      | soni@gmail.com                |
+----+----------+----------+-------------------------------+
```

---

## ?? Step-by-Step Commands

### Command 1: Connect to MySQL
```bash
mysql -u root -p
```
Password: `root`

### Command 2: View All Databases
```sql
SHOW DATABASES;
```

### Command 3: Select Database
```sql
USE dashboard_db;
```

### Command 4: View All Tables
```sql
SHOW TABLES;
```

### Command 5: View Users
```sql
SELECT * FROM users;
```

### Command 6: View Table Structure
```sql
DESCRIBE users;
```

### Command 7: Count Users
```sql
SELECT COUNT(*) as total_users FROM users;
```

### Command 8: Find Specific User
```sql
SELECT * FROM users WHERE email = 'soni@gmail.com';
```

### Command 9: Add New User (Manual)
```sql
INSERT INTO users (firstName, lastName, email, password) 
VALUES ('Rani', 'Kumar', 'rani@gmail.com', '12345678');
```

### Command 10: Exit MySQL
```sql
EXIT;
```

---

## ?? Complete Setup Script (Copy & Paste All)

**Step 1: Open Command Prompt**
- Press `Win + R`
- Type: `cmd`
- Press Enter

**Step 2: Navigate to your project folder**
```bash
cd C:\Users\DELL\Desktop\Ajaydev
```

**Step 3: Start MySQL Service**
```bash
net start MySQL80
```

**Step 4: Create Database**
```bash
mysql -u root -p < setup_database.sql
```
Password: `root`

**Step 5: Verify**
```bash
mysql -u root -p
```

Then in MySQL prompt:
```sql
USE dashboard_db;
SELECT * FROM users;
EXIT;
```

---

## ? Database Schema

### `users` Table
```
????????????????????????????????????????????????????????????????????
? id ?firstName ?lastName  ? email           ?password  ?createdAt ?
????????????????????????????????????????????????????????????????????
? 1  ?Ajay      ?Vishwakrma?ajay@gmail.com  ?7068009780?2024-01.. ?
? 2  ?Soni      ?Rai       ?soni@gmail.com  ?12345678  ?2024-01.. ?
????????????????????????????????????????????????????????????????????
```

### Columns
- **id** - Auto-increment, Primary Key
- **firstName** - User's first name (VARCHAR 100)
- **lastName** - User's last name (VARCHAR 100)
- **email** - Unique email (VARCHAR 100)
- **password** - User password (VARCHAR 255)
- **createdAt** - Registration timestamp
- **updatedAt** - Last update timestamp

### Indexes
- Email indexed for fast lookup
- User ID indexed for activity_log joins

---

## ?? Troubleshooting

### Error 1: "mysql is not recognized"
**Solution:** MySQL is not in system PATH
```bash
# Find MySQL installation
dir "C:\Program Files\MySQL"

# Or use full path
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" -u root -p
```

### Error 2: "Access denied for user 'root'"
**Solution:** Wrong password
```bash
mysql -u root -p
# Try password: root
# Or no password (just press Enter)
```

### Error 3: "Can't connect to MySQL server"
**Solution:** MySQL service not running
```bash
net start MySQL80
```

### Error 4: "ERROR 1045 (28000): Access denied"
**Solution:** Check credentials
```bash
# Try without password
mysql -u root

# Or with specific host
mysql -h localhost -u root -p
```

---

## ?? Common Database Operations

### Add User Manually
```sql
INSERT INTO users (firstName, lastName, email, password) 
VALUES ('John', 'Doe', 'john@gmail.com', 'pass123');
```

### Update User
```sql
UPDATE users SET firstName = 'Johnny' WHERE email = 'john@gmail.com';
```

### Delete User
```sql
DELETE FROM users WHERE email = 'john@gmail.com';
```

### Search User
```sql
SELECT * FROM users WHERE email LIKE '%gmail%';
```

### Get All User Emails
```sql
SELECT email FROM users;
```

### Get User Count
```sql
SELECT COUNT(*) FROM users;
```

### View Latest Users
```sql
SELECT * FROM users ORDER BY createdAt DESC LIMIT 5;
```

### Check Activity Log
```sql
SELECT * FROM activity_log;
```

### Check Sessions
```sql
SELECT * FROM sessions;
```

---

## ?? Database Statistics

### Get Database Size
```sql
SELECT table_name, round(((data_length + index_length) / 1024 / 1024), 2) as size_mb
FROM information_schema.tables
WHERE table_schema = 'dashboard_db';
```

### Get Table Info
```sql
SHOW TABLE STATUS FROM dashboard_db;
```

### Get Column Info
```sql
SHOW COLUMNS FROM users;
```

---

## ?? Backup Your Database

### Create Backup
```bash
mysqldump -u root -p dashboard_db > backup.sql
```

### Restore Backup
```bash
mysql -u root -p database_db < backup.sql
```

---

## ? Verification Checklist

- [ ] MySQL installed
- [ ] MySQL service running
- [ ] Database created: `dashboard_db`
- [ ] Tables created: users, activity_log, sessions
- [ ] Sample data inserted
- [ ] Can connect via: `mysql -u root -p`
- [ ] Can query: `SELECT * FROM users;`
- [ ] Backend server can connect
- [ ] Frontend can register users
- [ ] Data appears in database

---

## ?? You're Ready!

Once verified:
1. ? Start backend: `node api-server.js`
2. ? Start frontend: `node server-new.js`
3. ? Register new user
4. ? Check database: `SELECT * FROM users;`
5. ? See new user in database!

---

## ?? Quick Reference

| Task | Command |
|------|---------|
| Start MySQL | `net start MySQL80` |
| Connect | `mysql -u root -p` |
| List DBs | `SHOW DATABASES;` |
| Select DB | `USE dashboard_db;` |
| View tables | `SHOW TABLES;` |
| View data | `SELECT * FROM users;` |
| Count rows | `SELECT COUNT(*) FROM users;` |
| Exit | `EXIT;` |

---

**Apka database setup complete hai! ??**

Ab app chalao aur dekho sab kaam kar raha hai!

