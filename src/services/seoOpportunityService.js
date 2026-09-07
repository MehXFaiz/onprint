const { pool } = require('../config/database')
const googleSearchConsoleService = require('./googleSearchConsoleService')

/**
 * SEO Content Opportunity Finder
 * Detects striking-distance queries (positions 4–20), high-impression/low-CTR opportunities,
 * and high-intent commercial keyword gaps to maximize organic click yield.
 */
class SeoOpportunityService {
  /**
   * Scan queries and pages to identify highest-ROI SEO opportunities
   */
  async getOpportunities() {
    const gscStatus = await googleSearchConsoleService.getStatus()
    let rawQueries = []
    let rawPages = []

    if (gscStatus.isConnected) {
      const perf = await googleSearchConsoleService.getPerformanceData()
      rawQueries = perf.queries || []
      rawPages = perf.pages || []
    } else {
      // Fetch stored keyword snapshots from database if available
      try {
        const [kRows] = await pool.query(`SELECT * FROM seo_keyword_snapshots ORDER BY impressions DESC LIMIT 100`)
        rawQueries = kRows
        const [pRows] = await pool.query(`SELECT * FROM seo_page_metrics ORDER BY clicks DESC LIMIT 100`)
        rawPages = pRows
      } catch {}
    }

    const strikingDistance = [] // Position 4 to 20
    const highImpressionLowCtr = [] // CTR below average with high impressions
    const decliningKeywords = [] // Lost positions compared to previous
    const topGainingKeywords = [] // Gained positions

    rawQueries.forEach((q) => {
      const pos = Number(q.position || 0)
      const prevPos = Number(q.previous_position || 0)
      const impressions = Number(q.impressions || 0)
      const ctr = Number(q.ctr || 0)
      const query = q.query || q.keyword

      // 1. Striking Distance (Position 4 - 20)
      if (pos >= 4 && pos <= 20) {
        strikingDistance.push({
          keyword: query,
          position: pos,
          impressions,
          ctr,
          landingPage: q.page_url || '/services',
          recommendedAction:
            pos <= 10
              ? 'Add 2–3 contextual internal links from blog articles and expand H2 topical depth to break into Top 3.'
              : 'Enhance meta title snippet, add targeted FAQ schema, and optimize H1/H2 for secondary intent.',
          expectedBenefit: `Moving from position ${pos} to top 3 can yield 3x–5x organic click increase.`,
          priority: pos <= 10 ? 'CRITICAL' : 'HIGH',
        })
      }

      // 2. High Impressions, Low CTR (Snippets underperforming)
      if (impressions >= 50 && ctr < 2.5 && pos <= 15) {
        highImpressionLowCtr.push({
          keyword: query,
          position: pos,
          impressions,
          ctr,
          landingPage: q.page_url || '/products',
          recommendedAction:
            'Rewrite meta title and description with compelling Dubai turnaround time, price cues, and clear call-to-action.',
          expectedBenefit: 'Doubling CTR on high-impression query directly converts existing impressions into qualified leads.',
          priority: 'HIGH',
        })
      }

      // 3. Movement
      if (prevPos > 0 && pos > prevPos) {
        decliningKeywords.push({
          keyword: query,
          currentPosition: pos,
          previousPosition: prevPos,
          drop: (pos - prevPos).toFixed(1),
          landingPage: q.page_url || '/',
          recommendedAction: 'Audit page for recent content changes, check competitor updates, and refresh outdated specifications.',
          priority: 'MEDIUM',
        })
      } else if (prevPos > 0 && pos < prevPos) {
        topGainingKeywords.push({
          keyword: query,
          currentPosition: pos,
          previousPosition: prevPos,
          gain: (prevPos - pos).toFixed(1),
          landingPage: q.page_url || '/',
        })
      }
    })

    // Sort opportunities by priority and impressions
    strikingDistance.sort((a, b) => b.impressions - a.impressions)
    highImpressionLowCtr.sort((a, b) => b.impressions - a.impressions)

    // Curated high-intent target opportunities for Dubai commercial printing
    const strategicTargets = [
      {
        keyword: 'brochures printing dubai',
        targetPage: '/categories/brochures-printing',
        intent: 'Commercial / Transactional',
        searchVolumeRange: '1.2K - 2.5K/mo',
        recommendedAction: 'Build dedicated landing section for corporate tri-fold brochures with luxury matte velvet lamination.',
        priority: 'CRITICAL',
      },
      {
        keyword: 'luxury business cards dubai',
        targetPage: '/categories/business-cards-printing',
        intent: 'Commercial',
        searchVolumeRange: '1.5K - 3.0K/mo',
        recommendedAction: 'Highlight 450gsm–600gsm cotton stock options, gold foil stamping, and painted edges.',
        priority: 'CRITICAL',
      },
      {
        keyword: 'same day flyer printing in dubai',
        targetPage: '/categories/flyers-printing-in-dubai',
        intent: 'Transactional / Urgent',
        searchVolumeRange: '800 - 1.6K/mo',
        recommendedAction: 'Emphasize 4-hour rush turnaround in meta description and header callout.',
        priority: 'HIGH',
      },
      {
        keyword: 'corporate id card printing dubai',
        targetPage: '/categories/id-card-printing-dubai',
        intent: 'Commercial',
        searchVolumeRange: '600 - 1.2K/mo',
        recommendedAction: 'Feature CR80 smart chip specifications, barcodes, and custom branded lanyard packages.',
        priority: 'HIGH',
      },
      {
        keyword: 'exhibition rollup banner dubai',
        targetPage: '/services',
        intent: 'Commercial / Event',
        searchVolumeRange: '1.0K - 2.0K/mo',
        recommendedAction: 'Create dedicated exhibition graphics package targeting DWTC and Expo City events.',
        priority: 'HIGH',
      },
    ]

    return {
      connectedToGsc: gscStatus.isConnected,
      totalTrackedQueries: rawQueries.length,
      strikingDistanceCount: strikingDistance.length,
      highImpressionLowCtrCount: highImpressionLowCtr.length,
      decliningCount: decliningKeywords.length,
      opportunities: {
        strikingDistance,
        highImpressionLowCtr,
        decliningKeywords,
        topGainingKeywords,
        strategicTargets,
      },
    }
  }
}

module.exports = new SeoOpportunityService()
