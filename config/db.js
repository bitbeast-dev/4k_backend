import mysql2 from "mysql2";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error(chalk.red("Database connection failed: " + err.message));
        return;
    }
    console.log(chalk.yellow("Database successfully connected!"));
});

export default db;

