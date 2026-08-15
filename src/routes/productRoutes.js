const express = require('express')
const {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/', listProducts)
router.get('/:slug', getProductBySlug)
router.post('/', authenticateToken, requireAdmin, createProduct)
router.put('/:id', authenticateToken, requireAdmin, updateProduct)
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct)

module.exports = router
