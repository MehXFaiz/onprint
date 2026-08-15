const express = require('express')
const { createQuote, listQuotes, getQuoteById } = require('../controllers/quoteController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

router.post('/', createQuote)
router.get('/', listQuotes)
router.get('/:id', getQuoteById)

module.exports = router
