require("dotenv").config();
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("MySQL pool connected successfully!!!");
    connection.release();
  } catch (err) {
    console.error("MySQL pool connection failed:", err.message);
  }
})();

module.exports = db;

