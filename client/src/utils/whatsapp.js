/**
 * ONPRINT Dubai — Centralized WhatsApp Inquiry & Lead Dispatch Utility
 * 
 * Provides official WhatsApp click-to-chat URL formatting for desktop & mobile.
 * Reads the business WhatsApp number from the centralized environment variable VITE_WHATSAPP_NUMBER
 * (configurable via .env / client/.env) with fallback to default business number.
 * 
 * NOTE: Never automatically submits messages; prepares prefilled text for customer review.
 */

// 1. Centralized Business WhatsApp Configuration
export const RAW_WHATSAPP_NUMBER = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WHATSAPP_NUMBER) ||
  '447344546056'
).toString().trim()

/**
 * Normalizes phone string into clean E.164 digits without leading + or 00,
 * auto-resolving local UAE and UK mobile prefixes.
 */
export function normalizeWhatsAppNumber(raw) {
  let clean = String(raw || '').replace(/[^\d]/g, '').replace(/^00/, '')
  if (clean.startsWith('05') && clean.length === 10) clean = '971' + clean.slice(1)
  if (clean.startsWith('5') && clean.length === 9) clean = '971' + clean
  if (clean.startsWith('07') && clean.length === 11) clean = '44' + clean.slice(1)
  return clean || '447344546056'
}

// Sanitize to verified digits only for wa.me links
export const WHATSAPP_PHONE = normalizeWhatsAppNumber(RAW_WHATSAPP_NUMBER)

/**
 * Returns formatted human-readable international phone string
 */
export function formatPhoneNumber(digits = WHATSAPP_PHONE) {
  const clean = normalizeWhatsAppNumber(digits)
  if (clean.startsWith('44') && clean.length >= 12) {
    // Official UK display format: +44 7344 546056
    return `+${clean.slice(0, 2)} ${clean.slice(2, 6)} ${clean.slice(6)}`
  }
  if (clean.startsWith('971') && clean.length >= 11) {
    // UAE format: +971 50 123 4567 or +971 4 800 7746
    return `+${clean.slice(0, 3)} ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`
  }
  return `+${clean}`
}

export const FORMATTED_PHONE = formatPhoneNumber(WHATSAPP_PHONE)

// 2. Official Core Service Prefilled Inquiries (Clean, Direct & High-Converting)
export const SERVICE_INQUIRY_MESSAGES = {
  'business-cards':
    'Hello ONPRINT, I need custom business cards in Dubai. Please help me choose a suitable paper, finish and quantity and provide a quotation.',
  'business-cards-printing':
    'Hello ONPRINT, I need custom business cards in Dubai. Please help me choose a suitable paper, finish and quantity and provide a quotation.',
  'business-card-printing-dubai':
    'Hello ONPRINT, I need custom business cards in Dubai. Please help me choose a suitable paper, finish and quantity and provide a quotation.',
  'business-card-printing-uae':
    'Hello ONPRINT, I would like a quotation for corporate business cards across the UAE. Please share available card stocks, volume prices, and delivery schedule.',

  'bottle-printing':
    'Hello 0nprint, I am interested in ordering Custom Printed Water Bottles (Thermal Stainless Steel / Smart LED / Sports Bottles). Please share available models, minimum quantities, UV print / laser engraving prices, and delivery details.',
  'bottle-printing-dubai':
    'Hello 0nprint, I am interested in ordering Custom Printed Water Bottles in Dubai. Please share available models, minimum quantities, prices, and delivery details.',
  'water-bottle-printing-dubai':
    'Hello 0nprint, I am interested in ordering Custom Water Bottles in Dubai. Please share available bottle models, prices, and delivery details.',

  'bottle-labels':
    'Hello 0nprint, I am interested in ordering Custom Waterproof Bottle Labels & Jar Stickers. Please share material options, minimum quantities, prices, and delivery details.',

  'rollup-banners':
    'Hello 0nprint, I am interested in ordering Retractable Roll-Up Banners (85x200cm / 100x200cm / 120x200cm). Please share your prices, stand options, and 24-hour delivery details.',
  'rollup-banner-printing-dubai':
    'Hello 0nprint, I am interested in ordering Roll-Up Banners in Dubai. Please share your prices, sizes, and express delivery details.',

  'stickers':
    'Hello ONPRINT, I need custom stickers in Dubai. Please quote for my size, material and quantity.',
  'stickers-labels-printing':
    'Hello ONPRINT, I need custom stickers in Dubai. Please quote for my size, material and quantity.',
  'sticker-printing-dubai':
    'Hello ONPRINT, I need custom stickers in Dubai. Please quote for my size, material and quantity.',
  'custom-stickers':
    'Hello ONPRINT, I need custom stickers in Dubai. Please quote for my size, material and quantity.',

  'stamps':
    'Hello ONPRINT, I would like a quotation for a custom company stamp. Stamp type: custom company stamp. Quantity: 1 unit. Please share the available options and price.',
  'stamps-printing-dubai':
    'Hello ONPRINT, I would like a quotation for a custom company stamp. Stamp type: custom company stamp in Dubai. Quantity: 1 unit. Please share the available options and price.',
  'custom-stamps':
    'Hello ONPRINT, I would like a quotation for a custom company stamp. Stamp type: custom company stamp. Quantity: 1 unit. Please share the available options and price.',

  'mugs':
    'Hello 0nprint, I am interested in ordering Custom Printed Mugs (Ceramic, Two-Tone, Magic Heat-Reveal, or Travel Tumblers). Please share your prices, quantities, and delivery details.',
  'mug-printing-dubai':
    'Hello 0nprint, I am interested in ordering Custom Printed Mugs in Dubai. Please share your prices, quantities, and delivery details.',

  'id-cards':
    'Hello 0nprint, I am interested in ordering Corporate PVC ID Cards (Staff Photo IDs, RFID/NFC Access Cards, Badges & Lanyards). Please share your prices, specifications, and delivery details.',
  'id-card-printing-dubai':
    'Hello 0nprint, I am interested in ordering Corporate PVC ID Cards in Dubai. Please share your prices, specifications, and delivery details.',

  'lanyards':
    'Hello 0nprint, I am interested in ordering Custom Branded Neck Lanyards (Satin Sublimation / Polyester with Safety Breakaway & Metal Hook). Please share your prices, minimum quantities, and delivery details.',
  'lanyard-printing-dubai':
    'Hello 0nprint, I am interested in ordering Custom Branded Lanyards in Dubai. Please share your prices, clip options, and delivery details.',

  'flyers':
    'Hello 0nprint, I am interested in ordering Custom Flyers & Leaflets (A5, A4, DL, Bi-Fold/Tri-Fold). Please share your paper stocks, prices, and express delivery details.',
  'flyers-printing-in-dubai':
    'Hello 0nprint, I am interested in ordering Custom Flyers in Dubai. Please share your paper stocks, prices, and express delivery details.',

  'brochures':
    'Hello 0nprint, I am interested in ordering Custom Printed Brochures & Catalogs (Bi-Fold, Tri-Fold, Saddle-Stitched / Perfect Bound). Please share your prices, paper & lamination options, and delivery details.',
  'brochures-printing':
    'Hello 0nprint, I am interested in ordering Custom Brochures in Dubai. Please share your prices, paper & lamination options, and delivery details.',

  'stationery':
    'Hello 0nprint, I am interested in ordering Corporate Office Stationery (Letterheads, Envelopes, Presentation Folders, Notebooks). Please share your prices, paper stocks, and delivery details.',
  'office-stationery-printing':
    'Hello 0nprint, I am interested in ordering Corporate Office Stationery in Dubai. Please share your prices, specifications, and delivery details.',

  'letterheads':
    'Hello 0nprint, I am interested in ordering Corporate Official Letterheads (100gsm/120gsm bond, textured linen, gold foil accents). Please share your prices, paper stocks, and delivery details.',
  'envelopes':
    'Hello 0nprint, I am interested in ordering Custom Branded Envelopes (DL, C5, C4 with peel & seal strips). Please share your sizes, minimum quantities, prices, and delivery details.',
  'vouchers':
    'Hello 0nprint, I am interested in ordering Custom Gift Vouchers & Coupons (Sequential Numbering, Perforated Stubs, Foil Accents). Please share your options, prices, and delivery details.',

  'general':
    'Hello 0nprint, I am interested in your custom printing services (Business Cards, Flyers, Brochures, Stickers, Banners & Corporate Merchandise). Please share your prices, available options, and delivery details.',
}

/**
 * Resolves canonical service key from a slug or keyword
 */
export function resolveServiceKey(slugOrKey = '') {
  const s = String(slugOrKey || '').toLowerCase()
  // Bottle Labels vs Bottle Printing (Strict separation)
  if (s.includes('bottle-label') || s.includes('jar-label') || s.includes('product-label')) return 'bottle-labels'
  if (s.includes('bottle') || s.includes('flask') || s.includes('drinkware')) return 'bottle-printing'
  if (s.includes('mug') || s.includes('cup') || s.includes('tumbler')) return 'mugs'
  if (s.includes('card') && (s.includes('id') || s.includes('pvc') || s.includes('badge'))) return 'id-cards'
  if (s.includes('card') || s.includes('visiting')) return 'business-cards'
  if (s.includes('rollup') || s.includes('roll-up') || s.includes('banner') || s.includes('flag')) return 'rollup-banners'
  if (s.includes('sticker') || s.includes('label') || s.includes('decal')) return 'stickers'
  if (s.includes('stamp') || s.includes('seal')) return 'stamps'
  if (s.includes('id-card') || s.includes('id_card') || s.includes('pvc-id')) return 'id-cards'
  if (s.includes('lanyard')) return 'lanyards'
  if (s.includes('flyer') || s.includes('leaflet')) return 'flyers'
  if (s.includes('brochure') || s.includes('catalog')) return 'brochures'
  if (s.includes('letterhead')) return 'letterheads'
  if (s.includes('envelope')) return 'envelopes'
  if (s.includes('voucher') || s.includes('coupon') || s.includes('certificate')) return 'vouchers'
  if (s.includes('stationery') || s.includes('folder') || s.includes('notebook') || s.includes('pen')) return 'stationery'
  return 'general'
}

/**
 * Resolves current page URL safely for WhatsApp context
 */
export function resolveCurrentPageUrl(explicitUrl, slug, type = 'products') {
  if (explicitUrl && typeof explicitUrl === 'string' && explicitUrl.trim()) {
    if (explicitUrl.startsWith('http')) return explicitUrl.trim()
    return `https://www.0nprint.com${explicitUrl.startsWith('/') ? '' : '/'}${explicitUrl.trim()}`
  }
  if (slug && typeof slug === 'string' && slug.trim()) {
    return `https://www.0nprint.com/${type}/${slug.trim()}`
  }
  if (typeof window !== 'undefined' && window.location && window.location.href) {
    return window.location.href
  }
  return 'https://www.0nprint.com/'
}

/**
 * Returns dynamic, high-converting WhatsApp CTA button labels based on service or product category
 */
export function getProductInquiryButtonLabel(serviceKeyOrProduct = '') {
  const key = resolveServiceKey(serviceKeyOrProduct)
  if (key === 'business-cards') return 'Ask for Business Card Pricing'
  if (key === 'stickers' || key === 'bottle-labels') return 'Request a Sticker Printing Quote'
  if (key === 'stamps') return 'Get a Custom Stamp Quote'
  if (key === 'flyers') return 'Request a Flyer Printing Quote'
  if (key === 'brochures') return 'Request a Brochure Printing Quote'
  if (key === 'rollup-banners') return 'Get Banner Quote on WhatsApp'
  if (key === 'stationery' || key === 'letterheads' || key === 'envelopes') return 'Discuss Your Printing Requirements'
  return 'Get a Free Quote on WhatsApp'
}

/**
 * Generates official click-to-chat WhatsApp URL for a service or product with verified specs & page URL
 */
export function getServiceWhatsAppUrl(serviceKey = 'general', details = {}) {
  const canonicalKey = resolveServiceKey(serviceKey)
  const prodName = details.productName || details.product
  const intent = String(details.intent || 'quote').toLowerCase()

  if (canonicalKey === 'business-cards') {
    const msg = formatBusinessCardInquiry({
      productName: prodName,
      ...details,
    })
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
  }

  if (canonicalKey === 'stickers' || canonicalKey === 'bottle-labels') {
    const msg = formatStickerInquiry({
      productName: prodName,
      ...details,
    })
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
  }

  if (canonicalKey === 'stamps') {
    const msg = formatStampInquiry({
      productName: prodName,
      ...details,
    })
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
  }

  let baseMessage = SERVICE_INQUIRY_MESSAGES[canonicalKey] || SERVICE_INQUIRY_MESSAGES.general
  if (prodName) {
    if (intent === 'order') {
      baseMessage = `Hello ONPRINT, I would like to order ${prodName}. Please confirm total price, artwork check, and delivery details.`
    } else {
      baseMessage = `Hello ONPRINT, I am interested in ordering ${prodName}. Please share your prices, available options, and delivery details.`
    }
  }

  const detailLines = []
  const customerName = details.customerName || details.name
  if (customerName) detailLines.push(`• Customer Name: ${customerName}`)
  if (prodName) detailLines.push(`• Product: ${prodName}`)
  if (details.quantity) detailLines.push(`• Quantity: ${details.quantity} units`)
  const sizeVal = details.size || details.dimensions
  if (sizeVal) detailLines.push(`• Size / Dimensions: ${sizeVal}`)
  const matVal = details.material || details.paper || details.stock
  if (matVal) detailLines.push(`• Material / Stock: ${matVal}`)
  const finVal = details.finish || details.finishing || details.coating
  if (finVal) detailLines.push(`• Finish / Coating: ${finVal}`)
  if (details.casingBrand) detailLines.push(`• Stamp Casing: ${details.casingBrand}`)
  if (details.inkColor) detailLines.push(`• Ink Color: ${details.inkColor}`)
  if (details.stampText) detailLines.push(`• Text on Stamp: ${details.stampText}`)
  if (details.artworkStatus) detailLines.push(`• Artwork / Logo: ${details.artworkStatus}`)
  const locVal = details.deliveryLocation || details.location
  if (locVal) detailLines.push(`• Delivery Location: ${locVal}`)
  const deadlineVal = details.deadline || details.turnaround || details.deliveryDate
  if (deadlineVal) detailLines.push(`• Required Deadline: ${deadlineVal}`)
  if (details.price) detailLines.push(`• Starting / Quoted Price: AED ${details.price}`)
  if (details.notes) detailLines.push(`• Custom Notes: ${details.notes}`)

  const pageUrl = resolveCurrentPageUrl(details.pageUrl, details.slug, details.urlType || 'products')
  if (pageUrl && (prodName || details.includePageUrl || (typeof window !== 'undefined' && window.location?.pathname !== '/'))) {
    detailLines.push(`• Page URL: ${pageUrl}`)
  }

  let fullMessage = baseMessage
  if (detailLines.length > 0) {
    fullMessage += `\n\n*Product & Order Specifications:*\n${detailLines.join('\n')}`
  }

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(fullMessage)}`
}

/**
 * Generates official click-to-chat WhatsApp URL for structured quotes or orders
 */
export function formatWhatsAppMessage(params = {}) {
  if (typeof params === 'string') return params
  if (params && typeof params === 'object') {
    if (params.text) return params.text
    if (params.message) return params.message
    if (params.body) return params.body
  }

  const {
    title = 'NEW PRINTING INQUIRY — 0NPRINT',
    refNumber,
    name,
    phone,
    email,
    company,
    product,
    productName,
    quantity,
    size,
    dimensions,
    material,
    paper,
    finish,
    finishing,
    deadline,
    turnaround,
    specs,
    specifications,
    price,
    notes,
    deliveryLocation = 'Dubai, UAE',
    pageUrl,
  } = params || {}

  const resolvedProduct = product || productName
  const resolvedSize = size || dimensions
  const resolvedMaterial = material || paper
  const resolvedFinish = finish || finishing
  const resolvedDeadline = deadline || turnaround
  const resolvedSpecs = specs || specifications
  const resolvedPageUrl = pageUrl || (typeof window !== 'undefined' && window.location ? window.location.href : '')

  const introLine = resolvedProduct
    ? `Hello 0nprint, I am interested in ordering ${resolvedProduct}. Please share your prices, available options, and delivery details.`
    : `Hello 0nprint, I would like to request a printing quotation. Please review my requirements below:`

  const parts = [
    introLine,
    '',
    `⚡ *${title}* 📄`,
    '━━━━━━━━━━━━━━━━━━━━━',
    refNumber ? `🔖 *Ref #:* ${refNumber}` : null,
    name ? `👤 *Customer Name:* ${name}` : null,
    phone && phone !== 'N/A' ? `📞 *Phone / WhatsApp:* ${phone}` : null,
    email ? `✉️ *Email:* ${email}` : null,
    company && company !== 'Individual' ? `🏢 *Company:* ${company}` : null,
    resolvedProduct ? `🏷️ *Product / Service:* ${resolvedProduct}` : null,
    quantity ? `🔢 *Quantity:* ${quantity}${String(quantity).match(/unit|pcs|box|set/i) ? '' : ' units'}` : null,
    resolvedSize ? `📐 *Dimensions / Size:* ${resolvedSize}` : null,
    resolvedMaterial ? `📜 *Material / Paper:* ${resolvedMaterial}` : null,
    resolvedFinish ? `✨ *Finish / Coating:* ${resolvedFinish}` : null,
    resolvedDeadline ? `⏱️ *Required Deadline:* ${resolvedDeadline}` : null,
    resolvedSpecs ? `⚙️ *Specifications:* ${resolvedSpecs}` : null,
    price ? `💰 *Estimated Total:* AED ${price}` : null,
    deliveryLocation ? `📍 *Delivery Location:* ${deliveryLocation}` : null,
    notes && notes !== 'None' ? `📝 *Special Instructions:* ${notes}` : null,
    resolvedPageUrl ? `🔗 *Page URL:* ${resolvedPageUrl}` : null,
    '━━━━━━━━━━━━━━━━━━━━━',
    '💬 *Status:* Ready for price confirmation & express production scheduling.',
  ].filter((item) => item !== null)

  return parts.join('\n')
}

export function getWhatsAppUrl(params = {}) {
  const message =
    typeof params === 'string' && params.trim()
      ? params.trim()
      : formatWhatsAppMessage(params)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

/**
 * Opens WhatsApp safely in an adjacent tab via synthetic DOM <a> click
 * without closing the ONPRINT website or triggering aggressive popup blockers.
 */
export function openWhatsAppDirectly(input, options = {}) {
  const url = typeof input === 'string' ? input : getWhatsAppUrl(input)
  if (typeof window === 'undefined') return

  try {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    if (options.allowSameTabFallback) {
      window.location.assign(url)
    }
  }
}

/**
 * Formats a business card quote inquiry matching the buyer-intent specification:
 * "Hello ONPRINT, I would like a quotation for business cards. Quantity: [quantity]. Material/finish: [requirements]. Delivery location: [location]. Please share your best price and delivery time."
 */
export function formatBusinessCardInquiry({
  quantity = '',
  size = '',
  dimensions = '',
  paper = '',
  material = '',
  gsm = '',
  stock = '',
  paperStock = '',
  finish = '',
  finishing = '',
  coating = '',
  sides = '',
  location = '',
  deliveryLocation = '',
  artwork = null,
  name = '',
  customerName = '',
  company = '',
  notes = '',
  additionalRequirements = '',
  refNumber = '',
  pageUrl = '',
  productName = '',
  cardType = '',
} = {}) {
  const resolvedProduct = cardType || productName || ''
  const resolvedSize = size || dimensions || ''
  const resolvedPaper = paperStock || paper || material || (gsm ? `${gsm} Silk` : stock) || ''
  const resolvedFinish = finish || finishing || coating || ''
  const resolvedLocation = deliveryLocation || location || 'Dubai'
  const resolvedQty = quantity ? String(quantity).trim() : ''
  const resolvedReqs = (additionalRequirements || notes || '').trim()

  const materialFinishParts = [resolvedPaper, resolvedFinish].filter(Boolean)
  const materialFinishStr = materialFinishParts.join(', ')

  const lines = [
    'Hello ONPRINT, I need custom business cards in Dubai. Please help me choose a suitable paper, finish and quantity and provide a quotation.',
  ]
  const hasSpecs = Boolean(resolvedProduct || resolvedQty || resolvedSize || materialFinishStr || (sides && sides !== 'N/A') || deliveryLocation || location || resolvedReqs)
  if (resolvedProduct) lines.push(`Card type: ${resolvedProduct}`)
  if (resolvedQty) lines.push(`Quantity: ${resolvedQty}`)
  if (resolvedSize) lines.push(`Size: ${resolvedSize}`)
  if (materialFinishStr) lines.push(`Material/finish: ${materialFinishStr}`)
  if (sides && sides !== 'N/A') lines.push(`Sides: ${sides}`)
  if (hasSpecs && resolvedLocation) lines.push(`Delivery location: ${resolvedLocation}`)
  if (resolvedReqs && !resolvedReqs.toLowerCase().includes('cta') && !resolvedReqs.toLowerCase().includes('inquiry') && resolvedReqs !== 'None') {
    lines.push(`Additional requirements: ${resolvedReqs}`)
  }
  if (hasSpecs) {
    lines.push('', 'Please share your best price and delivery time.')
  }

  const extra = []
  const clientName = name || customerName
  if (clientName) extra.push(`• Client Name: ${clientName}`)
  if (company && company !== 'N/A' && company !== 'Individual') extra.push(`• Company: ${company}`)
  if (refNumber) extra.push(`• Quote Reference: ${refNumber}`)
  if (artwork) extra.push(`• Artwork: ${typeof artwork === 'string' ? artwork : (artwork?.name || 'File attached / sending in chat')}`)
  if (pageUrl) extra.push(`• Page URL: ${pageUrl}`)

  if (extra.length > 0) {
    lines.push('', '*Additional Details:*', ...extra)
  }

  return lines.join('\n')
}

export function getBusinessCardBuyerIntentUrl(params = {}) {
  const msg = formatBusinessCardInquiry(params)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
}

/**
 * Generates structured inquiry string for custom stickers matching prompt:
 * "Hello ONPRINT, I need a quotation for sticker printing. Sticker type: [type]. Quantity: [quantity]. Size: [size]. Finish: [finish]. Delivery location: [location]. Please share your pricing and delivery time."
 */
export function formatStickerInquiry(details = {}) {
  const {
    type,
    stickerType,
    productName,
    productTitle,
    quantity,
    size,
    dimensions,
    material,
    paper,
    shape,
    finish,
    finishing,
    intendedUse,
    use,
    deliveryLocation,
    location,
    city,
    additionalRequirements,
    requirements,
    notes,
    name,
    customerName,
    company,
    artwork,
    refNumber,
    pageUrl,
  } = details || {}

  const resolvedType = type || stickerType || productTitle || productName || ''
  const resolvedQty = quantity ? String(quantity).trim() : ''
  const resolvedSize = size || dimensions || ''
  const resolvedMaterial = material || paper || ''
  const resolvedShape = shape || ''
  const resolvedFinish = finish || finishing || ''
  const resolvedUse = intendedUse || use || ''
  const resolvedLocation = deliveryLocation || location || city || 'Dubai'
  const resolvedReqs = additionalRequirements || requirements || notes || ''

  const lines = [
    'Hello ONPRINT, I need custom stickers in Dubai. Please quote for my size, material and quantity.',
  ]
  const hasSpecs = Boolean(resolvedType || resolvedQty || resolvedSize || resolvedMaterial || resolvedShape || resolvedFinish || resolvedUse || deliveryLocation || location || city || resolvedReqs)
  if (resolvedType) lines.push(`Sticker type: ${resolvedType}`)
  if (resolvedQty) lines.push(`Quantity: ${resolvedQty}`)
  if (resolvedSize) lines.push(`Size: ${resolvedSize}`)
  if (resolvedMaterial) lines.push(`Material: ${resolvedMaterial}`)
  if (resolvedShape) lines.push(`Shape: ${resolvedShape}`)
  if (resolvedFinish) lines.push(`Finish: ${resolvedFinish}`)
  if (resolvedUse) lines.push(`Intended use: ${resolvedUse}`)
  if (hasSpecs && resolvedLocation) lines.push(`Delivery location: ${resolvedLocation}`)
  if (resolvedReqs && !resolvedReqs.toLowerCase().includes('cta') && !resolvedReqs.toLowerCase().includes('inquiry') && resolvedReqs !== 'None') {
    lines.push(`Additional requirements: ${resolvedReqs}`)
  }
  if (hasSpecs) {
    lines.push('', 'Please share your pricing and delivery time.')
  }

  const extra = []
  const clientName = name || customerName
  if (clientName) extra.push(`• Client Name: ${clientName}`)
  if (company && company !== 'N/A' && company !== 'Individual') extra.push(`• Company: ${company}`)
  if (refNumber) extra.push(`• Quote Reference: ${refNumber}`)
  if (artwork) extra.push(`• Artwork: ${typeof artwork === 'string' ? artwork : (artwork?.name || 'File attached / sending in chat')}`)
  if (pageUrl) extra.push(`• Page URL: ${pageUrl}`)

  if (extra.length > 0) {
    lines.push('', '*Additional Details:*', ...extra)
  }

  return lines.join('\n')
}

export function getStickerWhatsAppUrl(details = {}) {
  const msg = formatStickerInquiry(details)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
}

/**
 * Generates structured inquiry string for custom stamps matching prompt:
 * "Hello ONPRINT, I would like a quotation for a custom company stamp. Stamp type: [type]. Quantity: [quantity]. Delivery location: [location]. Please share the available options and price."
 */
export function formatStampInquiry(details = {}) {
  const {
    type,
    stampType,
    productName,
    product,
    quantity = '1 unit',
    size,
    dimensions,
    casingBrand,
    inkColor,
    stampText,
    deliveryLocation = 'Dubai',
    location,
    additionalRequirements,
    notes,
    name,
    customerName,
    company,
    artwork,
    refNumber,
    pageUrl,
  } = details || {}

  const resolvedType = type || stampType || productName || product || 'Custom Company Stamp'
  const resolvedQty = quantity ? (String(quantity).match(/unit|pcs/i) ? quantity : `${quantity} units`) : '1 unit'
  const resolvedSize = size || dimensions || ''
  const resolvedLocation = deliveryLocation || location || 'Dubai'
  const resolvedReqs = additionalRequirements || notes || ''

  const lines = [
    'Hello ONPRINT, I would like a quotation for a custom company stamp.',
  ]
  if (resolvedType) lines.push(`Stamp type: ${resolvedType}`)
  if (resolvedQty) lines.push(`Quantity: ${resolvedQty}`)
  if (resolvedSize) lines.push(`Stamp size / shape: ${resolvedSize}`)
  if (casingBrand) lines.push(`Casing / Body: ${casingBrand}`)
  if (inkColor) lines.push(`Ink color: ${inkColor}`)
  if (stampText) lines.push(`Text / Details on stamp: ${stampText}`)
  if (resolvedLocation) lines.push(`Delivery location: ${resolvedLocation}`)
  if (resolvedReqs && !resolvedReqs.toLowerCase().includes('cta') && !resolvedReqs.toLowerCase().includes('inquiry') && resolvedReqs !== 'None') {
    lines.push(`Additional requirements: ${resolvedReqs}`)
  }
  lines.push('', 'Please share the available options and price.')

  const extra = []
  const clientName = name || customerName
  if (clientName) extra.push(`• Client Name: ${clientName}`)
  if (company && company !== 'N/A' && company !== 'Individual') extra.push(`• Company: ${company}`)
  if (refNumber) extra.push(`• Quote Reference: ${refNumber}`)
  if (artwork) extra.push(`• Trade License / Logo File: ${typeof artwork === 'string' ? artwork : (artwork?.name || 'File attached / sending in chat')}`)
  if (pageUrl) extra.push(`• Page URL: ${pageUrl}`)

  if (extra.length > 0) {
    lines.push('', '*Additional Details:*', ...extra)
  }

  return lines.join('\n')
}

export function getStampWhatsAppUrl(details = {}) {
  const msg = formatStampInquiry(details)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
}

// ARABIC WHATSAPP LEAD GENERATION & INQUIRY FORMATTERS
// ==========================================

export function formatArabicBusinessCardInquiry(params = {}) {
  const {
    quantity = '500',
    paper = 'ورق كوشيه فاخر 350-400 جرام',
    finish = 'سلوفان مطفي + فويل ذهبي 24K',
    sides = 'وجهين ملون',
    deliveryLocation = 'دبي، الإمارات',
    notes = '',
  } = params

  return `مرحباً ONPRINT، أود الحصول على عرض سعر لطباعة كروت شخصية.

الكمية: ${quantity}
نوع الورق: ${paper}
التشطيب: ${finish}
طباعة وجه واحد أو وجهين: ${sides}
منطقة التوصيل: ${deliveryLocation}
متطلبات إضافية: ${notes || 'لا يوجد'}

يرجى تزويدي بالسعر والخيارات المتاحة ومدة التنفيذ المتوقعة.`
}

export function formatArabicStickerInquiry(params = {}) {
  const {
    stickerType = 'ملصقات منتجات مخصصة',
    quantity = '1000',
    size = '5 × 5 سم',
    material = 'فينيل مقاوم للماء',
    finish = 'قص ليزر حسب الشكل (Die-Cut)',
    deliveryLocation = 'دبي، الإمارات',
    notes = '',
  } = params

  return `مرحباً ONPRINT، أود الحصول على عرض سعر لطباعة الملصقات.

نوع الملصقات: ${stickerType}
الكمية: ${quantity}
المقاس: ${size}
الخامة: ${material}
الشكل والتشطيب: ${finish}
منطقة التوصيل: ${deliveryLocation}
متطلبات إضافية: ${notes || 'لا يوجد'}

يرجى إرسال السعر والخيارات المتاحة ومدة التنفيذ المتوقعة.`
}

export function formatArabicStampInquiry(params = {}) {
  const {
    stampType = 'ختم شركة رسمي دائري',
    quantity = '1',
    size = '40 مم دائري',
    inkColor = 'أزرق رسمي',
    casing = 'تروادت النمساوية الأصلية (Trodat)',
    deliveryLocation = 'دبي، الإمارات',
    notes = 'تتوفر نسخة الرخصة التجارية',
  } = params

  return `مرحباً ONPRINT، أود الحصول على عرض سعر لختم شركة رسمي.

نوع الختم: ${stampType}
الكمية: ${quantity}
المقاس / الشكل: ${size}
لون الحبر: ${inkColor}
الماركة: ${casing}
منطقة التوصيل: ${deliveryLocation}
ملاحظات: ${notes}

يرجى تزويدي بالسعر وخيارات التنفيذ والتوصيل السريع.`
}

export function formatArabicGeneralInquiry(params = {}) {
  const {
    service = 'خدمات الطباعة التجارية',
    quantity = '',
    deliveryLocation = 'دبي، الإمارات',
    notes = '',
  } = params

  return `مرحباً ONPRINT، أود الاستفسار والحصول على عرض سعر لـ: ${service}.
${quantity ? `الكمية المطلوبة: ${quantity}
` : ''}منطقة التوصيل: ${deliveryLocation}
${notes ? `تفاصيل إضافية: ${notes}
` : ''}
يرجى مشاركة الخيارات المتاحة، عينات سابقة، والتكلفة التقديرية.`
}

export function getArabicWhatsAppUrl(category = 'general', details = {}) {
  let msg = ''
  if (category === 'business-cards' || category === 'cards') {
    msg = formatArabicBusinessCardInquiry(details)
  } else if (category === 'stickers' || category === 'labels') {
    msg = formatArabicStickerInquiry(details)
  } else if (category === 'stamps') {
    msg = formatArabicStampInquiry(details)
  } else {
    msg = formatArabicGeneralInquiry(details)
  }

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
}
