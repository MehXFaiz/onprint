/**
 * ONPRINT Lead Notification Service
 * 
 * Safely dispatches new quote and inquiry notifications to the business email (0nprint183@gmail.com).
 * Supports standard SMTP / Gmail App Passwords and falls back to structured logging without crashing.
 */

let nodemailer = null
try {
  nodemailer = require('nodemailer')
} catch {
  // Graceful fallback if nodemailer is still installing
}

const BUSINESS_EMAIL = (process.env.BUSINESS_EMAIL || '0nprint183@gmail.com').trim()

function getTransporter() {
  if (!nodemailer) return null

  // 1. Direct SMTP server configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // 2. Gmail service configuration
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  return null
}

/**
 * Dispatches an email notification when a new quote/lead arrives
 */
async function notifyNewQuote(quote) {
  const quoteRef = quote.quoteNumber || quote.orderNumber || `ONP-LEAD-${quote.id}`
  const customerName = quote.name || 'Valued Customer'
  const customerEmail = quote.email || 'N/A'
  const customerPhone = quote.phone || 'N/A'
  const customerCompany = quote.company || 'Not Specified'
  const product = quote.productName || 'Custom Print Job'
  const qty = quote.quantity || 1
  const estimatedPrice = quote.totalPrice ? `AED ${quote.totalPrice.toLocaleString()}` : 'Custom Estimation'
  const specs = quote.specs || 'Standard Studio Specifications'
  const notes = quote.notes || 'None'
  const artwork = quote.artworkFile ? `Attached (${quote.artworkFile})` : 'None uploaded'

  // Log prominently to server console & application logs
  console.log(`\n======================================================`)
  console.log(`[ONPRINT NEW LEAD ALERT] ${quoteRef} - Status: NEW`)
  console.log(`Client: ${customerName} | Company: ${customerCompany}`)
  console.log(`Contact: ${customerEmail} | Phone: ${customerPhone}`)
  console.log(`Item: ${product} | Quantity: ${qty} | Total: ${estimatedPrice}`)
  console.log(`Specs: ${specs}`)
  console.log(`Notes: ${notes}`)
  console.log(`Artwork: ${artwork}`)
  console.log(`======================================================\n`)

  const transporter = getTransporter()
  if (!transporter) {
    console.info(`[Notification Service] SMTP not configured. Lead recorded securely in persistent store & database. Business Email recipient: ${BUSINESS_EMAIL}`)
    return false
  }

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
      <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #FF6A00;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">ONPRINT DUBAI</h1>
        <p style="color: #FF6A00; margin: 4px 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">New Commercial Lead Inquiry</p>
      </div>
      
      <div style="padding: 24px;">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 13px; color: #64748b;">Reference Number:</p>
          <p style="margin: 4px 0 0; font-size: 18px; font-weight: 800; color: #0f172a; font-family: monospace;">${quoteRef}</p>
          <span style="display: inline-block; margin-top: 8px; padding: 2px 10px; background-color: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 11px; font-weight: 700;">Status: NEW</span>
        </div>

        <h3 style="margin: 0 0 12px; font-size: 15px; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Customer Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 35%;">Name:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Email:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;"><a href="mailto:${customerEmail}" style="color: #FF6A00; text-decoration: none;">${customerEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Phone:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${customerPhone}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Company:</td>
            <td style="padding: 6px 0; color: #0f172a;">${customerCompany}</td>
          </tr>
        </table>

        <h3 style="margin: 0 0 12px; font-size: 15px; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Order &amp; Print Specifications</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 35%;">Product:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${product}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Quantity:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${qty}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Estimated Total:</td>
            <td style="padding: 6px 0; font-weight: 800; color: #16a34a;">${estimatedPrice}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Specifications:</td>
            <td style="padding: 6px 0; color: #334155;">${specs}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Client Notes:</td>
            <td style="padding: 6px 0; color: #334155;">${notes}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Artwork Files:</td>
            <td style="padding: 6px 0; color: #334155;">${artwork}</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <a href="https://www.0nprint.com/admin/quotes" style="display: inline-block; background-color: #FF6A00; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px;">
            Open in Admin Dashboard
          </a>
        </div>
      </div>

      <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        ONPRINT Printing &amp; Branding Solutions LLC &bull; Al Quoz, Dubai, UAE
      </div>
    </div>
  `

  try {
    const info = await transporter.sendMail({
      from: `"ONPRINT Dubai Leads" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'no-reply@0nprint.com'}>`,
      to: BUSINESS_EMAIL,
      subject: `[NEW LEAD] ${quoteRef} - ${product} from ${customerName}`,
      html: htmlContent,
    })
    console.log(`[Notification Service] Email successfully delivered to ${BUSINESS_EMAIL}:`, info.messageId)
    return true
  } catch (err) {
    console.warn(`[Notification Service] Email sending error:`, err.message)
    return false
  }
}

/**
 * Dispatches an email notification when a general contact inquiry arrives
 */
async function notifyNewContactMessage(contact) {
  const customerName = contact.name || 'Valued Customer'
  const customerEmail = contact.email || 'N/A'
  const customerPhone = contact.phone || 'N/A'
  const customerCompany = contact.company || 'Not Specified'
  const subject = contact.subject || 'Direct Studio Inquiry'
  const message = contact.message || 'None'

  console.log(`\n======================================================`)
  console.log(`[ONPRINT CONTACT INQUIRY] Subject: ${subject}`)
  console.log(`Client: ${customerName} | Company: ${customerCompany}`)
  console.log(`Contact: ${customerEmail} | Phone: ${customerPhone}`)
  console.log(`Message: ${message}`)
  console.log(`======================================================\n`)

  const transporter = getTransporter()
  if (!transporter) return false

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
      <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #FF6A00;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">ONPRINT DUBAI</h1>
        <p style="color: #FF6A00; margin: 4px 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">New Contact Inquiry</p>
      </div>
      <div style="padding: 24px;">
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Company:</strong> ${customerCompany}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 12px;">
          <p style="margin: 0; font-style: italic;">"${message}"</p>
        </div>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"ONPRINT Inquiries" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'no-reply@0nprint.com'}>`,
      to: BUSINESS_EMAIL,
      subject: `[INQUIRY] ${subject} from ${customerName}`,
      html: htmlContent,
    })
    return true
  } catch (err) {
    console.warn(`[Notification Service] Contact email sending error:`, err.message)
    return false
  }
}

/**
 * Dispatches an alert when a high-value corporate quote is submitted
 */
async function notifyCorporateQuote(corpQuote) {
  const ref = corpQuote.referenceNumber || corpQuote.reference_number || 'ONP-CORP'
  const company = corpQuote.companyName || corpQuote.company_name || 'Enterprise Client'
  const contact = corpQuote.contactName || corpQuote.contact_name || 'Corporate Representative'
  const email = corpQuote.email || 'N/A'
  const phone = corpQuote.phone || 'N/A'
  const itemsCount = corpQuote.items?.length || 0

  console.log(`\n======================================================`)
  console.log(`[ONPRINT CORPORATE PROCUREMENT ALERT] ${ref}`)
  console.log(`Company: ${company} | Contact: ${contact}`)
  console.log(`Email: ${email} | Phone: ${phone}`)
  console.log(`Items count: ${itemsCount} | Terms: ${corpQuote.creditTermsRequested || 'Prepaid'}`)
  console.log(`======================================================\n`)

  const transporter = getTransporter()
  if (!transporter) return false

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF65; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #101D35; padding: 24px; text-align: center; border-bottom: 3px solid #D4AF65;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">ONPRINT DUBAI</h1>
        <p style="color: #D4AF65; margin: 4px 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">Corporate Procurement RFQ Alert</p>
      </div>
      <div style="padding: 24px; color: #1e293b;">
        <p><strong>Reference:</strong> ${ref}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Representative:</strong> ${contact} (${corpQuote.department || 'Procurement'})</p>
        <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone}</p>
        <p><strong>Trade License:</strong> ${corpQuote.tradeLicenseNumber || 'N/A'} | <strong>TRN:</strong> ${corpQuote.trnNumber || 'N/A'}</p>
        <p><strong>Annual Volume:</strong> ${corpQuote.annualVolumeEstimate || 'Not specified'}</p>
        <p><strong>Credit Terms Requested:</strong> ${corpQuote.creditTermsRequested || 'Prepaid'}</p>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"ONPRINT Corporate Desk" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'no-reply@0nprint.com'}>`,
      to: BUSINESS_EMAIL,
      subject: `[CORPORATE RFQ] ${ref} - ${company} (${contact})`,
      html,
    })
    return true
  } catch (err) {
    console.warn('[Notification Service] Corporate RFQ email error:', err.message)
    return false
  }
}

module.exports = {
  notifyNewQuote,
  notifyNewContactMessage,
  notifyCorporateQuote,
  BUSINESS_EMAIL,
}

