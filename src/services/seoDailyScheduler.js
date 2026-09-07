const { pool } = require('../config/database')
const seoScannerService = require('./seoScannerService')
const googleSearchConsoleService = require('./googleSearchConsoleService')
const seoAiAnalyzerService = require('./seoAiAnalyzerService')
const seoChangeService = require('./seoChangeService')

/**
 * Daily SEO Scheduler & Orchestration Engine
 * Runs daily at scheduled time (or triggered via POST /api/seo/run-daily from GoDaddy cPanel / cron)
 * Ensures idempotent execution, saves daily report snapshots, and logs all events.
 */
class SeoDailyScheduler {
  constructor() {
    this.intervalHandle = null
    this.isRunning = false
  }

  /**
   * Initialize in-process timer to check every minute if it is time to run
   */
  init() {
    if (this.intervalHandle) return
    console.log('[SeoDailyScheduler] Initializing AI SEO daily scheduler...')

    // Check once every minute
    this.intervalHandle = setInterval(() => {
      this.checkScheduledRun().catch((err) => {
        console.error('[SeoDailyScheduler] Scheduled check error:', err.message)
      })
    }, 60 * 1000)

    // Also run an initial check shortly after boot (e.g. after 15 seconds)
    setTimeout(() => {
      this.checkScheduledRun().catch(() => {})
    }, 15000)
  }

  /**
   * Check if today's run is due based on settings and time
   */
  async checkScheduledRun() {
    try {
      if (this.isRunning) return

      const [settingRows] = await pool.query(`SELECT setting_key, setting_value FROM seo_settings`)
      const settings = {}
      settingRows.forEach((r) => {
        settings[r.setting_key] = r.setting_value
      })

      if (settings.scheduler_enabled === '0' || settings.scheduler_enabled === 'false') {
        return
      }

      const scheduledTime = settings.daily_run_time || '03:00'
      const [schedHour, schedMin] = scheduledTime.split(':').map(Number)

      const now = new Date()
      const currentHour = now.getHours()
      const currentMin = now.getMinutes()

      // If within 2-minute window of the scheduled time
      if (currentHour === schedHour && Math.abs(currentMin - schedMin) <= 1) {
        // Check if already ran today
        const todayStr = now.toISOString().split('T')[0]
        const [existing] = await pool.query(
          `SELECT id FROM seo_daily_reports WHERE report_date = ? LIMIT 1`,
          [todayStr]
        )

        if (existing.length === 0) {
          console.log(`[SeoDailyScheduler] Scheduled trigger time reached (${scheduledTime}). Starting daily SEO run...`)
          await this.executeDailyRun({ isCronTrigger: false, forced: false })
        }
      }
    } catch (err) {
      console.warn('[SeoDailyScheduler] checkScheduledRun note:', err.message)
    }
  }

  /**
   * Main Pipeline Execution: Audit -> GSC Sync -> AI Analysis -> Auto-Apply (if enabled) -> Report -> Log
   */
  async executeDailyRun({ isCronTrigger = false, forced = false, triggeredBy = 'System Scheduler' } = {}) {
    if (this.isRunning) {
      return {
        success: false,
        message: 'A daily SEO run is already currently in progress.',
      }
    }

    this.isRunning = true
    const startTime = Date.now()
    const todayStr = new Date().toISOString().split('T')[0]

    try {
      await pool.query(
        `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
        ['daily_run_started', 'info', `Daily SEO run initiated by ${triggeredBy}`, JSON.stringify({ isCronTrigger, forced })]
      )

      // 1. Fetch current settings
      const [settingRows] = await pool.query(`SELECT setting_key, setting_value FROM seo_settings`)
      const settings = {}
      settingRows.forEach((r) => {
        settings[r.setting_key] = r.setting_value
      })

      const autoApplyEnabled = settings.auto_apply_safe === '1' || settings.auto_apply_safe === 'true'
      const minConfidence = parseFloat(settings.min_confidence_auto_apply || '0.90')

      // 2. Step 1: Run Full SEO Audit
      console.log('[SeoDailyScheduler] Step 1/4: Running complete website SEO audit...')
      const auditResult = await seoScannerService.runAudit()

      // 3. Step 2: Sync Search Console (if connected)
      console.log('[SeoDailyScheduler] Step 2/4: Checking Google Search Console metrics...')
      let gscMetrics = {
        connected: false,
        totalClicks: 0,
        totalImpressions: 0,
        averageCtr: 0,
        averagePosition: 0,
        opportunities: {},
      }
      try {
        const gscStatus = await googleSearchConsoleService.getStatus()
        if (gscStatus.isConnected) {
          await googleSearchConsoleService.sync()
          gscMetrics = await googleSearchConsoleService.getPerformance()
        }
      } catch (gscErr) {
        console.warn('[SeoDailyScheduler] GSC sync note:', gscErr.message)
      }

      // 4. Step 3: Run AI SEO Analyzer
      console.log('[SeoDailyScheduler] Step 3/4: Generating AI SEO recommendations...')
      let aiResult = { totalAnalyzed: 0, recommendationsCreated: 0 }
      try {
        aiResult = await seoAiAnalyzerService.analyzeSite({
          maxEntities: 15,
          priorityFilter: 'all',
        })
      } catch (aiErr) {
        console.warn('[SeoDailyScheduler] AI analyzer note:', aiErr.message)
      }

      // 5. Step 4: Auto-apply safe changes if enabled
      let autoAppliedCount = 0
      if (autoApplyEnabled) {
        console.log(`[SeoDailyScheduler] Step 4/4: Evaluating auto-apply for safe recommendations (min confidence: ${minConfidence})...`)
        try {
          const [pendingSafe] = await pool.query(
            `SELECT id, target_field, confidence 
             FROM seo_recommendations 
             WHERE status = 'PENDING' 
               AND target_field IN ('meta_description', 'image_alt', 'h1') 
               AND confidence >= ?`,
            [minConfidence]
          )

          for (const rec of pendingSafe) {
            try {
              await seoChangeService.applyRecommendation(rec.id, 'Auto-Apply Scheduler')
              autoAppliedCount++
            } catch (applyErr) {
              console.warn(`[SeoDailyScheduler] Auto-apply failed for #${rec.id}:`, applyErr.message)
            }
          }
        } catch (autoErr) {
          console.warn('[SeoDailyScheduler] Auto-apply loop note:', autoErr.message)
        }
      }

      // Count pending recommendations remaining
      const [pendingRows] = await pool.query(
        `SELECT COUNT(*) as pendingCount FROM seo_recommendations WHERE status = 'PENDING'`
      )
      const pendingCount = pendingRows[0]?.pendingCount || 0

      // Count issue severity breakdown
      const issuesBySeverity = { critical: 0, high: 0, medium: 0, low: 0 }
      auditResult.issues.forEach((i) => {
        const sev = (i.severity || 'medium').toLowerCase()
        if (issuesBySeverity[sev] !== undefined) {
          issuesBySeverity[sev]++
        }
      })

      // Generate Executive Summary Text
      const execSummary = `SEO Daily Health Score: ${auditResult.healthScore}% (${auditResult.issuesCount} active issues). ` +
        `Technical Score: ${auditResult.technicalScore}%, On-Page Score: ${auditResult.onpageScore}%, Structured Data: ${auditResult.structuredDataScore}%. ` +
        `${aiResult.recommendationsCreated} AI recommendation(s) generated. ` +
        `${autoAppliedCount} safe optimization(s) auto-applied. ` +
        (gscMetrics.connected ? `Google Search Console recorded ${gscMetrics.totalClicks} clicks and ${gscMetrics.totalImpressions} impressions.` : `Google Search Console is not connected.`)

      // 6. Persist to seo_daily_reports (Upsert for idempotency)
      const [existingToday] = await pool.query(
        `SELECT id FROM seo_daily_reports WHERE report_date = ? LIMIT 1`,
        [todayStr]
      )

      const reportData = [
        todayStr,
        auditResult.healthScore,
        auditResult.technicalScore,
        auditResult.onpageScore,
        auditResult.contentScore,
        auditResult.structuredDataScore,
        auditResult.totalEntities,
        issuesBySeverity.critical,
        issuesBySeverity.high,
        issuesBySeverity.medium,
        issuesBySeverity.low,
        pendingCount,
        autoAppliedCount,
        gscMetrics.totalClicks || 0,
        gscMetrics.totalImpressions || 0,
        gscMetrics.averagePosition || 0,
        JSON.stringify(gscMetrics.opportunities?.gainingQueries || []),
        JSON.stringify(gscMetrics.opportunities?.losingQueries || []),
        execSummary,
      ]

      if (existingToday.length > 0) {
        await pool.query(
          `UPDATE seo_daily_reports SET 
            health_score = ?, technical_score = ?, onpage_score = ?, content_score = ?, structured_data_score = ?,
            total_pages_scanned = ?, critical_issues = ?, high_issues = ?, medium_issues = ?, low_issues = ?,
            pending_recommendations = ?, applied_changes_today = ?, organic_clicks = ?, organic_impressions = ?,
            avg_position = ?, top_gaining_keywords = ?, top_losing_keywords = ?, executive_summary = ?
           WHERE report_date = ?`,
          [
            auditResult.healthScore, auditResult.technicalScore, auditResult.onpageScore, auditResult.contentScore, auditResult.structuredDataScore,
            auditResult.totalEntities, issuesBySeverity.critical, issuesBySeverity.high, issuesBySeverity.medium, issuesBySeverity.low,
            pendingCount, autoAppliedCount, gscMetrics.totalClicks || 0, gscMetrics.totalImpressions || 0,
            gscMetrics.averagePosition || 0, JSON.stringify(gscMetrics.opportunities?.gainingQueries || []), JSON.stringify(gscMetrics.opportunities?.losingQueries || []),
            execSummary, todayStr
          ]
        )
      } else {
        await pool.query(
          `INSERT INTO seo_daily_reports (
            report_date, health_score, technical_score, onpage_score, content_score, structured_data_score,
            total_pages_scanned, critical_issues, high_issues, medium_issues, low_issues,
            pending_recommendations, applied_changes_today, organic_clicks, organic_impressions,
            avg_position, top_gaining_keywords, top_losing_keywords, executive_summary
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          reportData
        )
      }

      // Update last_run_at setting
      await pool.query(
        `UPDATE seo_settings SET setting_value = NOW() WHERE setting_key = 'last_run_at'`
      )

      const durationMs = Date.now() - startTime
      await pool.query(
        `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
        ['daily_run_completed', 'success', `Daily SEO run completed in ${Math.round(durationMs / 1000)}s`, JSON.stringify({
          durationMs,
          healthScore: auditResult.healthScore,
          issuesCount: auditResult.issuesCount,
          recommendationsCreated: aiResult.recommendationsCreated,
          autoAppliedCount,
        })]
      )

      return {
        success: true,
        message: `Daily SEO run completed successfully in ${Math.round(durationMs / 1000)}s.`,
        reportDate: todayStr,
        healthScore: auditResult.healthScore,
        issuesCount: auditResult.issuesCount,
        recommendationsCreated: aiResult.recommendationsCreated,
        autoAppliedCount,
        executiveSummary: execSummary,
      }
    } catch (err) {
      console.error('[SeoDailyScheduler] Daily run failed:', err)
      await pool.query(
        `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
        ['daily_run_failed', 'error', `Daily SEO run failed: ${err.message}`, JSON.stringify({ error: err.stack })]
      )
      return {
        success: false,
        message: `Daily SEO run failed: ${err.message}`,
      }
    } finally {
      this.isRunning = false
    }
  }
}

module.exports = new SeoDailyScheduler()
