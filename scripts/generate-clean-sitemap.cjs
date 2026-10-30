const fs = require('fs')
const path = require('path')
const http = require('http')

const SITE_URL = 'https://www.0nprint.com'
const today = new Date().toISOString().split('T')[0]

const initialData = require('../src/data/initialData')
const { BUSINESS_CARDS_LANDING_DATA } = require('../src/data/businessCardsLandingData')
const { COMMERCIAL_LANDING_PAGES } = require('../src/data/commercialLandingPagesData')
const { DEFAULT_BLOG_GUIDES } = require('../client/src/data/defaultBlogGuides')
const dbStore = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/dbStore.json'), 'utf8'))

const urlEntries = []
const seenPaths = new Set()

function addUrl(urlPath, priority = '0.8', changefreq = 'weekly') {
  const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`
  if (seenPaths.has(cleanPath)) return
  seenPaths.add(cleanPath)
  urlEntries.push({
    loc: `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`,
    path: cleanPath,
    priority,
    changefreq,
    lastmod: today,
  })
}

// 1. Core Arabic Landing Pages
addUrl('/ar', '1.0', 'daily')
addUrl('/ar/business-cards', '0.95', 'weekly')
addUrl('/ar/stickers', '0.95', 'weekly')
addUrl('/ar/sticker-printing-dubai', '0.95', 'weekly')
addUrl('/ar/stamps', '0.9', 'weekly')
addUrl('/ar/printing-services', '0.9', 'weekly')

// 2. Core English Public Pages
addUrl('/', '1.0', 'daily')
addUrl('/services', '0.95', 'weekly')
addUrl('/categories', '0.9', 'weekly')
addUrl('/products', '0.9', 'daily')
addUrl('/get-a-quote', '0.9', 'weekly')
addUrl('/corporate-quotes', '0.85', 'weekly')
addUrl('/portfolio', '0.8', 'weekly')
addUrl('/about', '0.8', 'monthly')
addUrl('/contact', '0.8', 'weekly')
addUrl('/faq', '0.8', 'weekly')
addUrl('/finishes', '0.8', 'monthly')
addUrl('/track-order', '0.7', 'monthly')
addUrl('/privacy-policy', '0.5', 'monthly')
addUrl('/terms', '0.5', 'monthly')

// 3. Business Card Topical Clusters (18 dedicated pages)
for (const key of Object.keys(BUSINESS_CARDS_LANDING_DATA)) {
  addUrl(`/${key}`, '0.9', 'weekly')
}

// 4. Commercial Landing Pages
for (const key of Object.keys(COMMERCIAL_LANDING_PAGES)) {
  addUrl(`/${key}`, '0.9', 'weekly')
}
addUrl('/sticker-printing-dubai', '0.95', 'weekly')
addUrl('/rubber-stamps-dubai', '0.9', 'weekly')
addUrl('/rollup-banners', '0.9', 'weekly')

// 5. Active Categories from initialData
for (const cat of initialData.categories || []) {
  if (cat.active !== false && cat.slug) {
    addUrl(`/categories/${cat.slug}`, '0.85', 'weekly')
  }
}

// 6. Active Services from initialData
for (const srv of initialData.services || []) {
  if (srv.active !== false && srv.slug) {
    addUrl(`/services/${srv.slug}`, '0.85', 'weekly')
  }
}

// 7. Active Products from initialData
for (const prod of initialData.products || []) {
  if (prod.active !== false && prod.slug) {
    addUrl(`/products/${prod.slug}`, '0.8', 'weekly')
  }
}

// 8. Blog Index & Published Guides
addUrl('/blog', '0.85', 'daily')

const allBlogs = [
  ...(DEFAULT_BLOG_GUIDES || []),
  ...((dbStore && dbStore.blogs) || []),
]

const seenBlogSlugs = new Set()
for (const b of allBlogs) {
  if (b.slug && !seenBlogSlugs.has(b.slug) && b.status !== 'draft') {
    seenBlogSlugs.add(b.slug)
    addUrl(`/blog/${b.slug}`, '0.8', 'weekly')
  }
}

// Now test all paths against Express server before writing sitemap!
async function validateAndWrite() {
  const createApp = require('../src/app')
  const app = createApp()
  const server = http.createServer(app)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port

  console.log(`[Sitemap] Testing ${urlEntries.length} candidate URLs against live Express instance...`)
  const validEntries = []
  const invalidEntries = []

  for (const entry of urlEntries) {
    await new Promise((resolve) => {
      http.get({ port, path: entry.path }, (res) => {
        if (res.statusCode === 200) {
          validEntries.push(entry)
        } else {
          invalidEntries.push({ path: entry.path, status: res.statusCode })
        }
        resolve()
      })
    })
  }

  server.close()

  console.log(`[Sitemap] Validation Complete: ${validEntries.length} OK (200), ${invalidEntries.length} Invalid/Redirects.`)
  if (invalidEntries.length > 0) {
    console.warn('[Sitemap] Filtered out non-200 URLs:', invalidEntries)
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  for (const item of validEntries) {
    xml += `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>\n`
  }
  xml += `</urlset>\n`

  const targetFiles = [
    path.resolve(__dirname, '../sitemap.xml'),
    path.resolve(__dirname, '../client/public/sitemap.xml'),
  ]

  for (const f of targetFiles) {
    fs.writeFileSync(f, xml, 'utf8')
    console.log(`[Sitemap] Written clean sitemap with ${validEntries.length} canonical URLs to ${f}`)
  }
}

validateAndWrite().catch(console.error)
