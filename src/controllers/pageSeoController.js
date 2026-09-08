const pageSeoService = require('../services/pageSeoService')
const { pool } = require('../config/database')

class PageSeoController {
  /**
   * Public: Get SEO for frontend <head> injection by URL
   * GET /api/seo/by-url?url=/about
   */
  async getPageByUrl(req, res) {
    try {
      const url = req.query.url || '/'
      const data = await pageSeoService.getPageByUrl(url)
      if (!data) {
        return res.status(404).json({ success: false, message: 'Page SEO not found for URL' })
      }
      res.json({ success: true, data })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Get all pages with filters & keyword cannibalization
   * GET /api/seo/pages
   */
  async getPages(req, res) {
    try {
      const pages = await pageSeoService.getAllPages(req.query)
      res.json({ success: true, data: pages, total: pages.length })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Get single page SEO record + change history
   * GET /api/seo/pages/:id
   */
  async getPageById(req, res) {
    try {
      const page = await pageSeoService.getPageById(req.params.id)
      if (!page) {
        return res.status(404).json({ success: false, message: 'Page SEO record not found.' })
      }
      res.json({ success: true, data: page })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Create a new Page SEO record
   * POST /api/seo/pages
   */
  async createPage(req, res) {
    try {
      const {
        page_type = 'static',
        page_id = null,
        url,
        slug = null,
        meta_title,
        meta_description,
        focus_keyword,
        secondary_keywords,
        h1,
        seo_content,
        canonical_url,
        robots_index = 'index',
        robots_follow = 'follow',
        og_title,
        og_description,
        og_image,
        twitter_title,
        twitter_description,
        twitter_image,
        schema_type = 'WebPage',
        schema_markup,
      } = req.body

      if (!url) {
        return res.status(400).json({ success: false, message: 'Page URL is required.' })
      }

      // Check duplicate URL
      const [existing] = await pool.query('SELECT id FROM page_seo WHERE url = ?', [url])
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'An SEO record for this URL already exists.' })
      }

      const scoreResult = pageSeoService.calculateSeoScore({
        meta_title,
        meta_description,
        focus_keyword,
        h1,
        canonical_url,
        og_title,
        og_description,
        og_image,
        twitter_title,
        twitter_description,
        schema_markup,
      })

      const [insertRes] = await pool.query(
        `INSERT INTO page_seo 
         (page_type, page_id, url, slug, meta_title, meta_description, focus_keyword, secondary_keywords, h1, seo_content, canonical_url, robots_index, robots_follow, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, schema_type, schema_markup, seo_score, readability_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          page_type,
          page_id,
          url,
          slug,
          meta_title,
          meta_description,
          focus_keyword,
          secondary_keywords,
          h1,
          seo_content,
          canonical_url,
          robots_index,
          robots_follow,
          og_title || meta_title,
          og_description || meta_description,
          og_image,
          twitter_title || meta_title,
          twitter_description || meta_description,
          twitter_image || og_image,
          schema_type,
          schema_markup,
          scoreResult.score,
          80,
        ]
      )

      const created = await pageSeoService.getPageById(insertRes.insertId)
      res.status(201).json({ success: true, message: 'Page SEO record created successfully.', data: created })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Update Page SEO record (with change history logging)
   * PUT /api/seo/pages/:id
   */
  async updatePage(req, res) {
    try {
      const updated = await pageSeoService.updatePageSeo(req.params.id, req.body, req.user)
      res.json({
        success: true,
        message: 'Page SEO updated successfully.',
        data: updated,
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Analyze page with AI (returns Current vs AI Recommendation)
   * POST /api/seo/pages/:id/analyze
   */
  async analyzePage(req, res) {
    try {
      const analysis = await pageSeoService.analyzePageWithAi(req.params.id)
      res.json({ success: true, data: analysis })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Optimize page with AI (generates ready-to-apply payload)
   * POST /api/seo/pages/:id/optimize
   */
  async optimizePage(req, res) {
    try {
      const analysis = await pageSeoService.analyzePageWithAi(req.params.id)
      const rec = analysis.recommendation

      const optimizedPayload = {
        meta_title: rec.metaTitle,
        meta_description: rec.metaDescription,
        focus_keyword: rec.focusKeyword,
        secondary_keywords: rec.secondaryKeywords,
        h1: rec.h1,
        schema_type: rec.schemaType,
      }

      res.json({
        success: true,
        data: {
          ...analysis,
          optimizedPayload,
        },
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Run full website SEO audit inspecting every page
   * POST /api/seo/audit
   */
  async runAudit(req, res) {
    try {
      const auditResult = await pageSeoService.runFullWebsiteAudit()
      res.json({ success: true, message: 'Full website SEO audit completed.', data: auditResult })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Get audit issues list
   * GET /api/seo/issues
   */
  async getIssues(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM seo_issues 
        ORDER BY FIELD(severity, 'critical', 'high', 'medium', 'low'), created_at DESC 
        LIMIT 100
      `)
      res.json({ success: true, data: rows, total: rows.length })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Get Website SEO Score Overview
   * GET /api/seo/score
   */
  async getScore(req, res) {
    try {
      const overview = await pageSeoService.getWebsiteOverview()
      res.json({ success: true, data: overview })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Keyword Cannibalization Detector
   * GET /api/seo/cannibalization
   */
  async getCannibalization(req, res) {
    try {
      const reports = await pageSeoService.detectCannibalization()
      res.json({ success: true, data: reports, total: reports.length })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Rollback SEO Change
   * POST /api/seo/history/:id/rollback
   */
  async rollbackChange(req, res) {
    try {
      const reverted = await pageSeoService.rollbackChange(req.params.id, req.user)
      res.json({
        success: true,
        message: 'SEO change successfully rolled back.',
        data: reverted,
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Admin: Get Change History Log
   * GET /api/seo/history
   */
  async getHistory(req, res) {
    try {
      const { page_seo_id, limit = 50 } = req.query
      let query = `
        SELECT psh.*, ps.page_type 
        FROM page_seo_history psh
        LEFT JOIN page_seo ps ON psh.page_seo_id = ps.id
        WHERE 1=1
      `
      const params = []
      if (page_seo_id) {
        query += ` AND psh.page_seo_id = ?`
        params.push(Number(page_seo_id))
      }
      query += ` ORDER BY psh.created_at DESC LIMIT ?`
      params.push(Number(limit))

      const [rows] = await pool.query(query, params)
      res.json({ success: true, data: rows, total: rows.length })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }
}

module.exports = new PageSeoController()
