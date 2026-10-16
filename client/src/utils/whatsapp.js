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

// 2. Official Core Service Prefilled Inquiries (Dubai & UAE Focused)
export const SERVICE_INQUIRY_MESSAGES = {
  'business-cards':
    "Hi ONPRINT! I'd like a quotation for Business Card Printing in Dubai. Here are my details — Product: Business Cards, Quantity: [e.g., 100 / 250 / 500 / 1,000], Size: [90x55mm UAE Standard / 85x55mm ISO], Paper & Finish: [350gsm Matte / 450gsm Velvet / 600gsm Cotton / 24K Foil / 3D Spot UV / PVC], Delivery Location: [Dubai / UAE]. Please share pricing and turnaround.",
  'business-cards-printing':
    "Hi ONPRINT! I'd like a quotation for Business Card Printing in Dubai. Here are my details — Product: Business Cards, Quantity: [e.g., 100 / 250 / 500 / 1,000], Size: [90x55mm UAE Standard / 85x55mm ISO], Paper & Finish: [350gsm Matte / 450gsm Velvet / 600gsm Cotton / 24K Foil / 3D Spot UV / PVC], Delivery Location: [Dubai / UAE]. Please share pricing and turnaround.",
  'business-card-printing-dubai':
    "Hi ONPRINT! I'd like a quotation for Business Card Printing in Dubai. Here are my details — Product: Business Cards, Quantity: [e.g., 100 / 250 / 500 / 1,000], Size: [90x55mm UAE Standard / 85x55mm ISO], Paper & Finish: [350gsm Matte / 450gsm Velvet / 600gsm Cotton / 24K Foil / 3D Spot UV / PVC], Delivery Location: [Dubai / UAE]. Please share pricing and turnaround.",

  'bottle-printing':
    "Hi ONPRINT! I'd like a quotation for Custom Water Bottle Printing in Dubai (Product: Thermal Stainless Steel / LED Smart / Sports Bottle, Quantity, Size/Capacity, Finish: UV Print / 360° Laser Engraving, Delivery Location: Dubai/UAE). Please share models, minimum quantities, and pricing.",
  'bottle-printing-dubai':
    "Hi ONPRINT! I'd like a quotation for Custom Water Bottle Printing in Dubai (Product: Thermal Stainless Steel / LED Smart / Sports Bottle, Quantity, Size/Capacity, Finish: UV Print / 360° Laser Engraving, Delivery Location: Dubai/UAE). Please share models, minimum quantities, and pricing.",
  'water-bottle-printing-dubai':
    "Hi ONPRINT! I'd like a quotation for Custom Water Bottle Printing in Dubai (Product, Quantity, Size, Finish, and Delivery Location in Dubai/UAE). Please share available bottle models and pricing.",

  'bottle-labels':
    "Hi ONPRINT! I'd like a quotation for Custom Bottle Label Printing in Dubai (Product: Waterproof Roll Labels / Die-Cut Vinyl, Quantity, Size, Finish, and Delivery Location in Dubai/UAE).",

  'rollup-banners':
    "Hi ONPRINT! I'd like a quotation for Roll-Up Banner Printing in Dubai (Product: Retractable Roll-Up Banner, Quantity, Size: 85x200 / 100x200 / 120x200 cm, Finish: 440gsm Anti-Curl Matte, Delivery Location: Dubai/UAE). Please share prices and 24h turnaround.",
  'rollup-banner-printing-dubai':
    "Hi ONPRINT! I'd like a quotation for Roll-Up Banner Printing in Dubai (Product: Retractable Roll-Up Banner, Quantity, Size: 85x200 / 100x200 / 120x200 cm, Finish, Delivery Location: Dubai/UAE). Please share prices and 24h turnaround.",

  'stickers':
    "Hi ONPRINT! I'd like a quotation for Custom Sticker & Label Printing in Dubai (Product: Waterproof Vinyl / Die-Cut / Roll Labels / Holographic, Quantity, Size, Finish, Delivery Location: Dubai/UAE). Please share minimum quantities and pricing.",
  'stickers-labels-printing':
    "Hi ONPRINT! I'd like a quotation for Custom Sticker & Label Printing in Dubai (Product, Quantity, Size, Finish, and Delivery Location in Dubai/UAE). Please share pricing and turnaround.",
  'sticker-printing-dubai':
    "Hi ONPRINT! I'd like a quotation for Custom Sticker & Label Printing in Dubai (Product, Quantity, Size, Finish, and Delivery Location in Dubai/UAE). Please share pricing and turnaround.",

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
    "Hi ONPRINT! I'd like a quotation for commercial printing in Dubai. Product: [Business Cards / Roll-Up Banners / Stickers / Bottles], Quantity: [Units], Size: [Dimensions], Finish: [Matte / Velvet / Foil / UV], Delivery Location: [Dubai / UAE].",
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
 * Generates official click-to-chat WhatsApp URL for a service with verified product specs
 */
export function getServiceWhatsAppUrl(serviceKey = 'general', details = {}) {
  const canonicalKey = resolveServiceKey(serviceKey)
  const baseMessage = SERVICE_INQUIRY_MESSAGES[canonicalKey] || SERVICE_INQUIRY_MESSAGES.general

  const detailLines = []
  const prodName = details.productName || details.product
  if (prodName) detailLines.push(`• Product: ${prodName}`)
  if (details.quantity) detailLines.push(`• Quantity: ${details.quantity} units`)
  const sizeVal = details.size || details.dimensions
  if (sizeVal) detailLines.push(`• Size / Dimensions: ${sizeVal}`)
  const matVal = details.material || details.paper || details.stock
  if (matVal) detailLines.push(`• Material / Stock: ${matVal}`)
  const finVal = details.finish || details.finishing || details.coating
  if (finVal) detailLines.push(`• Finish / Coating: ${finVal}`)
  const locVal = details.deliveryLocation || details.location
  if (locVal) detailLines.push(`• Delivery Location: ${locVal}`)
  const deadlineVal = details.deadline || details.turnaround || details.deliveryDate
  if (deadlineVal) detailLines.push(`• Required Deadline: ${deadlineVal}`)
  if (details.price) detailLines.push(`• Starting / Quoted Price: AED ${details.price}`)
  if (details.notes) detailLines.push(`• Custom Notes: ${details.notes}`)

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
    title = 'NEW PRINTING INQUIRY',
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
    price,
    notes,
    deliveryLocation = 'Dubai, UAE',
  } = params || {}

  const resolvedProduct = product || productName
  const resolvedSize = size || dimensions
  const resolvedMaterial = material || paper
  const resolvedFinish = finish || finishing
  const resolvedDeadline = deadline || turnaround

  const parts = [
    `⚡ *${title}* 📄`,
    '━━━━━━━━━━━━━━━━━━━━━',
    refNumber ? `🔖 *Ref #:* ${refNumber}` : null,
    name ? `👤 *Customer Name:* ${name}` : null,
    phone && phone !== 'N/A' ? `📞 *Phone / WhatsApp:* ${phone}` : null,
    email ? `✉️ *Email:* ${email}` : null,
    company && company !== 'Individual' ? `🏢 *Company:* ${company}` : null,
    resolvedProduct ? `🏷️ *Product / Service:* ${resolvedProduct}` : null,
    quantity ? `🔢 *Quantity:* ${quantity} units` : null,
    resolvedSize ? `📐 *Dimensions / Size:* ${resolvedSize}` : null,
    resolvedMaterial ? `📜 *Material / Paper:* ${resolvedMaterial}` : null,
    resolvedFinish ? `✨ *Finish / Coating:* ${resolvedFinish}` : null,
    resolvedDeadline ? `⏱️ *Required Deadline:* ${resolvedDeadline}` : null,
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
