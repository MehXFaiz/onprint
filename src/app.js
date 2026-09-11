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
const breadcrumbService = require('./services/breadcrumbService')

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

async function renderSeoShell(requestPath) {
  const indexPath = path.join(CLIENT_DIST, 'index.html')
  const html = await fs.promises.readFile(indexPath, 'utf8')
  const siteUrl = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

  let seo
  try {
    seo = await pageSeoService.getPageByUrl(requestPath)
  } catch (error) {
    console.warn('[SEO] Server shell metadata lookup warning:', error.message)
  }

  if (!seo) return html

  const title = seo.meta_title || 'Printing Company in Dubai | ONPRINT'
  const description = seo.meta_description || ''
  const canonical = seo.canonical_url || `${siteUrl}${requestPath === '/' ? '' : requestPath}`
  const ogImage = absoluteSeoUrl(seo.og_image, siteUrl)
  const twitterImage = absoluteSeoUrl(seo.twitter_image || seo.og_image, siteUrl)
  const robots = `${seo.robots_index || 'index'}, ${seo.robots_follow || 'follow'}, max-image-preview:large`

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
        const renderedShell = await renderSeoShell(req.path)
        res.type('html').send(renderedShell)
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
