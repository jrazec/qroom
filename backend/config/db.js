const mysql = require('mysql2');
const dotenv = require('dotenv');

// For .env variable
dotenv.config()

// MYSQL CONNECTION

const con = mysql.createConnection({
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

console.log("DB Connected!")


module.exports = con;