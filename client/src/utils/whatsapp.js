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
 * Generates official click-to-chat WhatsApp URL for a service or product with verified specs & page URL
 */
export function getServiceWhatsAppUrl(serviceKey = 'general', details = {}) {
  const canonicalKey = resolveServiceKey(serviceKey)
  const prodName = details.productName || details.product
  const intent = String(details.intent || 'quote').toLowerCase()

  let baseMessage = SERVICE_INQUIRY_MESSAGES[canonicalKey] || SERVICE_INQUIRY_MESSAGES.general
  if (canonicalKey === 'stamps') {
    const stampType = details.stampType || prodName || 'custom company stamp'
    const qtyVal = details.quantity ? (String(details.quantity).match(/unit|pcs/i) ? details.quantity : `${details.quantity} units`) : '1 unit'
    baseMessage = `Hello ONPRINT, I would like a quotation for a custom company stamp. Stamp type: ${stampType}. Quantity: ${qtyVal}. Please share the available options and price.`
  } else if (canonicalKey === 'business-cards') {
    const qtyVal = details.quantity
    const paperVal = details.material || details.paper || details.stock || (details.gsm ? `${details.gsm}` : '') || prodName
    const finVal = details.finish || details.finishing || details.coating
    const locVal = details.deliveryLocation || details.location || 'Dubai'

    if (qtyVal || paperVal || finVal) {
      const phrases = []
      if (qtyVal) phrases.push(`Quantity: ${qtyVal}`)
      if (paperVal) phrases.push(`Paper/GSM: ${paperVal}`)
      if (finVal) phrases.push(`Finish: ${finVal}`)
      if (locVal) phrases.push(`Delivery location: ${locVal}`)

      baseMessage = `Hello ONPRINT, I would like a quotation for business cards. ${phrases.join('. ')}. Please share pricing and available options.`
    } else {
      baseMessage = 'Hello ONPRINT, I would like a quotation for business cards. Please share available options, prices, and delivery time.'
    }
  } else if (prodName) {
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
  const specsVal = details.specifications || details.specs
  if (details.casingBrand) detailLines.push(`• Stamp Casing: ${details.casingBrand}`)
  if (details.inkColor) detailLines.push(`• Ink Color: ${details.inkColor}`)
  if (details.stampText) detailLines.push(`• Text on Stamp: ${details.stampText}`)
  if (details.artworkStatus) detailLines.push(`• Artwork / Logo: ${details.artworkStatus}`)
  if (details.specsVal) detailLines.push(`• Specifications: ${details.specsVal}`)
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
 * "Hello ONPRINT, I need a quotation for custom business cards. Quantity: [quantity]. Material/GSM: [material]. Finish: [finish]. Delivery location: [location]. Please share available options and pricing."
 */
export function formatBusinessCardInquiry({
  quantity = '100',
  paper = '',
  material = '',
  gsm = '',
  stock = '',
  finish = 'Matte',
  finishing = '',
  coating = '',
  location = 'Dubai',
  deliveryLocation = '',
  artwork = null,
  name = '',
  customerName = '',
  company = '',
  notes = '',
  refNumber = '',
  pageUrl = '',
} = {}) {
  const resolvedPaper = paper || material || (gsm ? `${gsm} Artboard` : stock) || '350 GSM Silk'
  const resolvedFinish = finish || finishing || coating || 'Matte'
  const resolvedLocation = location || deliveryLocation || 'Dubai'
  const resolvedQty = quantity ? String(quantity).trim() : '100'

  const specPhrases = []
  if (resolvedQty) specPhrases.push(`Quantity: ${resolvedQty}`)
  if (resolvedPaper) specPhrases.push(`Paper/GSM: ${resolvedPaper}`)
  if (resolvedFinish) specPhrases.push(`Finish: ${resolvedFinish}`)
  if (resolvedLocation) specPhrases.push(`Delivery location: ${resolvedLocation}`)

  let intro = 'Hello ONPRINT, I would like a quotation for business cards.'
  if (specPhrases.length > 0) {
    intro += ` ${specPhrases.join('. ')}.`
  }
  intro += ' Please share pricing and available options.'

  const extra = []
  const clientName = name || customerName
  if (clientName) extra.push(`• Client Name: ${clientName}`)
  if (company && company !== 'N/A' && company !== 'Individual') extra.push(`• Company: ${company}`)
  if (refNumber) extra.push(`• Quote Reference: ${refNumber}`)
  if (artwork) extra.push(`• Artwork: ${typeof artwork === 'string' ? artwork : (artwork?.name || 'File attached')}`)
  if (notes && notes !== 'None') extra.push(`• Notes: ${notes}`)
  if (pageUrl) extra.push(`• Page URL: ${pageUrl}`)

  if (extra.length > 0) {
    return `${intro}\n\n*Additional Details:*\n${extra.join('\n')}`
  }
  return intro
}

export function getBusinessCardBuyerIntentUrl(params = {}) {
  const msg = formatBusinessCardInquiry(params)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`
}

/**
 * Safely opens WhatsApp click-to-chat across mobile and desktop.
 * - On mobile (iOS / Android), triggers direct app intent via window.location.href
 *   so the native WhatsApp app opens immediately with the prefilled message.
 * - On desktop, attempts window.open with fallback to prevent popup-block dropoffs.
 */
export function openWhatsAppDirectly(paramsOrUrl, options = {}) {
  const { allowSameTabFallback = true } = options
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

    if (isMobile) {
      window.location.href = url
      return url
    }

    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer')
      if ((!opened || opened.closed || typeof opened.closed === 'undefined') && allowSameTabFallback) {
        window.location.href = url
      }
    } catch (e) {
      console.warn('Could not open WhatsApp popup:', e)
      if (allowSameTabFallback) {
        window.location.href = url
      }
    }
  }
  return url
}



/**
 * Generates structured inquiry string for custom stickers
 */
export function formatStickerInquiry({
  type = 'Custom Stickers',
  size = 'Custom Size',
  quantity = '100+ pcs',
  material = 'Waterproof Vinyl',
  finish = 'Matte Lamination',
  name = '',
  company = '',
  location = 'Dubai, UAE',
  artwork = null,
  notes = '',
} = {}) {
  const parts = [
    `Hello ONPRINT, I would like a quotation for custom stickers. Sticker type: ${type}. Size: ${size}. Quantity: ${quantity}. Material/finish: ${[material, finish].filter(Boolean).join(' / ')}. Please share the available options and pricing.`
  ]
  const extra = []
  if (location) extra.push(`• Delivery Location: ${location}`)
  if (name) extra.push(`• Client Name: ${name}`)
  if (company) extra.push(`• Company: ${company}`)
  if (artwork) extra.push(`• Artwork: ${typeof artwork === 'string' ? artwork : (artwork?.name || 'File attached')}`)
  if (notes) extra.push(`• Notes: ${notes}`)

  if (extra.length > 0) {
    parts.push(`\n*Specifications:*\n${extra.join('\n')}`)
  }
  return parts.join('\n')
}
