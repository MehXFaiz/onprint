const { pool } = require('../config/database')
const seoScannerService = require('../services/seoScannerService')
const googleSearchConsoleService = require('../services/googleSearchConsoleService')
const seoAiAnalyzerService = require('../services/seoAiAnalyzerService')
const seoChangeService = require('../services/seoChangeService')
const seoDailyScheduler = require('../services/seoDailyScheduler')
const seoSafetyService = require('../services/seoSafetyService')
const internalLinkingService = require('../services/internalLinkingService')
const seoOpportunityService = require('../services/seoOpportunityService')
const competitorGapService = require('../services/competitorGapService')
const imageSeoService = require('../services/imageSeoService')
const programmaticSeoService = require('../services/programmaticSeoService')

/**
 * AI SEO Manager Controller
 * Exposes full management REST API for ONPRINT admin dashboard.
 */
class SeoManagerController {
  /**
   * 1. Dashboard Overview Summary
   */
  async getDashboardSummary(req, res) {
    try {
      // Get latest audit
      const audit = await seoScannerService.getLatestAudit()

      // Get GSC status & performance
      const gscStatus = await googleSearchConsoleService.getStatus()
      let gscPerformance = {
        connected: false,
        totalClicks: 0,
        totalImpressions: 0,
        averageCtr: 0,
        averagePosition: 0,
        queries: [],
        pages: [],
        opportunities: {},
      }
      if (gscStatus.isConnected) {
        gscPerformance = await googleSearchConsoleService.getPerformanceData()
      }

      // Count recommendations
      let recCounts = [{ total: 0, pending: 0, approved: 0, applied: 0, rejected: 0 }]
      try {
        const [rows] = await pool.query(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'PENDING' OR status = 'NEW' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'APPLIED' THEN 1 ELSE 0 END) as applied,
            SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
          FROM seo_recommendations
        `)
        if (rows.length > 0) recCounts = rows
      } catch (err) {
        console.warn('[SeoController] Rec counts fallback note:', err.message)
      }

      // Top pending recommendations
      let topPending = []
      try {
        const [rows] = await pool.query(`
          SELECT * FROM seo_recommendations 
          WHERE status = 'PENDING' OR status = 'NEW' 
          ORDER BY FIELD(priority, 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'), created_at DESC 
          LIMIT 5
        `)
        topPending = rows
      } catch (err) {
        console.warn('[SeoController] Top pending fallback note:', err.message)
      }

      // Top issues
      let topIssues = []
      try {
        const [rows] = await pool.query(`
          SELECT * FROM seo_issues 
          ORDER BY FIELD(severity, 'critical', 'high', 'medium', 'low'), created_at DESC 
          LIMIT 6
        `)
        topIssues = rows
      } catch (err) {
        console.warn('[SeoController] Top issues fallback note:', err.message)
      }

      // 7-day trend from daily reports
      let trends = []
      try {
        const [rows] = await pool.query(`
          SELECT report_date, health_score, technical_score, onpage_score, content_score, structured_data_score, critical_issues, high_issues, organic_clicks, organic_impressions 
          FROM seo_daily_reports 
          ORDER BY report_date DESC 
          LIMIT 7
        `)
        trends = rows
      } catch (err) {
        console.warn('[SeoController] Trends fallback note:', err.message)
      }

      // Settings
      const settings = {}
      try {
        const [settingsRows] = await pool.query(`SELECT setting_key, setting_value FROM seo_settings`)
        settingsRows.forEach((r) => {
          settings[r.setting_key] = r.setting_value
        })
      } catch (err) {
        console.warn('[SeoController] Settings fallback note:', err.message)
      }

      res.json({
        success: true,
        data: {
          scores: {
            healthScore: audit.healthScore,
            technicalScore: audit.technicalScore,
            onpageScore: audit.onpageScore,
            contentScore: audit.contentScore,
            structuredDataScore: audit.structuredDataScore,
          },
          auditSummary: {
            totalPagesScanned: audit.totalPagesScanned || audit.totalEntities || 0,
            issuesCount: audit.issuesCount || 0,
            lastAuditAt: audit.createdAt || new Date().toISOString(),
          },
          recommendationsSummary: {
            total: recCounts[0]?.total || 0,
            pending: recCounts[0]?.pending || 0,
            approved: recCounts[0]?.approved || 0,
            applied: recCounts[0]?.applied || 0,
            rejected: recCounts[0]?.rejected || 0,
            topPending: topPending.map((r) => {
              let curVal = r.current_value
              let propVal = r.proposed_value
              if (typeof curVal === 'string') {
                try { curVal = JSON.parse(curVal) } catch {}
              }
              if (typeof propVal === 'string') {
                try { propVal = JSON.parse(propVal) } catch {}
              }
              const targetField = r.target_field || (propVal?.meta_description ? 'meta_description' : propVal?.title ? 'seo_title' : 'metadata')
              return {
                ...r,
                target_type: r.target_type || r.entity_type || 'page',
                target_field: targetField,
                target_name: r.target_name || (r.page_url ? r.page_url.split('/').filter(Boolean).pop() : 'Page'),
                target_url: r.target_url || r.page_url,
                current_value: typeof curVal === 'object' && curVal !== null ? (curVal[targetField] || curVal.meta_description || curVal.title || '') : (curVal || ''),
                recommended_value: r.recommended_value || (typeof propVal === 'object' && propVal !== null ? (propVal[targetField] || propVal.meta_description || propVal.title || '') : (propVal || '')),
                keywords: typeof r.keywords === 'string' ? JSON.parse(r.keywords) : (r.keywords || []),
                internal_link_suggestions: typeof r.internal_link_suggestions === 'string' ? JSON.parse(r.internal_link_suggestions) : (r.internal_link_suggestions || []),
              }
            }),
          },
          topIssues,
          searchConsole: {
            status: gscStatus,
            performance: gscPerformance,
          },
          trends: trends.reverse(),
          scheduler: {
            enabled: (settings.scheduler_enabled !== '0' && settings.scheduler_enabled !== 'false') && (settings.schedule_enabled !== '0' && settings.schedule_enabled !== 'false') && (settings.scheduler_enabled === '1' || settings.scheduler_enabled === 'true' || settings.schedule_enabled === '1' || settings.schedule_enabled === 'true'),
            dailyRunTime: settings.daily_run_time || settings.schedule_time || '03:00',
            timezone: settings.timezone || settings.schedule_timezone || 'Asia/Dubai',
            lastRunAt: settings.last_run_at || null,
            autoApplySafe: settings.auto_apply_safe === '1' || settings.auto_apply_safe === 'true' || settings.auto_apply_safe_changes === '1' || settings.auto_apply_safe_changes === 'true',
          },
        },
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 2. Full Technical & On-Page Audit Details
   */
  async getAudit(req, res) {
    try {
      const audit = await seoScannerService.getLatestAudit()
      res.json({ success: true, data: audit })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Trigger on-demand full SEO Audit
   */
  async triggerAudit(req, res) {
    try {
      const result = await seoScannerService.runAudit()
      res.json({
        success: true,
        message: 'SEO audit completed successfully.',
        data: result,
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 3. AI Recommendations Catalog with Filters
   */
  async getRecommendations(req, res) {
    try {
      const { status = 'all', priority = 'all', targetType = 'all', page = 1, limit = 50 } = req.query
      const offset = (Number(page) - 1) * Number(limit)

      let whereSql = 'WHERE 1=1'
      const params = []

      if (status && status !== 'all') {
        whereSql += ' AND status = ?'
        params.push(status.toUpperCase())
      }

      if (priority && priority !== 'all') {
        whereSql += ' AND priority = ?'
        params.push(priority.toUpperCase())
      }

      if (targetType && targetType !== 'all') {
        whereSql += ' AND (entity_type = ? OR target_type = ?)'
        params.push(targetType.toLowerCase(), targetType.toLowerCase())
      }

      const [rows] = await pool.query(
        `SELECT * FROM seo_recommendations ${whereSql} 
         ORDER BY FIELD(status, 'PENDING', 'NEW', 'APPROVED', 'APPLIED', 'REJECTED', 'FAILED'), 
                  FIELD(priority, 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'), 
                  created_at DESC 
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), Number(offset)]
      )

      const [countRows] = await pool.query(
        `SELECT COUNT(*) as total FROM seo_recommendations ${whereSql}`,
        params
      )

      const formatted = rows.map((r) => {
        let curVal = r.current_value
        let propVal = r.proposed_value
        if (typeof curVal === 'string') {
          try { curVal = JSON.parse(curVal) } catch {}
        }
        if (typeof propVal === 'string') {
          try { propVal = JSON.parse(propVal) } catch {}
        }

        const targetField = r.target_field || (propVal?.meta_description ? 'meta_description' : propVal?.title ? 'seo_title' : 'metadata')
        const currentDisplay = typeof curVal === 'object' && curVal !== null
          ? (curVal[targetField] || curVal.meta_description || curVal.title || JSON.stringify(curVal))
          : (curVal || '')
        const recommendedDisplay = r.recommended_value || (typeof propVal === 'object' && propVal !== null
          ? (propVal[targetField] || propVal.meta_description || propVal.title || JSON.stringify(propVal))
          : (propVal || ''))

        return {
          ...r,
          target_type: r.target_type || r.entity_type || 'page',
          target_field: targetField,
          target_name: r.target_name || (r.page_url ? r.page_url.split('/').filter(Boolean).pop() : 'Page'),
          target_url: r.target_url || r.page_url,
          current_value: currentDisplay,
          recommended_value: recommendedDisplay,
          proposed_value: typeof propVal === 'object' ? JSON.stringify(propVal) : propVal,
          keywords: typeof r.keywords === 'string' ? JSON.parse(r.keywords) : (r.keywords || []),
          internal_link_suggestions: typeof r.internal_link_suggestions === 'string' ? JSON.parse(r.internal_link_suggestions) : (r.internal_link_suggestions || []),
        }
      })

      res.json({
        success: true,
        data: {
          items: formatted,
          total: countRows[0].total,
          page: Number(page),
          limit: Number(limit),
        },
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Trigger AI SEO Analysis on pages/products
   */
  async triggerAiAnalysis(req, res) {
    try {
      const options = {
        maxEntities: req.body.maxEntities ? Number(req.body.maxEntities) : 20,
        priorityFilter: req.body.priorityFilter || 'all',
      }
      const result = await seoAiAnalyzerService.analyzeSite(options)
      res.json({
        success: true,
        message: `AI SEO analysis complete. Created ${result.recommendationsCreated} actionable recommendation(s).`,
        data: result,
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Approve a Recommendation
   */
  async approveRecommendation(req, res) {
    try {
      const { id } = req.params
      const adminUser = req.user?.name || req.user?.email || 'Admin'
      const { notes } = req.body

      const result = await seoChangeService.reviewRecommendation(id, 'APPROVED', adminUser, notes)
      res.json({ success: true, message: result.message, data: result.recommendation })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Reject a Recommendation
   */
  async rejectRecommendation(req, res) {
    try {
      const { id } = req.params
      const adminUser = req.user?.name || req.user?.email || 'Admin'
      const { notes } = req.body

      const result = await seoChangeService.reviewRecommendation(id, 'REJECTED', adminUser, notes)
      res.json({ success: true, message: result.message, data: result.recommendation })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Apply Single Recommendation Directly
   */
  async applyRecommendation(req, res) {
    try {
      const { id } = req.params
      const adminUser = req.user?.name || req.user?.email || 'Admin'

      const result = await seoChangeService.applyRecommendation(id, adminUser)
      res.json({ success: true, message: result.message, data: result })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Bulk Apply Approved Recommendations
   */
  async bulkApply(req, res) {
    try {
      const adminUser = req.user?.name || req.user?.email || 'Admin'
      const result = await seoChangeService.applyBulkApproved(adminUser)
      res.json(result)
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 4. Change History & Rollback
   */
  async getChangeHistory(req, res) {
    try {
      const { page = 1, limit = 50, entityType, status } = req.query
      const result = await seoChangeService.getHistory({ page, limit, entityType, status })
      res.json({ success: true, data: result })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 1-Click Rollback for a change
   */
  async rollbackChange(req, res) {
    try {
      const { id } = req.params
      const adminUser = req.user?.name || req.user?.email || 'Admin'
      const result = await seoChangeService.rollbackChange(id, adminUser)
      res.json(result)
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 5. Daily Reports History
   */
  async getDailyReports(req, res) {
    try {
      const { limit = 30 } = req.query
      const [rows] = await pool.query(
        `SELECT * FROM seo_daily_reports ORDER BY report_date DESC LIMIT ?`,
        [Number(limit)]
      )

      const formatted = rows.map((r) => ({
        ...r,
        top_gaining_keywords: typeof r.top_gaining_keywords === 'string' ? JSON.parse(r.top_gaining_keywords) : (r.top_gaining_keywords || []),
        top_losing_keywords: typeof r.top_losing_keywords === 'string' ? JSON.parse(r.top_losing_keywords) : (r.top_losing_keywords || []),
      }))

      res.json({ success: true, data: formatted })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Get single daily report by date
   */
  async getDailyReportByDate(req, res) {
    try {
      const { date } = req.params
      const [rows] = await pool.query(`SELECT * FROM seo_daily_reports WHERE report_date = ? LIMIT 1`, [date])
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No SEO report found for this date.' })
      }

      const report = rows[0]
      report.top_gaining_keywords = typeof report.top_gaining_keywords === 'string' ? JSON.parse(report.top_gaining_keywords) : (report.top_gaining_keywords || [])
      report.top_losing_keywords = typeof report.top_losing_keywords === 'string' ? JSON.parse(report.top_losing_keywords) : (report.top_losing_keywords || [])

      res.json({ success: true, data: report })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 6. Keywords & Search Opportunities
   */
  async getKeywords(req, res) {
    try {
      const gscStatus = await googleSearchConsoleService.getStatus()
      if (gscStatus.isConnected) {
        const perf = await googleSearchConsoleService.getPerformance()
        return res.json({
          success: true,
          data: {
            connected: true,
            queries: perf.queries,
            opportunities: perf.opportunities,
          },
        })
      }

      // If Search Console is disconnected, fetch seeded / snapshot keyword database
      const [snapshots] = await pool.query(
        `SELECT * FROM seo_keyword_snapshots ORDER BY snapshot_date DESC, position ASC LIMIT 100`
      )

      res.json({
        success: true,
        data: {
          connected: false,
          message: 'Google Search Console not connected. Showing tracked keyword targets.',
          queries: snapshots.map((s) => ({
            query: s.keyword,
            clicks: s.clicks || 0,
            impressions: s.impressions || 0,
            ctr: s.ctr || 0,
            position: s.position || 0,
          })),
          opportunities: {
            highImpressionLowCtr: [],
            position4To20: [],
            gainingQueries: [],
            losingQueries: [],
          },
        },
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 7. Pages & Catalog Metadata Status
   */
  async getPages(req, res) {
    try {
      const audit = await seoScannerService.getLatestAudit()
      const entities = audit.entities || []

      // If entities are in audit, return them; otherwise run a quick scan
      if (entities.length > 0) {
        return res.json({ success: true, data: entities })
      }

      const freshAudit = await seoScannerService.runAudit()
      res.json({ success: true, data: freshAudit.entities })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 8. Google Search Console Management
   */
  async getSearchConsoleStatus(req, res) {
    try {
      const status = await googleSearchConsoleService.getStatus()
      res.json({ success: true, data: status })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Save Search Console Credentials / Connect
   */
  async connectSearchConsole(req, res) {
    try {
      const { property, authType, serviceAccountJson, clientId, clientSecret, refreshToken } = req.body
      const result = await googleSearchConsoleService.saveCredentials({
        property,
        authType,
        serviceAccountJson,
        clientId,
        clientSecret,
        refreshToken,
      })
      res.json({ success: true, message: result.message, data: result.integration })
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  }

  /**
   * Manually Sync Google Search Console Data
   */
  async syncSearchConsole(req, res) {
    try {
      const result = await googleSearchConsoleService.sync()
      res.json(result)
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 9. SEO Settings
   */
  async getSettings(req, res) {
    try {
      let rows = []
      try {
        const [queryRows] = await pool.query(`SELECT setting_key, setting_value FROM seo_settings`)
        rows = queryRows
      } catch (dbErr) {
        console.warn('[SeoController] getSettings DB note:', dbErr.message)
      }

      const settingsObj = {}
      rows.forEach((r) => {
        settingsObj[r.setting_key] = r.setting_value
      })

      // Normalize key aliases
      const schedulerEnabled = settingsObj.scheduler_enabled ?? settingsObj.schedule_enabled ?? '1'
      const dailyRunTime = settingsObj.daily_run_time ?? settingsObj.schedule_time ?? '03:00'
      const timezone = settingsObj.timezone ?? settingsObj.schedule_timezone ?? 'Asia/Dubai'
      const autoApplySafe = settingsObj.auto_apply_safe ?? settingsObj.auto_apply_safe_changes ?? '0'
      const minConfidence = settingsObj.min_confidence_auto_apply || '0.90'
      const aiProvider = settingsObj.ai_provider || 'gemini'
      const aiModel = settingsObj.ai_model || 'gemini-1.5-flash'

      // Mask sensitive API keys for security
      const maskedAiKey = (settingsObj.ai_api_key || process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || '')
      const hasAiKey = maskedAiKey.length > 0
      const displayAiKey = hasAiKey ? `${maskedAiKey.slice(0, 4)}••••••••${maskedAiKey.slice(-4)}` : ''

      res.json({
        success: true,
        data: {
          ...settingsObj,
          scheduler_enabled: schedulerEnabled,
          schedule_enabled: schedulerEnabled,
          daily_run_time: dailyRunTime,
          schedule_time: dailyRunTime,
          timezone,
          schedule_timezone: timezone,
          auto_apply_safe: autoApplySafe,
          auto_apply_safe_changes: autoApplySafe,
          min_confidence_auto_apply: minConfidence,
          ai_provider: aiProvider,
          ai_model: aiModel,
          hasAiKey,
          ai_api_key_masked: displayAiKey,
          cron_endpoint: `${(process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')}/api/seo/run-daily`,
        },
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * Update SEO Settings
   */
  async updateSettings(req, res) {
    try {
      const settings = req.body || {}

      // Mirror aliases so either key is updated consistently
      if (settings.scheduler_enabled !== undefined) {
        settings.schedule_enabled = settings.scheduler_enabled
      }
      if (settings.daily_run_time !== undefined) {
        settings.schedule_time = settings.daily_run_time
      }
      if (settings.timezone !== undefined) {
        settings.schedule_timezone = settings.timezone
      }
      if (settings.auto_apply_safe !== undefined) {
        settings.auto_apply_safe_changes = settings.auto_apply_safe
      }

      for (const [key, value] of Object.entries(settings)) {
        if (key === 'hasAiKey' || key === 'ai_api_key_masked' || key === 'cron_endpoint') continue

        // If updating ai_api_key and value contains masked bullet points, skip updating
        if (key === 'ai_api_key' && value.includes('••••')) continue

        await pool.query(
          `INSERT INTO seo_settings (setting_key, setting_value, updated_at) 
           VALUES (?, ?, NOW()) 
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
          [key, String(value)]
        )
      }

      try {
        await pool.query(
          `INSERT INTO seo_logs (event_type, status, message) VALUES (?, ?, ?)`,
          ['settings_updated', 'success', `SEO Settings updated by ${req.user?.name || 'Admin'}`]
        )
      } catch (logErr) {
        console.warn('[SeoController] Settings log note:', logErr.message)
      }

      res.json({ success: true, message: 'SEO settings updated successfully.' })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 10. Daily Execution Trigger (Cron / On-Demand)
   */
  async runDaily(req, res) {
    try {
      const cronSecretHeader = req.headers['x-cron-secret'] || req.query.cron_secret
      const envSecret = process.env.CRON_SECRET || 'onprint_daily_seo_cron_secret_2026'

      let triggeredBy = 'Admin User'
      let isCronTrigger = false

      if (cronSecretHeader && cronSecretHeader === envSecret) {
        triggeredBy = 'GoDaddy Cron / External Scheduler'
        isCronTrigger = true
      } else if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'administrator')) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized. Admin credentials or valid X-Cron-Secret header required.',
        })
      }

      const forced = req.body?.force === true || req.query.force === 'true'
      const result = await seoDailyScheduler.executeDailyRun({
        isCronTrigger,
        forced,
        triggeredBy: req.user?.name || triggeredBy,
      })

      res.json(result)
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 11. Activity Logs
   */
  async getLogs(req, res) {
    try {
      const { limit = 50 } = req.query
      const [rows] = await pool.query(
        `SELECT * FROM seo_logs ORDER BY created_at DESC LIMIT ?`,
        [Number(limit)]
      )
      res.json({
        success: true,
        data: rows.map((r) => ({
          ...r,
          details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details,
        })),
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 12. Content Opportunity Finder (Striking distance & high-impression queries)
   */
  async getOpportunities(req, res) {
    try {
      const data = await seoOpportunityService.getOpportunities()
      res.json({ success: true, data })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 13. Internal Linking Engine Recommendations
   */
  async getInternalLinks(req, res) {
    try {
      const data = await internalLinkingService.generateRecommendations()
      res.json({ success: true, data })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 14. Competitor Gap Analysis
   */
  async getCompetitorAnalysis(req, res) {
    try {
      const data = await competitorGapService.getGapAnalysis()
      res.json({ success: true, data })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 15. Image SEO Audit
   */
  async getImageAudit(req, res) {
    try {
      const data = await imageSeoService.scanImages()
      res.json({ success: true, data })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 16. Update Image Alt Text
   */
  async updateImageAlt(req, res) {
    try {
      const { entityType, entityId, altText } = req.body
      if (!entityType || !entityId || !altText) {
        return res.status(400).json({ success: false, message: 'entityType, entityId, and altText are required.' })
      }
      const result = await imageSeoService.updateAltText(entityType, entityId, altText)
      res.json(result)
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 17. SEO Safety & Review Required Queue
   */
  async getSafetyQueue(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM seo_recommendations 
         WHERE status = 'REVIEW_REQUIRED' 
         ORDER BY FIELD(priority, 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'), created_at DESC`
      )

      const formatted = rows.map((r) => {
        let propVal = r.proposed_value
        if (typeof propVal === 'string') {
          try { propVal = JSON.parse(propVal) } catch {}
        }
        return {
          ...r,
          proposed_value: propVal,
          safety_violations: propVal?.safety_violations || [],
        }
      })

      res.json({ success: true, data: formatted })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 18. Real-time Pre-publish Safety Validation
   */
  async validateChange(req, res) {
    try {
      const result = seoSafetyService.validateChange(req.body)
      res.json({ success: true, data: result })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 19. Programmatic Landing Pages Catalog
   */
  async getProgrammaticPages(req, res) {
    try {
      const pages = programmaticSeoService.getAllPages()
      res.json({ success: true, data: pages })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  /**
   * 20. Single Programmatic Page Details
   */
  async getProgrammaticPage(req, res) {
    try {
      const { slug } = req.params
      const { type } = req.query
      const page = programmaticSeoService.getPageBySlug(slug, type)
      if (!page) {
        return res.status(404).json({ success: false, message: 'Programmatic landing page not found.' })
      }
      res.json({ success: true, data: page })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }
}

module.exports = new SeoManagerController()
