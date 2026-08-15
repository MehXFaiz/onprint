const express = require('express')
const { listCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/', listCategories)
router.post('/', authenticateToken, requireAdmin, createCategory)
router.put('/:id', authenticateToken, requireAdmin, updateCategory)
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory)

module.exports = router
