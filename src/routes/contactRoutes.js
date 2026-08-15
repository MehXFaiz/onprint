const express = require('express')
const { submitContact, listContactMessages } = require('../controllers/contactController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.post('/', submitContact)
router.get('/', authenticateToken, requireAdmin, listContactMessages)

module.exports = router
