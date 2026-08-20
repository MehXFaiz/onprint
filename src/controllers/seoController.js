const { pool, seedBlogArticles } = require('../config/database')
const { products: fallbackProducts, services: fallbackServices, categories: fallbackCategories } = require('../data/initialData')

const SITE_URL = (process.env.SITE_URL || 'https://0nprint.com').replace(/\/$/, '')

async function getRobotsTxt(req, res) {
  const robots = `User-agent: *
Allow: /
Allow: /services
Allow: /services/
Allow: /products
Allow: /products/
Allow: /portfolio
Allow: /portfolio/
Allow: /blog
Allow: /blog/
Allow: /about
Allow: /contact
Allow: /faq
Allow: /get-a-quote
Allow: /privacy-policy
Allow: /terms
Allow: /assets/
Allow: /uploads/

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
  res.type('text/plain').send(robots)
}

async function getSitemapXml(req, res) {
  try {
    const urls = []
    const now = new Date().toISOString().split('T')[0]

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

    // 2. Dynamic Categories
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
          urls.push({
            loc: `${SITE_URL}/products?category=${c.slug}`,
            lastmod: mod,
            changefreq: 'weekly',
            priority: '0.8',
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
          urls.push({
            loc: `${SITE_URL}/products?category=${c.slug}`,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.8',
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
        urls.push({
          loc: `${SITE_URL}/products?category=${c.slug}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: '0.8',
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

    // 5. Dynamic Blog Posts
    try {
      const [blogs] = await pool.execute('SELECT slug, updated_at, published_at FROM blog_posts WHERE active = 1')
      if (blogs.length > 0) {
        blogs.forEach((b) => {
          urls.push({
            loc: `${SITE_URL}/blog/${b.slug}`,
            lastmod: b.updated_at
              ? new Date(b.updated_at).toISOString().split('T')[0]
              : b.published_at
              ? new Date(b.published_at).toISOString().split('T')[0]
              : now,
            changefreq: 'monthly',
            priority: '0.75',
          })
        })
      } else if (seedBlogArticles) {
        seedBlogArticles.forEach((b) => {
          urls.push({
            loc: `${SITE_URL}/blog/${b.slug}`,
            lastmod: now,
            changefreq: 'monthly',
            priority: '0.75',
          })
        })
      }
    } catch {
      if (seedBlogArticles) {
        seedBlogArticles.forEach((b) => {
          urls.push({
            loc: `${SITE_URL}/blog/${b.slug}`,
            lastmod: now,
            changefreq: 'monthly',
            priority: '0.75',
          })
        })
      }
    }

    // Format XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

    urls.forEach((u) => {
      xml += `  <url>\n`
      xml += `    <loc>${u.loc}</loc>\n`
      xml += `    <lastmod>${u.lastmod}</lastmod>\n`
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`
      xml += `    <priority>${u.priority}</priority>\n`
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
      const [rows] = await pool.execute('SELECT id, title, slug, seo_title, seo_description, image_alt FROM blog_posts')
      blogs = rows
    } catch {
      blogs = seedBlogArticles || []
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
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  getRobotsTxt,
  getSitemapXml,
  runSeoAudit,
}
