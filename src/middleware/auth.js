const jwt = require('jsonwebtoken')
const { pool } = require('../config/database')
const ApiError = require('../utils/ApiError')

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      throw new ApiError(401, 'Authentication token required')
    }

    const secret = process.env.JWT_SECRET || 'onprint_jwt_secret_key_godaddy_prod_2026'
    const decoded = jwt.verify(token, secret)

    try {
      const [rows] = await pool.execute('SELECT id, name, email, role, phone, status FROM users WHERE id = ? LIMIT 1', [decoded.id])
      if (rows.length === 0) {
        throw new ApiError(401, 'User associated with token no longer exists')
      }
      req.user = rows[0]
    } catch {
      // Fallback if DB is unavailable but token valid
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role || 'customer', name: decoded.name || 'User' }
    }

    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token'))
    }
    next(err)
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Administrator privileges required'))
  }
  next()
}

module.exports = {
  authenticateToken,
  requireAdmin,
}
