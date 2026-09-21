const { pool } = require('../config/database')
const programmaticSeoService = require('./programmaticSeoService')
const { categories: fallbackCategories, services: fallbackServices, products: fallbackProducts } = require('../data/initialData')

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

/**
 * Internal Linking Engine
 * Builds a semantic link graph across all website pages and catalog entities.
 * Identifies high-authority link opportunities, suggests natural varied anchor texts,
 * protects against over-optimization / exact-match link spam, and rescues orphan pages.
 */
class InternalLinkingService {
  /**
   * Scan entire site to discover internal linking opportunities
   */
  async generateRecommendations() {
    const pages = await this._getAllSitePages()
    const recommendations = []

    // High authority source pages
    const authorityPages = pages.filter((p) =>
      ['/', '/services', '/categories', '/products', '/about'].includes(p.path)
    )

    // Commercial target pages (categories, services, products, programmatic pages)
    const commercialTargets = pages.filter((p) =>
      ['category', 'service', 'product', 'programmatic_location', 'programmatic_use_case'].includes(p.type)
    )

    // Blog articles (great for contextual in-content linking)
    const blogPages = pages.filter((p) => p.type === 'blog')

    // 1. Link from Blogs to Commercial Products & Services
    blogPages.forEach((blog) => {
      commercialTargets.forEach((target) => {
        const relevance = this._calculateTopicalRelevance(blog, target)
        if (relevance >= 65) {
          const suggestedAnchor = this._generateNaturalAnchor(target, blog)
          recommendations.push({
            id: `link-${blog.id || blog.slug}-${target.id || target.slug}`,
            sourceUrl: blog.url,
            sourceTitle: blog.title || blog.name,
            sourceType: 'blog',
            targetUrl: target.url,
            targetTitle: target.title || target.name,
            targetType: target.type,
            suggestedAnchorText: suggestedAnchor,
            relevanceScore: relevance,
            priority: relevance >= 85 ? 'HIGH' : 'MEDIUM',
            rationale: `Contextual link from educational blog to commercial landing page (${target.name}) boosts topical authority and conversion.`,
            linkPlacementSuggestion: 'In-content body paragraph mentioning printing specifications or practical use cases.',
          })
        }
      })
    })

    // 2. Link from High-Authority Pages to High-Intent Programmatic & Category Pages
    authorityPages.forEach((authPage) => {
      commercialTargets
        .filter((t) => ['programmatic_location', 'category', 'service'].includes(t.type))
        .slice(0, 4)
        .forEach((target) => {
          const suggestedAnchor = this._generateNaturalAnchor(target, authPage)
          recommendations.push({
            id: `auth-${authPage.path.replace(/\//g, '')}-${target.slug}`,
            sourceUrl: authPage.url,
            sourceTitle: authPage.name,
            sourceType: 'authority_page',
            targetUrl: target.url,
            targetTitle: target.title || target.name,
            targetType: target.type,
            suggestedAnchorText: suggestedAnchor,
            relevanceScore: 90,
            priority: 'CRITICAL',
            rationale: `Flows homepage and top-level PageRank directly into high-converting commercial page (${target.name}).`,
            linkPlacementSuggestion: 'Featured service section or corporate service area footer link.',
          })
        })
    })

    // 3. Cross-linking between related categories and services
    const categoryPages = pages.filter((p) => p.type === 'category')
    const servicePages = pages.filter((p) => p.type === 'service')
    const productPages = pages.filter((p) => p.type === 'product')

    categoryPages.forEach((cat) => {
      const matchedService = servicePages.find((s) => s.slug === cat.slug || s.name.includes(cat.name))
      if (matchedService) {
        recommendations.push({
          id: `cross-${cat.slug}-${matchedService.slug}`,
          sourceUrl: cat.url,
          sourceTitle: cat.name,
          sourceType: 'category',
          targetUrl: matchedService.url,
          targetTitle: matchedService.name,
          targetType: 'service',
          pairingType: 'Category -> Service',
          suggestedAnchorText: `Explore our ${cat.name} specifications and bespoke options`,
          relevanceScore: 95,
          priority: 'HIGH',
          rationale: 'Bidirectional alignment between product category catalog and dedicated commercial service page.',
          linkPlacementSuggestion: 'Bottom of category description as "Related Service".',
        })
      }
    })

    // 4. Product -> Category contextual breadcrumb / parent links
    productPages.forEach((prod) => {
      categoryPages.forEach((cat) => {
        if (prod.description && prod.description.toLowerCase().includes(cat.name.toLowerCase().replace(' printing', ''))) {
          recommendations.push({
            id: `prod-cat-${prod.slug}-${cat.slug}`,
            sourceUrl: prod.url,
            sourceTitle: prod.name,
            sourceType: 'product',
            targetUrl: cat.url,
            targetTitle: cat.name,
            targetType: 'category',
            pairingType: 'Product -> Category',
            suggestedAnchorText: `view complete range of ${cat.name.toLowerCase()}`,
            relevanceScore: 92,
            priority: 'HIGH',
            rationale: 'Strengthens category authority and navigation hierarchy from leaf product.',
            linkPlacementSuggestion: 'Within product specifications panel as category taxonomy link.',
          })
        }
      })
    })

    // 5. Service -> Related Service links
    servicePages.forEach((serv) => {
      servicePages.filter((other) => other.slug !== serv.slug).slice(0, 2).forEach((other) => {
        recommendations.push({
          id: `serv-serv-${serv.slug}-${other.slug}`,
          sourceUrl: serv.url,
          sourceTitle: serv.name,
          sourceType: 'service',
          targetUrl: other.url,
          targetTitle: other.name,
          targetType: 'service',
          pairingType: 'Service -> Related Service',
          suggestedAnchorText: `commercial ${other.name.toLowerCase()} for UAE businesses`,
          relevanceScore: 88,
          priority: 'MEDIUM',
          rationale: 'Promotes cross-service discovery and distributes link equity across service silos.',
          linkPlacementSuggestion: '"Related Commercial Services" grid at the bottom of the page.',
        })
      })

      // 6. Service -> Contact/Quote Conversion Links
      recommendations.push({
        id: `serv-quote-${serv.slug}`,
        sourceUrl: serv.url,
        sourceTitle: serv.name,
        sourceType: 'service',
        targetUrl: `${SITE_URL}/get-a-quote`,
        targetTitle: 'Get a Custom Quote',
        targetType: 'conversion_page',
        pairingType: 'Service -> Contact/Quote',
        suggestedAnchorText: `request an immediate itemized quote for ${serv.name.toLowerCase()}`,
        relevanceScore: 98,
        priority: 'CRITICAL',
        rationale: 'Direct funnel from commercial service interest to instant quotation form.',
        linkPlacementSuggestion: 'Primary and secondary in-body conversion triggers.',
      })
    })

    // Deduplicate and sort by priority & relevance
    const uniqueRecs = []
    const seen = new Set()
    const inboundCount = new Map()

    for (const rec of recommendations) {
      const key = `${rec.sourceUrl}-->${rec.targetUrl}`
      if (!seen.has(key)) {
        seen.add(key)
        uniqueRecs.push(rec)

        // Track inbound references
        const tUrl = rec.targetUrl
        inboundCount.set(tUrl, (inboundCount.get(tUrl) || 0) + 1)
      }
    }

    uniqueRecs.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Identify Graph Metrics: Orphans, Low-link pages, High-link authority pages
    const orphanPages = []
    const lowLinkPages = []
    const highAuthorityPages = []

    pages.forEach((p) => {
      const inCount = inboundCount.get(p.url) || (p.path === '/' ? 25 : (p.path === '/services' ? 14 : 0))
      if (inCount === 0 && !['/privacy-policy', '/terms'].includes(p.path)) {
        orphanPages.push({
          url: p.url,
          name: p.name,
          type: p.type,
          issue: 'No inbound contextual links discovered.',
          action: 'Add contextual links from related service or blog guides.',
        })
      } else if (inCount < 2 && !['/privacy-policy', '/terms'].includes(p.path)) {
        lowLinkPages.push({
          url: p.url,
          name: p.name,
          type: p.type,
          inboundCount: inCount,
          action: 'Increase contextual in-content references to strengthen topical weight.',
        })
      } else if (inCount >= 5) {
        highAuthorityPages.push({
          url: p.url,
          name: p.name,
          type: p.type,
          inboundCount: inCount,
        })
      }
    })

    // Group pairings by type for Section 10 compliance
    const clusterPairings = {
      blogToService: uniqueRecs.filter((r) => r.sourceType === 'blog' && r.targetType === 'service'),
      blogToProduct: uniqueRecs.filter((r) => r.sourceType === 'blog' && r.targetType === 'product'),
      serviceToRelatedService: uniqueRecs.filter((r) => r.pairingType === 'Service -> Related Service'),
      productToCategory: uniqueRecs.filter((r) => r.pairingType === 'Product -> Category'),
      categoryToService: uniqueRecs.filter((r) => r.pairingType === 'Category -> Service'),
      serviceToQuote: uniqueRecs.filter((r) => r.pairingType === 'Service -> Contact/Quote'),
    }

    return {
      totalRecommendations: uniqueRecs.length,
      highPriorityCount: uniqueRecs.filter((r) => r.priority === 'CRITICAL' || r.priority === 'HIGH').length,
      recommendations: uniqueRecs.slice(0, 60),
      orphanPages,
      lowLinkPages: lowLinkPages.slice(0, 15),
      highAuthorityPages: highAuthorityPages.slice(0, 15),
      clusterPairings,
      sitePagesCount: pages.length,
    }
  }

  /**
   * Helper: Calculate topical overlap score (0-100)
   */
  _calculateTopicalRelevance(source, target) {
    const sourceText = `${source.name || ''} ${source.title || ''} ${source.description || ''}`.toLowerCase()
    const targetKeywords = (target.name || '').toLowerCase().split(/\s+/).filter((w) => w.length > 3)

    let hits = 0
    targetKeywords.forEach((kw) => {
      if (sourceText.includes(kw)) hits++
    })

    if (targetKeywords.length === 0) return 50
    const ratio = hits / targetKeywords.length
    return Math.min(100, Math.round(50 + ratio * 45))
  }

  /**
   * Helper: Generate natural, varied anchor text (avoids over-optimized exact match spam)
   */
  _generateNaturalAnchor(target, source) {
    const name = target.name || 'printing services'
    const variations = [
      `our ${name.toLowerCase()} in Dubai`,
      `explore bespoke ${name.toLowerCase()}`,
      `professional ${name.toLowerCase()} options`,
      `custom ${name.toLowerCase()} solutions`,
      `view ${name.toLowerCase()} portfolio and specifications`,
      `learn more about ${name.toLowerCase()}`,
      `compare ${name.toLowerCase()} finishes and formats`,
    ]
    const hash = (target.slug || name).length % variations.length
    return variations[hash]
  }

  /**
   * Fetch all site pages including categories, services, products, blogs, and programmatic pages
   */
  async _getAllSitePages() {
    const pages = [
      { name: 'Home Page', url: `${SITE_URL}/`, path: '/', type: 'static_page' },
      { name: 'Commercial Services', url: `${SITE_URL}/services`, path: '/services', type: 'static_page' },
      { name: 'Categories Catalog', url: `${SITE_URL}/categories`, path: '/categories', type: 'static_page' },
      { name: 'Products Directory', url: `${SITE_URL}/products`, path: '/products', type: 'static_page' },
      { name: 'Printing & Gifting Blog', url: `${SITE_URL}/blog`, path: '/blog', type: 'static_page' },
      { name: 'About ONPRINT', url: `${SITE_URL}/about`, path: '/about', type: 'static_page' },
      { name: 'Contact & Support', url: `${SITE_URL}/contact`, path: '/contact', type: 'static_page' },
      { name: 'Get a Custom Quote', url: `${SITE_URL}/get-a-quote`, path: '/get-a-quote', type: 'static_page' },
      { name: 'FAQ & Help', url: `${SITE_URL}/faq`, path: '/faq', type: 'static_page' },
    ]

    // Categories
    try {
      const [rows] = await pool.query('SELECT id, name, slug, description FROM categories WHERE active = 1')
      const cats = rows.length > 0 ? rows : fallbackCategories
      cats.forEach((c) => {
        pages.push({
          id: c.id,
          name: c.name,
          slug: c.slug,
          url: `${SITE_URL}/categories/${c.slug}`,
          path: `/categories/${c.slug}`,
          type: 'category',
          description: c.description,
        })
      })
    } catch {
      fallbackCategories.forEach((c) => {
        pages.push({
          id: c.id,
          name: c.name,
          slug: c.slug,
          url: `${SITE_URL}/categories/${c.slug}`,
          path: `/categories/${c.slug}`,
          type: 'category',
          description: c.description,
        })
      })
    }

    // Services
    try {
      const [rows] = await pool.query('SELECT id, name, slug, description FROM services WHERE active = 1')
      const servs = rows.length > 0 ? rows : fallbackServices
      servs.forEach((s) => {
        pages.push({
          id: s.id,
          name: s.name,
          slug: s.slug,
          url: `${SITE_URL}/services/${s.slug}`,
          path: `/services/${s.slug}`,
          type: 'service',
          description: s.description,
        })
      })
    } catch {
      fallbackServices.forEach((s) => {
        pages.push({
          id: s.id,
          name: s.name,
          slug: s.slug,
          url: `${SITE_URL}/services/${s.slug}`,
          path: `/services/${s.slug}`,
          type: 'service',
          description: s.description,
        })
      })
    }

    // Products
    try {
      const [rows] = await pool.query('SELECT id, name, slug, description FROM products WHERE active = 1')
      const prods = rows.length > 0 ? rows : fallbackProducts
      prods.forEach((p) => {
        pages.push({
          id: p.id,
          name: p.name,
          slug: p.slug,
          url: `${SITE_URL}/products/${p.slug}`,
          path: `/products/${p.slug}`,
          type: 'product',
          description: p.description,
        })
      })
    } catch {
      fallbackProducts.forEach((p) => {
        pages.push({
          id: p.id,
          name: p.name,
          slug: p.slug,
          url: `${SITE_URL}/products/${p.slug}`,
          path: `/products/${p.slug}`,
          type: 'product',
          description: p.description,
        })
      })
    }

    // Blogs
    try {
      const [rows] = await pool.query('SELECT id, title, slug, excerpt FROM blogs WHERE status = "published"')
      rows.forEach((b) => {
        pages.push({
          id: b.id,
          name: b.title,
          slug: b.slug,
          url: `${SITE_URL}/blog/${b.slug}`,
          path: `/blog/${b.slug}`,
          type: 'blog',
          description: b.excerpt,
        })
      })
    } catch {}

    // Programmatic Pages
    const progPages = programmaticSeoService.getAllPages()
    progPages.forEach((p) => {
      pages.push({
        name: p.name,
        slug: p.slug,
        url: p.fullUrl,
        path: p.path,
        type: p.type === 'location' ? 'programmatic_location' : 'programmatic_use_case',
        description: p.metaDescription,
      })
    })

    return pages
  }
}

module.exports = new InternalLinkingService()
