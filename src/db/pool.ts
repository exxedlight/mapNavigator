import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'map_navigator',
  waitForConnections: true,
  connectionLimit: 30,
});
