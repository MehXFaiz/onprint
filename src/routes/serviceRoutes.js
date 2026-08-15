const express = require('express')
const {
  listServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/', listServices)
router.get('/:slug', getServiceBySlug)
router.post('/', authenticateToken, requireAdmin, createService)
router.put('/:id', authenticateToken, requireAdmin, updateService)
router.delete('/:id', authenticateToken, requireAdmin, deleteService)

module.exports = router
