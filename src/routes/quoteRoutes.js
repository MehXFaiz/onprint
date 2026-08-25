const express = require('express')
const {
  createQuote,
  listQuotes,
  getQuoteById,
  updateQuote,
  updateQuoteStatus,
  deleteQuote,
  bulkDeleteQuotes,
} = require('../controllers/quoteController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

router.post('/', createQuote)
router.get('/', listQuotes)
router.post('/bulk-delete', bulkDeleteQuotes)
router.delete('/bulk', bulkDeleteQuotes)
router.get('/:id', getQuoteById)
router.put('/:id', updateQuote)
router.put('/:id/status', updateQuoteStatus)
router.delete('/:id', deleteQuote)

module.exports = router
