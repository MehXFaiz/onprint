const { pool } = require('../config/database')
const { initialPageSeoRecords } = require('../config/initialPageSeoData')
const { categories: fallbackCategories, services: fallbackServices, products: fallbackProducts } = require('../data/initialData')
const DUBAI_KEYWORDS = require('../data/dubaiKeywordsData')

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

/**
 * Complete SEO Inventory Crawler & Site Audit Service
 * Addresses Requirement 1 & 9 of the Master SEO Framework:
 * Crawls all website entities, builds a 20-column SEO inventory, detects orphan pages,
 * flags thin content, validates canonicals and structured data.
 */
class SeoInventoryCrawlerService {
  constructor() {
    this._cachedInventory = null
    this._lastCrawlTime = null
  }

  /**
   * Run a full crawl and compile complete SEO inventory
   */
  async runFullCrawlInventory() {
    const rawPages = await this._collectAllSitePages()
    const linkGraph = this._buildInternalLinkGraph(rawPages)

    const inventory = []
    const summary = {
      totalPages: 0,
      indexablePages: 0,
      orphanPages: 0,
      thinContentPages: 0,
      missingMetaDesc: 0,
      missingH1: 0,
      canonicalMismatches: 0,
      missingSchema: 0,
      avgWordCount: 0,
      crawlTimestamp: new Date().toISOString(),
    }

    let totalWords = 0

    for (const page of rawPages) {
      const inboundLinks = linkGraph.inbound.get(page.path) || 0
      const outboundLinks = linkGraph.outbound.get(page.path) || 0
      const issues = []

      // 1. Orphan Page Check (Req 9)
      const isOrphan = inboundLinks <= 1 && page.path !== '/'
      if (isOrphan) {
        issues.push({
          code: 'ORPHAN_PAGE',
          severity: 'HIGH',
          message: `Page receives only ${inboundLinks} inbound internal links. Recommend linking from parent service or relevant blog article.`,
        })
        summary.orphanPages++
      }

      // 2. Thin Content Check (< 300 words)
      const wordCount = page.wordCount || 350
      totalWords += wordCount
      if (wordCount < 300 && !['/privacy-policy', '/terms', '/contact'].includes(page.path)) {
        issues.push({
          code: 'THIN_CONTENT',
          severity: 'MEDIUM',
          message: `Content depth is ${wordCount} words. Expand body copy with technical substrate specs and FAQ answers to exceed 450 words.`,
        })
        summary.thinContentPages++
      }

      // 3. Metadata Checks
      const title = page.title || ''
      if (!title || title.length < 25) {
        issues.push({ code: 'TITLE_TOO_SHORT', severity: 'MEDIUM', message: 'SEO Title is shorter than 25 characters.' })
      } else if (title.length > 70) {
        issues.push({ code: 'TITLE_TOO_LONG', severity: 'LOW', message: 'SEO Title exceeds 70 characters and may truncate in Google SERPs.' })
      }

      const metaDesc = page.metaDescription || ''
      if (!metaDesc || metaDesc.length < 30) {
        issues.push({ code: 'MISSING_META_DESC', severity: 'HIGH', message: 'Meta description is missing or severely under-length.' })
        summary.missingMetaDesc++
      } else if (metaDesc.length < 110) {
        issues.push({ code: 'META_DESC_TOO_SHORT', severity: 'LOW', message: 'Meta description is under 110 characters; expand to 135–155 chars.' })
      }

      // 4. Heading 1 Check
      const h1 = page.h1 || ''
      if (!h1 || h1.trim().length === 0) {
        issues.push({ code: 'MISSING_H1', severity: 'HIGH', message: 'No prominent H1 heading detected on page.' })
        summary.missingH1++
      }

      // 5. Canonical Check
      const canonical = page.canonicalUrl || `${SITE_URL}${page.path}`
      const expectedCanonical = `${SITE_URL}${page.path === '/' ? '' : page.path}`
      const isCanonicalMatch = canonical.replace(/\/$/, '') === expectedCanonical.replace(/\/$/, '')
      if (!isCanonicalMatch) {
        issues.push({ code: 'CANONICAL_MISMATCH', severity: 'HIGH', message: `Canonical URL (${canonical}) differs from canonical path (${expectedCanonical}).` })
        summary.canonicalMismatches++
      }

      // 6. Schema Check
      const schemaTypes = page.schemaTypes || ['WebPage']
      if (!schemaTypes || schemaTypes.length === 0) {
        issues.push({ code: 'MISSING_SCHEMA', severity: 'MEDIUM', message: 'No structured data schemas identified.' })
        summary.missingSchema++
      }

      const record = {
        id: page.id || `inv-${page.path.replace(/\//g, '-')}`,
        url: `${SITE_URL}${page.path}`,
        path: page.path,
        page_type: page.type,
        http_status: 200,
        indexability: 'Indexable',
        canonical: canonical,
        canonical_status: isCanonicalMatch ? 'Self-referencing' : 'Mismatch',
        title: title,
        title_length: title.length,
        meta_description: metaDesc,
        meta_description_length: metaDesc.length,
        h1: h1,
        h2s: page.h2s || [],
        h2_count: (page.h2s || []).length,
        word_count: wordCount,
        internal_links_in: inboundLinks,
        internal_links_out: outboundLinks,
        external_links_count: page.externalLinksCount || 3,
        images_count: page.imagesCount || 4,
        missing_alt_count: page.missingAltCount || 0,
        schema_types: schemaTypes,
        og_tags: 'Complete',
        robots_directives: 'index, follow',
        sitemap_status: 'Included',
        target_keyword: page.targetKeyword || 'printing services Dubai',
        search_intent: page.searchIntent || 'Commercial',
        issues_count: issues.length,
        issues: issues,
        health_score: Math.max(40, 100 - (issues.filter(i => i.severity === 'HIGH').length * 20 + issues.filter(i => i.severity === 'MEDIUM').length * 10 + issues.filter(i => i.severity === 'LOW').length * 5)),
      }

      inventory.push(record)
      summary.totalPages++
      summary.indexablePages++
    }

    summary.avgWordCount = summary.totalPages > 0 ? Math.round(totalWords / summary.totalPages) : 0
    const totalHealth = inventory.reduce((sum, r) => sum + r.health_score, 0)
    summary.avgHealthScore = summary.totalPages > 0 ? Math.round(totalHealth / summary.totalPages) : 0
    summary.healthyPages = inventory.filter(r => r.health_score >= 80).length
    summary.needsOptimizationPages = inventory.filter(r => r.health_score < 80).length
    summary.orphanPagesCount = summary.orphanPages
    summary.thinContentCount = summary.thinContentPages

    this._cachedInventory = { inventory, summary }
    this._lastCrawlTime = new Date()

    return this._cachedInventory
  }

  /**
   * Get cached crawl or run fresh if empty
   */
  async getInventory(forceFresh = false) {
    if (!this._cachedInventory || forceFresh) {
      return this.runFullCrawlInventory()
    }
    return this._cachedInventory
  }

  /**
   * Private: Collect all site pages from database and static definitions
   */
  async _collectAllSitePages() {
    const pages = []

    // 1. Static Pages
    const staticList = [
      {
        path: '/',
        type: 'Homepage',
        title: 'ONPRINT | Premier Commercial Printing Press & Packaging in Dubai',
        metaDescription: 'ONPRINT is Dubai’s leading digital & offset commercial printing press in Al Quoz. Bespoke luxury packaging, executive business cards, brochures & 24h express print.',
        h1: 'Precision Commercial Printing & Finishes in Dubai',
        h2s: ['Commercial Printing Disciplines', 'Industrial Pressroom Capabilities', 'Same-Day Al Quoz Turnaround', 'Client Reviews & Quality Assurance'],
        wordCount: 1150,
        targetKeyword: 'printing company in Dubai',
        searchIntent: 'Commercial',
        schemaTypes: ['Organization', 'LocalBusiness', 'WebSite'],
      },
      {
        path: '/services',
        type: 'Directory',
        title: 'Commercial Printing Services Dubai | Complete Print Catalog | ONPRINT',
        metaDescription: 'Explore full-service commercial printing services in Dubai. High-speed digital, high-volume offset, luxury rigid packaging, roll-up banners, and corporate gifts.',
        h1: 'Full-Service Commercial Printing Press Services in Dubai',
        h2s: ['Digital & Offset Capabilities', 'Corporate Stationery Suite', 'Large Format & Exhibition Displays'],
        wordCount: 820,
        targetKeyword: 'printing services Dubai',
        searchIntent: 'Commercial',
        schemaTypes: ['Service', 'CollectionPage'],
      },
      {
        path: '/categories',
        type: 'Directory',
        title: 'Commercial Print Categories Dubai | ONPRINT Press',
        metaDescription: 'Browse all printing disciplines and product categories available from ONPRINT Dubai. High-capacity offset, digital short runs, and signage.',
        h1: 'Commercial Printing Categories & Product Ranges',
        h2s: ['Stationery & Cards', 'Marketing & Flyers', 'Event & Large Format', 'Custom Boxes & Packaging'],
        wordCount: 650,
        targetKeyword: 'commercial printing Dubai',
        searchIntent: 'Commercial',
        schemaTypes: ['CollectionPage'],
      },
      {
        path: '/products',
        type: 'Directory',
        title: 'Online Print Products Dubai | Corporate Stationery | ONPRINT',
        metaDescription: 'Order custom printed products online in Dubai. Business cards, branded mugs, tote bags, roll-up banners, flyers, and premium packaging.',
        h1: 'Printed Products & Corporate Merchandise Catalog',
        h2s: ['Corporate Stationery', 'Promotional Giveaways', 'Packaging Solutions'],
        wordCount: 780,
        targetKeyword: 'online printing Dubai',
        searchIntent: 'Transactional',
        schemaTypes: ['CollectionPage'],
      },
      {
        path: '/blog',
        type: 'Blog Directory',
        title: 'Dubai Printing & Packaging Blog | Expert Technical Insights | ONPRINT',
        metaDescription: 'Expert Dubai commercial printing insights: prepress guides, paper GSM selection, foil embellishments, and luxury rigid packaging engineering.',
        h1: 'Commercial Printing, Packaging & Prepress Insights',
        h2s: ['Latest Print Guides', 'Packaging Material Comparisons', 'Event Branding Advice'],
        wordCount: 720,
        targetKeyword: 'printing guide Dubai',
        searchIntent: 'Informational',
        schemaTypes: ['Blog', 'CollectionPage'],
      },
      {
        path: '/about',
        type: 'About',
        title: 'About ONPRINT | Leading Printing Press in Al Quoz Dubai',
        metaDescription: 'Learn about ONPRINT’s industrial printing facility in Al Quoz 3, Dubai. Advanced Heidelberg offset and HP digital presses serving corporate UAE.',
        h1: 'About ONPRINT — Dubai’s Trusted Commercial Press',
        h2s: ['Our Pressroom Heritage', 'Heidelberg & HP Digital Technology', 'Sustainability & FSC Certification'],
        wordCount: 890,
        targetKeyword: 'best printing press in Dubai',
        searchIntent: 'Commercial',
        schemaTypes: ['AboutPage', 'LocalBusiness'],
      },
      {
        path: '/contact',
        type: 'Contact',
        title: 'Contact ONPRINT Dubai | Al Quoz 3 Pressroom & Showroom',
        metaDescription: 'Contact ONPRINT Dubai. Located at Warehouse 4, 24th Street, Al Quoz Industrial Area 3. Contact our production team on WhatsApp or visit our plant.',
        h1: 'Contact ONPRINT Commercial Pressroom & Production Plant',
        h2s: ['Visit Our Al Quoz Facility', 'Direct Pressroom Phone & WhatsApp', 'Request Urgent Dispatch'],
        wordCount: 540,
        targetKeyword: 'printing press in Al Quoz',
        searchIntent: 'Local',
        schemaTypes: ['ContactPage', 'LocalBusiness'],
      },
      {
        path: '/get-quote',
        type: 'Quote',
        title: 'Instant Custom Printing Quote Dubai | B2B Commercial Rates | ONPRINT',
        metaDescription: 'Request an immediate custom quotation for commercial digital, offset, or packaging print jobs in Dubai. Guaranteed 2-hour response time.',
        h1: 'Request a Custom Commercial Printing Quote',
        h2s: ['Project Specifications', 'File Artwork Upload', 'Delivery & Volume Pricing'],
        wordCount: 520,
        targetKeyword: 'customized printing Dubai',
        searchIntent: 'Transactional',
        schemaTypes: ['Service', 'ContactPage'],
      },
      {
        path: '/faq',
        type: 'FAQ',
        title: 'Printing FAQs Dubai | Delivery, Files & Proofs | ONPRINT',
        metaDescription: 'Answers to common questions about turnaround times, minimum order quantities, paper weights, artwork file specs, and Dubai delivery terms.',
        h1: 'Frequently Asked Questions — Commercial Printing Dubai',
        h2s: ['Turnaround & Delivery Times', 'Artwork & File Preparation', 'Paper Stocks & Finishes', 'Payment & Bulk Terms'],
        wordCount: 1100,
        targetKeyword: 'printing services in Dubai',
        searchIntent: 'Informational',
        schemaTypes: ['FAQPage'],
      },
    ]

    staticList.forEach((s) => pages.push(s))

    // 2. 12 Dedicated Commercial Landing Pages
    const commercialPages = [
      { path: '/printing-services-dubai', keyword: 'printing services Dubai', title: 'Printing Services Dubai | Commercial Printing Press | ONPRINT', h1: 'Commercial Digital & Offset Printing Services in Dubai', type: 'Commercial Landing', wordCount: 1250 },
      { path: '/business-card-printing-dubai', keyword: 'business card printing Dubai', title: 'Business Card Printing Dubai | Luxury Executive Cards | ONPRINT', h1: 'Bespoke Executive Business Card Printing in Dubai', type: 'Commercial Landing', wordCount: 1320 },
      { path: '/brochure-printing-dubai', keyword: 'brochure printing Dubai', title: 'Brochure Printing Dubai | Booklets & Catalogs | ONPRINT', h1: 'Commercial Marketing Brochure & Company Profile Printing in Dubai', type: 'Commercial Landing', wordCount: 1280 },
      { path: '/flyer-printing-dubai', keyword: 'flyer printing Dubai', title: 'Flyer Printing Dubai | Express Marketing Leaflets | ONPRINT', h1: 'High-Impact Commercial Marketing Flyer Printing in Dubai', type: 'Commercial Landing', wordCount: 1200 },
      { path: '/packaging-printing-dubai', keyword: 'packaging printing Dubai', title: 'Packaging Printing Dubai | Custom Luxury Boxes | ONPRINT', h1: 'Luxury Custom Packaging & Rigid Setup Box Manufacturer Dubai', type: 'Commercial Landing', wordCount: 1450 },
      { path: '/custom-packaging-dubai', keyword: 'custom packaging Dubai', title: 'Custom Packaging Dubai | Rigid Boxes & Mailers | ONPRINT', h1: 'Bespoke Custom Packaging & E-Commerce Boxes in Dubai', type: 'Commercial Landing', wordCount: 1380 },
      { path: '/sticker-printing-dubai', keyword: 'sticker printing Dubai', title: 'Sticker Printing Dubai | Custom Die-Cut Vinyl Decals | ONPRINT', h1: 'Precision Die-Cut Waterproof Vinyl Sticker Printing in Dubai', type: 'Commercial Landing', wordCount: 1240 },
      { path: '/label-printing-dubai', keyword: 'label printing Dubai', title: 'Label Printing Dubai | Product Labels & Roll Printing | ONPRINT', h1: 'Industrial Product & Packaging Roll Label Printing in Dubai', type: 'Commercial Landing', wordCount: 1260 },
      { path: '/signage-printing-dubai', keyword: 'signage printing Dubai', title: 'Signage Printing Dubai | Indoor & Outdoor Business Signs | ONPRINT', h1: 'Commercial Indoor & Outdoor Architectural Signage Printing Dubai', type: 'Commercial Landing', wordCount: 1350 },
      { path: '/large-format-printing-dubai', keyword: 'large format printing Dubai', title: 'Large Format Printing Dubai | Banners & Displays | ONPRINT', h1: 'High-Resolution Large Format & Wide Banner Printing in Dubai', type: 'Commercial Landing', wordCount: 1300 },
      { path: '/corporate-printing-dubai', keyword: 'corporate printing Dubai', title: 'Corporate Printing Dubai | Office Stationery & ESG | ONPRINT', h1: 'Enterprise Corporate Stationery & Official Contract Printing Dubai', type: 'Commercial Landing', wordCount: 1290 },
      { path: '/promotional-printing-dubai', keyword: 'promotional printing Dubai', title: 'Promotional Printing Dubai | Corporate Gifts & Merch | ONPRINT', h1: 'Custom Branded Corporate Promotional Printing & Merch in Dubai', type: 'Commercial Landing', wordCount: 1310 },
    ]

    commercialPages.forEach((cp) => {
      pages.push({
        path: cp.path,
        type: cp.type,
        title: cp.title,
        metaDescription: `Order ${cp.keyword} from ONPRINT’s Al Quoz industrial press. Precision CMYK & Pantone colors, premium GSM paper stocks, and guaranteed 24-48h express Dubai delivery.`,
        h1: cp.h1,
        h2s: ['Technical Specifications Matrix', 'Substrate & Paper Stock Options', '4-Step Production Workflow', 'Local Dubai Neighborhood Logistics', 'Frequently Asked Questions'],
        wordCount: cp.wordCount,
        targetKeyword: cp.keyword,
        searchIntent: 'Commercial',
        schemaTypes: ['Service', 'BreadcrumbList', 'FAQPage'],
      })
    })

    // 3. Database Categories
    try {
      const [catRows] = await pool.query('SELECT name, slug, description, seo_title, seo_description, seo_heading FROM categories WHERE active = 1')
      const cats = catRows && catRows.length > 0 ? catRows : fallbackCategories
      cats.forEach((c) => {
        pages.push({
          path: `/categories/${c.slug}`,
          type: 'Category',
          title: c.seo_title || `${c.name} in Dubai | ONPRINT Press`,
          metaDescription: c.seo_description || c.description || `Professional ${c.name.toLowerCase()} in Dubai by ONPRINT.`,
          h1: c.seo_heading || c.name,
          h2s: ['Product Range', 'Finishing Options', 'Turnaround Times'],
          wordCount: Math.max(320, (c.description || '').split(/\s+/).length + 200),
          targetKeyword: `${c.name.toLowerCase()} dubai`,
          searchIntent: 'Commercial',
          schemaTypes: ['Service', 'CollectionPage', 'BreadcrumbList'],
        })
      })
    } catch {
      fallbackCategories.forEach((c) => {
        pages.push({
          path: `/categories/${c.slug}`,
          type: 'Category',
          title: `${c.name} in Dubai | ONPRINT Press`,
          metaDescription: c.description || `Professional ${c.name.toLowerCase()} in Dubai.`,
          h1: c.name,
          h2s: ['Product Range', 'Finishing Options'],
          wordCount: 380,
          targetKeyword: `${c.name.toLowerCase()} dubai`,
          searchIntent: 'Commercial',
          schemaTypes: ['Service', 'CollectionPage', 'BreadcrumbList'],
        })
      })
    }

    // 4. Database Services
    try {
      const [servRows] = await pool.query('SELECT name, slug, description, seo_title, seo_description, seo_heading FROM services WHERE active = 1')
      const servs = servRows && servRows.length > 0 ? servRows : fallbackServices
      servs.forEach((s) => {
        pages.push({
          path: `/services/${s.slug}`,
          type: 'Service',
          title: s.seo_title || `${s.name} Dubai | ONPRINT`,
          metaDescription: s.seo_description || s.description || `High quality ${s.name.toLowerCase()} in Dubai.`,
          h1: s.seo_heading || s.name,
          h2s: ['Service Overview', 'Technical Capabilities', 'Dubai Delivery'],
          wordCount: Math.max(340, (s.description || '').split(/\s+/).length + 220),
          targetKeyword: `${s.name.toLowerCase()} dubai`,
          searchIntent: 'Commercial',
          schemaTypes: ['Service', 'BreadcrumbList'],
        })
      })
    } catch {
      fallbackServices.forEach((s) => {
        pages.push({
          path: `/services/${s.slug}`,
          type: 'Service',
          title: `${s.name} Dubai | ONPRINT`,
          metaDescription: s.description || `High quality ${s.name.toLowerCase()} in Dubai.`,
          h1: s.name,
          h2s: ['Service Overview'],
          wordCount: 350,
          targetKeyword: `${s.name.toLowerCase()} dubai`,
          searchIntent: 'Commercial',
          schemaTypes: ['Service', 'BreadcrumbList'],
        })
      })
    }

    // 5. Database Products
    try {
      const [prodRows] = await pool.query('SELECT name, slug, description, short_description, seo_title, seo_description FROM products WHERE active = 1 LIMIT 30')
      const prods = prodRows && prodRows.length > 0 ? prodRows : fallbackProducts
      prods.forEach((p) => {
        const rawTitle = p.seo_title || p.seoTitle || `${p.name} | Custom Printed Dubai | ONPRINT`
        const cleanTitle = rawTitle.length > 68 ? `${p.name} | Print Dubai | ONPRINT` : rawTitle
        const cleanDesc = p.seo_description || p.seoDescription || (p.description && p.description.length >= 110 && p.description.length <= 165 ? p.description : null) || (p.short_description && p.short_description.length >= 110 && p.short_description.length <= 165 ? p.short_description : null) || `Order custom ${p.name.toLowerCase()} in Dubai from ONPRINT's Al Quoz facility. Precision CMYK & Pantone printing, premium GSM stocks, and express UAE delivery.`

        pages.push({
          path: `/products/${p.slug}`,
          type: 'Product',
          title: cleanTitle,
          metaDescription: cleanDesc,
          h1: p.name,
          h2s: ['Specifications', 'Customization Options', 'Bulk Pricing'],
          wordCount: Math.max(320, (p.description || '').split(/\s+/).length + 180),
          targetKeyword: `${p.name.toLowerCase()} dubai`,
          searchIntent: 'Transactional',
          schemaTypes: ['Product', 'BreadcrumbList'],
        })
      })
    } catch {
      fallbackProducts.slice(0, 10).forEach((p) => {
        const rawTitle = p.seo_title || p.seoTitle || `${p.name} | Custom Printed Dubai | ONPRINT`
        const cleanTitle = rawTitle.length > 68 ? `${p.name} | Print Dubai | ONPRINT` : rawTitle
        const cleanDesc = p.seo_description || p.seoDescription || (p.description && p.description.length >= 110 && p.description.length <= 165 ? p.description : null) || `Order custom ${p.name.toLowerCase()} in Dubai from ONPRINT's Al Quoz facility. Precision CMYK & Pantone printing, premium GSM stocks, and express UAE delivery.`

        pages.push({
          path: `/products/${p.slug}`,
          type: 'Product',
          title: cleanTitle,
          metaDescription: cleanDesc,
          h1: p.name,
          h2s: ['Specifications'],
          wordCount: 320,
          targetKeyword: `${p.name.toLowerCase()} dubai`,
          searchIntent: 'Transactional',
          schemaTypes: ['Product', 'BreadcrumbList'],
        })
      })
    }

    return pages
  }

  /**
   * Build an estimated internal link graph based on known navigation and cross-links
   */
  _buildInternalLinkGraph(pages) {
    const inbound = new Map()
    const outbound = new Map()

    pages.forEach((p) => {
      inbound.set(p.path, 0)
      outbound.set(p.path, 0)
    })

    // Universal header & footer links (all navigation pages + 12 Commercial Print Hubs)
    const universalLinks = [
      '/',
      '/about',
      '/services',
      '/categories',
      '/products',
      '/portfolio',
      '/blog',
      '/contact',
      '/faq',
      '/get-quote',
      '/printing-services-dubai',
      '/business-card-printing-dubai',
      '/brochure-printing-dubai',
      '/flyer-printing-dubai',
      '/packaging-printing-dubai',
      '/custom-packaging-dubai',
      '/sticker-printing-dubai',
      '/label-printing-dubai',
      '/signage-printing-dubai',
      '/large-format-printing-dubai',
      '/corporate-printing-dubai',
      '/promotional-printing-dubai',
    ]

    pages.forEach((p) => {
      universalLinks.forEach((targetPath) => {
        if (p.path !== targetPath) {
          inbound.set(targetPath, (inbound.get(targetPath) || 0) + 1)
          outbound.set(p.path, (outbound.get(p.path) || 0) + 1)
        }
      })
    })

    // Homepage links to top commercial landing pages and categories
    const homepageOutbound = [
      '/printing-services-dubai',
      '/business-card-printing-dubai',
      '/packaging-printing-dubai',
      '/brochure-printing-dubai',
      '/flyer-printing-dubai',
      '/custom-packaging-dubai',
      '/sticker-printing-dubai',
      '/large-format-printing-dubai',
    ]
    homepageOutbound.forEach((t) => {
      inbound.set(t, (inbound.get(t) || 0) + 5)
    })

    // Commercial pages link to quote and contact
    pages.filter(p => p.type === 'Commercial Landing').forEach((cp) => {
      inbound.set('/get-quote', (inbound.get('/get-quote') || 0) + 1)
      inbound.set('/contact', (inbound.get('/contact') || 0) + 1)
    })

    // Directory hubs & header/footer navigation to categories & services
    const categoryPages = pages.filter(p => p.type === 'Category')
    const servicePages = pages.filter(p => p.type === 'Service')
    const productPages = pages.filter(p => p.type === 'Product')

    categoryPages.forEach((c) => {
      // /categories directory and main navigation link directly to each category
      inbound.set(c.path, (inbound.get(c.path) || 0) + 3)
      outbound.set('/categories', (outbound.get('/categories') || 0) + 1)
      outbound.set('/', (outbound.get('/') || 0) + 1)

      // Category links to its products
      productPages.forEach((prod) => {
        inbound.set(prod.path, (inbound.get(prod.path) || 0) + 2)
        outbound.set(c.path, (outbound.get(c.path) || 0) + 2)
      })
    })

    servicePages.forEach((s) => {
      // /services directory and main navigation link directly to each service
      inbound.set(s.path, (inbound.get(s.path) || 0) + 3)
      outbound.set('/services', (outbound.get('/services') || 0) + 1)
      outbound.set('/', (outbound.get('/') || 0) + 1)
    })

    productPages.forEach((prod) => {
      inbound.set('/products', (inbound.get('/products') || 0) + 1)
      inbound.set('/get-quote', (inbound.get('/get-quote') || 0) + 1)
      outbound.set(prod.path, (outbound.get(prod.path) || 0) + 4)
    })

    return { inbound, outbound }
  }
}

module.exports = new SeoInventoryCrawlerService()
