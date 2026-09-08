const express = require('express')
const { getAdminDashboardMetrics } = require('../controllers/adminController')
const {
  listAdminBlogs,
  getBlogStats,
  getBlogSeoMetrics,
  createBlog,
  updateBlog,
  deleteBlog,
  bulkDeleteBlogs,
  publishBlog,
  unpublishBlog,
  toggleFeaturedBlog,
  generateBlogContent,
  generateBlogImage,
  generateBlogSeoHandler,
  analyzeBlogSeoHandler,
} = require('../controllers/blogController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/dashboard', authenticateToken, requireAdmin, getAdminDashboardMetrics)

// Admin Blogs Endpoints: /api/admin/blogs/...
const adminBlogRouter = express.Router()
adminBlogRouter.use(authenticateToken, requireAdmin)

adminBlogRouter.get('/', listAdminBlogs)
adminBlogRouter.get('/stats', getBlogStats)
adminBlogRouter.get('/seo-metrics', getBlogSeoMetrics)
adminBlogRouter.post('/', createBlog)
adminBlogRouter.put('/:id', updateBlog)
adminBlogRouter.delete('/:id', deleteBlog)
adminBlogRouter.post('/bulk-delete', bulkDeleteBlogs)
adminBlogRouter.delete('/bulk', bulkDeleteBlogs)
adminBlogRouter.post('/generate-content', generateBlogContent)
adminBlogRouter.post('/generate-image', generateBlogImage)
adminBlogRouter.post('/generate-seo', generateBlogSeoHandler)
adminBlogRouter.post('/:id/generate-seo', generateBlogSeoHandler)
adminBlogRouter.post('/analyze-seo', analyzeBlogSeoHandler)
adminBlogRouter.post('/:id/analyze-seo', analyzeBlogSeoHandler)
adminBlogRouter.patch('/:id/publish', publishBlog)
adminBlogRouter.post('/:id/publish', publishBlog)
adminBlogRouter.patch('/:id/unpublish', unpublishBlog)
adminBlogRouter.post('/:id/unpublish', unpublishBlog)
adminBlogRouter.patch('/:id/featured', toggleFeaturedBlog)

router.use('/blogs', adminBlogRouter)

module.exports = router
