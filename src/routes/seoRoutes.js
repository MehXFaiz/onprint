const express = require('express')
const router = express.Router()
const { getRobotsTxt, getSitemapXml, getAdsTxt, runSeoAudit } = require('../controllers/seoController')

// Public SEO files
router.get('/robots.txt', getRobotsTxt)
router.get('/sitemap.xml', getSitemapXml)
router.get('/ads.txt', getAdsTxt)

// SEO Audit API
router.get('/audit', runSeoAudit)

module.exports = router
