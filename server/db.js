// server/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "designSchool",
  waitForConnections: true,
  connectionLimit: 10, // ← Max 10 connexions en même temps
  queueLimit: 0, // ← Pas de limite de queue
});

export default db;
