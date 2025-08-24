import mysql2 from "mysql2";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

// Create a pool instead of single connection
const db = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // max simultaneous connections
  queueLimit: 0,       // unlimited queued requests
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error(chalk.red("Database connection failed: " + err.message));
  } else {
    console.log(chalk.yellow("Database successfully connected!"));
    connection.release(); // release test connection back to pool
  }
});

export default db;
