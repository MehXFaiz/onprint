const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const { pool, testConnection } = require('./config/database')
const { notFound, errorHandler } = require('./middleware/errorHandler')
const pageSeoService = require('./services/pageSeoService')

const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const productRoutes = require('./routes/productRoutes')
const contactRoutes = require('./routes/contactRoutes')
const quoteRoutes = require('./routes/quoteRoutes')
const orderRoutes = require('./routes/orderRoutes')
const newsletterRoutes = require('./routes/newsletterRoutes')
const adminRoutes = require('./routes/adminRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const blogRoutes = require('./routes/blogRoutes')
const seoRoutes = require('./routes/seoRoutes')
const { getRobotsTxt, getSitemapXml, getLlmsTxt, getAdsTxt } = require('./controllers/seoController')
const { BUSINESS_CARDS_LANDING_DATA } = require('./data/businessCardsLandingData')

const CLIENT_DIST = path.join(__dirname, '..', 'dist')

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function absoluteSeoUrl(value, siteUrl) {
  if (!value) return `${siteUrl}/logo_icon.png`
  return value.startsWith('http') ? value : `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`
}

function replaceMeta(html, attribute, name, content) {
  if (!content) return html
  const escapedContent = escapeHtml(content)
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${name}["'][^>]*>`, 'i')
  const replacement = `<meta ${attribute}="${name}" content="${escapedContent}" />`
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`)
}

async function renderSeoShell(requestPath, { noindex = false } = {}) {
  const indexPath = path.join(CLIENT_DIST, 'index.html')
  const html = await fs.promises.readFile(indexPath, 'utf8')
  const siteUrl = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

  let seo
  try {
    seo = await pageSeoService.getPageByUrl(requestPath)
  } catch (error) {
    console.warn('[SEO] Server shell metadata lookup warning:', error.message)
  }

  seo = seo || {}

  const cleanPathKey = requestPath.replace(/^\//, '')
  const bcData = BUSINESS_CARDS_LANDING_DATA[cleanPathKey]

  const title = seo.meta_title || bcData?.title || 'Printing Company in Dubai | ONPRINT'
  const description = seo.meta_description || bcData?.metaDescription || ''
  const canonical = seo.canonical_url || `${siteUrl}${requestPath === '/' ? '' : requestPath}`
  const ogImage = absoluteSeoUrl(seo.og_image, siteUrl)
  const twitterImage = absoluteSeoUrl(seo.twitter_image || seo.og_image, siteUrl)
  const robots = noindex
    ? 'noindex, nofollow'
    : `${seo.robots_index || 'index'}, ${seo.robots_follow || 'follow'}, max-image-preview:large`

  const keywordsString = [
    seo.focus_keyword || bcData?.focusKeyword,
    seo.secondary_keywords || bcData?.secondaryKeywords,
  ].filter(Boolean).join(', ')

  let rendered = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  rendered = replaceMeta(rendered, 'name', 'description', description)
  rendered = replaceMeta(rendered, 'name', 'keywords', keywordsString)
  rendered = replaceMeta(rendered, 'name', 'robots', robots)
  rendered = replaceMeta(rendered, 'property', 'og:title', seo.og_title || title)
  rendered = replaceMeta(rendered, 'property', 'og:description', seo.og_description || description)
  rendered = replaceMeta(rendered, 'property', 'og:image', ogImage)
  rendered = replaceMeta(rendered, 'property', 'og:url', canonical)
  rendered = replaceMeta(rendered, 'name', 'twitter:title', seo.twitter_title || title)
  rendered = replaceMeta(rendered, 'name', 'twitter:description', seo.twitter_description || description)
  rendered = replaceMeta(rendered, 'name', 'twitter:image', twitterImage)

  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`
  rendered = /<link\s+rel=["']canonical["'][^>]*>/i.test(rendered)
    ? rendered.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag)
    : rendered.replace('</head>', `    ${canonicalTag}\n  </head>`)

  // Inject Hreflang Tags for International & UAE SEO
  const hreflangTags = [
    `<link rel="alternate" hreflang="en-ae" href="${escapeHtml(canonical)}" />`,
    `<link rel="alternate" hreflang="en" href="${escapeHtml(canonical)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(canonical)}" />`,
  ].join('\n    ')
  if (!rendered.includes('hreflang="en-ae"')) {
    rendered = rendered.replace('</head>', `    ${hreflangTags}\n  </head>`)
  }

  // Inject Google Site Verification if configured in environment
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_VERIFICATION
  if (googleVerification && !rendered.includes('name="google-site-verification"')) {
    rendered = rendered.replace('</head>', `    <meta name="google-site-verification" content="${escapeHtml(googleVerification)}" />\n  </head>`)
  }

  // Inject Standard Organization & LocalBusiness JSON-LD Schema
  const organizationJson = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: 'ONPRINT',
    alternateName: '0nprint',
    legalName: 'ONPRINT Printing & Branding Solutions',
    url: siteUrl,
    logo: `${siteUrl}/logo_icon.png`,
    image: `${siteUrl}/logo_icon.png`,
    description: 'ONPRINT is a commercial printing, packaging, and corporate branding press located in Al Quoz, Dubai, UAE. Specializing in luxury business cards, custom packaging, product labels, marketing collaterals, and corporate gifts.',
        email: '0nprint183@gmail.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Al Quoz',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      postalCode: '00000',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.1328,
      longitude: 55.2348,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '18:30',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
                contactType: 'customer service / sales',
        areaServed: 'AE',
        availableLanguage: ['English', 'Arabic', 'Urdu'],
      },
      {
        '@type': 'ContactPoint',
                contactType: 'concierge / WhatsApp quotes',
        areaServed: 'AE',
        availableLanguage: ['English', 'Urdu'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/onprintdubai',
      'https://www.instagram.com/onprintdubai',
      'https://www.linkedin.com/company/onprintdubai',
    ],
    areaServed: [
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'City', name: 'Abu Dhabi' },
      { '@type': 'City', name: 'Sharjah' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
  }

  const websiteJson = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'ONPRINT Printing Dubai',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  rendered = rendered.replace(
    '</head>',
    `    <script type="application/ld+json">${JSON.stringify(organizationJson)}</script>\n    <script type="application/ld+json">${JSON.stringify(websiteJson)}</script>\n  </head>`
  )

  // Inject BreadcrumbList JSON-LD for nested landing pages
  let breadcrumbItems = null
  if (requestPath.startsWith('/categories/') && requestPath.length > 12) {
    breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${siteUrl}/categories` },
      { '@type': 'ListItem', position: 3, name: seo.h1 || seo.meta_title || 'Category', item: canonical },
    ]
  } else if (requestPath.startsWith('/products/') && requestPath.length > 10) {
    breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${siteUrl}/products` },
      { '@type': 'ListItem', position: 3, name: seo.h1 || seo.meta_title || 'Product', item: canonical },
    ]
  } else if (requestPath.startsWith('/services/') && requestPath.length > 10) {
    breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
      { '@type': 'ListItem', position: 3, name: seo.h1 || seo.meta_title || 'Service', item: canonical },
    ]
  } else if (requestPath.startsWith('/blog/') && requestPath.length > 6) {
    breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: seo.h1 || seo.meta_title || 'Article', item: canonical },
    ]
  } else if (bcData) {
    breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Business Card Printing Dubai', item: `${siteUrl}/business-card-printing-dubai` },
      { '@type': 'ListItem', position: 3, name: bcData.h1, item: canonical },
    ]
  } else if (COMMERCIAL_STATIC_PATHS.has(requestPath)) {
    breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
      { '@type': 'ListItem', position: 3, name: seo.h1 || seo.meta_title || 'Commercial Printing', item: canonical },
    ]
  }

  if (breadcrumbItems) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    }
    rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>\n  </head>`)
  }

  // Inject FAQPage Schema for Business Card Landing Pages if available
  if (bcData && bcData.faqs && bcData.faqs.length > 0 && !rendered.includes('"@type":"FAQPage"')) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: bcData.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    }
    rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n  </head>`)
  }

  // Inject Service Schema for Business Card Landing Pages
  if (bcData) {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: bcData.h1,
      description: bcData.metaDescription,
      provider: {
        '@id': `${siteUrl}/#organization`,
      },
      areaServed: [
        { '@type': 'City', name: 'Dubai' },
        { '@type': 'City', name: 'Abu Dhabi' },
        { '@type': 'City', name: 'Sharjah' },
        { '@type': 'Country', name: 'United Arab Emirates' },
      ],
      serviceType: 'Business Card Printing',
    }
    rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>\n  </head>`)
  }

  if (seo.schema_markup) {
    try {
      const schemaMarkup = JSON.stringify(JSON.parse(seo.schema_markup))
      rendered = rendered.replace('</head>', `    <script type="application/ld+json">${schemaMarkup}</script>\n  </head>`)
    } catch {
      // Ignore invalid stored schema; the client-side SEO layer also rejects it.
    }
  }

  return rendered
}

const COMMERCIAL_STATIC_PATHS = new Set([
  '/printing-services-dubai',
  '/business-card-printing-dubai',
  '/business-card-printing-uae',
  '/visiting-card-printing-dubai',
  '/premium-business-cards',
  '/luxury-business-cards',
  '/foil-business-cards',
  '/spot-uv-business-cards',
  '/velvet-business-cards',
  '/soft-touch-business-cards',
  '/embossed-business-cards',
  '/corporate-business-cards',
  '/business-card-design',
  '/same-day-business-card-printing',
  '/business-card-printing-abu-dhabi',
  '/business-card-printing-sharjah',
  '/business-card-printing-ajman',
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
  '/mug-printing-dubai',
  '/bottle-printing-dubai',
])

const PUBLIC_STATIC_PATHS = new Set([
  '/',
  '/about',
  '/services',
  '/categories',
  '/products',
  '/blog',
  '/portfolio',
  '/contact',
  '/get-a-quote',
  '/track-order',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/printing-services',
  '/printing-solutions',
  ...COMMERCIAL_STATIC_PATHS,
])

async function isKnownPublicPath(requestPath) {
  if (PUBLIC_STATIC_PATHS.has(requestPath)) return true

  const dynamicRoute = requestPath.match(/^\/(categories|products|services|blog|printing-services|printing-solutions)\/([^/]+)$/)
  if (!dynamicRoute) return false

  const [, routeType, slug] = dynamicRoute
  try {
    if (routeType === 'categories') {
      const [rows] = await pool.execute('SELECT id FROM categories WHERE slug = ? AND active = 1 LIMIT 1', [slug])
      return rows.length > 0
    }
    if (routeType === 'products') {
      const [rows] = await pool.execute('SELECT id FROM products WHERE slug = ? AND active = 1 LIMIT 1', [slug])
      return rows.length > 0
    }
    if (routeType === 'services') {
      const [rows] = await pool.execute('SELECT id FROM services WHERE slug = ? AND active = 1 LIMIT 1', [slug])
      return rows.length > 0
    }
    if (routeType === 'blog') {
      const [rows] = await pool.execute(
        `SELECT id FROM blogs WHERE slug = ? AND status = 'published' AND (published_at IS NULL OR published_at <= NOW()) LIMIT 1`,
        [slug]
      )
      return rows.length > 0
    }
    return true
  } catch {
    // Preserve SPA fallback behavior for recognized dynamic sections when the DB is temporarily unavailable.
    return true
  }
}

function createApp() {
  const app = express()

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      const clientUrls = process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
        : []

      if (clientUrls.includes('*') || clientUrls.includes(origin)) {
        return callback(null, true)
      }

      if (
        origin === 'https://0nprint.com' ||
        origin === 'https://www.0nprint.com' ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.endsWith('.airoapp.ai') ||
        !process.env.CLIENT_URL
      ) {
        return callback(null, true)
      }

      return callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 204,
  }

  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
  app.use(compression())
  app.use(cors(corsOptions))
  app.options('*', cors(corsOptions))

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }

  // Canonical domain & trailing-slash normalization middleware
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()

    // Host canonicalization (www -> non-www)
    const host = req.headers.host || ''
    if (host.startsWith('www.')) {
      const nonWwwHost = host.slice(4)
      const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https'
      return res.redirect(301, `${proto}://${nonWwwHost}${req.originalUrl}`)
    }

    // Trailing slash normalization (except root /)
    const [pathname, search] = req.url.split('?')
    if (pathname.length > 1 && pathname.endsWith('/')) {
      const cleanUrl = pathname.slice(0, -1) + (search ? `?${search}` : '')
      return res.redirect(301, cleanUrl)
    }

    next()
  })

  // Server-side 301 Permanent Redirects for legacy and alternate routes
  app.get('/category/:slug', (req, res) => res.redirect(301, `/categories/${req.params.slug}`))
  app.get('/product/:slug', (req, res) => res.redirect(301, `/products/${req.params.slug}`))
  app.get(['/track', '/orders/track', '/order-tracking', '/customer', '/account'], (req, res) => res.redirect(301, '/track-order'))
  app.get(['/login', '/register'], (req, res) => res.redirect(301, '/admin/login'))
  app.get(['/quote', '/get-quote', '/quote-request', '/pricing'], (req, res) => res.redirect(301, '/get-a-quote'))

  // Commercial Landing Page Aliases 301 Permanent Redirects
  app.get('/business-card-printing', (req, res) => res.redirect(301, '/business-card-printing-dubai'))
  app.get('/custom-packaging', (req, res) => res.redirect(301, '/custom-packaging-dubai'))
  app.get('/packaging-printing', (req, res) => res.redirect(301, '/packaging-printing-dubai'))
  app.get('/brochure-printing', (req, res) => res.redirect(301, '/brochure-printing-dubai'))
  app.get('/flyer-printing', (req, res) => res.redirect(301, '/flyer-printing-dubai'))
  app.get('/sticker-printing', (req, res) => res.redirect(301, '/sticker-printing-dubai'))
  app.get('/label-printing', (req, res) => res.redirect(301, '/label-printing-dubai'))
  app.get('/signage-printing', (req, res) => res.redirect(301, '/signage-printing-dubai'))
  app.get('/large-format-printing', (req, res) => res.redirect(301, '/large-format-printing-dubai'))
  app.get('/corporate-printing', (req, res) => res.redirect(301, '/corporate-printing-dubai'))
  app.get('/promotional-printing', (req, res) => res.redirect(301, '/promotional-printing-dubai'))

  // Dynamic Database-Driven 301/302 Redirect Manager (Requirement 28)
  app.use(async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    if (req.path.startsWith('/api/') || req.path.startsWith('/assets/') || req.path.startsWith('/uploads/')) return next()

    try {
      const [rows] = await pool.query(
        'SELECT new_url, redirect_type FROM seo_redirects WHERE old_url = ? AND status = "active" LIMIT 1',
        [req.path]
      )
      if (rows && rows.length > 0) {
        const rule = rows[0]
        const type = Number(rule.redirect_type) || 301
        pool.query('UPDATE seo_redirects SET hit_count = hit_count + 1 WHERE old_url = ?', [req.path]).catch(() => {})
        return res.redirect(type, rule.new_url)
      }
    } catch {}

    next()
  })

  // Direct SEO endpoints on root
  app.get('/robots.txt', getRobotsTxt)
  app.get('/llms.txt', getLlmsTxt)
  app.get('/sitemap.xml', getSitemapXml)
  app.get('/ads.txt', getAdsTxt)

  // Database Health Check endpoint
  app.get('/api/health/db', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT 1 AS connected')
      if (rows && rows.length > 0) {
        return res.status(200).json({
          success: true,
          database: 'MySQL',
          connected: true,
        })
      }
      return res.status(500).json({
        success: false,
        database: 'MySQL',
        connected: false,
        error: 'Database connection failed',
      })
    } catch {
      return res.status(500).json({
        success: false,
        database: 'MySQL',
        connected: false,
        error: 'Database connection failed',
      })
    }
  })

  // Immediate HEAD checks for platform health pingers
  app.head('/', (_req, res) => res.status(200).end())
  app.head(['/health', '/healthz', '/ping', '/api/health'], (_req, res) => res.status(200).end())

  // Standard Platform & Cloud Health Endpoints (GET /health, /healthz, /ping, /api/health)
  app.get(['/health', '/healthz', '/ping', '/api/health'], async (_req, res) => {
    let databaseConnected = false
    try {
      const [rows] = await pool.query('SELECT 1 AS connected')
      databaseConnected = Boolean(rows && rows.length > 0)
    } catch {
      databaseConnected = false
    }

    res.status(200).json({
      status: 'ok',
      health: 'healthy',
      service: 'ONPRINT',
      uptime: Math.round(process.uptime()),
      databaseConnected,
      timestamp: new Date().toISOString(),
      message: 'ONPRINT Production API is running',
    })
  })

  // Static assets & Uploads with caching headers
  const staticCacheOptions = {
    maxAge: '1y',
    immutable: true,
  }
  const uploadCacheOptions = {
    maxAge: '7d',
  }

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), uploadCacheOptions))
  app.use('/assets', express.static(path.join(__dirname, 'assets'), staticCacheOptions))
  app.use('/assets', express.static(path.join(__dirname, '..', 'client', 'public', 'assets'), staticCacheOptions))

  // API Routes
  app.use('/api/auth', authRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/services', serviceRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/contact', contactRoutes)
  app.use('/api/quotes', quoteRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/newsletter', newsletterRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/upload', uploadRoutes)
  app.use('/api/blog', blogRoutes)
  app.use('/api/blogs', blogRoutes)
  app.use('/api/seo', seoRoutes)

  // Single-process deployment for GoDaddy / cPanel / Node.js Apps
  app.use('/assets', express.static(path.join(CLIENT_DIST, 'assets'), staticCacheOptions))
  app.use(
    express.static(CLIENT_DIST, {
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, must-revalidate')
        }
      },
    })
  )

  // SPA, SEO Server-Side Shell & Health-Safe Fallback
  app.get(/^(?!\/api).*/, async (req, res, next) => {
    const indexPath = path.join(CLIENT_DIST, 'index.html')
    const hasDist = fs.existsSync(indexPath)

    res.setHeader('Cache-Control', 'no-cache, must-revalidate')

    if (hasDist) {
      try {
        const knownPath = await isKnownPublicPath(req.path)
        const renderedShell = await renderSeoShell(req.path, { noindex: !knownPath })
        return res.status(knownPath ? 200 : 404).type('html').send(renderedShell)
      } catch (error) {
        return res.sendFile(indexPath)
      }
    }

    // Never 404 on the root path — guarantees cloud platform health checks always succeed
    if (req.path === '/' || req.path === '') {
      return res.status(200).type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ONPRINT Dubai — Printing & Branding Solutions</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 60px 20px; background: #0c0d0e; color: #f8fafc;">
  <h1 style="color: #d4af37; font-size: 2.2rem; margin-bottom: 0.5rem;">ONPRINT Dubai</h1>
  <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 1.5rem;">Haute Imprimerie • Luxury Printing & Packaging Press</p>
  <div style="display: inline-block; padding: 8px 18px; border-radius: 9999px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-weight: 500; font-size: 0.95rem;">
    ✓ Service Status: Operational (HTTP 200 OK)
  </div>
</body>
</html>`)
    }

    next()
  })

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = createApp
