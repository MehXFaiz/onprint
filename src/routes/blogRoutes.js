const express = require('express')
const router = express.Router()
const {
  listBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

// Public routes
router.get('/', listBlogPosts)
router.get('/:slug', getBlogPostBySlug)

// Admin management routes
router.post('/', authenticateToken, requireAdmin, createBlogPost)
router.put('/:id', authenticateToken, requireAdmin, updateBlogPost)
router.delete('/:id', authenticateToken, requireAdmin, deleteBlogPost)

module.exports = router
