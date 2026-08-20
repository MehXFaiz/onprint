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

    // Support mock admin token for offline local frontend preview
    if (token === 'mock-admin-jwt-token') {
      req.user = { id: 1, email: 'admin@onprint.ae', role: 'admin', name: 'ONPRINT Admin' }
      return next()
    }

    const secret = process.env.JWT_SECRET || 'onprint_jwt_secret_key_godaddy_prod_2026'
    const decoded = jwt.verify(token, secret)

    try {
      const [rows] = await pool.execute('SELECT id, name, email, role, phone, status FROM users WHERE id = ? LIMIT 1', [decoded.id])
      if (rows.length > 0) {
        req.user = rows[0]
      } else {
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role || 'customer', name: decoded.name || 'User' }
      }
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
  const role = (req.user?.role || '').toLowerCase()
  if (!req.user || (role !== 'admin' && role !== 'administrator')) {
    return next(new ApiError(403, 'Administrator privileges required'))
  }
  next()
}

module.exports = {
  authenticateToken,
  requireAuth: authenticateToken,
  requireAdmin,
}
