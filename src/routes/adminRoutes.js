const express = require('express')
const { getAdminDashboardMetrics } = require('../controllers/adminController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/dashboard', authenticateToken, requireAdmin, getAdminDashboardMetrics)

module.exports = router
