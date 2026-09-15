const { pool } = require('../config/database')
const { products: fallbackProducts, services: fallbackServices, categories: fallbackCategories } = require('../data/initialData')
const programmaticSeoService = require('../services/programmaticSeoService')

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case '\'': return '&apos;'
        case '"': return '&quot;'
        default: return c
      }
    })
}

async function getRobotsTxt(req, res) {
  const robots = `User-agent: *
Allow: /
Allow: /ads.txt
Allow: /services
Allow: /services/
Allow: /products
Allow: /products/
Allow: /categories
Allow: /categories/
Allow: /portfolio
Allow: /portfolio/
Allow: /blog
Allow: /blog/
Allow: /about
Allow: /contact
Allow: /faq
Allow: /get-a-quote
Allow: /track-order
Allow: /track
Allow: /orders/track
Allow: /printing-services
Allow: /printing-services/
Allow: /printing-solutions
Allow: /printing-solutions/
Allow: /privacy-policy
Allow: /terms
Allow: /assets/
Allow: /uploads/

# AI Crawlers - Explicitly allowed for GEO
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: cohere-ai
Allow: /

# Admin and Private Areas
Disallow: /admin
Disallow: /admin/
Disallow: /admin/*
Disallow: /api/
Disallow: /api/*
Disallow: /dashboard
Disallow: /login
Disallow: /register
Disallow: /account

Sitemap: ${SITE_URL}/sitemap.xml
`
  res.header('Content-Type', 'text/plain; charset=utf-8')
  res.header('Cache-Control', 'public, max-age=3600')
  res.status(200).send(robots)
}

async function getLlmsTxt(req, res) {
  const llms = `# ONPRINT — Commercial & Corporate Printing Services Dubai

> ONPRINT is a professional commercial printing company based in Al Quoz Industrial Area 3, Dubai, UAE. 
> We provide digital printing, offset printing, luxury packaging, corporate gifts, office stationery, 
> business cards, brochures, flyers, banners, signage, and custom branded merchandise to businesses 
> across the United Arab Emirates.

## About ONPRINT
ONPRINT operates an in-house production facility in Al Quoz, Dubai, equipped with Heidelberg offset presses 
and HP Indigo digital presses. We serve 500+ corporate clients across Dubai, Abu Dhabi, Sharjah, and the UAE, 
delivering professional printing solutions with same-day and 24-hour turnaround options.

**Location:** Al Quoz Industrial Area 3, Dubai, UAE  
**Experience:** 10+ years in commercial printing  
**Service Areas:** Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, UAE-wide  
**Contact:** +971551837995 | 0nprint183@gmail.com

## Core Services
- **Digital Printing:** Fast turnaround printing for business cards, flyers, brochures, stationery (24-48 hours)
- **Offset Printing:** High-volume commercial printing with superior color consistency (1,000+ units)
- **Business Card Printing:** 350gsm-600gsm cotton and silk stocks with foil stamping, spot UV, soft-touch lamination
- **Brochure & Flyer Printing:** Corporate marketing materials on 170gsm-300gsm gloss or matte art paper
- **Luxury Packaging:** Custom rigid boxes, magnetic gift boxes, premium packaging with foil finishing
- **Corporate Gifts:** Laser-engraved water bottles, branded tote bags, notebooks, mugs, polo shirts
- **Large Format Printing:** Banners, rollup displays, signage, vinyl printing for events and exhibitions
- **Office Stationery:** Letterheads, envelopes, folders, notebooks, corporate stationery sets
- **ID Cards & Badges:** PVC ID cards, magnetic name badges, lanyards, access cards
- **Stickers & Labels:** Die-cut vinyl stickers, product labels, waterproof outdoor stickers

## Key Pages
- [All Printing Services](${SITE_URL}/services) — Complete list of printing disciplines
- [Product Categories](${SITE_URL}/categories) — Browse by printing category
- [All Products](${SITE_URL}/products) — Full product catalog
- [Portfolio](${SITE_URL}/portfolio) — Example projects and client work
- [Get a Quote](${SITE_URL}/get-a-quote) — Request custom pricing
- [Track Order](${SITE_URL}/track-order) — Real-time order tracking
- [About ONPRINT](${SITE_URL}/about) — Company information and capabilities
- [Contact Us](${SITE_URL}/contact) — Get in touch with our team
- [FAQ](${SITE_URL}/faq) — Frequently asked questions
- [Blog](${SITE_URL}/blog) — Printing guides and industry insights

## Why Choose ONPRINT?
- **Al Quoz Production Facility:** In-house printing eliminates broker markups
- **Fast Turnaround:** Same-day and 24-hour production available
- **Pantone Color Matching:** Guaranteed color accuracy for brand-critical projects
- **FSC-Certified Paper:** Eco-friendly paper stocks available
- **Corporate Client Base:** Trusted by 500+ UAE businesses
- **Full-Service:** Design assistance, pre-flight checks, physical proofs available
- **UAE-Wide Delivery:** Dubai/Sharjah 24hrs, Abu Dhabi 48hrs, full UAE coverage

## Common Questions
- **What is the difference between digital and offset printing?** Digital is ideal for small quantities (up to 1,000) with faster turnaround. Offset is cost-effective for large volumes (1,000+) with superior color consistency.
- **What is the turnaround time?** Standard digital printing: 24-48 hours. Offset and specialty projects: 3-7 days. Same-day service available for rush orders.
- **What paper stocks are available?** 120gsm-600gsm range including smooth uncoated, glossy art paper, matte coated, premium cotton, FSC-certified stocks.
- **Do you deliver across UAE?** Yes, we deliver to all emirates. Dubai/Sharjah within 24 hours, Abu Dhabi and others within 48 hours.
- **Can I see a proof before printing?** Yes, every order includes digital PDF proof. Physical printed proofs available on request.

## Primary Services Links
- [Commercial Printing](${SITE_URL}/services)
- [Business Card Printing](${SITE_URL}/categories/business-cards-printing)
- [Brochure Printing](${SITE_URL}/categories/brochures-printing)
- [Flyer Printing](${SITE_URL}/categories/flyers-printing-in-dubai)
- [Corporate Gifts](${SITE_URL}/categories/corporate-gift-items)
- [Packaging Printing](${SITE_URL}/products)

---
**Last Updated:** 2026-09-15  
**Website:** ${SITE_URL}  
**Business Type:** Commercial Printing Company  
**Specialization:** Digital & Offset Printing, Luxury Packaging, Corporate Branding

`
  res.header('Content-Type', 'text/plain; charset=utf-8')
  res.header('Cache-Control', 'public, max-age=3600')
  res.status(200).send(llms)
}

const ADSENSE_PUB_ID = (process.env.ADSENSE_PUB_ID || 'pub-2412757543318629').trim()

async function getAdsTxt(req, res) {
  const ads = `google.com, ${ADSENSE_PUB_ID}, DIRECT, f08c47fec0942fa0\n`
  res.header('Content-Type', 'text/plain; charset=utf-8')
  res.header('Cache-Control', 'public, max-age=3600')
  res.status(200).send(ads)
}

async function getSitemapXml(req, res) {
  try {
    const urls = []
    const now = new Date().toISOString().split('T')[0]
    const seenUrls = new Set()

    // 1. Fetch all indexable pages directly from page_seo (Single Source of Truth)
    try {
      const [seoPages] = await pool.query(`
        SELECT ps.url, ps.updated_at, ps.robots_index, ps.page_type
        FROM page_seo ps
        LEFT JOIN blogs b ON ps.page_type = 'blog' AND (ps.slug = b.slug OR ps.page_id = b.id)
        WHERE ps.robots_index = 'index'
          AND (ps.page_type != 'blog' OR (b.status = 'published' AND (b.published_at IS NULL OR b.published_at <= NOW())))
        ORDER BY FIELD(ps.page_type, 'static', 'service', 'category', 'product', 'blog', 'portfolio', 'programmatic'), ps.url ASC
      `)

      if (seoPages && seoPages.length > 0) {
        seoPages.forEach((p) => {
          const rawUrl = (p.url || '').trim()
          if (!rawUrl) return
          const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
          const fullLoc = `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`
          
          if (seenUrls.has(fullLoc)) return
          seenUrls.add(fullLoc)

          const mod = p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : now
          let priority = '0.7'
          let changefreq = 'weekly'

          if (cleanPath === '/' || cleanPath === '') {
            priority = '1.0'
            changefreq = 'daily'
          } else if (p.page_type === 'service') {
            priority = '0.9'
            changefreq = 'weekly'
          } else if (p.page_type === 'category') {
            priority = '0.85'
            changefreq = 'weekly'
          } else if (p.page_type === 'product') {
            priority = '0.85'
            changefreq = 'weekly'
          } else if (p.page_type === 'blog') {
            priority = '0.8'
            changefreq = 'weekly'
          } else if (cleanPath === '/contact' || cleanPath === '/get-a-quote') {
            priority = '0.85'
            changefreq = 'monthly'
          } else if (cleanPath === '/privacy-policy' || cleanPath === '/terms') {
            priority = '0.3'
            changefreq = 'yearly'
          }

          urls.push({
            loc: fullLoc,
            lastmod: mod,
            changefreq,
            priority,
          })
        })
      }
    } catch (pageSeoErr) {
      console.warn('[Sitemap] page_seo lookup warning:', pageSeoErr.message)
    }

    // 2. If page_seo had no records, use catalog tables fallback
    if (urls.length === 0) {
      // 1. Static Primary Pages
      const staticPages = [
        { path: '', priority: '1.0', changefreq: 'weekly' },
        { path: '/services', priority: '0.9', changefreq: 'weekly' },
        { path: '/products', priority: '0.9', changefreq: 'daily' },
        { path: '/blog', priority: '0.8', changefreq: 'daily' },
        { path: '/portfolio', priority: '0.7', changefreq: 'monthly' },
        { path: '/about', priority: '0.7', changefreq: 'monthly' },
        { path: '/contact', priority: '0.8', changefreq: 'monthly' },
        { path: '/get-a-quote', priority: '0.8', changefreq: 'monthly' },
        { path: '/faq', priority: '0.6', changefreq: 'monthly' },
        { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
        { path: '/terms', priority: '0.3', changefreq: 'yearly' },
      ]

      staticPages.forEach((p) => {
        urls.push({
          loc: `${SITE_URL}${p.path}`,
          lastmod: now,
          changefreq: p.changefreq,
          priority: p.priority,
        })
      })

      // Dynamic Categories Fallback
      urls.push({
        loc: `${SITE_URL}/categories`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.9',
      })

      try {
        const [cats] = await pool.execute('SELECT slug, updated_at FROM categories WHERE active = 1')
        if (cats.length > 0) {
          cats.forEach((c) => {
          const mod = c.updated_at ? new Date(c.updated_at).toISOString().split('T')[0] : now
          urls.push({
            loc: `${SITE_URL}/categories/${c.slug}`,
            lastmod: mod,
            changefreq: 'weekly',
            priority: '0.85',
          })
        })
      } else {
        fallbackCategories.forEach((c) => {
          urls.push({
            loc: `${SITE_URL}/categories/${c.slug}`,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.85',
          })
        })
      }
    } catch {
      fallbackCategories.forEach((c) => {
        urls.push({
          loc: `${SITE_URL}/categories/${c.slug}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: '0.85',
        })
      })
    }

    // 3. Dynamic Services
    try {
      const [servs] = await pool.execute('SELECT slug, updated_at FROM services WHERE active = 1')
      if (servs.length > 0) {
        servs.forEach((s) => {
          urls.push({
            loc: `${SITE_URL}/services/${s.slug}`,
            lastmod: s.updated_at ? new Date(s.updated_at).toISOString().split('T')[0] : now,
            changefreq: 'weekly',
            priority: '0.85',
          })
        })
      } else {
        fallbackServices.forEach((s) => {
          urls.push({
            loc: `${SITE_URL}/services/${s.slug}`,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.85',
          })
        })
      }
    } catch {
      fallbackServices.forEach((s) => {
        urls.push({
          loc: `${SITE_URL}/services/${s.slug}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: '0.85',
        })
      })
    }

    // 4. Dynamic Products
    try {
      const [prods] = await pool.execute('SELECT slug, updated_at FROM products WHERE active = 1')
      if (prods.length > 0) {
        prods.forEach((p) => {
          urls.push({
            loc: `${SITE_URL}/products/${p.slug}`,
            lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : now,
            changefreq: 'weekly',
            priority: '0.8',
          })
        })
      } else {
        fallbackProducts.forEach((p) => {
          urls.push({
            loc: `${SITE_URL}/products/${p.slug}`,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.8',
          })
        })
      }
    } catch {
      fallbackProducts.forEach((p) => {
        urls.push({
          loc: `${SITE_URL}/products/${p.slug}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: '0.8',
        })
      })
    }

    // 5. Dynamic Blog Posts (Only published blogs)
    try {
      const [blogs] = await pool.execute(`
        SELECT slug, updated_at, published_at 
        FROM blogs 
        WHERE status = 'published' AND (published_at IS NULL OR published_at <= NOW())
      `)
      if (blogs.length > 0) {
        blogs.forEach((b) => {
          urls.push({
            loc: `${SITE_URL}/blog/${b.slug}`,
            lastmod: b.updated_at
              ? new Date(b.updated_at).toISOString().split('T')[0]
              : b.published_at
              ? new Date(b.published_at).toISOString().split('T')[0]
              : now,
            changefreq: 'weekly',
            priority: '0.8',
          })
        })
      }
    } catch {
      try {
        const persistentBlogs = require('../data/persistentStore').getBlogs()
        persistentBlogs
          .filter((b) => b.status === 'published')
          .forEach((b) => {
            urls.push({
              loc: `${SITE_URL}/blog/${b.slug}`,
              lastmod: now,
              changefreq: 'weekly',
              priority: '0.8',
            })
          })
        } catch (e) {}
      }
    }

    // 6. Safe Programmatic Landing Pages (Locations & Use Cases)
    try {
      const programmaticPages = programmaticSeoService.getAllPages()
      programmaticPages.forEach((p) => {
        if (!seenUrls.has(p.fullUrl)) {
          seenUrls.add(p.fullUrl)
          urls.push({
            loc: p.fullUrl,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.85',
          })
        }
      })
    } catch (progErr) {
      console.warn('[Sitemap] Programmatic pages inclusion note:', progErr.message)
    }

    // Remove duplicates collected from page_seo and live entity tables.
    const uniqueUrls = Array.from(new Map(urls.map((entry) => [entry.loc, entry])).values())

    // Format XML with strict validation & XML entity escaping
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

    uniqueUrls.forEach((u) => {
      xml += `  <url>\n`
      xml += `    <loc>${escapeXml(u.loc)}</loc>\n`
      xml += `    <lastmod>${escapeXml(u.lastmod)}</lastmod>\n`
      xml += `    <changefreq>${escapeXml(u.changefreq)}</changefreq>\n`
      xml += `    <priority>${escapeXml(u.priority)}</priority>\n`
      xml += `  </url>\n`
    })

    xml += `</urlset>`

    res.header('Content-Type', 'application/xml')
    res.header('Cache-Control', 'public, max-age=3600')
    res.send(xml)
  } catch (err) {
    res.status(500).send('Error generating sitemap')
  }
}

async function runSeoAudit(req, res) {
  try {
    const issues = []
    let totalItems = 0
    let optimizedItems = 0

    // Check Categories
    let cats = []
    try {
      const [rows] = await pool.execute('SELECT id, name, slug, seo_title, seo_description, image_alt FROM categories')
      cats = rows
    } catch {
      cats = fallbackCategories
    }

    cats.forEach((c) => {
      totalItems++
      const itemIssues = []
      if (!c.seo_title && !c.seoTitle) itemIssues.push('Missing custom SEO title (using fallback)')
      if (!c.seo_description && !c.seoDescription) itemIssues.push('Missing custom SEO description (using fallback)')
      if (!c.image_alt && !c.imageAlt) itemIssues.push('Missing image ALT text')
      if (itemIssues.length === 0) optimizedItems++
      else issues.push({ entity: 'Category', name: c.name, slug: c.slug, issues: itemIssues })
    })

    // Check Products
    let prods = []
    try {
      const [rows] = await pool.execute('SELECT id, name, slug, seo_title, seo_description, image_alt FROM products')
      prods = rows
    } catch {
      prods = fallbackProducts
    }

    prods.forEach((p) => {
      totalItems++
      const itemIssues = []
      if (!p.seo_title && !p.seoTitle) itemIssues.push('Missing custom SEO title (using fallback)')
      if (!p.seo_description && !p.seoDescription) itemIssues.push('Missing custom SEO description (using fallback)')
      if (!p.image_alt && !p.imageAlt) itemIssues.push('Missing image ALT text')
      if (itemIssues.length === 0) optimizedItems++
      else issues.push({ entity: 'Product', name: p.name, slug: p.slug, issues: itemIssues })
    })

    // Check Services
    let servs = []
    try {
      const [rows] = await pool.execute('SELECT id, name, slug, seo_title, seo_description, image_alt FROM services')
      servs = rows
    } catch {
      servs = fallbackServices
    }

    servs.forEach((s) => {
      totalItems++
      const itemIssues = []
      if (!s.seo_title && !s.seoTitle) itemIssues.push('Missing custom SEO title (using fallback)')
      if (!s.seo_description && !s.seoDescription) itemIssues.push('Missing custom SEO description (using fallback)')
      if (!s.image_alt && !s.imageAlt) itemIssues.push('Missing image ALT text')
      if (itemIssues.length === 0) optimizedItems++
      else issues.push({ entity: 'Service', name: s.name, slug: s.slug, issues: itemIssues })
    })

    // Check Blog Posts
    let blogs = []
    try {
      const [rows] = await pool.execute('SELECT id, title, slug, seo_title, meta_description AS seo_description, image_alt FROM blogs')
      blogs = rows
    } catch {
      try {
        blogs = require('../data/persistentStore').getBlogs()
      } catch (e) {
        blogs = []
      }
    }

    blogs.forEach((b) => {
      totalItems++
      const itemIssues = []
      if (!b.seo_title && !b.seoTitle) itemIssues.push('Missing custom SEO title (using fallback)')
      if (!b.seo_description && !b.seoDescription) itemIssues.push('Missing custom SEO description (using fallback)')
      if (!b.image_alt && !b.imageAlt) itemIssues.push('Missing image ALT text')
      if (itemIssues.length === 0) optimizedItems++
      else issues.push({ entity: 'Blog Article', name: b.title, slug: b.slug, issues: itemIssues })
    })

    const healthScore = totalItems > 0 ? Math.round((optimizedItems / totalItems) * 100) : 100

    res.json({
      success: true,
      siteUrl: SITE_URL,
      healthScore,
      totalItems,
      optimizedItems,
      issuesCount: issues.length,
      issues,
      summary: {
        categoriesCount: cats.length,
        productsCount: prods.length,
        servicesCount: servs.length,
        blogArticlesCount: blogs.length,
        sitemapUrl: `${SITE_URL}/sitemap.xml`,
        robotsUrl: `${SITE_URL}/robots.txt`,
        adsUrl: `${SITE_URL}/ads.txt`,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  getRobotsTxt,
  getLlmsTxt,
  getAdsTxt,
  getSitemapXml,
  runSeoAudit,
}
