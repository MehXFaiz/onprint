const express = require('express')
const router = express.Router()
const { getRobotsTxt, getSitemapXml, runSeoAudit } = require('../controllers/seoController')

// Public SEO files
router.get('/robots.txt', getRobotsTxt)
router.get('/sitemap.xml', getSitemapXml)

// SEO Audit API
router.get('/audit', runSeoAudit)

module.exports = router
