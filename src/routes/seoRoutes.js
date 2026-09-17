const express = require('express')
const router = express.Router()
const { getRobotsTxt, getSitemapXml, getLlmsTxt, getAdsTxt, runSeoAudit } = require('../controllers/seoController')
const seoManagerController = require('../controllers/seoManagerController')
const pageSeoController = require('../controllers/pageSeoController')
const seoConversionController = require('../controllers/seoConversionController')
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
router.get('/faqs/by-url', (req, res) => seoManagerController.getGeoFaqsByUrl(req, res))
router.get('/landing-pages', (req, res) => seoManagerController.getProgrammaticPages(req, res))
router.get('/landing-pages/:slug', (req, res) => seoManagerController.getProgrammaticPage(req, res))
router.post('/conversions/track', (req, res) => seoConversionController.trackConversion(req, res))

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
router.get('/keyword-targets', (req, res) => seoManagerController.getKeywordTargets(req, res))
router.post('/keyword-targets', (req, res) => seoManagerController.createKeywordTarget(req, res))
router.put('/keyword-targets/:id', (req, res) => seoManagerController.updateKeywordTarget(req, res))
router.delete('/keyword-targets/:id', (req, res) => seoManagerController.deleteKeywordTarget(req, res))

// Backlink records and manual outreach CRM. These endpoints never send email or create links.
router.get('/backlinks', (req, res) => seoManagerController.getBacklinks(req, res))
router.post('/backlinks', (req, res) => seoManagerController.createBacklink(req, res))
router.put('/backlinks/:id', (req, res) => seoManagerController.updateBacklink(req, res))
router.delete('/backlinks/:id', (req, res) => seoManagerController.deleteBacklink(req, res))
router.get('/outreach', (req, res) => seoManagerController.getOutreach(req, res))
router.post('/outreach', (req, res) => seoManagerController.createOutreach(req, res))
router.put('/outreach/:id', (req, res) => seoManagerController.updateOutreach(req, res))
router.delete('/outreach/:id', (req, res) => seoManagerController.deleteOutreach(req, res))
router.get('/competitors', (req, res) => seoManagerController.getCompetitorRecords(req, res))
router.post('/competitors', (req, res) => seoManagerController.createCompetitorRecord(req, res))

// 150 Legitimate UAE Backlink Opportunities & Strategy
router.get('/backlink-opportunities', (req, res) => seoManagerController.getBacklinkOpportunities(req, res))
router.post('/backlink-opportunities', (req, res) => seoManagerController.createBacklinkOpportunity(req, res))
router.put('/backlink-opportunities/:id', (req, res) => seoManagerController.updateBacklinkOpportunity(req, res))
router.delete('/backlink-opportunities/:id', (req, res) => seoManagerController.deleteBacklinkOpportunity(req, res))

// 200 Additional Backlink Opportunities (B1–B10) CRM
router.get('/backlink-opportunities-200', (req, res) => seoManagerController.getBacklinkOpportunities200(req, res))
router.post('/backlink-opportunities-200', (req, res) => seoManagerController.createBacklinkOpportunity200(req, res))
router.put('/backlink-opportunities-200/:id', (req, res) => seoManagerController.updateBacklinkOpportunity200(req, res))
router.delete('/backlink-opportunities-200/:id', (req, res) => seoManagerController.deleteBacklinkOpportunity200(req, res))

// AI & GEO Visibility Tracking (ChatGPT, Perplexity, Gemini, Copilot, Google AI Overviews)
router.get('/ai-visibility', (req, res) => seoManagerController.getAiVisibility(req, res))
router.put('/ai-visibility/:id', (req, res) => seoManagerController.updateAiVisibility(req, res))

// GEO FAQ Database Manager (Requirement 27)
router.get('/geo-faqs', (req, res) => seoManagerController.getGeoFaqs(req, res))
router.post('/geo-faqs', (req, res) => seoManagerController.createGeoFaq(req, res))
router.put('/geo-faqs/:id', (req, res) => seoManagerController.updateGeoFaq(req, res))
router.delete('/geo-faqs/:id', (req, res) => seoManagerController.deleteGeoFaq(req, res))

// GEO Content Knowledge Manager (Requirement 28)
router.get('/geo-content', (req, res) => seoManagerController.getGeoContent(req, res))
router.post('/geo-content', (req, res) => seoManagerController.createGeoContent(req, res))
router.put('/geo-content/:id', (req, res) => seoManagerController.updateGeoContent(req, res))
router.delete('/geo-content/:id', (req, res) => seoManagerController.deleteGeoContent(req, res))

// GEO Real Citation Verification Logs (Requirement 30)
router.get('/citation-logs', (req, res) => seoManagerController.getCitationLogs(req, res))
router.post('/citation-logs', (req, res) => seoManagerController.createCitationLog(req, res))

// Competitor URL Content Analyzer (Requirement 31)
router.post('/competitor-url-analysis', (req, res) => seoManagerController.analyzeCompetitorUrl(req, res))

// GEO 9-Pillar Scorecard (Requirement 41)
router.get('/geo-scorecard', (req, res) => seoManagerController.getGeoScorecard(req, res))

// Google Search Console Integration
router.get('/search-console/status', (req, res) => seoManagerController.getSearchConsoleStatus(req, res))
router.post('/search-console/connect', (req, res) => seoManagerController.connectSearchConsole(req, res))
router.post('/search-console/sync', (req, res) => seoManagerController.syncSearchConsole(req, res))

// Settings
router.get('/settings', (req, res) => seoManagerController.getSettings(req, res))
router.put('/settings', (req, res) => seoManagerController.updateSettings(req, res))

// Activity Logs
router.get('/logs', (req, res) => seoManagerController.getLogs(req, res))

// Requirement 1 & 9: Complete SEO Crawl Inventory
router.get('/inventory', (req, res) => seoManagerController.getSeoInventory(req, res))

// Requirements 35 & 36: Organic Conversion Dashboard & Stats
router.get('/conversions/stats', (req, res) => seoConversionController.getConversionStats(req, res))

// Requirement 28: 404 + Redirect Manager
router.get('/redirects', (req, res) => seoManagerController.getRedirects(req, res))
router.post('/redirects', (req, res) => seoManagerController.createRedirect(req, res))
router.put('/redirects/:id', (req, res) => seoManagerController.updateRedirect(req, res))
router.delete('/redirects/:id', (req, res) => seoManagerController.deleteRedirect(req, res))

// Requirement 30: Brand Mention Tracker
router.get('/brand-mentions', (req, res) => seoManagerController.getBrandMentions(req, res))
router.post('/brand-mentions', (req, res) => seoManagerController.createBrandMention(req, res))
router.put('/brand-mentions/:id', (req, res) => seoManagerController.updateBrandMention(req, res))
router.delete('/brand-mentions/:id', (req, res) => seoManagerController.deleteBrandMention(req, res))

// Requirement 34: SEO Experiments (A/B Testing)
router.get('/experiments', (req, res) => seoManagerController.getSeoExperiments(req, res))
router.post('/experiments', (req, res) => seoManagerController.createSeoExperiment(req, res))
router.put('/experiments/:id', (req, res) => seoManagerController.updateSeoExperiment(req, res))
router.delete('/experiments/:id', (req, res) => seoManagerController.deleteSeoExperiment(req, res))

// Requirement 14: Content Decay & Refresh
router.get('/content-decay', (req, res) => seoManagerController.getContentDecay(req, res))
router.put('/content-decay/:id', (req, res) => seoManagerController.updateContentDecay(req, res))

// Requirement 38 & 41: Monthly SEO Automation Report & Priority Roadmap
router.get('/monthly-report', (req, res) => seoManagerController.getMonthlyReport(req, res))

module.exports = router
