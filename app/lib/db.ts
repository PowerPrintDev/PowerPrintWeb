import mysql from "mysql2/promise";

const pool =
  process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME
    ? mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
    : null;

export default pool;
