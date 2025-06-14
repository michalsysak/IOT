const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

const initDB = async () => {
  const createDBQuery = `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`;
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS \`${process.env.DB_NAME}\`.users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );`;

  const createTodosTable = `
    CREATE TABLE IF NOT EXISTS \`${process.env.DB_NAME}\`.todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

  const conn = await pool.getConnection();
  await conn.query(createDBQuery);
  await conn.query(createUsersTable);
  await conn.query(createTodosTable);
  conn.release();
  console.log("Baza danych zapierdala")
};

module.exports = { pool, initDB };
