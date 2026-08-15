const express = require('express')
const {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} = require('../controllers/categoryController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/', listCategories)
router.get('/:id', getCategoryById)
router.post('/', authenticateToken, requireAdmin, createCategory)
router.put('/:id', authenticateToken, requireAdmin, updateCategory)
router.patch('/:id/status', authenticateToken, requireAdmin, updateCategoryStatus)
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory)

module.exports = router
