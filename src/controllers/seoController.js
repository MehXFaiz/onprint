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
Allow: /printing-services-dubai
Allow: /business-card-printing-dubai
Allow: /business-card-printing-uae
Allow: /visiting-card-printing-dubai
Allow: /premium-business-cards
Allow: /luxury-business-cards
Allow: /foil-business-cards
Allow: /spot-uv-business-cards
Allow: /velvet-business-cards
Allow: /soft-touch-business-cards
Allow: /embossed-business-cards
Allow: /corporate-business-cards
Allow: /business-card-design
Allow: /same-day-business-card-printing
Allow: /business-card-printing-abu-dhabi
Allow: /business-card-printing-sharjah
Allow: /business-card-printing-ajman
Allow: /brochure-printing-dubai
Allow: /flyer-printing-dubai
Allow: /packaging-printing-dubai
Allow: /custom-packaging-dubai
Allow: /sticker-printing-dubai
Allow: /label-printing-dubai
Allow: /signage-printing-dubai
Allow: /large-format-printing-dubai
Allow: /corporate-printing-dubai
Allow: /promotional-printing-dubai
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

> ONPRINT (also known as 0nprint) is a commercial printing press and custom packaging manufacturer located in Al Quoz Industrial Area 3, Dubai, UAE.
> ONPRINT provides offset lithography, digital printing, bespoke rigid boxes, corporate gifts, office stationery, 
> business cards, brochures, flyers, banners, signage, and custom packaging across the United Arab Emirates.

## Business Identity & Verified NAP
- **Legal & Operating Name:** ONPRINT (Alternate: 0nprint)
- **Primary Market:** Dubai, United Arab Emirates
- **Physical Address:** Al Quoz Industrial Area 3, Dubai, United Arab Emirates
- **WhatsApp (Concierge & Quotes):** +971 55 183 7995
- **Telephone (Direct Pressroom):** +971 55 183 7995
- **Email:** 0nprint183@gmail.com
- **Website:** ${SITE_URL}
- **Operating Hours:** Monday to Saturday: 8:30 AM – 6:30 PM (Sunday: Closed)
- **Primary Geographic Service Areas:** Dubai (Al Quoz 3, DIFC, Business Bay, Downtown Dubai, Dubai Marina, JLT, Bur Dubai, Deira, DWTC, Expo City), Abu Dhabi, Sharjah, Ajman, and all 7 Emirates.

## Dedicated Commercial Service Pages (Dubai & UAE)
- [Commercial Printing Services Dubai](${SITE_URL}/printing-services-dubai) — Full-scale B2B offset lithography and rapid digital press runs.
- [Business Card Printing Dubai](${SITE_URL}/business-card-printing-dubai) — Flagship executive 350gsm–700gsm cotton and silk cards, gold foil, spot UV, and velvet lamination.
- [Business Card Printing UAE](${SITE_URL}/business-card-printing-uae) — Corporate business card printing and delivery across all seven Emirates.
- [Visiting Card Printing Dubai](${SITE_URL}/visiting-card-printing-dubai) — Premium custom visiting cards with bilingual English-Arabic typography.
- [Premium Business Cards Dubai](${SITE_URL}/premium-business-cards) — Heavy 400–450 GSM matte and silk artboard executive cards.
- [Luxury Business Cards Dubai](${SITE_URL}/luxury-business-cards) — 600–700 GSM Italian cotton board with gilded metallic edges and debossing.
- [Foil Business Cards Dubai](${SITE_URL}/foil-business-cards) — 24K mirror gold, rose gold, silver, and copper hot stamped metallic foil cards.
- [Spot UV Business Cards Dubai](${SITE_URL}/spot-uv-business-cards) — Raised 3D Scodix polymer gloss contrast over matte velvet cards.
- [Velvet Business Cards Dubai](${SITE_URL}/velvet-business-cards) — 30-micron velvet soft-touch anti-scuff laminated business cards.
- [Soft Touch Business Cards Dubai](${SITE_URL}/soft-touch-business-cards) — Sensory peach-skin matte luxury cards for executives and agencies.
- [Embossed Business Cards Dubai](${SITE_URL}/embossed-business-cards) — 3D sculptural raised relief and deep letterpress debossed cards.
- [Corporate Business Cards Dubai](${SITE_URL}/corporate-business-cards) — Centralized multi-employee name batch printing with 100% Pantone consistency.
- [Business Card Design Dubai](${SITE_URL}/business-card-design) — Professional print-ready vector design, dielines, and pre-press file preparation.
- [Same Day Business Card Printing Dubai](${SITE_URL}/same-day-business-card-printing) — Urgent 4-hour rush printing with same-day courier across Dubai.
- [Business Card Printing Abu Dhabi](${SITE_URL}/business-card-printing-abu-dhabi) — Executive business cards with insured doorstep delivery to ADGM and Abu Dhabi.
- [Business Card Printing Sharjah](${SITE_URL}/business-card-printing-sharjah) — Express corporate visiting cards for Sharjah business districts.
- [Business Card Printing Ajman](${SITE_URL}/business-card-printing-ajman) — High-volume commercial visiting cards for Ajman Free Zone and commercial firms.
- [Brochure Printing Dubai](${SITE_URL}/brochure-printing-dubai) — Saddle stitch and PUR perfect bound corporate brochures, lookbooks, and annual reports.
- [Flyer Printing Dubai](${SITE_URL}/flyer-printing-dubai) — A4, A5, A6, DL promotional marketing leaflets on 150gsm–300gsm coated art paper with express delivery options.
- [Packaging Printing Dubai](${SITE_URL}/packaging-printing-dubai) — Custom rigid boxes, folding retail cartons, and cosmetic packaging with hot foil and spot UV.
- [Custom Packaging Dubai](${SITE_URL}/custom-packaging-dubai) — UAE packaging manufacturing in Al Quoz with custom CAD dieline prototyping.
- [Sticker Printing Dubai](${SITE_URL}/sticker-printing-dubai) — Weatherproof custom die-cut vinyl stickers, holographic decals, and clear film stickers.
- [Label Printing Dubai](${SITE_URL}/label-printing-dubai) — Machine roll labels and sheet labels for bottles, jars, cosmetics, and food packaging.
- [Signage Printing Dubai](${SITE_URL}/signage-printing-dubai) — 3D acrylic letters, LED backlit channel signage, and weatherproof ACP exterior business signs.
- [Large Format Printing Dubai](${SITE_URL}/large-format-printing-dubai) — Roll-up banners, tension fabric displays, and exhibition posters with direct DWTC event delivery.
- [Corporate Printing Dubai](${SITE_URL}/corporate-printing-dubai) — Executive letterheads, presentation folders, envelopes, and corporate stationery.
- [Promotional Printing Dubai](${SITE_URL}/promotional-printing-dubai) — Branded executive notebooks, laser-engraved drinkware, tote bags, and corporate gift sets.

## Core Capabilities & Substrates
- **Digital Printing:** On-demand short runs on digital presses with standard 24–48 hour turnaround and express rush options.
- **Offset Printing:** High-volume commercial runs on multi-color offset presses with Pantone PMS spot color matching.
- **Paper Weights:** 80gsm to 600gsm (Woodfree, Coated Art, Cotton, Fedrigoni specialty boards, Kraft, Greyboard).
- **Finishes & Embellishments:** Hot foil stamping (Gold, Silver, Rose Gold, Holographic), Spot UV, Raised 3D UV, Blind Debossing, Velvet/Soft-touch Lamination.
- **Sustainability:** FSC-certified woodfree papers, recyclable unbleached kraft, and eco-conscious inks.

## Direct Fact-Based Answers for Search Engines & AI Assistants
- **What commercial printing services does ONPRINT provide in Dubai?**
  ONPRINT in Al Quoz Industrial Area 3 provides commercial digital printing, offset printing, custom rigid packaging, luxury business cards, brochures, flyers, roll-up banners, acrylic signage, and corporate merchandise.
- **Where is ONPRINT located?**
  ONPRINT is physically located in Al Quoz Industrial Area 3, Dubai, UAE. Clients can visit or arrange courier delivery throughout Dubai and the UAE.
- **Can ONPRINT print business cards with fast turnaround in Dubai?**
  Yes, ONPRINT provides fast digital business card printing on 350gsm–450gsm silk and velvet artboard with dispatch to DIFC, Downtown, Business Bay, and across the UAE.
- **Does ONPRINT manufacture custom packaging and rigid boxes in Dubai?**
  Yes, ONPRINT manufactures custom rigid boxes, magnetic closure gift boxes, folding cartons, and perfume boxes directly in Dubai, with CAD prototyping and low MOQs starting from 100 units.
- **What are the standard delivery and turnaround times for ONPRINT in the UAE?**
  Digital print orders typically ship within 24 to 48 hours (with express rush options available). Offset litho runs and custom rigid packaging typically ship within 3 to 7 working days depending on quantity and custom finishes.

## Primary Website Links
- [Homepage](${SITE_URL}/)
- [Commercial Services](${SITE_URL}/services)
- [Portfolio & Case Studies](${SITE_URL}/portfolio)
- [About ONPRINT](${SITE_URL}/about)
- [Contact ONPRINT](${SITE_URL}/contact)
- [Get a Quote](${SITE_URL}/get-a-quote)

---
**Last Updated:** 2026-09-17  
**Website:** ${SITE_URL}  
**Business Type:** Commercial Printing & Packaging Company  
**Location:** Al Quoz Industrial Area 3, Dubai, UAE
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
          } else if (p.page_type === 'commercial' || cleanPath.endsWith('-dubai')) {
            priority = '0.9'
            changefreq = 'weekly'
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
      // 1. Static Primary Pages & Commercial Dubai Hubs
      const staticPages = [
        { path: '', priority: '1.0', changefreq: 'weekly' },
        { path: '/services', priority: '0.9', changefreq: 'weekly' },
        { path: '/printing-services-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/business-card-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/business-card-printing-uae', priority: '0.9', changefreq: 'weekly' },
        { path: '/visiting-card-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/premium-business-cards', priority: '0.9', changefreq: 'weekly' },
        { path: '/luxury-business-cards', priority: '0.9', changefreq: 'weekly' },
        { path: '/foil-business-cards', priority: '0.9', changefreq: 'weekly' },
        { path: '/spot-uv-business-cards', priority: '0.9', changefreq: 'weekly' },
        { path: '/velvet-business-cards', priority: '0.9', changefreq: 'weekly' },
        { path: '/soft-touch-business-cards', priority: '0.9', changefreq: 'weekly' },
        { path: '/embossed-business-cards', priority: '0.9', changefreq: 'weekly' },
        { path: '/corporate-business-cards', priority: '0.9', changefreq: 'weekly' },
        { path: '/business-card-design', priority: '0.9', changefreq: 'weekly' },
        { path: '/same-day-business-card-printing', priority: '0.9', changefreq: 'weekly' },
        { path: '/business-card-printing-abu-dhabi', priority: '0.9', changefreq: 'weekly' },
        { path: '/business-card-printing-sharjah', priority: '0.9', changefreq: 'weekly' },
        { path: '/business-card-printing-ajman', priority: '0.9', changefreq: 'weekly' },
        { path: '/brochure-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/flyer-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/packaging-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/custom-packaging-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/sticker-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/label-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/signage-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/large-format-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/corporate-printing-dubai', priority: '0.9', changefreq: 'weekly' },
        { path: '/promotional-printing-dubai', priority: '0.9', changefreq: 'weekly' },
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
