const express = require('express')
const {
  createCorporateQuote,
  listCorporateQuotes,
  getCorporateQuoteById,
  updateCorporateQuoteStatus,
} = require('../controllers/corporateQuoteController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.post('/', createCorporateQuote)
router.get('/', authenticateToken, requireAdmin, listCorporateQuotes)
router.get('/:id', getCorporateQuoteById)
router.put('/:id/status', authenticateToken, requireAdmin, updateCorporateQuoteStatus)

module.exports = router
