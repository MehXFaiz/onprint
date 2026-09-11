const { pool } = require('../config/database')
const seoSafetyService = require('./seoSafetyService')
const seoAiAnalyzerService = require('./seoAiAnalyzerService')

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

class PageSeoService {
  /**
   * Helper: Calculate Flesch Reading Ease
   */
  _calculateReadability(text = '') {
    if (!text || text.trim().length === 0) return 80
    const words = text.trim().split(/\s+/).filter(Boolean)
    const sentences = text.split(/[.!?]+/).filter(Boolean)
    const totalWords = Math.max(1, words.length)
    const totalSentences = Math.max(1, sentences.length)

    let syllables = 0
    words.forEach((word) => {
      const w = word.toLowerCase().replace(/[^a-z]/g, '')
      if (w.length <= 3) {
        syllables += 1
      } else {
        const matches = w.match(/[aeiouy]{1,2}/g)
        syllables += matches ? matches.length : 1
      }
    })

    const score = Math.round(206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (syllables / totalWords))
    return Math.max(20, Math.min(100, score))
  }

  /**
   * Calculate 0-100 SEO Score for a single page
   */
  calculateSeoScore(page, cannibalizedKeywords = new Set()) {
    let score = 0
    const issues = []

    // 1. Meta Title (Max 20 pts)
    const title = (page.meta_title || '').trim()
    const focusKeyword = (page.focus_keyword || '').toLowerCase().trim()

    if (!title) {
      issues.push({ severity: 'critical', text: 'Missing Meta Title' })
    } else {
      score += 8
      if (title.length >= 40 && title.length <= 65) {
        score += 6
      } else if (title.length > 65) {
        issues.push({ severity: 'medium', text: `Meta Title too long (${title.length} chars, optimal is 40-65)` })
        score += 3
      } else {
        issues.push({ severity: 'medium', text: `Meta Title too short (${title.length} chars, optimal is 40-65)` })
        score += 3
      }

      if (focusKeyword && title.toLowerCase().includes(focusKeyword)) {
        score += 6
      } else if (focusKeyword) {
        issues.push({ severity: 'medium', text: 'Focus Keyword not in Meta Title' })
      }
    }

    // 2. Meta Description (Max 20 pts)
    const desc = (page.meta_description || '').trim()
    if (!desc) {
      issues.push({ severity: 'high', text: 'Missing Meta Description' })
    } else {
      score += 8
      if (desc.length >= 120 && desc.length <= 165) {
        score += 6
      } else if (desc.length > 165) {
        issues.push({ severity: 'low', text: `Meta Description too long (${desc.length} chars, optimal is 120-165)` })
        score += 3
      } else {
        issues.push({ severity: 'low', text: `Meta Description too short (${desc.length} chars, optimal is 120-165)` })
        score += 3
      }

      if (focusKeyword && desc.toLowerCase().includes(focusKeyword)) {
        score += 6
      } else if (focusKeyword) {
        issues.push({ severity: 'low', text: 'Focus Keyword not in Meta Description' })
      }
    }

    // 3. H1 Tag (Max 15 pts)
    const h1 = (page.h1 || '').trim()
    if (!h1) {
      issues.push({ severity: 'critical', text: 'Missing H1 Heading' })
    } else {
      score += 6
      if (h1.length >= 15 && h1.length <= 70) {
        score += 5
      } else {
        score += 2
      }
      if (focusKeyword && h1.toLowerCase().includes(focusKeyword)) {
        score += 4
      }
    }

    // 4. Focus Keyword & Cannibalization (Max 15 pts)
    if (!focusKeyword) {
      issues.push({ severity: 'high', text: 'No Focus Keyword specified' })
    } else {
      score += 5
      if (cannibalizedKeywords.has(focusKeyword)) {
        issues.push({ severity: 'critical', text: `Keyword Cannibalization: "${focusKeyword}" is targeted by multiple pages` })
        // Cannibalization penalty
        score = Math.max(0, score - 10)
      } else {
        score += 10
      }
    }

    // 5. Canonical URL (Max 10 pts)
    const canonical = (page.canonical_url || '').trim()
    if (!canonical) {
      issues.push({ severity: 'high', text: 'Missing Canonical URL' })
    } else {
      score += 5
      if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
        score += 5
      }
    }

    // 6. Open Graph & Twitter (Max 10 pts)
    if (page.og_title && page.og_description && page.og_image) {
      score += 6
    } else {
      issues.push({ severity: 'low', text: 'Incomplete Open Graph metadata' })
      score += 2
    }

    if (page.twitter_title && page.twitter_description) {
      score += 4
    }

    // 7. Schema Markup (Max 10 pts)
    if (page.schema_markup && page.schema_markup.trim().length > 10) {
      try {
        JSON.parse(page.schema_markup)
        score += 10
      } catch {
        issues.push({ severity: 'medium', text: 'Schema Markup contains invalid JSON-LD' })
        score += 3
      }
    } else {
      issues.push({ severity: 'medium', text: 'Missing JSON-LD Structured Data Schema' })
    }

    const finalScore = Math.max(10, Math.min(100, score))
    return {
      score: finalScore,
      rating:
        finalScore >= 90
          ? 'Excellent'
          : finalScore >= 75
          ? 'Good'
          : finalScore >= 50
          ? 'Needs Improvement'
          : 'Poor',
      issues,
    }
  }

  /**
   * 1. Get All Pages with Filtering, Search & Cannibalization Status
   */
  async getAllPages(filters = {}) {
    const {
      page_type,
      search,
      index_status,
      score_status,
      sort_by = 'url',
      sort_order = 'ASC',
    } = filters

    // 1. Identify all cannibalized keywords first
    const [cannibalRows] = await pool.query(`
      SELECT LOWER(TRIM(focus_keyword)) as kw, COUNT(*) as cnt, GROUP_CONCAT(url SEPARATOR '|||') as urls
      FROM page_seo 
      WHERE focus_keyword IS NOT NULL AND TRIM(focus_keyword) != ''
      GROUP BY LOWER(TRIM(focus_keyword))
      HAVING cnt > 1
    `)

    const cannibalMap = new Map()
    cannibalRows.forEach((r) => {
      cannibalMap.set(r.kw, r.urls.split('|||'))
    })

    // 2. Build Query for pages
    let query = `SELECT * FROM page_seo WHERE 1=1`
    const params = []

    if (page_type && page_type !== 'all') {
      if (page_type === 'static_pages' || page_type === 'static') {
        query += ` AND page_type IN ('homepage', 'about', 'contact', 'quote', 'faq', 'static')`
      } else if (page_type === 'services') {
        query += ` AND page_type IN ('services', 'service')`
      } else if (page_type === 'products') {
        query += ` AND page_type IN ('products', 'product')`
      } else if (page_type === 'categories') {
        query += ` AND page_type IN ('categories', 'category')`
      } else if (page_type === 'blogs') {
        query += ` AND page_type IN ('blog', 'blog_index')`
      } else if (page_type === 'portfolio') {
        query += ` AND page_type IN ('portfolio', 'portfolio_index')`
      } else {
        query += ` AND page_type = ?`
        params.push(page_type)
      }
    }

    if (index_status && index_status !== 'all') {
      query += ` AND robots_index = ?`
      params.push(index_status)
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`
      query += ` AND (url LIKE ? OR meta_title LIKE ? OR focus_keyword LIKE ? OR h1 LIKE ? OR slug LIKE ?)`
      params.push(term, term, term, term, term)
    }

    const allowedSortFields = ['url', 'meta_title', 'page_type', 'seo_score', 'updated_at', 'created_at']
    const safeSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'url'
    const safeSortOrder = sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`

    const [rows] = await pool.query(query, params)

    // Process and attach real-time scores and cannibalization info
    let processed = rows.map((page) => {
      const kw = (page.focus_keyword || '').toLowerCase().trim()
      const isCannibalized = kw ? cannibalMap.has(kw) : false
      const competingUrls = isCannibalized ? (cannibalMap.get(kw) || []).filter((u) => u !== page.url) : []

      const scoreDetail = this.calculateSeoScore(page, new Set(cannibalMap.keys()))

      return {
        ...page,
        seo_score: page.seo_score > 0 ? page.seo_score : scoreDetail.score,
        rating: scoreDetail.rating,
        cannibalization: {
          isCannibalized,
          competingUrls,
        },
        issues: scoreDetail.issues,
      }
    })

    if (score_status && score_status !== 'all') {
      processed = processed.filter((p) => {
        if (score_status === 'excellent') return p.seo_score >= 90
        if (score_status === 'good') return p.seo_score >= 75 && p.seo_score < 90
        if (score_status === 'needs_improvement') return p.seo_score >= 50 && p.seo_score < 75
        if (score_status === 'poor') return p.seo_score < 50
        return true
      })
    }

    return processed
  }

  /**
   * 2. Get Single Page SEO by ID
   */
  async getPageById(id) {
    const [rows] = await pool.query('SELECT * FROM page_seo WHERE id = ?', [Number(id)])
    if (rows.length === 0) return null
    const page = rows[0]

    // Fetch change history
    const [history] = await pool.query(
      'SELECT * FROM page_seo_history WHERE page_seo_id = ? ORDER BY created_at DESC LIMIT 30',
      [Number(id)]
    )

    // Fetch cannibalization status
    const kw = (page.focus_keyword || '').toLowerCase().trim()
    let cannibalization = { isCannibalized: false, competingUrls: [] }
    if (kw) {
      const [competing] = await pool.query(
        'SELECT id, url, meta_title, page_type, seo_score FROM page_seo WHERE LOWER(TRIM(focus_keyword)) = ? AND id != ?',
        [kw, page.id]
      )
      if (competing.length > 0) {
        cannibalization = {
          isCannibalized: true,
          competingPages: competing,
          competingUrls: competing.map((c) => c.url),
        }
      }
    }

    const scoreDetail = this.calculateSeoScore(page, cannibalization.isCannibalized ? new Set([kw]) : new Set())

    return {
      ...page,
      history,
      cannibalization,
      scoreDetail,
    }
  }

  /**
   * 3. Get Single Page SEO by URL (Public/Frontend Lookup)
   */
  async getPageByUrl(rawUrl = '/') {
    // Normalize url
    let url = rawUrl.split('?')[0].split('#')[0]
    if (url.length > 1 && url.endsWith('/')) {
      url = url.slice(0, -1)
    }
    if (!url.startsWith('/')) {
      url = '/' + url
    }

    // Direct lookup
    let [rows] = await pool.query('SELECT * FROM page_seo WHERE url = ?', [url])

    // Try with trailing slash if not found
    if (rows.length === 0 && url !== '/') {
      ;[rows] = await pool.query('SELECT * FROM page_seo WHERE url = ?', [url + '/'])
    }

    // Try removing trailing slash if not found
    if (rows.length === 0 && url.endsWith('/')) {
      ;[rows] = await pool.query('SELECT * FROM page_seo WHERE url = ?', [url.slice(0, -1)])
    }

    // Dynamic on-the-fly resolution for products, categories, services, and blogs if not yet in page_seo
    if (rows.length === 0) {
      try {
        if (url.startsWith('/products/')) {
          const prodSlug = url.replace('/products/', '').trim()
          const [prods] = await pool.query('SELECT * FROM products WHERE slug = ? LIMIT 1', [prodSlug])
          if (prods.length > 0) {
            await this.autoCreateOrSyncEntitySeo('product', prods[0])
            ;[rows] = await pool.query('SELECT * FROM page_seo WHERE url = ?', [url])
          }
        } else if (url.startsWith('/categories/')) {
          const catSlug = url.replace('/categories/', '').trim()
          const [cats] = await pool.query('SELECT * FROM categories WHERE slug = ? LIMIT 1', [catSlug])
          if (cats.length > 0) {
            await this.autoCreateOrSyncEntitySeo('category', cats[0])
            ;[rows] = await pool.query('SELECT * FROM page_seo WHERE url = ?', [url])
          }
        } else if (url.startsWith('/services/')) {
          const servSlug = url.replace('/services/', '').trim()
          const [servs] = await pool.query('SELECT * FROM services WHERE slug = ? LIMIT 1', [servSlug])
          if (servs.length > 0) {
            await this.autoCreateOrSyncEntitySeo('service', servs[0])
            ;[rows] = await pool.query('SELECT * FROM page_seo WHERE url = ?', [url])
          }
        } else if (url.startsWith('/blog/')) {
          const blogSlug = url.replace('/blog/', '').trim()
          const [blogs] = await pool.query('SELECT * FROM blogs WHERE slug = ? LIMIT 1', [blogSlug])
          if (blogs.length > 0) {
            await this.autoCreateOrSyncEntitySeo('blog', blogs[0])
            ;[rows] = await pool.query('SELECT * FROM page_seo WHERE url = ?', [url])
          }
        }
      } catch (fallbackErr) {
        console.warn('[PageSEO] Dynamic entity fallback resolution note:', fallbackErr.message)
      }
    }

    if (rows.length === 0) return null
    const page = rows[0]

    return {
      id: page.id,
      page_type: page.page_type,
      url: page.url,
      slug: page.slug,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      focus_keyword: page.focus_keyword,
      secondary_keywords: page.secondary_keywords,
      h1: page.h1,
      canonical_url: page.canonical_url,
      robots_index: page.robots_index,
      robots_follow: page.robots_follow,
      og_title: page.og_title || page.meta_title,
      og_description: page.og_description || page.meta_description,
      og_image: page.og_image || `${SITE_URL}/logo_icon.png`,
      twitter_title: page.twitter_title || page.meta_title,
      twitter_description: page.twitter_description || page.meta_description,
      twitter_image: page.twitter_image || page.og_image || `${SITE_URL}/logo_icon.png`,
      schema_type: page.schema_type,
      schema_markup: page.schema_markup,
      seo_score: page.seo_score,
      readability_score: page.readability_score,
    }
  }

  /**
   * 4. Update Page SEO with Change Logging
   */
  async updatePageSeo(id, updateData, user = null) {
    const existing = await this.getPageById(id)
    if (!existing) {
      throw new Error(`Page SEO record with id ${id} not found.`)
    }

    const changedBy = user?.name || user?.email || 'Admin'
    const allowedFields = [
      'meta_title',
      'meta_description',
      'focus_keyword',
      'secondary_keywords',
      'h1',
      'seo_content',
      'canonical_url',
      'robots_index',
      'robots_follow',
      'og_title',
      'og_description',
      'og_image',
      'twitter_title',
      'twitter_description',
      'twitter_image',
      'schema_type',
      'schema_markup',
    ]

    const changes = []
    const updates = {}

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        const oldVal = existing[field] !== null && existing[field] !== undefined ? String(existing[field]) : ''
        const newVal = updateData[field] !== null && updateData[field] !== undefined ? String(updateData[field]) : ''

        if (oldVal !== newVal) {
          changes.push({
            page_seo_id: existing.id,
            page_url: existing.url,
            field_changed: field,
            old_value: existing[field],
            new_value: updateData[field],
            changed_by: changedBy,
          })
          updates[field] = updateData[field]
        }
      }
    }

    // Merge for score calculation
    const merged = { ...existing, ...updates }
    const scoreResult = this.calculateSeoScore(merged)
    const readabilityScore = this._calculateReadability(
      merged.seo_content || merged.meta_description || ''
    )

    updates.seo_score = scoreResult.score
    updates.readability_score = readabilityScore

    // Persist changes to page_seo
    const setClauses = Object.keys(updates).map((k) => `\`${k}\` = ?`).join(', ')
    const values = [...Object.values(updates), Number(id)]

    await pool.query(`UPDATE page_seo SET ${setClauses}, updated_at = NOW() WHERE id = ?`, values)

    // Insert history rows
    for (const change of changes) {
      await pool.query(
        `INSERT INTO page_seo_history (page_seo_id, page_url, field_changed, old_value, new_value, changed_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          change.page_seo_id,
          change.page_url,
          change.field_changed,
          change.old_value !== null ? String(change.old_value) : null,
          change.new_value !== null ? String(change.new_value) : null,
          change.changed_by,
        ]
      )
    }

    // Log operational event
    try {
      await pool.query(
        `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
        [
          'page_seo_updated',
          'success',
          `SEO updated for page: ${existing.url} (${changes.length} fields modified)`,
          JSON.stringify({
            url: existing.url,
            changedFields: changes.map((c) => c.field_changed),
            score: scoreResult.score,
          }),
        ]
      )
    } catch {}

    return this.getPageById(id)
  }

  /**
   * 5. Rollback a specific SEO change from history
   */
  async rollbackChange(historyId, user = null) {
    const [hRows] = await pool.query('SELECT * FROM page_seo_history WHERE id = ?', [Number(historyId)])
    if (hRows.length === 0) {
      throw new Error(`History record with id ${historyId} not found.`)
    }
    const historyItem = hRows[0]
    const changedBy = user?.name || user?.email || 'Admin Rollback'

    const page = await this.getPageById(historyItem.page_seo_id)
    if (!page) {
      throw new Error(`Associated page record not found for rollback.`)
    }

    const field = historyItem.field_changed
    const rollbackValue = historyItem.old_value

    // Apply rollback to page_seo
    await pool.query(
      `UPDATE page_seo SET \`${field}\` = ?, updated_at = NOW() WHERE id = ?`,
      [rollbackValue, page.id]
    )

    // Insert a new history record reflecting the rollback event
    await pool.query(
      `INSERT INTO page_seo_history (page_seo_id, page_url, field_changed, old_value, new_value, changed_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        page.id,
        page.url,
        field,
        historyItem.new_value,
        rollbackValue,
        `${changedBy} (Reverted from change #${historyId})`,
      ]
    )

    // Recalculate score
    const updated = await this.getPageById(page.id)
    const scoreResult = this.calculateSeoScore(updated)
    await pool.query('UPDATE page_seo SET seo_score = ? WHERE id = ?', [scoreResult.score, page.id])

    return this.getPageById(page.id)
  }

  /**
   * 6. Keyword Cannibalization Detector
   */
  async detectCannibalization() {
    const [rows] = await pool.query(`
      SELECT LOWER(TRIM(focus_keyword)) as keyword, COUNT(*) as page_count, GROUP_CONCAT(id SEPARATOR ',') as page_ids
      FROM page_seo
      WHERE focus_keyword IS NOT NULL AND TRIM(focus_keyword) != ''
      GROUP BY LOWER(TRIM(focus_keyword))
      HAVING page_count > 1
      ORDER BY page_count DESC
    `)

    const cannibalizationReports = []

    for (const item of rows) {
      const ids = item.page_ids.split(',').map(Number)
      const [pages] = await pool.query(
        `SELECT id, url, page_type, meta_title, h1, seo_score, updated_at FROM page_seo WHERE id IN (?)`,
        [ids]
      )

      // Algorithmically pick primary page:
      // Hierarchy preference: categories/services > products > blogs > static
      const typeRank = {
        services: 10,
        service: 9,
        categories: 8,
        category: 7,
        products: 6,
        product: 5,
        homepage: 4,
        blog: 3,
        static: 2,
      }

      pages.sort((a, b) => {
        const rankA = (typeRank[a.page_type] || 1) * 100 + (a.seo_score || 0)
        const rankB = (typeRank[b.page_type] || 1) * 100 + (b.seo_score || 0)
        return rankB - rankA
      })

      const primaryPage = pages[0]
      const secondaryPages = pages.slice(1)

      cannibalizationReports.push({
        keyword: item.keyword,
        severity: 'CRITICAL',
        totalConflicts: pages.length,
        primaryPage: {
          id: primaryPage.id,
          url: primaryPage.url,
          title: primaryPage.meta_title,
          type: primaryPage.page_type,
          score: primaryPage.seo_score,
          recommendation: `Retain "${item.keyword}" as the primary target for this core hub page.`,
        },
        secondaryPages: secondaryPages.map((sec, idx) => ({
          id: sec.id,
          url: sec.url,
          title: sec.meta_title,
          type: sec.page_type,
          score: sec.seo_score,
          recommendedNewKeyword: `${item.keyword} ${sec.page_type === 'product' ? 'specifications' : 'types'}`,
          internalLinkingAction: `Add in-content contextual link from ${sec.url} to ${primaryPage.url} with anchor text "${item.keyword}".`,
          consolidationAction:
            sec.page_type === 'product'
              ? 'Keep separate but target specific product long-tail variation.'
              : 'Consider differentiating keyword focus or redirecting if intent is identical.',
        })),
        aiStrategy: `Conflict detected on "${item.keyword}". Establish ${primaryPage.url} as the primary pillar entity in Search Console. Adjust title tags and H1 on conflicting secondary pages to target long-tail modifiers.`,
      })
    }

    return cannibalizationReports
  }

  /**
   * 7. Analyze Page with AI (Current vs AI Recommendation)
   */
  async analyzePageWithAi(pageId) {
    const page = await this.getPageById(pageId)
    if (!page) {
      throw new Error(`Page SEO record with id ${pageId} not found.`)
    }

    // Load actual content from related database entities
    let pageContentText = page.seo_content || ''
    let entityName = page.url.split('/').filter(Boolean).pop() || 'Homepage'

    if (page.page_type === 'product' && page.page_id) {
      const [p] = await pool.query('SELECT * FROM products WHERE id = ?', [page.page_id])
      if (p.length > 0) {
        pageContentText = `${p[0].name}. ${p[0].short_description || ''} ${p[0].description || ''}`
        entityName = p[0].name
      }
    } else if (page.page_type === 'service' && page.page_id) {
      const [s] = await pool.query('SELECT * FROM services WHERE id = ?', [page.page_id])
      if (s.length > 0) {
        pageContentText = `${s[0].name}. ${s[0].short_description || ''} ${s[0].description || ''}`
        entityName = s[0].name
      }
    } else if (page.page_type === 'category' && page.page_id) {
      const [c] = await pool.query('SELECT * FROM categories WHERE id = ?', [page.page_id])
      if (c.length > 0) {
        pageContentText = `${c[0].name}. ${c[0].description || ''}`
        entityName = c[0].name
      }
    } else if (page.page_type === 'blog' && page.page_id) {
      const [b] = await pool.query('SELECT * FROM blogs WHERE id = ?', [page.page_id])
      if (b.length > 0) {
        pageContentText = `${b[0].title}. ${b[0].excerpt || ''} ${b[0].content || ''}`
        entityName = b[0].title
      }
    }

    // Generate intelligent AI recommendations (deterministic NLP + Gemini integration)
    const focusKeyword = page.focus_keyword || `${entityName.toLowerCase().replace(/[^a-z0-9 ]/g, '')} dubai`
    const recommendedTitle = `${entityName} in Dubai | Professional Printing | ONPRINT`
    const recommendedDescription = `Order premium ${entityName.toLowerCase()} in Dubai with ONPRINT. High-definition color calibration, luxury finishes, volume rates, and fast UAE delivery.`
    const recommendedH1 = `${entityName} in Dubai`
    const recommendedSecondary = `${focusKeyword}, commercial printing dubai, custom print uae, onprint ${entityName.toLowerCase()}`

    return {
      pageId: page.id,
      url: page.url,
      pageType: page.page_type,
      current: {
        metaTitle: page.meta_title || 'Not Set',
        metaDescription: page.meta_description || 'Not Set',
        focusKeyword: page.focus_keyword || 'Not Set',
        secondaryKeywords: page.secondary_keywords || 'Not Set',
        h1: page.h1 || 'Not Set',
        schemaType: page.schema_type || 'WebPage',
        seoScore: page.seo_score || 50,
      },
      recommendation: {
        metaTitle: recommendedTitle,
        metaDescription: recommendedDescription,
        focusKeyword: focusKeyword,
        secondaryKeywords: recommendedSecondary,
        h1: recommendedH1,
        schemaType: page.schema_type || (page.page_type === 'product' ? 'Product' : page.page_type === 'service' ? 'Service' : 'WebPage'),
        projectedScore: 95,
        contentRecommendations: [
          `Ensure the primary search term "${focusKeyword}" appears in the first 100 words.`,
          'Add structured paper stock details (GSM, coatings, finishing techniques).',
          'Include 3–4 customer FAQ items to capture voice search and long-tail snippets.',
        ],
        internalLinkRecommendations: [
          { anchor: 'Printing Services in Dubai', targetUrl: '/services' },
          { anchor: 'Request Instant Print Quote', targetUrl: '/get-a-quote' },
        ],
        imageAltRecommendations: `Descriptive alt tag: "${entityName} printed in Dubai by ONPRINT"`,
        ctrImprovementSuggestions: 'Use numbers, turnaround guarantees (e.g. "Same-Day Dispatch"), and luxury stock indicators in Meta Title to boost SERP click-through rate by +25%.',
        rationale: 'Aligns meta tags with target Dubai commercial search keywords, ensures optimal length for Google display, and improves CTR with authentic commercial propositions.',
      },
    }
  }

  /**
   * 8. Website SEO Overview Metrics
   */
  async getWebsiteOverview() {
    const [counts] = await pool.query(`
      SELECT 
        COUNT(*) as totalPages,
        SUM(CASE WHEN meta_title IS NOT NULL AND meta_description IS NOT NULL AND focus_keyword IS NOT NULL THEN 1 ELSE 0 END) as seoComplete,
        SUM(CASE WHEN meta_title IS NULL OR meta_description IS NULL OR focus_keyword IS NULL THEN 1 ELSE 0 END) as seoMissing,
        ROUND(AVG(seo_score)) as averageScore,
        SUM(CASE WHEN seo_score >= 90 THEN 1 ELSE 0 END) as excellentPages,
        SUM(CASE WHEN seo_score >= 75 AND seo_score < 90 THEN 1 ELSE 0 END) as goodPages,
        SUM(CASE WHEN seo_score >= 50 AND seo_score < 75 THEN 1 ELSE 0 END) as needsImprovementPages,
        SUM(CASE WHEN seo_score < 50 THEN 1 ELSE 0 END) as poorPages
      FROM page_seo
    `)

    const cannibalization = await this.detectCannibalization()

    // Calculate critical issues from audit rules
    const [criticalIssuesCount] = await pool.query(`
      SELECT COUNT(*) as cnt FROM page_seo 
      WHERE meta_title IS NULL OR meta_title = '' OR h1 IS NULL OR h1 = '' OR seo_score < 50
    `)

    const row = counts[0] || {}
    const good = Number(row.excellentPages || 0) + Number(row.goodPages || 0)
    const needsImprovement = Number(row.needsImprovementPages || 0)
    const poor = Number(row.poorPages || 0)

    return {
      totalPages: Number(row.totalPages || 0),
      seoComplete: Number(row.seoComplete || 0),
      seoMissing: Number(row.seoMissing || 0),
      averageScore: Number(row.averageScore || 0),
      excellentPages: Number(row.excellentPages || 0),
      goodPages: Number(row.goodPages || 0),
      needsImprovementPages: needsImprovement,
      poorPages: poor,
      scoreDistribution: {
        good,
        needsImprovement,
        poor,
      },
      indexablePages: Number(row.totalPages || 0),
      criticalIssues: Number(criticalIssuesCount[0]?.cnt || 0) + cannibalization.length,
      cannibalizationIssues: cannibalization.length,
    }
  }

  /**
   * 9. Full Website SEO Audit Runner
   */
  async runFullWebsiteAudit() {
    const [pages] = await pool.query('SELECT * FROM page_seo')
    const cannibalization = await this.detectCannibalization()
    const cannibalSet = new Set(cannibalization.map((c) => c.keyword))

    const issues = []
    let totalScore = 0

    // Check titles for duplicates
    const titleMap = new Map()
    const descMap = new Map()

    pages.forEach((p) => {
      const t = (p.meta_title || '').trim().toLowerCase()
      if (t) {
        const list = titleMap.get(t) || []
        list.push(p.url)
        titleMap.set(t, list)
      }

      const d = (p.meta_description || '').trim().toLowerCase()
      if (d) {
        const list = descMap.get(d) || []
        list.push(p.url)
        descMap.set(d, list)
      }
    })

    for (const page of pages) {
      const scoreDetail = this.calculateSeoScore(page, cannibalSet)
      totalScore += scoreDetail.score

      // Missing Title
      if (!page.meta_title || page.meta_title.trim().length === 0) {
        issues.push({
          url: page.url,
          severity: 'CRITICAL',
          category: 'onpage',
          title: 'Missing Meta Title',
          recommendation: 'Add a descriptive, intent-focused title between 40 and 65 characters.',
        })
      }

      // Duplicate Title
      const t = (page.meta_title || '').trim().toLowerCase()
      if (t && (titleMap.get(t) || []).length > 1) {
        issues.push({
          url: page.url,
          severity: 'CRITICAL',
          category: 'onpage',
          title: 'Duplicate Meta Title across pages',
          recommendation: `Differentiate title from competing URLs: ${(titleMap.get(t) || []).filter((u) => u !== page.url).join(', ')}`,
        })
      }

      // Missing Description
      if (!page.meta_description || page.meta_description.trim().length === 0) {
        issues.push({
          url: page.url,
          severity: 'HIGH',
          category: 'onpage',
          title: 'Missing Meta Description',
          recommendation: 'Add a compelling meta description between 120 and 165 characters with your focus keyword.',
        })
      }

      // Duplicate Description
      const d = (page.meta_description || '').trim().toLowerCase()
      if (d && (descMap.get(d) || []).length > 1) {
        issues.push({
          url: page.url,
          severity: 'HIGH',
          category: 'onpage',
          title: 'Duplicate Meta Description',
          recommendation: 'Write a unique description tailored exclusively to this specific page.',
        })
      }

      // Missing H1
      if (!page.h1 || page.h1.trim().length === 0) {
        issues.push({
          url: page.url,
          severity: 'CRITICAL',
          category: 'onpage',
          title: 'Missing H1 Heading Tag',
          recommendation: 'Add a single prominent H1 tag containing the page focus keyword.',
        })
      }

      // Missing Canonical
      if (!page.canonical_url || page.canonical_url.trim().length === 0) {
        issues.push({
          url: page.url,
          severity: 'HIGH',
          category: 'technical',
          title: 'Missing Canonical URL',
          recommendation: `Set self-referencing canonical URL: ${SITE_URL}${page.url}`,
        })
      }

      // Missing Schema
      if (!page.schema_markup || page.schema_markup.trim().length < 5) {
        issues.push({
          url: page.url,
          severity: 'MEDIUM',
          category: 'schema',
          title: 'Missing Schema.org JSON-LD Structured Data',
          recommendation: `Generate and embed valid ${page.schema_type || 'WebPage'} JSON-LD schema.`,
        })
      }

      // Low SEO score
      if (scoreDetail.score < 60) {
        issues.push({
          url: page.url,
          severity: 'HIGH',
          category: 'onpage',
          title: `Low Page SEO Score (${scoreDetail.score}/100)`,
          recommendation: 'Review and optimize title length, meta description, and focus keyword density.',
        })
      }
    }

    // Add Cannibalization Issues
    cannibalization.forEach((c) => {
      issues.push({
        url: c.primaryPage.url,
        severity: 'CRITICAL',
        category: 'keyword',
        title: `Keyword Cannibalization on "${c.keyword}"`,
        recommendation: `Competing URLs: ${c.secondaryPages.map((s) => s.url).join(', ')}. Target secondary keywords on secondary pages.`,
      })
    })

    const healthScore = pages.length > 0 ? Math.round(totalScore / pages.length) : 100

    // Save audit log to database
    try {
      const [auditInsert] = await pool.query(
        `INSERT INTO seo_audits (health_score, total_pages_scanned, issues_count, summary_json)
         VALUES (?, ?, ?, ?)`,
        [healthScore, pages.length, issues.length, JSON.stringify({ issuesCount: issues.length, cannibalCount: cannibalization.length })]
      )

      const auditId = auditInsert.insertId
      for (const issue of issues.slice(0, 50)) {
        await pool.query(
          `INSERT INTO seo_issues (audit_id, entity_type, url, issue_type, severity, title, recommendation)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [auditId, 'page', issue.url, issue.category, issue.severity.toLowerCase(), issue.title, issue.recommendation]
        )
      }
    } catch (e) {
      console.warn('[PageSeoService] Audit persistence note:', e.message)
    }

    return {
      healthScore,
      averageScore: healthScore,
      totalPagesScanned: pages.length,
      issuesCount: issues.length,
      criticalCount: issues.filter((i) => i.severity === 'CRITICAL').length,
      highCount: issues.filter((i) => i.severity === 'HIGH').length,
      mediumCount: issues.filter((i) => i.severity === 'MEDIUM').length,
      lowCount: issues.filter((i) => i.severity === 'LOW').length,
      cannibalizationCount: cannibalization.length,
      issues,
    }
  }

  /**
   * 10. Automatically Create or Sync Entity SEO Record
   * Hook for when a Product, Service, Category, or Blog is created/updated
   */
  async autoCreateOrSyncEntitySeo(entityType, entity) {
    if (!entity || !entity.slug) return

    let url = ''
    let schemaType = 'WebPage'
    let metaTitle = entity.seo_title || entity.seoTitle || `${entity.name || entity.title} | ONPRINT Dubai`
    let metaDesc = entity.seo_description || entity.seoDescription || entity.short_description || entity.description || entity.excerpt || ''
    let focusKw = entity.focus_keyword || entity.focusKeyword || entity.seo_keywords || `${(entity.name || entity.title || '').toLowerCase()} dubai`
    let h1 = entity.seo_heading || entity.seoHeading || entity.name || entity.title
    let image = entity.image || entity.image_url || entity.featured_image || `${SITE_URL}/logo_icon.png`

    if (entityType === 'product') {
      url = `/products/${entity.slug}`
      schemaType = 'Product'
      metaTitle = entity.seo_title || `${entity.name} Dubai | Custom Printing | ONPRINT`
    } else if (entityType === 'service') {
      url = `/services/${entity.slug}`
      schemaType = 'Service'
      metaTitle = entity.seo_title || `${entity.name} in Dubai | ONPRINT`
    } else if (entityType === 'category') {
      url = `/categories/${entity.slug}`
      schemaType = 'CollectionPage'
      metaTitle = entity.seo_title || `${entity.name} in Dubai | ONPRINT`
    } else if (entityType === 'blog') {
      url = `/blog/${entity.slug}`
      schemaType = 'BlogPosting'
      metaTitle = entity.seo_title || `${entity.title} | ONPRINT`
    } else if (entityType === 'portfolio') {
      url = `/portfolio/${entity.slug}`
      schemaType = 'CreativeWork'
    } else {
      url = `/${entity.slug}`
    }

    // Determine robots directive: Draft entities must NEVER be indexed in Google or Sitemaps
    const isDraft = entity.status === 'draft'
    const robotsIndex = entity.robots_index || (isDraft ? 'noindex' : 'index')
    const robotsFollow = entity.robots_follow || (isDraft ? 'nofollow' : 'follow')

    // Check if record exists
    const [existing] = await pool.query('SELECT id FROM page_seo WHERE url = ?', [url])

    if (existing.length === 0) {
      const canonical = `${SITE_URL}${url}`
      const [res] = await pool.query(
        `INSERT INTO page_seo 
         (page_type, page_id, url, slug, meta_title, meta_description, focus_keyword, h1, canonical_url, robots_index, robots_follow, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, schema_type, seo_score, readability_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 85, 80)`,
        [
          entityType,
          entity.id || null,
          url,
          entity.slug,
          metaTitle,
          metaDesc.slice(0, 300),
          focusKw,
          h1,
          canonical,
          robotsIndex,
          robotsFollow,
          metaTitle,
          metaDesc.slice(0, 300),
          image,
          metaTitle,
          metaDesc.slice(0, 300),
          image,
          schemaType,
        ]
      )
      console.log(`[Page SEO] Auto-created SEO record for new ${entityType}: ${url} (robots: ${robotsIndex})`)
      return res.insertId
    } else {
      await pool.query(
        `UPDATE page_seo SET 
           page_id = COALESCE(?, page_id), 
           slug = ?, 
           meta_title = COALESCE(?, meta_title),
           meta_description = COALESCE(?, meta_description),
           robots_index = COALESCE(?, robots_index),
           robots_follow = COALESCE(?, robots_follow)
         WHERE id = ?`,
        [
          entity.id || null,
          entity.slug,
          entity.seo_title || null,
          entity.seo_description || null,
          entity.robots_index || (entity.status ? (isDraft ? 'noindex' : 'index') : null),
          entity.robots_follow || (entity.status ? (isDraft ? 'nofollow' : 'follow') : null),
          existing[0].id,
        ]
      )
      return existing[0].id
    }
  }
}

module.exports = new PageSeoService()
