const express = require('express')
const { getDashboardStats } = require('../controllers/adminController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/dashboard', authenticateToken, requireAdmin, getDashboardStats)

module.exports = router
