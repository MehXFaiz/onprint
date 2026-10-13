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
    // UK format: +44 7344 546056
    return `+${clean.slice(0, 2)} ${clean.slice(2, 6)} ${clean.slice(6)}`
  }
  if (clean.startsWith('971') && clean.length >= 11) {
    // UAE format: +971 50 123 4567 or +971 4 800 7746
    return `+${clean.slice(0, 3)} ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`
  }
  return `+${clean}`
}

export const FORMATTED_PHONE = formatPhoneNumber(WHATSAPP_PHONE)

// 2. Official Core Service Prefilled Inquiries (Dubai & UAE Focused)
export const SERVICE_INQUIRY_MESSAGES = {
  'business-cards':
    "Hi ONPRINT! I'm interested in luxury & executive business card printing in Dubai. Please share your available paper stocks (cotton, silk, velvet soft-touch), finishes (24K foil, spot UV), quantities, pricing, and express delivery times.",
  'business-cards-printing':
    "Hi ONPRINT! I'm interested in luxury & executive business card printing in Dubai. Please share your available paper stocks, finishes, quantities, pricing, and express delivery times.",
  'business-card-printing-dubai':
    "Hi ONPRINT! I'm interested in luxury & executive business card printing in Dubai. Please share your available paper stocks, finishes, quantities, pricing, and express delivery times.",

  'bottle-printing':
    "Hi ONPRINT! I'm interested in custom water bottle printing in Dubai (LED temperature display, thermal stainless steel, sports aluminium, glass bamboo). Please share bottle models, branding methods (laser engraving / UV print), minimum quantities, and pricing.",
  'bottle-printing-dubai':
    "Hi ONPRINT! I'm interested in custom water bottle printing in Dubai (LED temperature display, thermal stainless steel, sports aluminium, glass bamboo). Please share bottle models, branding methods (laser engraving / UV print), minimum quantities, and pricing.",
  'water-bottle-printing-dubai':
    "Hi ONPRINT! I'm interested in custom water bottle printing in Dubai. Please share available bottle models, minimum order quantities, and express delivery options.",

  'bottle-labels':
    "Hi ONPRINT! I'm interested in custom bottle label printing in Dubai (waterproof roll labels / die-cut vinyl stickers). Please share label materials, finishes, adhesive options, minimum quantities, and pricing.",

  'rollup-banners':
    "Hi ONPRINT! I need roll-up banner printing in Dubai. Please share the available sizes (85x200, 100x200, 120x200 cm), stand types (standard / luxury teardrop), prices, and 24h turnaround times.",
  'rollup-banner-printing-dubai':
    "Hi ONPRINT! I need roll-up banner printing in Dubai. Please share the available sizes, stand types, prices, and 24h turnaround times.",

  'stickers':
    "Hi ONPRINT! I'm interested in custom sticker & product label printing in Dubai (waterproof vinyl, die-cut, roll labels, transparent, holographic). Please share shapes, sizes, minimum order quantities, and prices.",
  'stickers-labels-printing':
    "Hi ONPRINT! I'm interested in custom sticker & product label printing in Dubai. Please share available materials, finishes, minimum order quantities, and pricing.",
  'sticker-printing-dubai':
    "Hi ONPRINT! I'm interested in custom sticker & product label printing in Dubai. Please share available materials, finishes, minimum order quantities, and pricing.",

  'stamps':
    "Hi ONPRINT! I need a custom stamp in Dubai (official self-inking company stamp, pocket stamp, dater, or wax seal). Please share available models, sizes, license verification requirements, and prices.",
  'stamps-printing-dubai':
    "Hi ONPRINT! I need a custom stamp in Dubai. Please share available models, sizes, license verification requirements, and prices.",
  'custom-stamps':
    "Hi ONPRINT! I need a custom stamp in Dubai. Please share available models, sizes, license verification requirements, and prices.",

  'mugs':
    "Hi ONPRINT! I'm interested in custom ceramic mug printing in Dubai (white ceramic, two-tone, magic heat-sensitive, travel tumblers). Please share quantities, pricing, and express delivery times.",
  'mug-printing-dubai':
    "Hi ONPRINT! I'm interested in custom ceramic mug printing in Dubai. Please share quantities, pricing, and express delivery times.",

  'id-cards':
    "Hi ONPRINT! I need corporate PVC ID card printing in Dubai (smart NFC, RFID access, magnetic stripe, staff photo IDs). Please share specifications, badge accessories, and corporate volume pricing.",
  'id-card-printing-dubai':
    "Hi ONPRINT! I need corporate PVC ID card printing in Dubai. Please share specifications, badge accessories, and corporate volume pricing.",

  'lanyards':
    "Hi ONPRINT! I need custom branded neck lanyards in Dubai (polyester, satin dye-sublimation, safety breakaway, woven jacquard). Please share clip attachments, minimum quantities, and turnaround times.",
  'lanyard-printing-dubai':
    "Hi ONPRINT! I need custom branded neck lanyards in Dubai. Please share clip attachments, minimum quantities, and turnaround times.",

  'flyers':
    "Hi ONPRINT! I'm interested in commercial flyer printing in Dubai (A5, A4, DL, folded leaflets). Please share paper stocks, quantities, and express same-day dispatch options.",
  'flyers-printing-in-dubai':
    "Hi ONPRINT! I'm interested in commercial flyer printing in Dubai. Please share paper stocks, quantities, and express same-day dispatch options.",

  'brochures':
    "Hi ONPRINT! I need corporate brochure printing in Dubai (bi-fold, tri-fold, multi-page catalogs). Please share coated paper stocks, luxury lamination options, and pricing.",
  'brochures-printing':
    "Hi ONPRINT! I need corporate brochure printing in Dubai. Please share coated paper stocks, luxury lamination options, and pricing.",

  'stationery':
    "Hi ONPRINT! I'm interested in executive office stationery printing in Dubai (letterheads, presentation folders, corporate envelopes, notebooks). Please share specifications and pricing.",
  'office-stationery-printing':
    "Hi ONPRINT! I'm interested in executive office stationery printing in Dubai. Please share specifications and pricing.",

  'general':
    "Hi ONPRINT! I'm interested in commercial printing in Dubai. Please share your pricing, options, and express delivery times.",
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
  if (s.includes('card') || s.includes('visiting')) return 'business-cards'
  if (s.includes('rollup') || s.includes('roll-up') || s.includes('banner')) return 'rollup-banners'
  if (s.includes('sticker') || s.includes('label') || s.includes('decal')) return 'stickers'
  if (s.includes('stamp') || s.includes('seal')) return 'stamps'
  if (s.includes('id-card') || s.includes('id_card') || s.includes('pvc-id')) return 'id-cards'
  if (s.includes('lanyard')) return 'lanyards'
  if (s.includes('flyer') || s.includes('leaflet')) return 'flyers'
  if (s.includes('brochure') || s.includes('catalog')) return 'brochures'
  if (s.includes('stationery') || s.includes('letterhead') || s.includes('folder') || s.includes('envelope')) return 'stationery'
  return 'general'
}

/**
 * Generates official click-to-chat WhatsApp URL for a service with optional verified product specs
 */
export function getServiceWhatsAppUrl(serviceKey = 'general', details = {}) {
  const canonicalKey = resolveServiceKey(serviceKey)
  const baseMessage = SERVICE_INQUIRY_MESSAGES[canonicalKey] || SERVICE_INQUIRY_MESSAGES.general

  const detailLines = []
  if (details.productName) detailLines.push(`• Product: ${details.productName}`)
  if (details.size) detailLines.push(`• Size / Dimensions: ${details.size}`)
  if (details.material) detailLines.push(`• Material / Stock: ${details.material}`)
  if (details.finish) detailLines.push(`• Finish / Coating: ${details.finish}`)
  if (details.quantity) detailLines.push(`• Quantity: ${details.quantity} units`)
  if (details.price) detailLines.push(`• Starting Price: AED ${details.price}`)
  if (details.notes) detailLines.push(`• Custom Notes: ${details.notes}`)

  let fullMessage = baseMessage
  if (detailLines.length > 0) {
    fullMessage += `\n\n*Product Details:*\n${detailLines.join('\n')}`
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
    title = 'NEW PRINTING INQUIRY',
    refNumber,
    name,
    phone,
    email,
    company,
    product,
    quantity,
    specs,
    price,
    notes,
    deliveryLocation = 'Dubai, UAE',
  } = params || {}

  const parts = [
    `⚡ *${title}* 📄`,
    '━━━━━━━━━━━━━━━━━━━━━',
    refNumber ? `🔖 *Ref #:* ${refNumber}` : null,
    name ? `👤 *Customer Name:* ${name}` : null,
    phone && phone !== 'N/A' ? `📞 *Phone / WhatsApp:* ${phone}` : null,
    email ? `✉️ *Email:* ${email}` : null,
    company && company !== 'Individual' ? `🏢 *Company:* ${company}` : null,
    product ? `🏷️ *Product / Service:* ${product}` : null,
    quantity ? `🔢 *Quantity:* ${quantity} units` : null,
    specs ? `⚙️ *Specifications:* ${specs}` : null,
    price ? `💰 *Estimated Total:* AED ${price}` : null,
    deliveryLocation ? `📍 *Delivery Hub:* ${deliveryLocation}` : null,
    notes && notes !== 'None' ? `📝 *Special Instructions:* ${notes}` : null,
    '━━━━━━━━━━━━━━━━━━━━━',
    '💬 *Status:* Ready for quote confirmation & express press scheduling.',
  ].filter(Boolean)

  return parts.join('\n')
}

export function getWhatsAppUrl(params = {}) {
  const message = formatWhatsAppMessage(params)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

/**
 * Safely opens WhatsApp click-to-chat in a new tab without automatically submitting
 */
export function openWhatsAppDirectly(paramsOrUrl) {
  let url = ''
  if (typeof paramsOrUrl === 'string') {
    url = paramsOrUrl
  } else if (paramsOrUrl && typeof paramsOrUrl === 'object') {
    url = getWhatsAppUrl(paramsOrUrl)
  } else {
    url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(SERVICE_INQUIRY_MESSAGES.general)}`
  }

  if (typeof window !== 'undefined') {
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer')
      if (!opened) {
        window.location.href = url
      }
    } catch (e) {
      console.warn('Could not open WhatsApp:', e)
      window.location.href = url
    }
  }
  return url
}
