/**
 * ONPRINT Dubai — Centralized WhatsApp Order & Lead Dispatch Utility
 * Ensures all inquiries, quotes, and custom orders are formatted professionally
 * and delivered directly to the business WhatsApp (+44 7344 546056).
 */

export const WHATSAPP_PHONE = '447344546056'
export const FORMATTED_PHONE = '+44 7344 546056'

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
    phone ? `📞 *Phone / WhatsApp:* ${phone}` : null,
    email ? `✉️ *Email:* ${email}` : null,
    company ? `🏢 *Company:* ${company}` : null,
    product ? `🏷️ *Product / Service:* ${product}` : null,
    quantity ? `🔢 *Quantity:* ${quantity} units` : null,
    specs ? `⚙️ *Specifications:* ${specs}` : null,
    price ? `💰 *Estimated Total:* AED ${price}` : null,
    deliveryLocation ? `📍 *Delivery Hub:* ${deliveryLocation}` : null,
    notes ? `📝 *Special Instructions:* ${notes}` : null,
    '━━━━━━━━━━━━━━━━━━━━━',
    '💬 *Status:* Ready for quote confirmation & express press scheduling.',
  ].filter(Boolean)

  return parts.join('\n')
}

export function getWhatsAppUrl(params) {
  const message = formatWhatsAppMessage(params)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

export function openWhatsAppDirectly(params) {
  const url = getWhatsAppUrl(params)
  if (typeof window !== 'undefined') {
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer')
      if (!opened) {
        // Fallback for strict popup blockers
        window.location.href = url
      }
    } catch (e) {
      console.warn('Could not auto-open WhatsApp:', e)
    }
  }
  return url
}
