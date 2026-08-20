const express = require('express')
const router = express.Router()
const {
  listBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController')
const { requireAuth, requireAdmin } = require('../middleware/auth')

// Public routes
router.get('/', listBlogPosts)
router.get('/:slug', getBlogPostBySlug)

// Admin management routes
router.post('/', requireAuth, requireAdmin, createBlogPost)
router.put('/:id', requireAuth, requireAdmin, updateBlogPost)
router.delete('/:id', requireAuth, requireAdmin, deleteBlogPost)

module.exports = router
