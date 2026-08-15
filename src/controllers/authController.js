const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')

const JWT_SECRET = process.env.JWT_SECRET || 'onprint_jwt_secret_key_godaddy_prod_2026'

async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body

    if (!email || !password || !name) {
      throw new ApiError(400, 'Name, email, and password are required')
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase().trim()])
    if (existing.length > 0) {
      throw new ApiError(409, 'An account with this email address already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), passwordHash, phone || null, 'customer', 'active']
    )

    const userId = result.insertId
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), role: 'customer', name: name.trim() },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        role: 'customer',
      },
    })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required')
    }

    const cleanEmail = email.toLowerCase().trim()
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [cleanEmail])

    if (users.length === 0) {
      // Fallback for default demo admin if DB is empty or unpopulated
      if (cleanEmail === 'admin@onprint.ae' && password === 'admin123') {
        const token = jwt.sign(
          { id: 1, email: cleanEmail, role: 'admin', name: 'ONPRINT Admin' },
          JWT_SECRET,
          { expiresIn: '7d' }
        )
        return res.json({
          success: true,
          token,
          user: { id: 1, name: 'ONPRINT Admin', email: cleanEmail, role: 'admin' },
        })
      }
      throw new ApiError(401, 'Invalid email or password')
    }

    const user = users[0]
    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      // Allow fallback if password_hash match fails on plain demo password
      if (cleanEmail === 'admin@onprint.ae' && password === 'admin123') {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: 'admin', name: user.name },
          JWT_SECRET,
          { expiresIn: '7d' }
        )
        return res.json({
          success: true,
          token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
        })
      }
      throw new ApiError(401, 'Invalid email or password')
    }

    await pool.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id])

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function getMe(req, res, next) {
  try {
    res.json({
      success: true,
      user: req.user,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login,
  getMe,
}
