require('dotenv').config()
const bcrypt = require('bcryptjs')
const { pool, initDatabase } = require('../config/database')

async function seedAdmin() {
  console.log('--- ONPRINT Admin User Seeder ---')
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@onprint.ae').toLowerCase().trim()
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const adminName = process.env.ADMIN_NAME || 'ONPRINT Admin'
  const adminPhone = process.env.ADMIN_PHONE || '+971 4 800 PRINT'

  try {
    // Ensure all tables exist first
    await initDatabase()

    const connection = await pool.getConnection()
    const [rows] = await connection.query('SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1', [adminEmail])
    const passwordHash = await bcrypt.hash(adminPassword, 10)

    if (rows.length === 0) {
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password_hash, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [adminName, adminEmail, passwordHash, adminPhone, 'admin', 'active']
      )
      console.log(`[Success] Admin user created with ID ${result.insertId}`)
      console.log(`  Email:    ${adminEmail}`)
      console.log(`  Password: ${adminPassword}`)
      console.log(`  Role:     admin`)
    } else {
      await connection.query(
        'UPDATE users SET name = ?, password_hash = ?, phone = ?, role = "admin", status = "active" WHERE id = ?',
        [adminName, passwordHash, adminPhone, rows[0].id]
      )
      console.log(`[Success] Existing user (ID: ${rows[0].id}) updated to Admin with current credentials:`)
      console.log(`  Email:    ${adminEmail}`)
      console.log(`  Password: ${adminPassword}`)
      console.log(`  Role:     admin`)
    }

    connection.release()
    process.exit(0)
  } catch (err) {
    console.error('[Error] Failed to seed admin user:', err.message)
    process.exit(1)
  }
}

seedAdmin()
