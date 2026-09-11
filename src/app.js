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

  const title = seo.meta_title || 'Printing Company in Dubai | ONPRINT'
  const description = seo.meta_description || ''
  const canonical = seo.canonical_url || `${siteUrl}${requestPath === '/' ? '' : requestPath}`
  const ogImage = absoluteSeoUrl(seo.og_image, siteUrl)
  const twitterImage = absoluteSeoUrl(seo.twitter_image || seo.og_image, siteUrl)
  const robots = noindex
    ? 'noindex, nofollow'
    : `${seo.robots_index || 'index'}, ${seo.robots_follow || 'follow'}, max-image-preview:large`

  let rendered = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  rendered = replaceMeta(rendered, 'name', 'description', description)
  rendered = replaceMeta(rendered, 'name', 'keywords', [seo.focus_keyword, seo.secondary_keywords].filter(Boolean).join(', '))
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
    legalName: 'ONPRINT Printing & Branding Solutions',
    url: siteUrl,
    logo: `${siteUrl}/logo_icon.png`,
    image: `${siteUrl}/logo_icon.png`,
    description: 'ONPRINT is Dubai’s premier physical branding & commercial printing press. Specializing in executive stationery, luxury packaging, corporate gifts, large-format rollups, and precision digital printing across the UAE.',
    telephone: '+9714800PRINT',
    email: 'info@onprint.ae',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Al Quoz Industrial Area 3',
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
  }

  if (breadcrumbItems) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    }
    rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>\n  </head>`)
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

  // General Health endpoint
  app.get('/api/health', async (req, res) => {
    let databaseConnected = false
    try {
      const [rows] = await pool.query('SELECT 1 AS connected')
      databaseConnected = rows.length > 0
    } catch {
      databaseConnected = false
    }

    res.json({
      success: true,
      database: 'MySQL',
      databaseConnected,
      message: 'ONPRINT GoDaddy MySQL API is running',
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
  const hasClientBuild = fs.existsSync(path.join(CLIENT_DIST, 'index.html'))
  if (hasClientBuild) {
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
    app.get(/^(?!\/api).*/, async (req, res, next) => {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate')
      try {
        const knownPath = await isKnownPublicPath(req.path)
        const renderedShell = await renderSeoShell(req.path, { noindex: !knownPath })
        res.status(knownPath ? 200 : 404).type('html').send(renderedShell)
      } catch (error) {
        next(error)
      }
    })
  }

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = createApp
