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

// Sanitize to digits only for wa.me links
export const WHATSAPP_PHONE = RAW_WHATSAPP_NUMBER.replace(/[^\d]/g, '')

/**
 * Returns formatted human-readable international phone string
 */
export function formatPhoneNumber(digits = WHATSAPP_PHONE) {
  const clean = String(digits).replace(/[^\d]/g, '')
  if (clean.startsWith('44') && clean.length >= 12) {
    // Official display format: +44 7344546056
    return `+${clean.slice(0, 2)} ${clean.slice(2)}`
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
    'Hello 0nprint, I am interested in ordering Business Cards (Visiting Cards). Please share your prices, paper & finish options (Matte, Velvet Soft-Touch, Cotton, Foil, Spot UV, PVC), and delivery details.',
  'business-cards-printing':
    'Hello 0nprint, I am interested in ordering Business Cards (Visiting Cards). Please share your prices, paper & finish options (Matte, Velvet Soft-Touch, Cotton, Foil, Spot UV, PVC), and delivery details.',
  'business-card-printing-dubai':
    'Hello 0nprint, I am interested in ordering Business Cards in Dubai. Please share your prices, paper & finish options, and delivery details.',

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
    'Hello 0nprint, I am interested in ordering Custom Stickers & Labels (Waterproof Vinyl, Die-Cut, Roll Labels, Foil/Clear). Please share your prices, available finishes, and delivery details.',
  'stickers-labels-printing':
    'Hello 0nprint, I am interested in ordering Custom Stickers & Labels. Please share your prices, available options, and delivery details.',
  'sticker-printing-dubai':
    'Hello 0nprint, I am interested in ordering Custom Stickers in Dubai. Please share your prices, available options, and delivery details.',

  'stamps':
    'Hello 0nprint, I am interested in ordering a Custom Company Stamp (Self-Inking, Pocket, Dater, or Embossing Seal). Please share available models, sizes, required documents, and prices.',
  'stamps-printing-dubai':
    'Hello 0nprint, I am interested in ordering a Custom Company Stamp in Dubai. Please share available models, sizes, and prices.',
  'custom-stamps':
    'Hello 0nprint, I am interested in ordering a Custom Stamp. Please share available models, sizes, and prices.',

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
  if (prodName) {
    if (intent === 'order') {
      baseMessage = `Hello 0nprint, I would like to order ${prodName}. Please confirm the total price, artwork check, and delivery details.`
    } else {
      baseMessage = `Hello 0nprint, I am interested in ordering ${prodName}. Please share your prices, available options, and delivery details.`
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
  if (specsVal) detailLines.push(`• Specifications: ${specsVal}`)
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
 * Safely opens WhatsApp click-to-chat in a new tab without automatically submitting.
 * When called asynchronously after an API request (allowSameTabFallback = false),
 * avoids clobbering the current confirmation page if the browser blocks async popups.
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
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer')
      if (!opened && allowSameTabFallback) {
        window.location.href = url
      }
    } catch (e) {
      console.warn('Could not open WhatsApp:', e)
      if (allowSameTabFallback) {
        window.location.href = url
      }
    }
  }
  return url
}

