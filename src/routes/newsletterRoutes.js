const express = require('express')
const { subscribe, listSubscribers } = require('../controllers/newsletterController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.post('/subscribe', subscribe)
router.post('/', subscribe)
router.get('/', authenticateToken, requireAdmin, listSubscribers)

module.exports = router
