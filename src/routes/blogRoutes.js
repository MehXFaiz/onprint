const express = require('express')
const router = express.Router()
const {
  listPublicBlogs,
  listAdminBlogs,
  getBlogStats,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  bulkDeleteBlogs,
  publishBlog,
  unpublishBlog,
  toggleFeaturedBlog,
  generateBlogContent,
  generateBlogImage,
} = require('../controllers/blogController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

// Public routes
router.get('/', listPublicBlogs)
router.get('/category/:categorySlug', (req, res, next) => {
  req.query.category = req.params.categorySlug
  listPublicBlogs(req, res, next)
})
router.get('/product/:productSlug', (req, res, next) => {
  req.query.product = req.params.productSlug
  listPublicBlogs(req, res, next)
})

// Admin specific management endpoints (must come before /:slug so 'stats' or 'admin' aren't treated as slug)
router.get('/admin', authenticateToken, requireAdmin, listAdminBlogs)
router.get('/stats', authenticateToken, requireAdmin, getBlogStats)
router.post('/bulk-delete', authenticateToken, requireAdmin, bulkDeleteBlogs)
router.delete('/bulk', authenticateToken, requireAdmin, bulkDeleteBlogs)
router.post('/generate-content', authenticateToken, requireAdmin, generateBlogContent)
router.post('/generate-image', authenticateToken, requireAdmin, generateBlogImage)

// Single resource endpoints
router.get('/:slug', getBlogBySlug)
router.post('/', authenticateToken, requireAdmin, createBlog)
router.put('/:id', authenticateToken, requireAdmin, updateBlog)
router.delete('/:id', authenticateToken, requireAdmin, deleteBlog)
router.patch('/:id/publish', authenticateToken, requireAdmin, publishBlog)
router.patch('/:id/unpublish', authenticateToken, requireAdmin, unpublishBlog)
router.patch('/:id/featured', authenticateToken, requireAdmin, toggleFeaturedBlog)

module.exports = router
