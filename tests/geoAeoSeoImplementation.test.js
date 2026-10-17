const assert = require('assert')
const http = require('http')
const fs = require('fs')
const path = require('path')
const app = require('../src/app')
const persistentStore = require('../src/data/persistentStore')
const {
  PRIORITIZED_BUSINESS_CARD_KEYWORDS,
  ADDITIONAL_VERIFIED_PRODUCT_KEYWORDS,
  ALL_MAPPED_BUSINESS_CARD_KEYWORDS,
  LINK_WORTHY_CONTENT_ASSETS,
} = require('../src/services/businessCardLinkBuildingService')
const { BUSINESS_CARD_LINKABLE_GUIDES } = require('../src/data/businessCardLinkableGuidesData')

function request(server, method, urlPath, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const addr = server.address()
    const payload = body ? JSON.stringify(body) : null
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: addr.port,
        path: urlPath,
        method,
        headers: {
          'User-Agent': 'GPTBot/1.0 (+https://openai.com/gptbot)',
          ...(payload
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
              }
            : {}),
          ...headers,
        },
      },
      (res) => {
        let raw = ''
        res.on('data', (chunk) => {
          raw += chunk
        })
        res.on('end', () => {
          let json = null
          try {
            json = JSON.parse(raw)
          } catch {
            // Non-JSON response (HTML / XML / TXT)
          }
          resolve({ status: res.statusCode, headers: res.headers, text: raw, json })
        })
      }
    )
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

function extractJsonLdBlocks(html) {
  const blocks = []
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const raw = match[1].trim()
    if (raw) {
      blocks.push(JSON.parse(raw))
    }
  }
  return blocks
}

async function runTests() {
  console.log('=== ONPRINT Complete GEO + AEO + SEO + AI Search Visibility Test Suite ===')

  // 1. Verify Keyword Mapping & Zero Fabricated Metrics
  assert.strictEqual(PRIORITIZED_BUSINESS_CARD_KEYWORDS.length, 20, 'Should have 20 core target keywords')
  assert.strictEqual(ADDITIONAL_VERIFIED_PRODUCT_KEYWORDS.length, 10, 'Should have 10 additional verified product keywords')
  assert.strictEqual(
    ALL_MAPPED_BUSINESS_CARD_KEYWORDS.length,
    30,
    'ALL_MAPPED_BUSINESS_CARD_KEYWORDS should contain 30 total keywords'
  )

  const requiredPrimaryKeywords = [
    'business card printing Dubai',
    'business cards Dubai',
    'custom business cards Dubai',
    'business card printing UAE',
    'premium business card printing Dubai',
    'luxury business cards Dubai',
    'affordable business card printing Dubai',
    'corporate business cards Dubai',
    'business card design and printing Dubai',
    'business card printing with delivery Dubai',
  ]
  const requiredProductKeywords = [
    'gold foil business cards Dubai',
    'embossed business cards Dubai',
    'Spot UV business cards Dubai',
    'matte business cards Dubai',
    'PVC business cards Dubai',
    'eco-friendly business cards Dubai',
    'same-day business card printing Dubai',
  ]

  const normKw = (s) => String(s || '').replace(/-/g, ' ').toLowerCase().trim()
  const allKwLower = new Set(ALL_MAPPED_BUSINESS_CARD_KEYWORDS.map((k) => normKw(k.keyword)))
  for (const kw of [...requiredPrimaryKeywords, ...requiredProductKeywords]) {
    assert.ok(allKwLower.has(normKw(kw)), `Missing required mapped keyword: ${kw}`)
  }

  for (const kwObj of ALL_MAPPED_BUSINESS_CARD_KEYWORDS) {
    assert.strictEqual(kwObj.search_volume, null, `Keyword "${kwObj.keyword}" must not fabricate search_volume`)
    assert.strictEqual(kwObj.keyword_difficulty, null, `Keyword "${kwObj.keyword}" must not fabricate keyword_difficulty`)
    assert.ok(kwObj.target_url.startsWith('/'), `Keyword "${kwObj.keyword}" must map to a valid path`)
  }
  console.log(`✔ Verified ${ALL_MAPPED_BUSINESS_CARD_KEYWORDS.length} mapped Business Card keywords with zero fabricated metrics`)

  // 2. Verify all 8 Citation-Worthy Business Card Guides exist in persistentStore
  assert.strictEqual(BUSINESS_CARD_LINKABLE_GUIDES.length, 7, 'BUSINESS_CARD_LINKABLE_GUIDES should define the 7 specialized guides (IDs 19–25)')
  assert.strictEqual(LINK_WORTHY_CONTENT_ASSETS.length, 8, 'LINK_WORTHY_CONTENT_ASSETS should list all 8 link-worthy content assets (including ID #1)')
  const storeBlogs = persistentStore.getBlogs()
  for (const asset of LINK_WORTHY_CONTENT_ASSETS) {
    const slug = asset.url.replace('/blog/', '')
    const found = storeBlogs.find((b) => b.slug === slug)
    assert.ok(found, `Guide ${slug} must be persisted in persistentStore.getBlogs()`)
    assert.ok(found.content && found.content.length > 1000, `Guide ${slug} must have comprehensive HTML content`)
  }
  for (const guide of BUSINESS_CARD_LINKABLE_GUIDES) {
    const found = storeBlogs.find((b) => b.slug === guide.slug)
    assert.ok(Array.isArray(found.faqs) && found.faqs.length >= 1, `Guide ${guide.slug} must include structured FAQs`)
  }
  console.log('✔ Verified all 8 citation-worthy Business Card guides in persistentStore')

  // 3. Start Express server and test HTTP routes, SSR HTML, JSON-LD, robots.txt, llms.txt, sitemap.xml, and conversions
  const server = http.createServer(app)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))

  try {
    // 3A. Test /robots.txt
    const robotsRes = await request(server, 'GET', '/robots.txt')
    assert.strictEqual(robotsRes.status, 200)
    for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended']) {
      assert.ok(robotsRes.text.includes(`User-agent: ${bot}`), `robots.txt must explicitly configure ${bot}`)
    }
    assert.ok(robotsRes.text.includes('Disallow: /admin'), 'robots.txt must protect /admin')
    assert.ok(robotsRes.text.includes('Disallow: /api/'), 'robots.txt must protect /api/')
    assert.ok(robotsRes.text.includes('Disallow: /dashboard'), 'robots.txt must protect /dashboard')
    assert.ok(robotsRes.text.includes('Sitemap: https://www.0nprint.com/sitemap.xml'), 'robots.txt must declare canonical sitemap')
    console.log('✔ Verified /robots.txt AI crawler access & private route protection')

    // 3B. Test /llms.txt
    const llmsRes = await request(server, 'GET', '/llms.txt')
    assert.strictEqual(llmsRes.status, 200)
    assert.ok(llmsRes.text.includes('optional, experimental machine-readable index'), 'llms.txt must include experimental disclaimer')
    assert.ok(llmsRes.text.includes('+44 7344546056'), 'llms.txt must include verified WhatsApp number')
    for (const guide of BUSINESS_CARD_LINKABLE_GUIDES) {
      assert.ok(llmsRes.text.includes(`/blog/${guide.slug}`), `llms.txt must reference /blog/${guide.slug}`)
    }
    console.log('✔ Verified /llms.txt content, experimental note, and 8 guide links')

    // 3C. Test /sitemap.xml
    const sitemapRes = await request(server, 'GET', '/sitemap.xml')
    assert.strictEqual(sitemapRes.status, 200)
    assert.ok(sitemapRes.text.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'))
    for (const keyPath of [
      '/business-card-printing-dubai',
      '/foil-business-cards',
      '/spot-uv-business-cards',
      '/embossed-business-cards',
      '/same-day-business-card-printing',
      '/bottle-printing-dubai',
      '/sticker-printing-dubai',
    ]) {
      assert.ok(sitemapRes.text.includes(keyPath), `sitemap.xml must include ${keyPath}`)
    }
    for (const guide of BUSINESS_CARD_LINKABLE_GUIDES) {
      assert.ok(sitemapRes.text.includes(`/blog/${guide.slug}`), `sitemap.xml must include /blog/${guide.slug}`)
    }
    console.log('✔ Verified /sitemap.xml includes all commercial hubs and all 8 blog guides')

    // 3D. Test Server-Rendered HTML & JSON-LD on /business-card-printing-dubai (for AI & Search Crawlers without JS)
    const bcRes = await request(server, 'GET', '/business-card-printing-dubai')
    assert.strictEqual(bcRes.status, 200)
    assert.ok(bcRes.text.includes('id="ssr-seo-content"'), 'SSR HTML must inject id="ssr-seo-content"')
    assert.ok(bcRes.text.includes('350 GSM'), 'SSR HTML must include 350 GSM specification')
    assert.ok(bcRes.text.includes('600 GSM'), 'SSR HTML must include 600 GSM Cotton specification')
    assert.ok(bcRes.text.includes('760 Micron'), 'SSR HTML must include 760 Micron PVC specification')
    assert.ok(bcRes.text.includes('+44 7344546056'), 'SSR HTML must include verified WhatsApp number')
    assert.ok(bcRes.text.includes('<table'), 'SSR HTML must include comparison table')

    const ldBlocks = extractJsonLdBlocks(bcRes.text)
    assert.ok(ldBlocks.length >= 4, 'Should emit Organization/LocalBusiness, WebSite, BreadcrumbList, Service, and FAQPage JSON-LD')
    const rawLd = JSON.stringify(ldBlocks)
    assert.ok(!rawLd.includes('AggregateRating'), 'JSON-LD must never include fabricated AggregateRating')
    assert.ok(rawLd.includes('+44 7344546056'), 'JSON-LD must include verified telephone +44 7344546056')
    console.log('✔ Verified Server-Rendered HTML & JSON-LD for /business-card-printing-dubai')

    // 3D-2. Test Server-Rendered HTML & JSON-LD on /blog/:slug guides
    const blogRes = await request(server, 'GET', '/blog/business-card-printing-faqs-dubai-customers')
    assert.strictEqual(blogRes.status, 200)
    assert.ok(blogRes.text.includes('Business Card Printing FAQs for Dubai Customers'), 'SSR HTML for blog must include H1 title')
    assert.ok(blogRes.text.includes('Quick Answer:'), 'SSR HTML for blog must include Answer-First summary')
    const blogLd = extractJsonLdBlocks(blogRes.text)
    const blogLdRaw = JSON.stringify(blogLd)
    assert.ok(blogLdRaw.includes('"BlogPosting"'), 'Blog SSR must emit BlogPosting JSON-LD')
    assert.ok(blogLdRaw.includes('"FAQPage"'), 'Blog SSR must emit FAQPage JSON-LD')
    console.log('✔ Verified Server-Rendered HTML, BlogPosting & FAQPage JSON-LD for /blog/:slug guides')

    // 3E. Test Distinct Conversion Tracking & AI Referrer Detection
    const trackWa = await request(server, 'POST', '/api/seo/conversions/track', {
      conversion_type: 'whatsapp_click',
      landing_page: '/business-card-printing-dubai',
      referrer: 'https://chatgpt.com/',
      source_label: 'hero_whatsapp_cta',
    })
    assert.strictEqual(trackWa.status, 201)
    assert.strictEqual(trackWa.json.success, true)
    assert.strictEqual(trackWa.json.event.conversion_type, 'whatsapp_click')
    assert.strictEqual(trackWa.json.event.is_ai_referrer, true)

    const trackQuote = await request(server, 'POST', '/api/seo/conversions/track', {
      conversion_type: 'quote_request',
      landing_page: '/business-card-printing-dubai',
      referrer: 'https://www.google.ae/',
      source_label: 'business_card_calculator',
    })
    assert.strictEqual(trackQuote.status, 201)
    assert.strictEqual(trackQuote.json.event.conversion_type, 'quote_request')
    assert.strictEqual(trackQuote.json.event.is_ai_referrer, false)

    // Verify WhatsApp utility file contains verified number and required pre-filled fields
    const waFile = fs.readFileSync(path.join(__dirname, '../client/src/utils/whatsapp.js'), 'utf8')
    assert.ok(waFile.includes('447344546056'), 'whatsapp.js must default to 447344546056')
    assert.ok(waFile.includes('Quantity:'), 'whatsapp.js business card message must prompt for Quantity')
    assert.ok(waFile.includes('Size:'), 'whatsapp.js business card message must prompt for Size')
    assert.ok(waFile.includes('Paper & Finish:'), 'whatsapp.js business card message must prompt for Finish')
    assert.ok(waFile.includes('Delivery Location:'), 'whatsapp.js business card message must prompt for Delivery Location')
    console.log('✔ Verified WhatsApp (+44 7344546056) message structure and distinct conversion tracking beacons')
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }

  console.log('=== ALL GEO + AEO + SEO + AI VISIBILITY TESTS PASSED ===')
}

runTests().catch((err) => {
  console.error('Test failed:', err)
  process.exit(1)
})
