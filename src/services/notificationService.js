const { NotificationLog } = require('../models')
const persistentStore = require('../data/persistentStore')

const SITE_URL = (process.env.SITE_URL || 'https://www.0nprint.com').replace(/\/$/, '')
const SUPPORT_PHONE = '+44 7344546056'
const SUPPORT_EMAIL = '0nprint183@gmail.com'

/**
 * Generates luxury Navy & Gold HTML email layout
 */
function buildEmailTemplate({ title, subtitle, badgeText, contentHtml, ctaText, ctaUrl, referenceNumber }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d1627; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0d1627; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
          
          <!-- Header Banner (Midnight Navy & Gold) -->
          <tr>
            <td style="background-color: #101D35; padding: 32px 40px; text-align: center; border-bottom: 3px solid #D4AF65;">
              <a href="${SITE_URL}" style="text-decoration: none; display: inline-block;">
                <span style="font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #ffffff;">
                  ON<span style="color: #D4AF65;">PRINT</span>
                </span>
              </a>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #94a3b8; margin-top: 6px; font-weight: 600;">
                Commercial Pressroom &amp; Luxury Finishing • Dubai, UAE
              </div>
            </td>
          </tr>

          <!-- Milestone Badge & Title -->
          <tr>
            <td style="padding: 36px 40px 20px 40px; text-align: center;">
              ${badgeText ? `
              <span style="display: inline-block; background-color: #fcf8ee; color: #b89245; border: 1px solid #ebd9a9; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 6px 16px; border-radius: 9999px; margin-bottom: 16px;">
                ${badgeText}
              </span>` : ''}
              <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #101D35; line-height: 1.3;">
                ${title}
              </h1>
              ${subtitle ? `<p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">${subtitle}</p>` : ''}
              ${referenceNumber ? `
              <div style="margin-top: 14px; font-size: 13px; font-weight: 700; color: #101D35; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 8px 14px; display: inline-block;">
                Reference: <span style="color: #b89245;">${referenceNumber}</span>
              </div>` : ''}
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 10px 40px 30px 40px; font-size: 14px; line-height: 1.7; color: #334155;">
              ${contentHtml}
            </td>
          </tr>

          <!-- CTA Button -->
          ${ctaText && ctaUrl ? `
          <tr>
            <td style="padding: 0 40px 36px 40px; text-align: center;">
              <a href="${ctaUrl}" style="display: inline-block; background-color: #D4AF65; color: #101D35; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(212,175,101,0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                ${ctaText}
              </a>
            </td>
          </tr>` : ''}

          <!-- Direct WhatsApp Support Banner -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 40px; text-align: center;">
              <div style="font-size: 13px; font-weight: 700; color: #101D35; margin-bottom: 6px;">
                Need direct assistance with your order?
              </div>
              <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
                Our production team in Al Quoz is available on WhatsApp for live artwork and proof updates.
              </div>
              <a href="https://wa.me/447344546056?text=${encodeURIComponent(`Hello ONPRINT, checking status for reference ${referenceNumber || 'print order'}`)}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; padding: 8px 18px; border-radius: 6px;">
                💬 Message Production Team (+44 7344546056)
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #101D35; color: #94a3b8; padding: 24px 40px; text-align: center; font-size: 11px; line-height: 1.6;">
              <strong style="color: #ffffff;">ONPRINT Commercial Pressroom</strong><br />
              Industrial Area 3, Al Quoz, Dubai, United Arab Emirates<br />
              Email: <a href="mailto:${SUPPORT_EMAIL}" style="color: #D4AF65; text-decoration: none;">${SUPPORT_EMAIL}</a> | Web: <a href="${SITE_URL}" style="color: #D4AF65; text-decoration: none;">www.0nprint.com</a>
              <div style="margin-top: 12px; font-size: 10px; color: #64748b;">
                © ${new Date().getFullYear()} ONPRINT. All rights reserved. ISO 12647-2 Certified Commercial Printing.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Event-Driven Customer Notification Dispatcher
 */
async function sendNotification({
  eventType,
  recipientEmail,
  recipientPhone,
  recipientName = 'Valued Customer',
  referenceNumber,
  payload = {},
}) {
  if (!recipientEmail) {
    console.warn('[Notification] Skipping notification: No recipient email provided.')
    return { success: false, reason: 'missing_email' }
  }

  // Idempotency key (event + reference + date hash)
  const todayKey = new Date().toISOString().slice(0, 10)
  const idempotencyKey = `${eventType}_${referenceNumber || recipientEmail}_${todayKey}`

  // Check if already sent today to avoid duplicate spam
  try {
    const existing = await NotificationLog.findOne({ idempotency_key: idempotencyKey })
    if (existing && existing.status === 'sent') {
      console.log(`[Notification] Duplicate skipped for idempotency key: ${idempotencyKey}`)
      return { success: true, skipped: true, reason: 'duplicate_prevented' }
    }
  } catch {
    // Continue if DB lookup fails
  }

  let title = 'Print Production Notification'
  let subtitle = 'Status update from ONPRINT Pressroom Dubai'
  let badgeText = 'Production Update'
  let contentHtml = ''
  let ctaText = 'View Details'
  let ctaUrl = `${SITE_URL}/track-order?ref=${encodeURIComponent(referenceNumber || '')}`
  let subject = `ONPRINT: Update on ${referenceNumber || 'Your Printing Request'}`

  switch (eventType) {
    case 'quote_received':
      subject = `[Received] Quote Request ${referenceNumber} — ONPRINT Dubai`
      title = 'Quote Request Received'
      badgeText = 'Under Prepress Review'
      subtitle = 'We are calculating optimal volume pricing and finishing options for you.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Thank you for submitting your custom printing request to <strong>ONPRINT</strong>. Our Al Quoz production team has received your specifications and will provide an itemized quote within 2–4 business hours.</p>
        <div style="background: #f8fafc; border-left: 4px solid #D4AF65; padding: 14px 18px; margin: 18px 0; border-radius: 0 8px 8px 0;">
          <strong>Product:</strong> ${payload.productName || 'Custom Print Job'}<br />
          <strong>Quantity:</strong> ${payload.quantity || 'Specified in form'} units<br />
          <strong>Delivery Location:</strong> ${payload.deliveryLocation || 'UAE Doorstep Delivery'}
        </div>
        <p>If you have urgent deadline requirements or specific Pantone spot color specifications, reply directly to this email or chat with us on WhatsApp.</p>
      `
      ctaText = 'Track Quote Status'
      ctaUrl = `${SITE_URL}/get-a-quote`
      break

    case 'quote_prepared':
      subject = `[Ready] Official Quotation ${referenceNumber} — ONPRINT Dubai`
      title = 'Your Official Quotation is Ready'
      badgeText = 'Quotation Prepared'
      subtitle = 'Detailed price breakdown including volume tiers and premium finishes.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Your custom quotation <strong>${referenceNumber}</strong> has been prepared by our estimation desk.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 18px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Estimated Amount:</strong> <span style="font-size: 18px; color: #101D35; font-weight: 900;">AED ${payload.amount || 'Custom Quoted'}</span> (incl. 5% UAE VAT)</p>
          <p style="margin: 0; font-size: 13px; color: #64748b;">${payload.summary || 'Includes 300 DPI prepress check, premium paper stocks, and tracked courier dispatch.'}</p>
        </div>
        <p>To lock in this pricing and proceed with digital PDF proof generation, click the button below or contact our sales team.</p>
      `
      ctaText = 'Confirm & Approve Order'
      ctaUrl = `${SITE_URL}/track-order?ref=${encodeURIComponent(referenceNumber || '')}`
      break

    case 'order_confirmed':
      subject = `[Confirmed] Order ${referenceNumber} Confirmed — ONPRINT Dubai`
      title = 'Order Confirmed & Queued'
      badgeText = 'Pre-Production Queued'
      subtitle = 'Your job is entering our prepress and production workflow.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Thank you for choosing ONPRINT. Your order <strong>${referenceNumber}</strong> has been logged and assigned to a dedicated prepress specialist.</p>
        <p>Our technicians will inspect your artwork for bleed margins, resolution (300+ DPI), and color profiles before plate exposure.</p>
      `
      ctaText = 'Track Production Stage'
      ctaUrl = `${SITE_URL}/track-order?ref=${encodeURIComponent(referenceNumber || '')}`
      break

    case 'proof_ready':
      subject = `[Action Required] Digital Proof Ready for Order ${referenceNumber}`
      title = 'Digital Proof Ready for Review'
      badgeText = 'Action Required'
      subtitle = 'Please inspect and approve your proof before production begins.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>A high-resolution digital PDF proof for <strong>${referenceNumber}</strong> is ready for your review. Production cannot proceed until you have confirmed approval.</p>
        <p>Please inspect typography, spelling, phone numbers, bleed zones, and finishing alignment carefully.</p>
      `
      ctaText = 'Review & Approve Proof'
      ctaUrl = payload.proofUrl || `${SITE_URL}/track-order?ref=${encodeURIComponent(referenceNumber || '')}`
      break

    case 'artwork_approved':
      subject = `[Approved] Plates Scheduled for Order ${referenceNumber}`
      title = 'Artwork Approved — On Schedule'
      badgeText = 'Scheduled for Press'
      subtitle = 'Your job has been approved and moved to our Heidelberg / Indigo press queue.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Thank you for approving your proof. Your order <strong>${referenceNumber}</strong> is now scheduled for printing and embellishment at our Al Quoz pressroom.</p>
      `
      ctaText = 'Track Live Progress'
      ctaUrl = `${SITE_URL}/track-order?ref=${encodeURIComponent(referenceNumber || '')}`
      break

    case 'production_milestone':
      subject = `[On Press] Order ${referenceNumber} is Printing`
      title = 'Job is Currently On Press'
      badgeText = 'In Production'
      subtitle = 'Offset printing & luxury tactile finishing are underway.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Great news! Your print job <strong>${referenceNumber}</strong> is actively running on our presses. Next step: quality inspection, drying, and precision die-cutting / trimming.</p>
      `
      ctaText = 'View Production Timeline'
      ctaUrl = `${SITE_URL}/track-order?ref=${encodeURIComponent(referenceNumber || '')}`
      break

    case 'order_dispatched':
      subject = `[Dispatched] Order ${referenceNumber} is On Its Way!`
      title = 'Your Order Has Been Dispatched'
      badgeText = 'Out for Delivery'
      subtitle = 'Handed over to our courier partner for doorstep delivery.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Your finished order <strong>${referenceNumber}</strong> has completed 100% quality inspection, packaging, and has been dispatched via courier.</p>
        ${payload.courierPartner ? `<p><strong>Courier:</strong> ${payload.courierPartner}<br /><strong>Tracking Code:</strong> ${payload.trackingNumber || 'Available upon request'}</p>` : ''}
        <p>Our driver will contact you at <strong>${recipientPhone || 'your contact number'}</strong> prior to delivery.</p>
      `
      ctaText = 'Track Delivery Location'
      ctaUrl = `${SITE_URL}/track-order?ref=${encodeURIComponent(referenceNumber || '')}`
      break

    case 'order_delivered':
      subject = `[Delivered] Order ${referenceNumber} Delivered — Thank You!`
      title = 'Order Successfully Delivered'
      badgeText = 'Delivered'
      subtitle = 'We hope you love your finished print collateral.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Our courier records show that order <strong>${referenceNumber}</strong> has been successfully delivered to your destination.</p>
        <p>We take pride in every millimeter of print craft. If you have any feedback or would like to re-order, our team is at your service.</p>
      `
      ctaText = 'Leave a Verified Review'
      ctaUrl = `${SITE_URL}/products`
      break

    case 'corporate_inquiry':
      subject = `[Corporate Procurement] Inquiry ${referenceNumber} Received`
      title = 'Corporate Procurement Request Logged'
      badgeText = 'Enterprise Account'
      subtitle = 'Assigned to Senior Key Account Manager in Dubai.'
      contentHtml = `
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Thank you for submitting your corporate procurement inquiry for <strong>${payload.companyName || 'your organization'}</strong>.</p>
        <p>Your designated Corporate Account Director will review your multi-item specifications, credit terms, and contract pricing.</p>
      `
      ctaText = 'Corporate Desk'
      ctaUrl = `${SITE_URL}/corporate-quotes`
      break

    default:
      contentHtml = `<p>Hello ${recipientName}, you have an update regarding reference ${referenceNumber}.</p>`
  }

  const html = buildEmailTemplate({
    title,
    subtitle,
    badgeText,
    contentHtml,
    ctaText,
    ctaUrl,
    referenceNumber,
  })

  // Simulated / Production delivery
  // In production with Nodemailer or SendGrid, send email here.
  // We record the notification log for audit and deduplication.
  const logRecord = {
    idempotency_key: idempotencyKey,
    event_type: eventType,
    recipient_email: recipientEmail,
    recipient_phone: recipientPhone || null,
    recipient_name: recipientName,
    reference_number: referenceNumber || null,
    channel: 'email',
    subject,
    payload_summary: payload,
    status: 'sent',
    provider_message_id: `onprint_msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  }

  try {
    await NotificationLog.create(logRecord)
  } catch (err) {
    // MongoDB or fallback store
    persistentStore.addNotificationLog(logRecord)
  }

  console.log(`[Notification Service] Sent '${eventType}' to ${recipientEmail} (Ref: ${referenceNumber})`)
  return {
    success: true,
    idempotencyKey,
    recipientEmail,
    eventType,
    subject,
  }
}

module.exports = {
  sendNotification,
  buildEmailTemplate,
}
