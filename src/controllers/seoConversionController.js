const crypto = require('crypto')
const { pool } = require('../config/database')
const persistentStore = require('../data/persistentStore')

const AI_REFERRER_PATTERNS = [
  /chatgpt\.com/i,
  /openai\.com/i,
  /perplexity\.ai/i,
  /claude\.ai/i,
  /gemini\.google\.com/i,
  /copilot\.microsoft\.com/i,
  /you\.com/i,
]

function isAiReferrer(referrer = '') {
  return AI_REFERRER_PATTERNS.some((rx) => rx.test(String(referrer || '')))
}

/**
 * Organic Conversion & ROI Controller
 * Tracks user-initiated conversion actions (WhatsApp Clicks, Form Submissions, Quotation Requests, Confirmed Orders)
 * as strictly distinct events and attributes them to their landing page & referrer source.
 * Never reports WhatsApp clicks as confirmed orders or fabricates session counts.
 */
class SeoConversionController {
  /**
   * Public beacon to record organic conversion actions
   */
  async trackConversion(req, res) {
    try {
      const { conversion_type, landing_page, referrer, source_label, query_string } = req.body || {}

      if (!conversion_type) {
        return res.status(400).json({ success: false, message: 'conversion_type is required' })
      }

      // Anonymize IP hash for privacy compliance
      const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
      const ipHash = rawIp ? crypto.createHash('sha256').update(String(rawIp)).digest('hex').slice(0, 16) : null
      const userAgent = (req.headers['user-agent'] || '').slice(0, 250)

      // Persist in local persistentStore for reliable auditability
      const savedEntry = persistentStore.addSeoConversion({
        conversion_type,
        landing_page: (landing_page || '').slice(0, 500),
        referrer: (referrer || '').slice(0, 500),
        source_label: (source_label || '').slice(0, 100),
        query_string: (query_string || '').slice(0, 255),
        ip_hash: ipHash,
        user_agent: userAgent,
      })

      try {
        await pool.query(
          `INSERT INTO seo_conversions 
           (conversion_type, landing_page, referrer, source_label, query_string, ip_hash, user_agent)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            conversion_type,
            (landing_page || '').slice(0, 500),
            (referrer || '').slice(0, 500),
            (source_label || '').slice(0, 100),
            (query_string || '').slice(0, 255),
            ipHash,
            userAgent,
          ]
        )
      } catch (dbErr) {
        // Handled via persistentStore
      }

      res.status(201).json({
        success: true,
        message: 'Conversion event recorded distinctly (never counted as a confirmed order unless verified in orders).',
        event: {
          id: savedEntry.id,
          conversion_type: savedEntry.conversion_type,
          landing_page: savedEntry.landing_page,
          is_ai_referrer: isAiReferrer(savedEntry.referrer),
          created_at: savedEntry.created_at,
        },
      })
    } catch (err) {
      console.warn('[Conversion Track Note]:', err.message)
      res.status(200).json({ success: true, note: 'Degraded tracking mode' })
    }
  }

  /**
   * Admin analytics summary for Organic Conversion Dashboard
   * Strictly separates WhatsApp clicks, form submissions, quotation requests, and confirmed orders.
   */
  async getConversionStats(req, res) {
    try {
      const storeEvents = persistentStore.getSeoConversions()
      const storeOrders = persistentStore.getOrders()
      const storeQuotes = persistentStore.getQuotes()
      const storeMessages = persistentStore.getMessages()

      let whatsappClicks = 0
      let formSubmissions = 0
      let quoteRequests = 0
      let phoneClicks = 0
      let emailClicks = 0
      let productInquiries = 0
      let aiReferralEvents = 0

      const pageMap = new Map()

      for (const ev of storeEvents) {
        const t = String(ev.conversion_type || '').toLowerCase()
        if (t === 'whatsapp' || t === 'whatsapp_click') whatsappClicks += 1
        else if (t === 'form_submission' || t === 'contact_form' || t === 'contact_form_submit') formSubmissions += 1
        else if (t === 'quote_request' || t === 'quote_form_submit') quoteRequests += 1
        else if (t === 'phone' || t === 'phone_click') phoneClicks += 1
        else if (t === 'email' || t === 'email_click') emailClicks += 1
        else if (t === 'product_inquiry') productInquiries += 1

        if (isAiReferrer(ev.referrer)) {
          aiReferralEvents += 1
        }

        const lp = (ev.landing_page || '').trim()
        if (lp) {
          const prev = pageMap.get(lp) || { landing_page: lp, conversions: 0, whatsapp_leads: 0, quote_leads: 0, form_leads: 0 }
          prev.conversions += 1
          if (t === 'whatsapp' || t === 'whatsapp_click') prev.whatsapp_leads += 1
          if (t === 'quote_request' || t === 'quote_form_submit') prev.quote_leads += 1
          if (t === 'form_submission' || t === 'contact_form' || t === 'contact_form_submit') prev.form_leads += 1
          pageMap.set(lp, prev)
        }
      }

      // Include verified quote & contact records if higher than beacon count
      const verifiedQuotesCount = Array.isArray(storeQuotes) ? storeQuotes.length : 0
      const verifiedMessagesCount = Array.isArray(storeMessages) ? storeMessages.length : 0
      const confirmedOrdersCount = Array.isArray(storeOrders) ? storeOrders.length : 0

      const effectiveQuoteRequests = Math.max(quoteRequests, verifiedQuotesCount)
      const effectiveFormSubmissions = Math.max(formSubmissions, verifiedMessagesCount)
      const totalInteractionEvents =
        whatsappClicks + effectiveFormSubmissions + effectiveQuoteRequests + phoneClicks + emailClicks + productInquiries

      const topLandingPages = Array.from(pageMap.values())
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 10)

      const recentEvents = storeEvents.slice(0, 25)

      res.json({
        success: true,
        data: {
          totals: {
            total: totalInteractionEvents,
            whatsapp: whatsappClicks,
            whatsapp_clicks: whatsappClicks,
            form_submissions: effectiveFormSubmissions,
            quote_request: effectiveQuoteRequests,
            quotation_requests: effectiveQuoteRequests,
            phone: phoneClicks,
            email: emailClicks,
            product_inquiry: productInquiries,
            confirmed_orders: confirmedOrdersCount,
            ai_referral_events: aiReferralEvents,
            estimatedSessions: null,
            conversionRate: null,
            integrityNote:
              'WhatsApp clicks, form submissions, quotation requests, and confirmed orders are tracked as strictly separate funnel stages. Session counts require a live GA4 Data API connection and are never fabricated.',
          },
          topLandingPages,
          recentEvents,
        },
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }
}

module.exports = new SeoConversionController()
