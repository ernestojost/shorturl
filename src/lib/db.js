import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "185.215.167.136",
  user: "admin_shorturl",
  password: "ROecBeS10v",
  database: "admin_shorturl",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
