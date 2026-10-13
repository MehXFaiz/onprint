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
    "Hi ONPRINT! I'm interested in business card printing in Dubai. Please share your available paper types, finishes, quantities, prices, and delivery time.",
  'business-cards-printing':
    "Hi ONPRINT! I'm interested in business card printing in Dubai. Please share your available paper types, finishes, quantities, prices, and delivery time.",
  'business-card-printing-dubai':
    "Hi ONPRINT! I'm interested in business card printing in Dubai. Please share your available paper types, finishes, quantities, prices, and delivery time.",

  'rollup-banners':
    "Hi ONPRINT! I need roll-up banner printing in Dubai. Please share the available sizes, printing options, stand details, prices, and delivery time.",
  'rollup-banner-printing-dubai':
    "Hi ONPRINT! I need roll-up banner printing in Dubai. Please share the available sizes, printing options, stand details, prices, and delivery time.",

  'stickers':
    "Hi ONPRINT! I'm interested in sticker printing in Dubai. Please share the available materials, sizes, shapes, finishes, minimum quantities, and prices.",
  'stickers-labels-printing':
    "Hi ONPRINT! I'm interested in sticker printing in Dubai. Please share the available materials, sizes, shapes, finishes, minimum quantities, and prices.",
  'sticker-printing-dubai':
    "Hi ONPRINT! I'm interested in sticker printing in Dubai. Please share the available materials, sizes, shapes, finishes, minimum quantities, and prices.",

  'stamps':
    "Hi ONPRINT! I need a custom stamp. Please share the available stamp types, sizes, customization options, prices, and delivery time.",
  'stamps-printing-dubai':
    "Hi ONPRINT! I need a custom stamp. Please share the available stamp types, sizes, customization options, prices, and delivery time.",
  'custom-stamps':
    "Hi ONPRINT! I need a custom stamp. Please share the available stamp types, sizes, customization options, prices, and delivery time.",

  'general':
    "Hi ONPRINT! I'm interested in commercial printing in Dubai. Please share your pricing, options, and express delivery time.",
}

/**
 * Resolves canonical service key from a slug or keyword
 */
export function resolveServiceKey(slugOrKey = '') {
  const s = String(slugOrKey || '').toLowerCase()
  if (s.includes('card') || s.includes('visiting')) return 'business-cards'
  if (s.includes('rollup') || s.includes('roll-up') || s.includes('banner')) return 'rollup-banners'
  if (s.includes('sticker') || s.includes('label')) return 'stickers'
  if (s.includes('stamp') || s.includes('seal')) return 'stamps'
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
export function formatWhatsAppMessage({
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
}) {
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
