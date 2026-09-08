const express = require('express')
const router = express.Router()
const { getRobotsTxt, getSitemapXml, getLlmsTxt, getAdsTxt, runSeoAudit } = require('../controllers/seoController')
const seoManagerController = require('../controllers/seoManagerController')
const pageSeoController = require('../controllers/pageSeoController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

// ==========================================
// 1. PUBLIC SEO ENDPOINTS
// ==========================================
router.get('/robots.txt', getRobotsTxt)
router.get('/sitemap.xml', getSitemapXml)
router.get('/llms.txt', getLlmsTxt)
router.get('/ads.txt', getAdsTxt)
router.get('/audit', runSeoAudit) // Public quick audit endpoint
router.get('/by-url', (req, res) => pageSeoController.getPageByUrl(req, res))
router.get('/landing-pages', (req, res) => seoManagerController.getProgrammaticPages(req, res))
router.get('/landing-pages/:slug', (req, res) => seoManagerController.getProgrammaticPage(req, res))

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

// Website SEO Score Overview
router.get('/score', (req, res) => pageSeoController.getScore(req, res))

// Dashboard Overview
router.get('/dashboard', (req, res) => seoManagerController.getDashboardSummary(req, res))

// Page-by-Page SEO Catalog & Management
router.get('/pages', (req, res) => pageSeoController.getPages(req, res))
router.get('/pages/:id', (req, res) => pageSeoController.getPageById(req, res))
router.post('/pages', (req, res) => pageSeoController.createPage(req, res))
router.put('/pages/:id', (req, res) => pageSeoController.updatePage(req, res))
router.post('/pages/:id/analyze', (req, res) => pageSeoController.analyzePage(req, res))
router.post('/pages/:id/optimize', (req, res) => pageSeoController.optimizePage(req, res))

// Full Website SEO Audit & Issues
router.post('/audit', (req, res) => pageSeoController.runAudit(req, res))
router.get('/issues', (req, res) => pageSeoController.getIssues(req, res))

// Keyword Cannibalization Detector
router.get('/cannibalization', (req, res) => pageSeoController.getCannibalization(req, res))

// Technical & On-Page Audits
router.get('/audit-details', (req, res) => seoManagerController.getAudit(req, res))
router.post('/audit-trigger', (req, res) => seoManagerController.triggerAudit(req, res))

// Content Opportunities Finder
router.get('/opportunities', (req, res) => seoManagerController.getOpportunities(req, res))

// Internal Linking Engine
router.get('/internal-links', (req, res) => seoManagerController.getInternalLinks(req, res))

// Competitor Gap Analysis
router.get('/competitor-analysis', (req, res) => seoManagerController.getCompetitorAnalysis(req, res))

// Image SEO Audit & Alt Tag Updater
router.get('/image-audit', (req, res) => seoManagerController.getImageAudit(req, res))
router.post('/image-update', (req, res) => seoManagerController.updateImageAlt(req, res))

// SEO Safety & Review Required Queue
router.get('/safety-queue', (req, res) => seoManagerController.getSafetyQueue(req, res))
router.post('/validate-change', (req, res) => seoManagerController.validateChange(req, res))

// AI Recommendations
router.get('/recommendations', (req, res) => seoManagerController.getRecommendations(req, res))
router.post('/recommendations/analyze', (req, res) => seoManagerController.triggerAiAnalysis(req, res))
router.post('/recommendations/:id/approve', (req, res) => seoManagerController.approveRecommendation(req, res))
router.post('/recommendations/:id/reject', (req, res) => seoManagerController.rejectRecommendation(req, res))
router.post('/recommendations/:id/apply', (req, res) => seoManagerController.applyRecommendation(req, res))
router.post('/recommendations/bulk-apply', (req, res) => seoManagerController.bulkApply(req, res))

// Change History & Rollback
router.get('/history', (req, res) => pageSeoController.getHistory(req, res))
router.post('/history/:id/rollback', (req, res) => pageSeoController.rollbackChange(req, res))

// Daily Reports
router.get('/reports', (req, res) => seoManagerController.getDailyReports(req, res))
router.get('/reports/:date', (req, res) => seoManagerController.getDailyReportByDate(req, res))

// Keywords & Queries
router.get('/keywords', (req, res) => seoManagerController.getKeywords(req, res))

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
