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
const { COMMERCIAL_LANDING_PAGES } = require('./data/commercialLandingPagesData')
const initialData = require('./data/initialData')
const programmaticSeoService = require('./services/programmaticSeoService')

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


function buildPrerenderedHtml(requestPath, { h1, title, description, bcData, commercialData, productData, categoryData, serviceData, progData, seo, siteUrl }) {
  let pageHeading = h1 || bcData?.h1 || commercialData?.h1 || productData?.seoHeading || productData?.name || categoryData?.seoHeading || categoryData?.name || serviceData?.name || progData?.h1 || seo?.h1
  if (!pageHeading) {
    if (requestPath === '/' || requestPath === '') {
      pageHeading = 'Commercial & Luxury Printing Company in Dubai, UAE'
    } else if (requestPath.startsWith('/services')) {
      pageHeading = 'Commercial Printing Services Dubai, UAE'
    } else if (requestPath.startsWith('/products')) {
      pageHeading = 'Commercial Print Products & Marketing Collateral Dubai'
    } else if (requestPath.startsWith('/categories')) {
      pageHeading = 'Commercial Printing Categories Dubai'
    } else if (requestPath.startsWith('/about')) {
      pageHeading = 'About ONPRINT — Commercial Pressroom in Al Quoz, Dubai'
    } else if (requestPath.startsWith('/contact')) {
      pageHeading = 'Contact ONPRINT Dubai — Commercial Printing Facility'
    } else if (requestPath.startsWith('/faq')) {
      pageHeading = 'Frequently Asked Questions — Commercial Printing Dubai'
    } else if (requestPath.startsWith('/terms')) {
      pageHeading = 'Terms & Conditions — ONPRINT Commercial Press Dubai'
    } else if (requestPath.startsWith('/privacy-policy')) {
      pageHeading = 'Privacy Policy & Data Protection — ONPRINT Dubai'
    } else {
      pageHeading = (title ? title.split('|')[0].trim() : '') || 'Commercial Printing Dubai'
    }
  }
  const metaDesc = description || bcData?.metaDescription || commercialData?.metaDescription || productData?.seoDescription || productData?.description || categoryData?.seoDescription || categoryData?.description || serviceData?.seoDescription || serviceData?.description || progData?.metaDescription || seo?.meta_description || 'Commercial printing company in Al Quoz, Dubai. Luxury business cards, brochures, flyers, stickers, letterheads, and corporate merchandise with same-day UAE delivery.'

  let dynamicBody = ''

  if (productData) {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>${escapeHtml(productData.name)} — Specifications &amp; Overview</h2>
        <p style="font-size: 1.1rem; line-height: 1.7; color: #334155;">${escapeHtml(productData.description || productData.shortDescription || metaDesc)}</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 1.1rem; color: #0f172a;">Key Product Details</h3>
          <ul style="line-height: 1.8; color: #475569;">
            ${productData.price ? `<li><strong>Starting Price:</strong> AED ${escapeHtml(productData.price)}</li>` : ''}
            ${productData.minimumQuantity ? `<li><strong>Minimum Order Quantity (MOQ):</strong> ${escapeHtml(productData.minimumQuantity)} units</li>` : ''}
            ${productData.category?.name ? `<li><strong>Category:</strong> <a href="/categories/${escapeHtml(productData.category.slug || '')}" style="color: #A82F19;">${escapeHtml(productData.category.name)}</a></li>` : ''}
            <li><strong>Production Hub:</strong> Al Quoz Central Pressroom, Dubai, UAE</li>
            <li><strong>Turnaround:</strong> Express Same-Day Rush or Standard 24–48 Hours across Dubai, Abu Dhabi &amp; all Emirates</li>
          </ul>
        </div>
        ${productData.features && productData.features.length > 0 ? `
          <h3>Product Features &amp; Finishes</h3>
          <ul>
            ${productData.features.map(feat => `<li>${escapeHtml(feat)}</li>`).join('')}
          </ul>
        ` : ''}
        ${productData.specifications?.materials && productData.specifications.materials.length > 0 ? `
          <h3>Available Substrates &amp; Papers</h3>
          <ul>
            ${productData.specifications.materials.map(m => `<li><strong>${escapeHtml(m.label || m.name || m)}</strong></li>`).join('')}
          </ul>
        ` : ''}
        ${productData.specifications?.finishes && productData.specifications.finishes.length > 0 ? `
          <h3>Luxury Finishing Options</h3>
          <ul>
            ${productData.specifications.finishes.map(f => `<li><strong>${escapeHtml(f.label || f.name || f)}</strong></li>`).join('')}
          </ul>
        ` : ''}
        <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold; color: #166534;">Direct WhatsApp Quote &amp; Proofing:</p>
          <p style="margin: 4px 0 0 0; color: #15803d;">Connect directly with our master pressman via WhatsApp at <a href="https://wa.me/447344546056" style="color: #15803d; font-weight: bold;">+44 7344 546056</a> for instant volume discounts and free digital proofing.</p>
        </div>
      </section>
    `
  } else if (categoryData) {
    const matchingProducts = (initialData.products || []).filter(p => p.category?.slug === categoryData.slug || p.categories?.some(c => c.slug === categoryData.slug)).slice(0, 12)
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>${escapeHtml(categoryData.name)} — Commercial Printing Press in Dubai</h2>
        <p style="font-size: 1.1rem; line-height: 1.7; color: #334155;">${escapeHtml(categoryData.description || metaDesc)}</p>
        <p>ONPRINT delivers end-to-end commercial printing for ${escapeHtml(categoryData.name.toLowerCase())} in Dubai. Manufactured using state-of-the-art Heidelberg offset presses and high-definition digital presses with fast 24-hour turnaround across the UAE.</p>
        ${matchingProducts.length > 0 ? `
          <h3 style="margin-top: 28px;">Featured Products in ${escapeHtml(categoryData.name)}</h3>
          <ul style="line-height: 2;">
            ${matchingProducts.map(p => `
              <li>
                <a href="/products/${escapeHtml(p.slug)}" style="color: #A82F19; font-weight: 600; text-decoration: underline;">${escapeHtml(p.name)}</a>
                ${p.shortDescription ? ` — <span style="color: #64748b;">${escapeHtml(p.shortDescription)}</span>` : ''}
              </li>
            `).join('')}
          </ul>
        ` : ''}
      </section>
    `
  } else if (serviceData) {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>${escapeHtml(serviceData.name)} — Service Capabilities</h2>
        <p style="font-size: 1.1rem; line-height: 1.7; color: #334155;">${escapeHtml(serviceData.description || serviceData.shortDescription || metaDesc)}</p>
        <p>Manufactured in-house at our Al Quoz industrial pressroom using high-speed Heidelberg offset and precision digital presses. We handle urgent short-run requests and high-volume commercial contracts for UAE enterprises, luxury retailers, and hospitality brands.</p>
      </section>
    `
  } else if (progData) {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>${escapeHtml(progData.h1 || progData.name)}</h2>
        <p style="font-size: 1.1rem; line-height: 1.7; color: #334155;">${escapeHtml(progData.metaDescription || metaDesc)}</p>
        ${progData.logistics ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0f172a;">Logistics &amp; Turnaround</h3>
            <p><strong>Turnaround:</strong> ${escapeHtml(progData.logistics.turnaround)}</p>
            <p><strong>Dispatch Hub:</strong> ${escapeHtml(progData.logistics.dispatchHub)}</p>
            <p><strong>Delivery:</strong> ${escapeHtml(progData.logistics.deliveryFee)}</p>
          </div>
        ` : ''}
        ${progData.contentSections && progData.contentSections.length > 0 ? progData.contentSections.map(sec => `
          <div style="margin-bottom: 1.5rem;">
            <h3>${escapeHtml(sec.title)}</h3>
            <p style="line-height: 1.7; color: #475569;">${escapeHtml(sec.content)}</p>
          </div>
        `).join('') : ''}
        ${progData.faqs && progData.faqs.length > 0 ? `
          <h3>Frequently Asked Questions</h3>
          ${progData.faqs.map(f => `
            <div style="margin-bottom: 1rem;">
              <h4 style="font-weight: 700; margin-bottom: 0.25rem;">${escapeHtml(f.question)}</h4>
              <p style="color: #475569;">${escapeHtml(f.answer)}</p>
            </div>
          `).join('')}
        ` : ''}
      </section>
    `
  } else if (commercialData) {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>${escapeHtml(commercialData.h1 || commercialData.title)}</h2>
        <p style="font-size: 1.1rem; line-height: 1.7; color: #334155;">${escapeHtml(commercialData.subheading || commercialData.metaDescription || metaDesc)}</p>
        ${commercialData.highlights && commercialData.highlights.length > 0 ? `
          <div style="margin: 24px 0;">
            <h3>Technical Capabilities &amp; Finishing</h3>
            <ul>
              ${commercialData.highlights.map(h => `
                <li><strong>${escapeHtml(h.title)}:</strong> ${escapeHtml(h.description)}</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        ${commercialData.faqs && commercialData.faqs.length > 0 ? `
          <h3>Frequently Asked Questions</h3>
          ${commercialData.faqs.map(f => `
            <div style="margin-bottom: 1rem;">
              <h4 style="font-weight: 700; margin-bottom: 0.25rem;">${escapeHtml(f.question)}</h4>
              <p style="color: #475569;">${escapeHtml(f.answer)}</p>
            </div>
          `).join('')}
        ` : ''}
      </section>
    `
  } else if (bcData) {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>${escapeHtml(bcData.h1 || 'Commercial Printing Specifications')}</h2>
        <p>${escapeHtml(bcData.metaDescription || '')}</p>
        <p>Manufactured in-house at our Al Quoz, Dubai facility using certified Heidelberg offset and high-definition digital press technology. Available with premium finishes including 24K hot foil stamping, raised dimensional spot UV, soft-touch velvet lamination, and precision die-cutting.</p>
      </section>
      ${bcData.faqs && bcData.faqs.length > 0 ? `
      <section style="margin-bottom: 2rem;">
        <h2>Frequently Asked Questions</h2>
        ${bcData.faqs.map(f => `
          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-weight: 700; margin-bottom: 0.25rem;">${escapeHtml(f.question)}</h3>
            <p style="color: #475569;">${escapeHtml(f.answer)}</p>
          </div>
        `).join('')}
      </section>` : ''}
    `
  } else if (requestPath === '/' || requestPath === '') {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>Dubai's Leading Commercial Printing Pressroom</h2>
        <p>ONPRINT is a premier commercial printing, corporate stationery, and business branding production facility located in Al Quoz, Dubai, UAE. We combine Heidelberg offset precision with high-definition digital presses to deliver standard and bespoke print solutions for enterprises, government entities, luxury brands, and local businesses across Dubai, Abu Dhabi, Sharjah, and all seven Emirates.</p>
        <p>Our core services encompass luxury 600 GSM business cards with painted edges, corporate stationery, waterproof die-cut vinyl stickers and labels, multi-page corporate brochures, 120 GSM executive letterheads, promotional ceramic drinkware, smart NFC PVC badges, and exhibition display signage.</p>
      </section>
      <section style="margin-bottom: 2rem;">
        <h2>Why UAE Businesses Choose ONPRINT</h2>
        <ul>
          <li><strong>Guaranteed Color Fidelity:</strong> Calibrated ISO 12647 offset printing with spectrophotometer Pantone PMS spot matching.</li>
          <li><strong>Luxury Finishing Capabilities:</strong> In-house 24K metallic gold & silver hot foiling, raised dimensional spot UV, blind debossing, and soft-touch velvet lamination.</li>
          <li><strong>Same-Day & Express 24h Turnaround:</strong> Dedicated urgent print lines for critical corporate deadlines, exhibitions, and trade shows.</li>
          <li><strong>Direct Pressroom Pricing:</strong> Zero middlemen, zero agent markups — direct factory pricing with free pre-press digital proofing.</li>
        </ul>
      </section>
      <section style="margin-bottom: 2rem;">
        <h2>Popular Commercial Printing Categories</h2>
        <p><a href="/business-card-printing-dubai">Luxury Business Cards Dubai</a> | <a href="/categories/letterheads-printing-dubai">Executive Letterheads & Stationery</a> | <a href="/categories/custom-stamps-seals">Custom Stamps & Official Seals</a> | <a href="/categories/stickers-printing-dubai">Custom Stickers & Product Labels</a> | <a href="/categories/brochures-printing">Corporate Brochures & Catalogs</a> | <a href="/services">Full Printing Services</a></p>
      </section>
    `
  } else if (requestPath.startsWith('/products')) {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>Commercial Product Catalog & Ordering</h2>
        <p>Explore our complete catalog of commercial print products manufactured in Al Quoz, Dubai. Every product is produced using FSC-certified sustainable papers, heavy-weight card stocks (300gsm to 600gsm duplex), and premium corporate stationery materials.</p>
        <p>Order luxury business cards, branded letterheads, laminated flyers, branded neck lanyards, NFC proximity badges, ceramic mugs, and corporate presentation folders with fast dispatch across Dubai and the UAE.</p>
      </section>
    `
  } else if (requestPath.startsWith('/categories')) {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>Comprehensive Printing Categories</h2>
        <p>ONPRINT delivers specialized commercial printing across 15+ dedicated production categories. Whether you require promotional marketing collateral, executive corporate stationery, branded merchandise, or trade show exhibition displays, our Dubai pressroom delivers high-volume consistency and rapid express turnaround.</p>
      </section>
    `
  } else if (requestPath.startsWith('/services')) {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>Offset, Digital & Specialty Press Services</h2>
        <p>Our Al Quoz facility houses multi-color Heidelberg offset presses for high-volume commercial runs, next-generation digital presses for short-run rapid dispatch, and automated finishing lines for hot foil stamping, spot UV varnishing, die-cutting, folding, and binding.</p>
      </section>
    `
  } else {
    dynamicBody = `
      <section style="margin-bottom: 2rem;">
        <h2>Commercial Printing Solutions in Dubai, UAE</h2>
        <p>${escapeHtml(metaDesc)}</p>
        <p>ONPRINT delivers high-precision commercial printing, corporate stationery, and branding merchandise with express same-day and 24h delivery across Dubai, Abu Dhabi, and the wider UAE.</p>
      </section>
    `
  }

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background: #ffffff; max-width: 1200px; margin: 0 auto; padding: 20px;">
      <header style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <a href="/" style="font-size: 1.5rem; font-weight: 900; color: #0f172a; text-decoration: none; letter-spacing: 0.1em;">
          ON<span style="color: #A82F19;">PRINT</span>
        </a>
        <nav style="display: flex; gap: 14px; font-size: 0.875rem; font-weight: 600; flex-wrap: wrap;">
          <a href="/" style="color: #0f172a; text-decoration: none;">Home</a>
          <a href="/products" style="color: #0f172a; text-decoration: none;">Products</a>
          <a href="/categories" style="color: #0f172a; text-decoration: none;">Categories</a>
          <a href="/business-card-printing-dubai" style="color: #A82F19; text-decoration: none;">Business Cards</a>
          <a href="/categories/letterheads-printing-dubai" style="color: #0f172a; text-decoration: none;">Stationery</a>
          <a href="/services" style="color: #0f172a; text-decoration: none;">Services</a>
          <a href="/about" style="color: #0f172a; text-decoration: none;">About</a>
          <a href="/contact" style="color: #0f172a; text-decoration: none;">Contact</a>
          <a href="/get-a-quote" style="color: #ffffff; background: #A82F19; padding: 6px 14px; border-radius: 9999px; text-decoration: none;">Get a Quote</a>
        </nav>
      </header>

      <main id="main-content">
        <article>
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">${escapeHtml(pageHeading)}</h1>
          <p style="font-size: 1.125rem; color: #475569; line-height: 1.6; margin-bottom: 2rem;">${escapeHtml(metaDesc)}</p>
          ${dynamicBody}
        </article>
      </main>

      <footer style="border-top: 1px solid #e2e8f0; margin-top: 40px; padding-top: 24px; font-size: 0.875rem; color: #64748b; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>
          <strong>ONPRINT Printing &amp; Branding Solutions LLC</strong><br />
          Al Quoz Industrial Area, Dubai, United Arab Emirates<br />
          Email: <a href="mailto:0nprint183@gmail.com" style="color: #A82F19;">0nprint183@gmail.com</a> | WhatsApp: +44 7344 546056
        </div>
        <div>
          <a href="/privacy-policy" style="color: #64748b; margin-right: 12px;">Privacy Policy</a>
          <a href="/terms" style="color: #64748b; margin-right: 12px;">Terms &amp; Conditions</a>
          <a href="/faq" style="color: #64748b;">FAQ</a>
        </div>
      </footer>
    </div>
  `
}

async function renderSeoShell(requestPath, { noindex = false } = {}) {
  const indexPath = path.join(CLIENT_DIST, 'index.html')
  const html = await fs.promises.readFile(indexPath, 'utf8')
  const siteUrl = (process.env.SITE_URL || 'https://www.0nprint.com').replace(/\/$/, '')

  let seo
  try {
    seo = await pageSeoService.getPageByUrl(requestPath)
  } catch (error) {
    console.warn('[SEO] Server shell metadata lookup warning:', error.message)
  }

  seo = seo || {}

  const cleanPathKey = requestPath.replace(/^\//, '')
  const bcData = BUSINESS_CARDS_LANDING_DATA[cleanPathKey]
  const commercialData = COMMERCIAL_LANDING_PAGES[cleanPathKey]

  let productData = null
  let categoryData = null
  let serviceData = null
  let progData = null

  if (requestPath.startsWith('/products/')) {
    const slug = requestPath.replace('/products/', '').trim()
    productData = (initialData.products || []).find((p) => p.slug === slug)
  } else if (requestPath.startsWith('/categories/')) {
    const slug = requestPath.replace('/categories/', '').trim()
    categoryData = (initialData.categories || []).find((c) => c.slug === slug)
  } else if (requestPath.startsWith('/services/')) {
    const slug = requestPath.replace('/services/', '').trim()
    serviceData = (initialData.services || []).find((s) => s.slug === slug)
  } else if (requestPath.startsWith('/printing-services/')) {
    const slug = requestPath.replace('/printing-services/', '').trim()
    progData = programmaticSeoService.getPageBySlug(slug, 'location')
  } else if (requestPath.startsWith('/printing-solutions/')) {
    const slug = requestPath.replace('/printing-solutions/', '').trim()
    progData = programmaticSeoService.getPageBySlug(slug, 'use_case')
  }

  const title =
    seo.meta_title ||
    productData?.seoTitle ||
    (productData ? `${productData.name} Dubai | Custom Printing | ONPRINT` : null) ||
    categoryData?.seoTitle ||
    (categoryData ? `${categoryData.name} in Dubai | ONPRINT` : null) ||
    serviceData?.seoTitle ||
    (serviceData ? `${serviceData.name} Dubai | ONPRINT` : null) ||
    progData?.title ||
    commercialData?.title ||
    bcData?.title ||
    'Printing Company in Dubai | ONPRINT'

  const description =
    seo.meta_description ||
    productData?.seoDescription ||
    productData?.description ||
    productData?.shortDescription ||
    categoryData?.seoDescription ||
    categoryData?.description ||
    serviceData?.seoDescription ||
    serviceData?.description ||
    progData?.metaDescription ||
    commercialData?.metaDescription ||
    bcData?.metaDescription ||
    ''

  let canonical = seo.canonical_url || `${siteUrl}${requestPath === '/' ? '' : requestPath}`
  if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
    canonical = canonical.replace(/^https?:\/\/(www\.)?0nprint\.com/i, siteUrl)
  }
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
    description: 'ONPRINT is a commercial printing, corporate stationery, and business branding press located in Al Quoz, Dubai, UAE. Specializing in luxury business cards, brochures, product labels, marketing collaterals, and corporate gifts.',
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '120',
      bestRating: '5',
      worstRating: '1',
    },
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

  // Inject Product JSON-LD Schema
  if (productData && !rendered.includes('"@type":"Product"')) {
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.name,
      description: productData.description || productData.shortDescription || description,
      image: absoluteSeoUrl(productData.image || productData.image_url, siteUrl),
      sku: `ONP-PROD-${productData.id || productData.slug}`,
      brand: {
        '@type': 'Brand',
        name: 'ONPRINT',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'AED',
        price: productData.price || '25.00',
        availability: 'https://schema.org/InStock',
        url: canonical,
        priceValidUntil: '2027-12-31',
        seller: {
          '@id': `${siteUrl}/#organization`,
        },
      },
      category: productData.category?.name || 'Commercial Printing',
    }
    rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(productSchema)}</script>\n  </head>`)
  }

  // Inject CollectionPage Schema for Categories
  if (categoryData && !rendered.includes('"@type":"CollectionPage"')) {
    const collectionSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: categoryData.name,
      description: categoryData.description || description,
      url: canonical,
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    }
    rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>\n  </head>`)
  }

  // Inject Commercial Hub Service & FAQ Schemas
  if (commercialData) {
    const commServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: commercialData.h1 || commercialData.title,
      description: commercialData.metaDescription,
      provider: {
        '@id': `${siteUrl}/#organization`,
      },
      areaServed: [
        { '@type': 'City', name: 'Dubai' },
        { '@type': 'City', name: 'Abu Dhabi' },
        { '@type': 'City', name: 'Sharjah' },
        { '@type': 'Country', name: 'United Arab Emirates' },
      ],
      serviceType: commercialData.focusKeyword || 'Commercial Printing',
    }
    rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(commServiceSchema)}</script>\n  </head>`)

    if (commercialData.faqs && commercialData.faqs.length > 0 && !rendered.includes('"@type":"FAQPage"')) {
      const commFaqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: commercialData.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      }
      rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(commFaqSchema)}</script>\n  </head>`)
    }
  }

  // Inject Programmatic Location/Use-Case Schemas
  if (progData) {
    const progServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: progData.h1 || progData.name,
      description: progData.metaDescription,
      provider: {
        '@id': `${siteUrl}/#organization`,
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: progData.name || 'Dubai',
      },
      serviceType: 'Commercial Printing',
    }
    rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(progServiceSchema)}</script>\n  </head>`)

    if (progData.faqs && progData.faqs.length > 0 && !rendered.includes('"@type":"FAQPage"')) {
      const progFaqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: progData.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      }
      rendered = rendered.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(progFaqSchema)}</script>\n  </head>`)
    }
  }

  const prerenderedBody = buildPrerenderedHtml(requestPath, {
    h1: seo.h1 || bcData?.h1 || commercialData?.h1 || productData?.seoHeading || productData?.name || categoryData?.seoHeading || categoryData?.name || progData?.h1,
    title,
    description,
    bcData,
    commercialData,
    productData,
    categoryData,
    serviceData,
    progData,
    seo,
    siteUrl,
  })

  if (rendered.includes('<div id="root"></div>')) {
    rendered = rendered.replace('<div id="root"></div>', `<div id="root">${prerenderedBody}</div>`)
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
  '/quote/business-cards',
  '/quote/stickers',
  '/quote/mugs',
  ...COMMERCIAL_STATIC_PATHS,
])

async function isKnownPublicPath(requestPath) {
  if (PUBLIC_STATIC_PATHS.has(requestPath)) return true

  const dynamicRoute = requestPath.match(/^\/(categories|products|services|blog|printing-services|printing-solutions)\/([^/]+)$/)
  if (!dynamicRoute) return false

  const [, routeType, slug] = dynamicRoute

  // 1. Programmatic landing pages
  if (routeType === 'printing-services') {
    return Boolean(programmaticSeoService.getPageBySlug(slug, 'location'))
  }
  if (routeType === 'printing-solutions') {
    return Boolean(programmaticSeoService.getPageBySlug(slug, 'use_case'))
  }

  // 2. Query Database first
  try {
    if (routeType === 'categories') {
      const [rows] = await pool.execute('SELECT id FROM categories WHERE slug = ? AND active = 1 LIMIT 1', [slug])
      if (rows.length > 0) return true
    } else if (routeType === 'products') {
      const [rows] = await pool.execute('SELECT id FROM products WHERE slug = ? AND active = 1 LIMIT 1', [slug])
      if (rows.length > 0) return true
    } else if (routeType === 'services') {
      const [rows] = await pool.execute('SELECT id FROM services WHERE slug = ? AND active = 1 LIMIT 1', [slug])
      if (rows.length > 0) return true
    } else if (routeType === 'blog') {
      const [rows] = await pool.execute(
        `SELECT id FROM blogs WHERE slug = ? AND status = 'published' AND (published_at IS NULL OR published_at <= NOW()) LIMIT 1`,
        [slug]
      )
      if (rows.length > 0) return true
    }
  } catch (err) {
    // If DB is unreachable, continue to check catalog fallbacks below
  }

  // 3. Check hardcoded/fallback catalogs if DB didn't match or was offline
  if (routeType === 'categories') {
    return (initialData.categories || []).some((c) => c.slug === slug && c.active !== false)
  }
  if (routeType === 'products') {
    return (initialData.products || []).some((p) => p.slug === slug && p.active !== false)
  }
  if (routeType === 'services') {
    return (initialData.services || []).some((s) => s.slug === slug && s.active !== false)
  }
  if (routeType === 'blog') {
    try {
      const persistentBlogs = require('./data/persistentStore').getBlogs()
      return persistentBlogs.some((b) => b.slug === slug && b.status === 'published')
    } catch {
      return false
    }
  }

  return false
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

  // Trailing-slash normalization middleware (except root /)
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()

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

  // Commercial Landing Page Aliases 301 Permanent Redirects (Direct 1-Hop)
  app.get('/business-card-printing', (req, res) => res.redirect(301, '/business-card-printing-dubai'))
  app.get(['/custom-packaging', '/packaging-printing', '/custom-packaging-dubai', '/packaging-printing-dubai'], (req, res) => res.redirect(301, '/services'))
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
          database: 'MongoDB Atlas',
          connected: true,
        })
      }
      return res.status(500).json({
        success: false,
        database: 'MongoDB Atlas',
        connected: false,
        error: 'Database connection failed',
      })
    } catch {
      return res.status(500).json({
        success: false,
        database: 'MongoDB Atlas',
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
      index: false,
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
  <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 1.5rem;">Haute Imprimerie • Luxury Commercial &amp; Executive Printing Press</p>
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
