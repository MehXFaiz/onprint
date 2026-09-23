/**
 * Competitor Gap Analysis Service
 * Evaluates the competitive landscape in Dubai and UAE commercial printing.
 * Identifies legitimate topic coverage, content gaps, search intent discrepancies,
 * and formulates original white-hat recommendations for ONPRINT.
 */

class CompetitorGapService {
  /**
   * Analyze topical coverage and gaps against Dubai printing market leaders
   */
  async getGapAnalysis() {
    // Topic gap matrix in Dubai commercial printing
    const topicMatrix = [
      {
        topic: 'Executive Stationery & Luxury Business Cards',
        competitorFocus: 'Standard 350gsm matte cards with basic turnaround',
        onprintAdvantage: '350gsm–600gsm imported cotton stocks, painted edges, metallic gold foil stamping, and spot UV',
        gapStatus: 'STRONG_ADVANTAGE',
        actionableRecommendation: 'Emphasize European luxury paper stocks (Conqueror, Fedrigoni) to capture high-ticket DIFC and corporate clients.',
        targetKeywords: ['luxury business cards dubai', 'cotton business card printing uae', 'gold foil business cards dubai'],
      },
      {
        topic: 'Corporate Event & Exhibition Collateral',
        competitorFocus: 'Standard rollup banners and loose flyers',
        onprintAdvantage: 'Turnkey kits (retractable satin rollups + badges + lanyards + presentation folders)',
        gapStatus: 'EXPANSION_OPPORTUNITY',
        actionableRecommendation: 'Build dedicated DWTC / Expo City exhibition packages with guaranteed same-day booth delivery.',
        targetKeywords: ['exhibition printing dubai', 'dwtc rollup banners', 'corporate event badges dubai'],
      },
      {
        topic: 'Sustainable & Eco-Friendly Printing',
        competitorFocus: 'Rarely mentioned or vague green claims without material specs',
        onprintAdvantage: 'FSC-certified recycled art cards, soy-based vegetable CMYK inks, and biodegradable laminates',
        gapStatus: 'HIGH_OPPORTUNITY_GAP',
        actionableRecommendation: 'Publish a dedicated Sustainable Printing guide highlighting UAE Net Zero 2050 alignment and FSC paper options.',
        targetKeywords: ['eco friendly printing dubai', 'fsc certified printing uae', 'sustainable packaging dubai'],
      },
      {
        topic: 'Bespoke Luxury Retail Packaging',
        competitorFocus: 'High minimum order quantities (5,000+ units) with 2-week offshore manufacturing lead times',
        onprintAdvantage: 'Local Dubai factory production with low MOQs (from 100 units) and fast turnaround',
        gapStatus: 'HIGH_OPPORTUNITY_GAP',
        actionableRecommendation: 'Create dedicated landing pages for boutique shopping bags and magnetic gift boxes with low MOQ callouts.',
        targetKeywords: ['custom packaging boxes dubai', 'luxury shopping bag printing dubai', 'low moq retail packaging uae'],
      },
      {
        topic: 'Waterproof & Antimicrobial Hospitality Print',
        competitorFocus: 'Standard laminated paper menus prone to edge peeling and moisture damage',
        onprintAdvantage: 'Synthetic tear-proof waterproof polymer substrates with matte antimicrobial seal',
        gapStatus: 'STRONG_ADVANTAGE',
        actionableRecommendation: 'Target Dubai Marina, JBR, and Downtown luxury restaurants with waterproof menu sample kits.',
        targetKeywords: ['waterproof menu printing dubai', 'restaurant menu printing uae', 'durable dining menus dubai'],
      },
    ]

    // Content structure & SERP intent comparison
    const serpIntentAnalysis = [
      {
        intentType: 'Transactional (Urgent / Same-Day)',
        queryPattern: '"same day printing dubai", "urgent flyer printing al quoz"',
        serpRequirement: 'Clear price starting cues, 4-hour turnaround badge, WhatsApp instant quote button, and Google Maps location.',
        onprintStatus: 'Well-aligned on location and contact pages. Recommended to add prominent express turnaround badge on product headers.',
      },
      {
        intentType: 'Commercial Investigation (B2B Evaluation)',
        queryPattern: '"best commercial printing press in dubai", "corporate stationery packages uae"',
        serpRequirement: 'Client portfolio proofs, detailed material specifications (gsm, finishes), and transparent sample request workflow.',
        onprintStatus: 'Strong portfolio and clear specs. Recommended to add sample pack request callout on category pages.',
      },
      {
        intentType: 'Informational (Guides & Material Choices)',
        queryPattern: '"difference between 350gsm and 450gsm card", "foil stamping vs spot uv"',
        serpRequirement: 'High-quality comparative guides with real finish photos, tactile descriptions, and direct product links.',
        onprintStatus: 'Blog covers printing tips. Recommended to expand comparison articles to capture top-of-funnel searchers.',
      },
    ]

    // Summary scores
    const competitiveScore = 86 // ONPRINT competitive strength index
    const totalGapsIdentified = topicMatrix.filter((t) => t.gapStatus.includes('GAP') || t.gapStatus.includes('OPPORTUNITY')).length

    return {
      competitiveScore,
      totalGapsIdentified,
      marketNiche: 'Dubai & UAE Commercial & Corporate Printing',
      topicMatrix,
      serpIntentAnalysis,
      topActions: [
        {
          priority: 'CRITICAL',
          action: 'Launch Sustainable / FSC-Certified Printing Showcase to capture ESG corporate demand in Dubai.',
          expectedImpact: 'High organic visibility for high-ticket corporate accounts.',
        },
        {
          priority: 'HIGH',
          action: 'Create dedicated DWTC Exhibition Turnkey Package landing section.',
          expectedImpact: 'Capture seasonal surges during major Dubai trade exhibitions (GITEX, Arab Health, The Big 5).',
        },
      ],
    }
  }

  /**
   * Complete Head-to-Head Competitive Intelligence against DLXPrint (dlxprint.com)
   * Implements Phase 2 & Phase 27 of the Elite SEO System.
   */
  async getDlxprintCompetitorAnalysis() {
    const {
      DLXPRINT_PROFILE,
      ONPRINT_DIFFERENTIATION_MATRIX,
      DLXPRINT_COMPETITOR_GAPS,
    } = require('../data/dlxprintCompetitorData')

    const categoryCounts = {}
    let criticalCount = 0
    let highCount = 0

    DLXPRINT_COMPETITOR_GAPS.forEach((gap) => {
      categoryCounts[gap.category] = (categoryCounts[gap.category] || 0) + 1
      if (gap.priority === 'Critical') criticalCount++
      if (gap.priority === 'High') highCount++
    })

    const avgAdvantageScore = Math.round(
      ONPRINT_DIFFERENTIATION_MATRIX.reduce((acc, curr) => acc + curr.onprintAdvantageScore, 0) /
        ONPRINT_DIFFERENTIATION_MATRIX.length
    )

    return {
      profile: DLXPRINT_PROFILE,
      differentiationMatrix: ONPRINT_DIFFERENTIATION_MATRIX,
      gaps: DLXPRINT_COMPETITOR_GAPS,
      categoryCounts,
      summary: {
        totalGaps: DLXPRINT_COMPETITOR_GAPS.length,
        criticalGaps: criticalCount,
        highGaps: highCount,
        averageAdvantageScore: avgAdvantageScore,
        competitorDomain: 'dlxprint.com',
        competitorLocation: 'Al Qusais Industrial Area 1, Dubai',
        onprintLocation: 'Al Quoz Industrial Area 3, Dubai',
        keyDifferentiator: 'Direct proximity to DIFC/Downtown/Business Bay + In-House Luxury Rigid Packaging & 600gsm Cotton Craftsmanship',
      },
      topCompetitiveActions: [
        {
          priority: 'Critical',
          gap_id: 'gap-kw-1',
          title: 'Dominate Luxury Business Cards in DIFC & Downtown',
          action: 'Promote 450gsm velvet soft-touch and 600gsm painted edge cards with instant courier delivery to DIFC financial firms.',
          target_page: '/business-card-printing-dubai',
        },
        {
          priority: 'Critical',
          gap_id: 'gap-service-1',
          title: 'Launch DWTC Emergency Exhibitor Desk',
          action: 'Guarantee 4-hour direct-to-booth replacement prints and banner delivery for international exhibitors at Dubai World Trade Centre.',
          target_page: '/exhibition-stands-dubai',
        },
        {
          priority: 'High',
          gap_id: 'gap-local-1',
          title: 'Leverage Al Quoz Strategic Geographic Advantage',
          action: 'Emphasize 15-minute dispatch radius across Sheikh Zayed Road, Business Bay, JLT, and Dubai Marina vs. Al Qusais competitors.',
          target_page: '/same-day-printing-dubai',
        },
        {
          priority: 'High',
          gap_id: 'gap-geo-1',
          title: 'Solidify Generative Engine Optimization (GEO)',
          action: 'Maintain active /llms.txt and semantic schema so ChatGPT, Perplexity, and Google AI Overviews cite ONPRINT as Dubai’s premier press.',
          target_page: '/llms.txt',
        },
      ],
    }
  }

  /**
   * 10-Column DLXPrint Competitor Gap Matrix (Phase 2 Master Architecture)
   */
  async getCompetitorGaps() {
    const { pool } = require('../config/database')
    const { DLX_COMPETITOR_GAPS } = require('../data/dlxCompetitorGapData')
    try {
      const [rows] = await pool.query('SELECT * FROM seo_competitor_gaps ORDER BY FIELD(priority, "High", "Medium", "Low"), id ASC')
      if (rows && rows.length > 0) {
        return rows
      }
    } catch (err) {
      console.warn('[CompetitorGapService] MySQL query note:', err.message)
    }
    return DLX_COMPETITOR_GAPS
  }
}

module.exports = new CompetitorGapService()
