const express = require('express')
const router = express.Router()
const { getRobotsTxt, getSitemapXml, getLlmsTxt, getAdsTxt, runSeoAudit } = require('../controllers/seoController')
const seoManagerController = require('../controllers/seoManagerController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

// ==========================================
// 1. PUBLIC SEO ENDPOINTS
// ==========================================
router.get('/robots.txt', getRobotsTxt)
router.get('/sitemap.xml', getSitemapXml)
router.get('/llms.txt', getLlmsTxt)
router.get('/ads.txt', getAdsTxt)
router.get('/audit', runSeoAudit) // Public quick audit endpoint

// ==========================================
// 2. DAILY AUTOMATED RUNNER (Cron / Webhook / Admin)
// ==========================================
// Middleware allows either X-Cron-Secret header OR Admin Bearer token
function allowCronOrAdmin(req, res, next) {
  const cronSecretHeader = req.headers['x-cron-secret'] || req.query.cron_secret
  const envSecret = process.env.CRON_SECRET || 'onprint_daily_seo_cron_secret_2026'

  if (cronSecretHeader && cronSecretHeader === envSecret) {
    return next()
  }

  // Otherwise delegate to standard admin auth
  return authenticateToken(req, res, (err) => {
    if (err) return next(err)
    return requireAdmin(req, res, next)
  })
}

router.post('/run-daily', allowCronOrAdmin, (req, res) => seoManagerController.runDaily(req, res))

// ==========================================
// 3. AUTHENTICATED ADMIN SEO MANAGEMENT ROUTES
// ==========================================
router.use(authenticateToken)
router.use(requireAdmin)

// Dashboard Overview
router.get('/dashboard', (req, res) => seoManagerController.getDashboardSummary(req, res))

// Technical & On-Page Audits
router.get('/audit-details', (req, res) => seoManagerController.getAudit(req, res))
router.post('/audit-trigger', (req, res) => seoManagerController.triggerAudit(req, res))

// AI Recommendations
router.get('/recommendations', (req, res) => seoManagerController.getRecommendations(req, res))
router.post('/recommendations/analyze', (req, res) => seoManagerController.triggerAiAnalysis(req, res))
router.post('/recommendations/:id/approve', (req, res) => seoManagerController.approveRecommendation(req, res))
router.post('/recommendations/:id/reject', (req, res) => seoManagerController.rejectRecommendation(req, res))
router.post('/recommendations/:id/apply', (req, res) => seoManagerController.applyRecommendation(req, res))
router.post('/recommendations/bulk-apply', (req, res) => seoManagerController.bulkApply(req, res))

// Change History & Rollback
router.get('/history', (req, res) => seoManagerController.getChangeHistory(req, res))
router.post('/history/:id/rollback', (req, res) => seoManagerController.rollbackChange(req, res))

// Daily Reports
router.get('/reports', (req, res) => seoManagerController.getDailyReports(req, res))
router.get('/reports/:date', (req, res) => seoManagerController.getDailyReportByDate(req, res))

// Keywords & Queries
router.get('/keywords', (req, res) => seoManagerController.getKeywords(req, res))

// Pages & Catalog Status
router.get('/pages', (req, res) => seoManagerController.getPages(req, res))

// Google Search Console Integration
router.get('/search-console/status', (req, res) => seoManagerController.getSearchConsoleStatus(req, res))
router.post('/search-console/connect', (req, res) => seoManagerController.connectSearchConsole(req, res))
router.post('/search-console/sync', (req, res) => seoManagerController.syncSearchConsole(req, res))

// Settings
router.get('/settings', (req, res) => seoManagerController.getSettings(req, res))
router.put('/settings', (req, res) => seoManagerController.updateSettings(req, res))

// Activity Logs
router.get('/logs', (req, res) => seoManagerController.getLogs(req, res))

module.exports = router
