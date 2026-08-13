const express = require('express')
const { listServices, getServiceBySlug } = require('../controllers/serviceController')

const router = express.Router()

router.get('/', listServices)
router.get('/:slug', getServiceBySlug)

module.exports = router
