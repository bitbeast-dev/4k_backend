// import mysql2 from "mysql2";
// import chalk from "chalk";
// import dotenv from "dotenv";

// dotenv.config();



// const db = mysql2.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// });

// db.connect((err) => {
//     if (err) {
//         console.error(chalk.red("Database connection failed: " + err.message));
//         return;
//     }
//     console.log(chalk.yellow("Database successfully connected!"));
// });

// export default db;


import pkg from "pg";
import chalk from "chalk";
import dotenv from "dotenv";
var fullURL = "postgresql://honore:kTZqXYRr6MB0mMxDiaz4oPWsm9EAaAtT@dpg-d2pj5un5r7bs739per1g-a.oregon-postgres.render.com/full_database";

import { applyHardcodedSchema } from "./schema.js"; // ← use this

dotenv.config();
const { Client } = pkg;

const db = new Client({
  connectionString: fullURL,
  ssl: { rejectUnauthorized: false },
});

db.connect()
  .then(async () => {
    console.log(chalk.yellow("Database successfully connected!"));
    await applyHardcodedSchema(db); // ← creates all tables if missing
    console.log(chalk.green("Schema applied."));
  })
  .catch((err) => {
    console.error(chalk.red("Database connection failed: " + err.message));
  });

export default db;