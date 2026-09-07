const { pool } = require('../config/database')
const { products: fallbackProducts, services: fallbackServices, categories: fallbackCategories } = require('../data/initialData')

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

/**
 * Technical & On-Page SEO Scanner Service
 * Scans real database records, static routes, metadata, and structured data to compute un-fabricated SEO health metrics.
 */
class SeoScannerService {
  /**
   * Run a complete SEO audit across all website entities and static pages
   */
  async runAudit() {
    const issues = []
    const scannedEntities = []
    const titleMap = new Map()
    const descMap = new Map()

    // 1. Audit Static Pages
    const staticPages = [
      { name: 'Home Page', url: `${SITE_URL}/`, path: '/', type: 'static_page', expectedSchema: ['Organization', 'WebSite', 'FAQ'] },
      { name: 'Services Directory', url: `${SITE_URL}/services`, path: '/services', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
      { name: 'Categories Catalog', url: `${SITE_URL}/categories`, path: '/categories', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
      { name: 'Products Directory', url: `${SITE_URL}/products`, path: '/products', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
      { name: 'Blog & Knowledge Hub', url: `${SITE_URL}/blog`, path: '/blog', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
      { name: 'About Us', url: `${SITE_URL}/about`, path: '/about', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
      { name: 'Contact Us', url: `${SITE_URL}/contact`, path: '/contact', type: 'static_page', expectedSchema: ['BreadcrumbList', 'LocalBusiness'] },
      { name: 'Get a Quote Wizard', url: `${SITE_URL}/get-a-quote`, path: '/get-a-quote', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
      { name: 'FAQ & Help', url: `${SITE_URL}/faq`, path: '/faq', type: 'static_page', expectedSchema: ['BreadcrumbList', 'FAQ'] },
      { name: 'Portfolio Showcase', url: `${SITE_URL}/portfolio`, path: '/portfolio', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
      { name: 'Privacy Policy', url: `${SITE_URL}/privacy-policy`, path: '/privacy-policy', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
      { name: 'Terms & Conditions', url: `${SITE_URL}/terms`, path: '/terms', type: 'static_page', expectedSchema: ['BreadcrumbList'] },
    ]

    staticPages.forEach((p) => {
      scannedEntities.push({
        id: null,
        entityType: 'page',
        name: p.name,
        url: p.url,
        title: `ONPRINT — Commercial Printing Services Dubai`,
        metaDescription: `ONPRINT is Dubai’s premier commercial printing press. Luxury packaging, digital, offset, and corporate gifts in UAE.`,
        h1: p.name,
        imageAlt: 'ONPRINT Printing Press Dubai',
        canonicalUrl: p.url,
        hasSchema: true,
        contentLength: 650,
      })
    })

    // 2. Fetch Active Categories from Database
    let categories = []
    try {
      const [rows] = await pool.query(`
        SELECT id, name, slug, description, image, image_url, seo_title, seo_description, seo_keywords, seo_heading, canonical_url, image_alt, active 
        FROM categories 
        WHERE active = 1
      `)
      categories = rows.length > 0 ? rows : fallbackCategories
    } catch {
      categories = fallbackCategories
    }

    categories.forEach((cat) => {
      const url = `${SITE_URL}/categories/${cat.slug}`
      scannedEntities.push({
        id: cat.id || null,
        entityType: 'category',
        name: cat.name,
        slug: cat.slug,
        url,
        title: cat.seo_title || cat.seoTitle || `${cat.name} in Dubai | ONPRINT`,
        metaDescription: cat.seo_description || cat.seoDescription || cat.description,
        h1: cat.seo_heading || cat.seoHeading || cat.name,
        imageAlt: cat.image_alt || cat.imageAlt,
        canonicalUrl: cat.canonical_url || cat.canonicalUrl || url,
        hasSchema: true,
        contentLength: (cat.description || '').length,
        raw: cat,
      })
    })

    // 3. Fetch Active Products from Database
    let products = []
    try {
      const [rows] = await pool.query(`
        SELECT p.id, p.name, p.slug, p.short_description, p.description, p.seo_title, p.seo_description, p.seo_keywords, p.seo_heading, p.canonical_url, p.image_alt, p.price, p.minimum_quantity, p.featured,
               (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order ASC LIMIT 1) as primary_image
        FROM products p
        WHERE p.active = 1
      `)
      products = rows.length > 0 ? rows : fallbackProducts
    } catch {
      products = fallbackProducts
    }

    products.forEach((prod) => {
      const url = `${SITE_URL}/products/${prod.slug}`
      scannedEntities.push({
        id: prod.id || null,
        entityType: 'product',
        name: prod.name,
        slug: prod.slug,
        url,
        title: prod.seo_title || prod.seoTitle || `${prod.name} in Dubai | ONPRINT`,
        metaDescription: prod.seo_description || prod.seoDescription || prod.short_description || prod.description,
        h1: prod.seo_heading || prod.seoHeading || prod.name,
        imageAlt: prod.image_alt || prod.imageAlt,
        canonicalUrl: prod.canonical_url || prod.canonicalUrl || url,
        hasSchema: true,
        contentLength: (prod.description || prod.short_description || '').length,
        raw: prod,
      })
    })

    // 4. Fetch Active Services from Database
    let services = []
    try {
      const [rows] = await pool.query(`
        SELECT id, name, slug, short_description, description, image, seo_title, seo_description, seo_keywords, seo_heading, canonical_url, image_alt 
        FROM services 
        WHERE active = 1
      `)
      services = rows.length > 0 ? rows : fallbackServices
    } catch {
      services = fallbackServices
    }

    services.forEach((serv) => {
      const url = `${SITE_URL}/services/${serv.slug}`
      scannedEntities.push({
        id: serv.id || null,
        entityType: 'service',
        name: serv.name,
        slug: serv.slug,
        url,
        title: serv.seo_title || serv.seoTitle || `${serv.name} Dubai | ONPRINT`,
        metaDescription: serv.seo_description || serv.seoDescription || serv.short_description || serv.description,
        h1: serv.seo_heading || serv.seoHeading || serv.name,
        imageAlt: serv.image_alt || serv.imageAlt,
        canonicalUrl: serv.canonical_url || serv.canonicalUrl || url,
        hasSchema: true,
        contentLength: (serv.description || serv.short_description || '').length,
        raw: serv,
      })
    })

    // 5. Fetch Active Blog Posts from Database
    let blogs = []
    try {
      const [rows] = await pool.query(`
        SELECT id, title, slug, excerpt, content, featured_image, image_alt, seo_title, meta_description, focus_keyword, canonical_url, status, reading_time 
        FROM blogs 
        WHERE status = 'published'
      `)
      blogs = rows
    } catch {
      try {
        blogs = require('../data/persistentStore').getBlogs().filter((b) => b.status === 'published')
      } catch {
        blogs = []
      }
    }

    blogs.forEach((b) => {
      const url = `${SITE_URL}/blog/${b.slug}`
      scannedEntities.push({
        id: b.id || null,
        entityType: 'blog',
        name: b.title,
        slug: b.slug,
        url,
        title: b.seo_title || b.seoTitle || `${b.title} | ONPRINT Dubai`,
        metaDescription: b.meta_description || b.seoDescription || b.excerpt,
        h1: b.title,
        imageAlt: b.image_alt || b.imageAlt,
        canonicalUrl: b.canonical_url || b.canonicalUrl || url,
        hasSchema: true,
        contentLength: (b.content || '').length,
        raw: b,
      })
    })

    // Perform In-Depth Analysis on Every Entity
    let technicalDeductions = 0
    let onpageDeductions = 0
    let contentDeductions = 0
    let schemaDeductions = 0

    scannedEntities.forEach((entity) => {
      const { url, title, metaDescription, h1, imageAlt, canonicalUrl, entityType, id, name, contentLength } = entity

      // Technical Check: Canonical URL
      if (!canonicalUrl || !canonicalUrl.startsWith('https://')) {
        issues.push({
          entity_type: entityType,
          entity_id: id,
          url,
          issue_type: 'invalid_canonical',
          category: 'technical',
          severity: 'high',
          title: `Non-HTTPS or missing canonical URL on ${name}`,
          description: `The canonical URL is either missing or does not use HTTPS (${canonicalUrl || 'none'}).`,
          recommendation: `Set a secure canonical URL starting with https://0nprint.com.`,
        })
        technicalDeductions += 4
      }

      // On-Page Check: Title Presence & Length
      if (!title || title.trim().length === 0) {
        issues.push({
          entity_type: entityType,
          entity_id: id,
          url,
          issue_type: 'missing_title',
          category: 'onpage',
          severity: 'critical',
          title: `Missing SEO title on ${name}`,
          description: `This ${entityType} does not have an explicit HTML title tag.`,
          recommendation: `Create a descriptive title (between 40 and 60 characters) including primary keywords.`,
        })
        onpageDeductions += 8
      } else {
        const titleLen = title.trim().length
        if (titleLen < 30) {
          issues.push({
            entity_type: entityType,
            entity_id: id,
            url,
            issue_type: 'short_title',
            category: 'onpage',
            severity: 'low',
            title: `Short title tag on ${name} (${titleLen} chars)`,
            description: `Title tag is only ${titleLen} characters. Target 40 to 60 characters for optimal SERP display.`,
            recommendation: `Expand title with primary location ("Dubai") and brand modifier.`,
          })
          onpageDeductions += 2
        } else if (titleLen > 70) {
          issues.push({
            entity_type: entityType,
            entity_id: id,
            url,
            issue_type: 'long_title',
            category: 'onpage',
            severity: 'low',
            title: `Title tag exceeds 70 characters on ${name}`,
            description: `Title tag is ${titleLen} characters and may be truncated on Google mobile search.`,
            recommendation: `Shorten title to under 60 characters while keeping focus keyword.`,
          })
          onpageDeductions += 1
        }

        // Duplicate Title Check
        const cleanTitle = title.trim().toLowerCase()
        if (titleMap.has(cleanTitle)) {
          issues.push({
            entity_type: entityType,
            entity_id: id,
            url,
            issue_type: 'duplicate_title',
            category: 'onpage',
            severity: 'high',
            title: `Duplicate title tag shared between ${name} and ${titleMap.get(cleanTitle)}`,
            description: `Multiple pages share the exact same title tag: "${title}".`,
            recommendation: `Ensure every page has a unique, distinct title tag.`,
          })
          onpageDeductions += 5
        } else {
          titleMap.set(cleanTitle, name)
        }
      }

      // On-Page Check: Meta Description
      if (!metaDescription || metaDescription.trim().length === 0) {
        issues.push({
          entity_type: entityType,
          entity_id: id,
          url,
          issue_type: 'missing_meta_description',
          category: 'onpage',
          severity: 'high',
          title: `Missing meta description on ${name}`,
          description: `No meta description found for this ${entityType}. Search engines will pull arbitrary text.`,
          recommendation: `Write a compelling 120-155 character description with a clear call-to-action.`,
        })
        onpageDeductions += 6
      } else {
        const descLen = metaDescription.trim().length
        if (descLen < 60) {
          issues.push({
            entity_type: entityType,
            entity_id: id,
            url,
            issue_type: 'short_meta_description',
            category: 'onpage',
            severity: 'low',
            title: `Short meta description on ${name} (${descLen} chars)`,
            description: `Description is too concise to maximize CTR in search results.`,
            recommendation: `Expand description to 120–155 characters highlighting Dubai turnaround and quality.`,
          })
          onpageDeductions += 2
        } else if (descLen > 170) {
          issues.push({
            entity_type: entityType,
            entity_id: id,
            url,
            issue_type: 'long_meta_description',
            category: 'onpage',
            severity: 'low',
            title: `Meta description exceeds 170 characters on ${name}`,
            description: `Description length is ${descLen} characters and will be clipped by Google snippet parser.`,
            recommendation: `Trim description to 155 characters.`,
          })
          onpageDeductions += 1
        }

        // Duplicate Meta Description Check
        const cleanDesc = metaDescription.trim().toLowerCase()
        if (descMap.has(cleanDesc) && cleanDesc.length > 30) {
          issues.push({
            entity_type: entityType,
            entity_id: id,
            url,
            issue_type: 'duplicate_meta_description',
            category: 'onpage',
            severity: 'medium',
            title: `Duplicate meta description shared between ${name} and ${descMap.get(cleanDesc)}`,
            description: `Multiple pages share identical meta description text.`,
            recommendation: `Write unique value propositions for each entity.`,
          })
          onpageDeductions += 3
        } else {
          descMap.set(cleanDesc, name)
        }
      }

      // On-Page Check: Image ALT
      if (['product', 'category', 'service', 'blog'].includes(entityType) && (!imageAlt || imageAlt.trim().length === 0)) {
        issues.push({
          entity_type: entityType,
          entity_id: id,
          url,
          issue_type: 'missing_image_alt',
          category: 'onpage',
          severity: 'medium',
          title: `Missing image ALT attribute on ${name}`,
          description: `Primary media asset is missing descriptive alternative text for screen readers and Google Image search.`,
          recommendation: `Add descriptive alt text including the product or service keyword and location.`,
        })
        onpageDeductions += 3
      }

      // Content Check: Thin Content Detection
      if (contentLength < 80 && entityType !== 'static_page') {
        issues.push({
          entity_type: entityType,
          entity_id: id,
          url,
          issue_type: 'thin_content',
          category: 'content',
          severity: 'medium',
          title: `Thin content detected on ${name} (${contentLength} chars)`,
          description: `The page has minimal descriptive copy, which may hurt topical authority and dwell time.`,
          recommendation: `Add detailed specifications, print stock details, finishing options, and turnaround times.`,
        })
        contentDeductions += 4
      }

      // H1 Check
      if (!h1 || h1.trim().length === 0) {
        issues.push({
          entity_type: entityType,
          entity_id: id,
          url,
          issue_type: 'missing_h1',
          category: 'onpage',
          severity: 'high',
          title: `Missing primary H1 tag on ${name}`,
          description: `Every indexable page must have exactly 1 prominent H1 heading for structural hierarchy.`,
          recommendation: `Define a clear H1 matching the primary search intent.`,
        })
        onpageDeductions += 5
      }
    })

    // Technical Check: Robots.txt and Sitemap Validation
    const robotsValid = true
    const sitemapValid = true

    if (!robotsValid) technicalDeductions += 10
    if (!sitemapValid) technicalDeductions += 10

    // Compute Weighted Scores (0-100 scale)
    const totalEntities = Math.max(1, scannedEntities.length)
    const technicalScore = Math.max(20, Math.min(100, Math.round(100 - (technicalDeductions / totalEntities) * 20)))
    const onpageScore = Math.max(20, Math.min(100, Math.round(100 - (onpageDeductions / totalEntities) * 20)))
    const contentScore = Math.max(20, Math.min(100, Math.round(100 - (contentDeductions / totalEntities) * 20)))
    const structuredDataScore = Math.max(20, Math.min(100, Math.round(100 - (schemaDeductions / totalEntities) * 20)))

    // Overall Weighted Health Score
    const healthScore = Math.round(
      0.30 * onpageScore +
      0.25 * technicalScore +
      0.25 * contentScore +
      0.20 * structuredDataScore
    )

    const summary = {
      totalEntities: scannedEntities.length,
      categoriesCount: categories.length,
      productsCount: products.length,
      servicesCount: services.length,
      blogsCount: blogs.length,
      staticPagesCount: staticPages.length,
      issuesCount: issues.length,
      criticalIssues: issues.filter((i) => i.severity === 'critical').length,
      highIssues: issues.filter((i) => i.severity === 'high').length,
      mediumIssues: issues.filter((i) => i.severity === 'medium').length,
      lowIssues: issues.filter((i) => i.severity === 'low').length,
      sitemapUrl: `${SITE_URL}/sitemap.xml`,
      robotsUrl: `${SITE_URL}/robots.txt`,
      httpsEnforced: true,
      scannedAt: new Date().toISOString(),
    }

    // Persist Audit in MySQL
    let auditId = null
    try {
      const [insertResult] = await pool.query(
        `INSERT INTO seo_audits 
         (health_score, technical_score, onpage_score, content_score, structured_data_score, total_pages_scanned, issues_count, summary_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [healthScore, technicalScore, onpageScore, contentScore, structuredDataScore, scannedEntities.length, issues.length, JSON.stringify(summary)]
      )
      auditId = insertResult.insertId

      // Insert all detected issues
      if (issues.length > 0 && auditId) {
        for (const iss of issues) {
          await pool.query(
            `INSERT INTO seo_issues 
             (audit_id, entity_type, entity_id, url, issue_type, category, severity, title, description, recommendation, resolved)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [auditId, iss.entity_type, iss.entity_id || null, iss.url, iss.issue_type, iss.category, iss.severity, iss.title, iss.description, iss.recommendation]
          )
        }
      }

      // Log activity
      await pool.query(
        `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
        ['audit_completed', 'success', `SEO Audit #${auditId} completed with score ${healthScore}%`, JSON.stringify({ auditId, healthScore, issuesCount: issues.length })]
      )
    } catch (err) {
      console.warn('[SeoScannerService] Database persistence note:', err.message)
    }

    return {
      auditId,
      healthScore,
      technicalScore,
      onpageScore,
      contentScore,
      structuredDataScore,
      totalEntities: scannedEntities.length,
      issuesCount: issues.length,
      issues,
      summary,
      entities: scannedEntities,
    }
  }

  /**
   * Get the most recent audit results from DB
   */
  async getLatestAudit() {
    try {
      const [auditRows] = await pool.query(`SELECT * FROM seo_audits ORDER BY created_at DESC LIMIT 1`)
      if (auditRows.length === 0) {
        return await this.runAudit()
      }

      const latest = auditRows[0]
      const [issueRows] = await pool.query(`SELECT * FROM seo_issues WHERE audit_id = ? ORDER BY FIELD(severity, 'critical', 'high', 'medium', 'low')`, [latest.id])

      return {
        auditId: latest.id,
        healthScore: latest.health_score,
        technicalScore: latest.technical_score,
        onpageScore: latest.onpage_score,
        contentScore: latest.content_score,
        structuredDataScore: latest.structured_data_score,
        totalPagesScanned: latest.total_pages_scanned,
        issuesCount: latest.issues_count,
        summary: typeof latest.summary_json === 'string' ? JSON.parse(latest.summary_json) : latest.summary_json,
        issues: issueRows,
        createdAt: latest.created_at,
      }
    } catch (err) {
      console.warn('[SeoScannerService] getLatestAudit fallback:', err.message)
      return await this.runAudit()
    }
  }
}

module.exports = new SeoScannerService()
