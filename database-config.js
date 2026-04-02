// Database Configuration
module.exports = {
    host: 'localhost',
    user: 'root',
    password: 'root',  // Change this to your MySQL password
    database: 'dashboard_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

/*
HOW TO USE:
1. Update 'password' field with your MySQL root password
2. If MySQL is on different host, change 'host'
3. If using different database name, change 'database'

EXAMPLE:
    password: '1234'  // Your MySQL password
    host: '192.168.1.100'  // If MySQL is on remote server
    database: 'my_dashboard'  // If using different database name
*/
