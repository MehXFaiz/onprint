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
    'Hello ONPRINT, I would like a quotation for business cards. Please share your available options, prices, and delivery time.',
  'business-cards-printing':
    'Hello ONPRINT, I would like a quotation for business cards. Please share your available options, prices, and delivery time.',
  'business-card-printing-dubai':
    'Hello ONPRINT, I would like a quotation for business cards. Please share your available options, prices, and delivery time.',
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
    'Hello ONPRINT, I would like a quotation for custom stickers. Please share the available options and pricing.',
  'stickers-labels-printing':
    'Hello ONPRINT, I would like a quotation for custom stickers and product labels. Please share the available options and pricing.',
  'sticker-printing-dubai':
    'Hello ONPRINT, I would like a quotation for custom stickers in Dubai. Please share the available options, prices, and delivery time.',
  'custom-stickers':
    'Hello ONPRINT, I would like a quotation for custom stickers. Please share the available options and pricing.',

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
 * Formats a business card quote inquiry matching the buyer-intent specification:
 * "Hello ONPRINT, I would like a quotation for business cards. Quantity: [quantity]. Material/finish: [requirements]. Delivery location: [location]. Please share your best price and delivery time."
 */
export function formatBusinessCardInquiry({
  quantity = '',
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
  const resolvedPaper = paperStock || paper || material || (gsm ? `${gsm} Silk` : stock) || ''
  const resolvedFinish = finish || finishing || coating || ''
  const resolvedLocation = deliveryLocation || location || 'Dubai'
  const resolvedQty = quantity ? String(quantity).trim() : ''
  const resolvedReqs = additionalRequirements || notes

  const phrases = []
  if (resolvedProduct) phrases.push(`Card type: ${resolvedProduct}`)
  if (resolvedQty) phrases.push(`Quantity: ${resolvedQty}`)
  const matFinish = [resolvedPaper, resolvedFinish].filter(Boolean).join(', ')
  if (matFinish) phrases.push(`Material/finish: ${matFinish}`)
  if (sides && sides !== 'N/A') phrases.push(`Sides: ${sides}`)
  if (resolvedLocation) phrases.push(`Delivery location: ${resolvedLocation}`)

  let msg = ''
  if (phrases.length > 0) {
    msg = `Hello ONPRINT, I would like a quotation for business card printing. ${phrases.join('. ')}. Please share your best price and delivery time.`
  } else {
    msg = 'Hello ONPRINT, I would like a quotation for custom business card printing in Dubai. Please share your available paper stocks, luxury finishes, pricing, and delivery time.'
  }

  const extra = []
  const clientName = name || customerName
  if (clientName) extra.push(`• Client Name: ${clientName}`)
  if (company && company !== 'N/A' && company !== 'Individual') extra.push(`• Company: ${company}`)
  if (refNumber) extra.push(`• Quote Reference: ${refNumber}`)
  if (artwork) extra.push(`• Artwork: ${typeof artwork === 'string' ? artwork : (artwork?.name || 'File attached / sending in chat')}`)
  if (resolvedReqs && resolvedReqs.trim() && resolvedReqs !== 'None') {
    extra.push(`• Requirements: ${resolvedReqs.trim()}`)
  }
  if (pageUrl) extra.push(`• Page URL: ${pageUrl}`)

  if (extra.length > 0) {
    return `${msg}\n\n*Additional Details:*\n${extra.join('\n')}`
  }
  return msg
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
  } = details

  const resolvedType = type || stickerType || productTitle || productName || ''
  const resolvedQty = quantity ? String(quantity).trim() : ''
  const resolvedSize = size || dimensions || ''
  const resolvedMaterial = material || paper || ''
  const resolvedShape = shape || ''
  const resolvedFinish = finish || finishing || ''
  const resolvedUse = intendedUse || use || ''
  const resolvedLocation = deliveryLocation || location || city || 'Dubai'
  const resolvedReqs = additionalRequirements || requirements || notes || ''

  if (resolvedType || resolvedQty || resolvedSize || resolvedMaterial) {
    const lines = [
      'Hello ONPRINT, I am interested in custom sticker printing in Dubai.',
      '',
      `Sticker type: ${resolvedType || 'Custom Stickers'}`,
      `Quantity: ${resolvedQty || '500'}`,
      `Size: ${resolvedSize || '50 x 50 mm'}`,
      `Material: ${resolvedMaterial || 'Waterproof Vinyl'}`,
      `Shape: ${resolvedShape || 'Custom Die-Cut'}`,
      `Finish: ${resolvedFinish || 'Silk Matte'}`,
      `Intended use: ${resolvedUse || 'Product packaging / branding'}`,
      `Delivery location: ${resolvedLocation || 'Dubai'}`,
      `Additional requirements: ${resolvedReqs && resolvedReqs.trim() ? resolvedReqs.trim() : 'None'}`,
      '',
      'Please provide the available options, quotation, and estimated delivery time.',
    ]

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

  return 'Hello ONPRINT, I am interested in custom sticker printing in Dubai. Please provide the available options, quotation, and estimated delivery time.'
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
  } = details

  const resolvedType = type || stampType || productName || product || 'Custom Company Stamp'
  const resolvedQty = quantity ? (String(quantity).match(/unit|pcs/i) ? quantity : `${quantity} unit`) : '1 unit'
  const resolvedLocation = deliveryLocation || location || 'Dubai'
  const resolvedReqs = additionalRequirements || notes

  const phrases = []
  if (resolvedType) phrases.push(`Stamp type: ${resolvedType}`)
  if (resolvedQty) phrases.push(`Quantity: ${resolvedQty}`)
  if (size || dimensions) phrases.push(`Size: ${size || dimensions}`)
  if (casingBrand) phrases.push(`Casing: ${casingBrand}`)
  if (inkColor) phrases.push(`Ink Color: ${inkColor}`)
  if (resolvedLocation) phrases.push(`Delivery location: ${resolvedLocation}`)

  let msg = 'Hello ONPRINT, I would like a quotation for a custom company stamp.'
  if (phrases.length > 0) {
    msg += ` ${phrases.join('. ')}.`
  }
  msg += ' Please share the available options and price.'

  const extra = []
  const clientName = name || customerName
  if (clientName) extra.push(`• Client Name: ${clientName}`)
  if (company && company !== 'N/A' && company !== 'Individual') extra.push(`• Company: ${company}`)
  if (stampText) extra.push(`• Stamp Text: ${stampText}`)
  if (refNumber) extra.push(`• Reference: ${refNumber}`)
  if (artwork) extra.push(`• Logo / Trade License: ${typeof artwork === 'string' ? artwork : (artwork?.name || 'Attached / sending in chat')}`)
  if (resolvedReqs && resolvedReqs.trim() && resolvedReqs !== 'None') {
    extra.push(`• Requirements: ${resolvedReqs.trim()}`)
  }
  if (pageUrl) extra.push(`• Page URL: ${pageUrl}`)

  if (extra.length > 0) {
    return `${msg}\n\n*Additional Details:*\n${extra.join('\n')}`
  }
  return msg
}

export function getStampWhatsAppUrl(details = {}) {
  const msg = formatStampInquiry(details)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
}

/**
 * Safely opens WhatsApp click-to-chat across mobile and desktop.
 * - On mobile (iOS / Android), triggers direct app intent via window.location.href
 *   so the native WhatsApp app opens immediately with the prefilled message.
 * - On desktop, attempts window.open with fallback to prevent popup-block dropoffs.
 */
export function openWhatsAppDirectly(paramsOrUrl, options = {}) {
  let url = ''
  if (typeof paramsOrUrl === 'string') {
    url = paramsOrUrl
  } else if (paramsOrUrl && typeof paramsOrUrl === 'object') {
    url = getWhatsAppUrl(paramsOrUrl)
  } else {
    url = getServiceWhatsAppUrl('general')
  }

  if (typeof window !== 'undefined') {
    const isMobile =
      /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini/i.test(
        (navigator?.userAgent || '').toLowerCase()
      )

    // On mobile devices, trigger direct app intent
    if (isMobile) {
      window.location.href = url
      return url
    }

    // On desktop, open a new tab safely without popup blocker issues or navigating away from current page
    try {
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        try { a.remove() } catch {}
      }, 200)
      return url
    } catch (e) {
      console.warn('Could not trigger link click, falling back to window.open:', e)
      window.open(url, '_blank', 'noopener,noreferrer')
      return url
    }
  }
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
