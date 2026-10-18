const express = require('express')
const router = express.Router()
const { calculatePrice, getPricingTiers } = require('../controllers/pricingController')

// Public Price Calculation Endpoints
router.post('/calculate', calculatePrice)
router.get('/tiers', getPricingTiers)

module.exports = router
