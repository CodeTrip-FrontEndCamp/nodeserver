// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "47.116.215.205",
  user: "root",
  password: "123456",
  database: "tourism",
  port: 3000,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
