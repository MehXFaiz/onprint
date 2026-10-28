const SITE_URL = 'https://www.0nprint.com'

/**
 * Curated, deduplicated commercial & buyer-intent keyword bank across all 19 ONPRINT categories & services.
 * All search volume & difficulty metrics are explicitly labeled as 'unverified (GSC pending)' per zero-fabrication policy.
 */
export const ALL_CATEGORY_KEYWORD_OPPORTUNITIES = [
  // 1. Business Cards
  {
    keyword: 'embossed gold foil business cards dubai',
    productOrService: 'Gold Foil Business Cards',
    category: 'Business Cards Printing',
    targetUrl: '/products/gold-foil-business-cards',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: '600gsm cotton letterpress visiting cards uae',
    productOrService: '600GSM Cotton Letterpress Business Cards',
    category: 'Business Cards Printing',
    targetUrl: '/products/600gsm-cotton-letterpress-business-cards',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'nfc smart digital business cards dubai',
    productOrService: 'NFC Smart Digital Business Cards',
    category: 'Business Cards Printing',
    targetUrl: '/products/nfc-smart-business-cards',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 2. Stickers & Product Labels
  {
    keyword: 'custom waterproof bopp roll labels dubai',
    productOrService: 'Custom Roll Labels (BOPP & Vinyl)',
    category: 'Stickers & Product Labels',
    targetUrl: '/products/custom-roll-labels',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'uv dtf 3d crystal transfer stickers uae',
    productOrService: 'UV DTF Transfer Stickers (3D Crystal Finish)',
    category: 'Stickers & Product Labels',
    targetUrl: '/products/uv-dtf-transfer-stickers',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'arabic calligraphy gold foil eid stickers dubai',
    productOrService: 'Arabic & English Bilingual Packaging Stickers',
    category: 'Stickers & Product Labels',
    targetUrl: '/products/arabic-bilingual-stickers',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 3. Custom Stamps & Seals
  {
    keyword: 'official uae trade license company stamp dubai',
    productOrService: 'Round Company Seal Stamp',
    category: 'Custom Stamps & Seals',
    targetUrl: '/products/round-company-stamps',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'vat trn tax invoice rubber stamp dubai',
    productOrService: 'VAT & TRN Tax Invoice Stamp',
    category: 'Custom Stamps & Seals',
    targetUrl: '/products/vat-trn-stamps',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 4. Flyers & Leaflets
  {
    keyword: 'a5 promotional flyer printing al quoz dubai',
    productOrService: 'Standard A5 Promotional Flyers',
    category: 'Flyers Printing In Dubai',
    targetUrl: '/products/a5-promotional-flyers',
    searchIntent: 'Local',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'hotel room door hanger printing dubai',
    productOrService: 'Door Hangers Marketing Flyers',
    category: 'Flyers Printing In Dubai',
    targetUrl: '/products/door-hangers-printing',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 5. Brochures & Catalogs
  {
    keyword: 'corporate company profile booklet printing dubai',
    productOrService: 'Saddle-Stitched Corporate Booklets',
    category: 'Brochures Printing',
    targetUrl: '/products/saddle-stitched-corporate-booklets',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'perfect bound product catalog printing uae',
    productOrService: 'Perfect-Bound Product Catalogs',
    category: 'Catalogs & Booklets Printing',
    targetUrl: '/products/perfect-bound-product-catalogs',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 6. Letterheads & Office Stationery
  {
    keyword: 'conqueror watermarked letterhead printing dubai',
    productOrService: 'Conqueror Watermarked Letterheads',
    category: 'Letterheads Printing Dubai',
    targetUrl: '/products/conqueror-watermarked-letterheads',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'carbonless ncr invoice receipt books dubai',
    productOrService: 'Carbonless NCR Invoice & Receipt Duplicate Books',
    category: 'Office Stationery & Envelopes',
    targetUrl: '/products/ncr-duplicate-books',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'custom die cut pocket presentation folders dubai',
    productOrService: 'Executive Presentation Folders',
    category: 'Office Stationery & Envelopes',
    targetUrl: '/products/presentation-folders',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 7. ID Cards, Lanyards & Name Badges
  {
    keyword: 'rfid mifare access control staff id cards dubai',
    productOrService: 'RFID & Mifare Smart Access ID Cards',
    category: 'ID Card Printing Dubai',
    targetUrl: '/products/rfid-smart-access-id-cards',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'custom sublimated exhibition lanyards dwtc dubai',
    productOrService: 'Full-Color Sublimated Satin Lanyards',
    category: 'Lanyard Printing Dubai',
    targetUrl: '/products/sublimated-satin-lanyards',
    searchIntent: 'Local',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'brushed gold magnetic staff name badges dubai',
    productOrService: 'Professional Magnetic Metal Name Badges',
    category: 'Name Badges Printing Dubai',
    targetUrl: '/products/professional-magnetic-metal-name-badges',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 8. Mugs, Water Bottles & Corporate Gifts
  {
    keyword: 'custom logo printed ceramic coffee mugs dubai',
    productOrService: 'Executive Matte Ceramic Mugs',
    category: 'Mug Printing Dubai',
    targetUrl: '/products/executive-matte-ceramic-mugs',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'laser engraved insulated stainless steel flasks uae',
    productOrService: 'Laser-Engraved Thermal Flasks',
    category: 'Water Bottle Printing Dubai',
    targetUrl: '/products/laser-engraved-thermal-flasks',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'vip employee onboarding welcome gift kits dubai',
    productOrService: 'VIP Executive Onboarding Gift Box',
    category: 'Corporate Gifts & Merchandise',
    targetUrl: '/products/vip-executive-onboarding-gift-box',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'custom branded power banks wireless chargers dubai',
    productOrService: 'Light-Up Logo Wireless Power Banks',
    category: 'Promotional Drinkware & Tech',
    targetUrl: '/products/light-up-logo-wireless-power-banks',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 9. Rollup Banners, Signage & Apparel
  {
    keyword: 'broad base luxury roll up banner stand dubai',
    productOrService: 'Luxury Teardrop & Broad-Base Roll-Up Stand',
    category: 'Rollup Banners',
    targetUrl: '/products/broad-base-luxury-rollup-banner',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: '3d illuminated acrylic reception signage dubai',
    productOrService: '3D Acrylic Office Reception Signage',
    category: 'Signage & Exhibition Banners',
    targetUrl: '/products/3d-acrylic-office-reception-signage',
    searchIntent: 'Local',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  {
    keyword: 'embroidered corporate polo shirts uniforms dubai',
    productOrService: 'Embroidered Corporate Polo Shirts',
    category: 'Custom Apparel & Wearables',
    targetUrl: '/products/embroidered-corporate-polo-shirts',
    searchIntent: 'Transactional',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
  // 10. Hospitality & Event Stationery
  {
    keyword: 'waterproof synthetic restaurant menu printing dubai',
    productOrService: 'Luxury Leather & Waterproof Restaurant Menus',
    category: 'Hospitality & Event Stationery',
    targetUrl: '/products/luxury-restaurant-menus',
    searchIntent: 'Commercial',
    discoveryDate: '2026-10-28',
    source: 'UAE Print Buyer Intent Audit (Metrics Unverified — GSC Pending)',
    status: 'active_target',
  },
]

/**
 * Clean slug generator
 */
export function slugifyText(value = '') {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate a complete, non-cannibalized SEO + GEO draft for any new or edited Product, Service, or Category.
 * Uses only factual attributes from the item and checks against existing catalog items to prevent duplicate keywords.
 */
export function generateEntitySeoDraft({
  entityType = 'product', // 'product' | 'service' | 'category'
  name = '',
  slug = '',
  categoryName = '',
  categorySlug = '',
  shortDescription = '',
  description = '',
  price = '',
  minimumQuantity = '',
  existingCatalogItems = [],
}) {
  const cleanName = String(name || 'Custom Printing').trim()
  const cleanSlug = slug ? slugifyText(slug) : slugifyText(cleanName)
  const routePrefix =
    entityType === 'service' ? '/services/' : entityType === 'category' ? '/categories/' : '/products/'
  const canonicalUrl = `${SITE_URL}${routePrefix}${cleanSlug}`

  // Normalize existing primary keywords to avoid cannibalization
  const usedPrimaryKeywords = new Set()
  const conflictingItems = []
  existingCatalogItems.forEach((item) => {
    const itemSlug = item.slug || ''
    if (itemSlug && itemSlug === cleanSlug) return
    const kws = String(item.seoKeywords || item.seo_keywords || '')
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean)
    if (kws[0]) {
      usedPrimaryKeywords.add(kws[0])
    }
  })

  // Build primary keyword
  const baseNameLower = cleanName
    .toLowerCase()
    .replace(/\s+in\s+dubai$/i, '')
    .replace(/\s+dubai$/i, '')
    .trim()

  let primaryKeyword = `${baseNameLower} dubai`
  if (usedPrimaryKeywords.has(primaryKeyword)) {
    primaryKeyword = categoryName
      ? `custom ${baseNameLower} ${categoryName.toLowerCase().replace(/\s*printing.*$/i, '')} dubai`.replace(/\s+/g, ' ')
      : `custom ${baseNameLower} printing dubai`
  }

  // Check if any existing item shares this primary keyword
  existingCatalogItems.forEach((item) => {
    if (item.slug === cleanSlug) return
    const kws = String(item.seoKeywords || item.seo_keywords || '').toLowerCase()
    if (kws.includes(primaryKeyword)) {
      conflictingItems.push({ name: item.name || item.title, slug: item.slug })
    }
  })

  // Build deduplicated secondary keywords based on entityType & category
  const secondarySet = new Set([
    `custom ${baseNameLower} uae`,
    `${baseNameLower} printing dubai`,
    `order ${baseNameLower} dubai`,
    `corporate ${baseNameLower} al quoz`,
  ])
  if (categoryName) {
    const cleanCat = categoryName.toLowerCase().replace(/\s+in\s+dubai/i, '').replace(/\s+dubai/i, '').trim()
    secondarySet.add(`${cleanCat} dubai`)
  }
  const secondaryKeywords = Array.from(secondarySet).slice(0, 4)
  const seoKeywords = [primaryKeyword, ...secondaryKeywords].join(', ')

  // Build SEO Title (target 45-64 chars)
  const nameWithLocation = /dubai|uae/i.test(cleanName) ? cleanName : `${cleanName} Dubai`
  let seoTitle = `${nameWithLocation} | Custom Printing UAE | ONPRINT`
  if (seoTitle.length > 65) {
    seoTitle = `${nameWithLocation} | ONPRINT Dubai`
  }
  if (seoTitle.length > 65) {
    seoTitle = `${cleanName.slice(0, 46).trim()} | ONPRINT`
  }

  // Build Meta Description (target 130-160 chars) using only verified facts
  const factualSpecs = []
  if (minimumQuantity && Number(minimumQuantity) > 0) {
    factualSpecs.push(`MOQ ${minimumQuantity} pcs`)
  }
  if (price && Number(price) > 0) {
    factualSpecs.push(`from AED ${Number(price).toFixed(0)}`)
  }
  const specSuffix = factualSpecs.length > 0 ? ` (${factualSpecs.join(', ')})` : ''
  const baseSummary = (shortDescription || description || '').trim()

  let seoDescription = ''
  if (baseSummary && baseSummary.length >= 50) {
    const trimmedSummary = baseSummary.replace(/\.$/, '').slice(0, 105).trim()
    seoDescription = `${trimmedSummary}${specSuffix}. Request an instant WhatsApp quote in Dubai & UAE.`
  } else {
    seoDescription = `Order custom ${cleanName} in Dubai & across the UAE${specSuffix}. Precision commercial printing, artwork verification, and fast WhatsApp quotation.`
  }
  if (seoDescription.length > 165) {
    seoDescription = `${seoDescription.slice(0, 161).trim()}...`
  }

  const seoHeading = /dubai|uae/i.test(cleanName) ? cleanName : `${cleanName} in Dubai`
  const imageAlt = `${cleanName} - ${categoryName || 'Commercial Printing'} in Dubai, UAE by ONPRINT`

  // Auto-generate factual FAQs
  const faqs = [
    {
      question: `How can I request a quotation for ${cleanName} in Dubai?`,
      answer: `You can request an instant quotation for ${cleanName} via WhatsApp (+447344546056) or through our online quote form by sharing your required quantity, size, finish, and artwork file.`,
    },
    {
      question: `What file formats do you accept for ${cleanName}?`,
      answer: `We accept print-ready PDF, AI, EPS, PSD, and high-resolution PNG/JPG files (minimum 300 DPI with CMYK color profile and 3mm bleed where applicable).`,
    },
    {
      question: `Do you provide digital proof approval before printing ${cleanName}?`,
      answer: `Yes, our prepress team checks your artwork alignment, dimensions, and resolution before production begins so you can confirm specifications with confidence.`,
    },
  ]

  // Auto-generate contextual internal links
  const internalLinks = [
    ...(categorySlug
      ? [{ label: `Explore ${categoryName || 'Category'}`, url: `/categories/${categorySlug}` }]
      : []),
    { label: 'Request Custom Printing Quote', url: `/get-a-quote?product=${encodeURIComponent(cleanName)}` },
    { label: 'All Printing Products', url: '/products' },
    { label: 'Printing Guides & Blog', url: '/blog' },
  ]

  return {
    slug: cleanSlug,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoHeading,
    canonicalUrl,
    imageAlt,
    primaryKeyword,
    secondaryKeywords,
    faqs,
    internalLinks,
    seoReviewStatus: 'needs_review',
    cannibalizationCheck: {
      isUnique: conflictingItems.length === 0,
      conflictingItems,
    },
  }
}

/**
 * Audit all products, categories, services, and blogs for SEO completeness, cannibalization, and review status
 */
export function auditCatalogSeoAndKeywords({
  products = [],
  categories = [],
  services = [],
  blogs = [],
}) {
  const missingSeoItems = []
  const pagesAwaitingReview = []
  const keywordToPagesMap = new Map()

  const inspectEntity = (item, entityType, urlPrefix) => {
    const name = item.name || item.title || 'Untitled'
    const slug = item.slug || ''
    const url = `${urlPrefix}${slug}`
    const title = item.seoTitle || item.seo_title || item.metaTitle || ''
    const desc = item.seoDescription || item.seo_description || item.metaDescription || ''
    const kw = item.seoKeywords || item.seo_keywords || ''
    const canonical = item.canonicalUrl || item.canonical_url || ''
    const alt = item.imageAlt || item.image_alt || ''

    const missingFields = []
    if (!title) missingFields.push('seoTitle')
    if (!desc) missingFields.push('seoDescription')
    if (!kw && entityType !== 'blog') missingFields.push('seoKeywords')
    if (!canonical && entityType !== 'blog') missingFields.push('canonicalUrl')
    if (!alt && entityType === 'product') missingFields.push('imageAlt')

    if (missingFields.length > 0) {
      missingSeoItems.push({
        entityType,
        name,
        slug,
        url,
        missingFields,
      })
    }

    if (item.seoReviewStatus === 'needs_review') {
      pagesAwaitingReview.push({
        entityType,
        name,
        slug,
        url,
        updatedAt: item.updatedAt || item.createdAt || 'Recently generated',
      })
    }

    const primaryKw = String(kw)
      .split(',')[0]
      ?.trim()
      .toLowerCase()
    if (primaryKw) {
      const existing = keywordToPagesMap.get(primaryKw) || []
      existing.push({ entityType, name, slug, url })
      keywordToPagesMap.set(primaryKw, existing)
    }
  }

  products.forEach((p) => inspectEntity(p, 'product', '/products/'))
  categories.forEach((c) => inspectEntity(c, 'category', '/categories/'))
  services.forEach((s) => inspectEntity(s, 'service', '/services/'))
  blogs.forEach((b) => inspectEntity(b, 'blog', '/blog/'))

  const duplicateKeywordWarnings = []
  keywordToPagesMap.forEach((pages, keyword) => {
    if (pages.length > 1) {
      duplicateKeywordWarnings.push({
        keyword,
        count: pages.length,
        pages,
      })
    }
  })

  return {
    totals: {
      products: products.length,
      categories: categories.length,
      services: services.length,
      blogs: blogs.length,
      totalIndexedPages: products.length + categories.length + services.length + blogs.length,
    },
    missingSeoCount: missingSeoItems.length,
    missingSeoItems,
    duplicateKeywordCount: duplicateKeywordWarnings.length,
    duplicateKeywordWarnings,
    pagesAwaitingReviewCount: pagesAwaitingReview.length,
    pagesAwaitingReview,
    keywordOpportunitiesCount: ALL_CATEGORY_KEYWORD_OPPORTUNITIES.length,
    keywordOpportunities: ALL_CATEGORY_KEYWORD_OPPORTUNITIES,
  }
}
