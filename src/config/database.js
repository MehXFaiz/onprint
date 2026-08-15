const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'onprintdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function testConnection() {
  try {
    const connection = await pool.getConnection()
    await connection.query('SELECT 1')
    connection.release()
    console.log('ONPRINT MySQL connection successful')
    return true
  } catch (err) {
    console.error('ONPRINT MySQL connection failed:', err.message)
    return false
  }
}

module.exports = {
  pool,
  testConnection,
}
