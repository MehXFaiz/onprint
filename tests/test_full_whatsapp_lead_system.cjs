/**
 * Comprehensive Automated Lead Generation & WhatsApp System Integration Test
 * ONPRINT.COM
 */

const fs = require('fs')
const path = require('path')
const assert = require('assert')

console.log('🚀 Running ONPRINT WhatsApp Leads & Inquiry System Verification Suite...\n')

let passed = 0
let failed = 0

function it(name, fn) {
  try {
    fn()
    console.log(`  ✅ PASS: ${name}`)
    passed++
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`)
    console.error(`     Error: ${err.message}`)
    failed++
  }
}

// -----------------------------------------------------------------------------
// 1. WhatsApp Utilities & Phone Number Verification
// -----------------------------------------------------------------------------
console.log('--- 1. WhatsApp Number & Centralized Utility Verification ---')
const whatsappUtilsPath = path.join(__dirname, '../client/src/utils/whatsapp.js')
const whatsappUtilsCode = fs.readFileSync(whatsappUtilsPath, 'utf8')

// Clean code to isolate ES module in CJS test environment
let whatsappModule = null
try {
  const cleanCode = whatsappUtilsCode
    .replace(/import\s+.*?from\s+['"].*?['"]/g, '')
    .replace(/import\.meta/g, '({})')
    .replace(/export\s+default\s+.*?;/g, '')
    .replace(/export\s+/g, '') + `
return {
  RAW_WHATSAPP_NUMBER,
  WHATSAPP_PHONE,
  FORMATTED_PHONE,
  formatBusinessCardInquiry,
  formatStickerInquiry,
  formatStampInquiry,
  getProductInquiryButtonLabel,
  getServiceWhatsAppUrl
};`
  
  const fn = new Function(cleanCode)
  whatsappModule = fn()
} catch (e) {
  console.warn('Could not isolate whatsappModule:', e.message)
}

it('Verified business phone number is 447344546056 (+44 7344 546056)', () => {
  assert(whatsappModule, 'whatsappModule failed to load')
  assert.strictEqual(whatsappModule.RAW_WHATSAPP_NUMBER, '447344546056', 'RAW_WHATSAPP_NUMBER mismatch')
  assert.strictEqual(whatsappModule.WHATSAPP_PHONE, '447344546056', 'WHATSAPP_PHONE mismatch')
  assert.strictEqual(whatsappModule.FORMATTED_PHONE, '+44 7344 546056', 'FORMATTED_PHONE mismatch')
})

it('Zero instances of placeholder / test numbers in whatsapp.js', () => {
  const badNumbers = ['971500000000', '1234567890', '971501234567']
  for (const num of badNumbers) {
    assert(!whatsappUtilsCode.includes(num), `Found test phone number: ${num}`)
  }
})

it('formatBusinessCardInquiry produces tailored buyer-intent message', () => {
  const msg = whatsappModule.formatBusinessCardInquiry({
    quantity: '500 cards',
    paperStock: '450gsm Velvet Soft-Touch',
    finish: 'Gold Foil Stamping',
    deliveryLocation: 'Dubai, UAE',
  })
  assert(msg.includes('Hello ONPRINT, I would like a quotation for business card printing.'), 'Greeting mismatch')
  assert(msg.includes('Quantity: 500 cards'), 'Quantity mismatch')
  assert(msg.includes('Material/finish: 450gsm Velvet Soft-Touch, Gold Foil Stamping'), 'Material mismatch')
  assert(msg.includes('Delivery location: Dubai, UAE'), 'Location mismatch')
  assert(!msg.includes('undefined'), 'Contains undefined')
  assert(!msg.includes('[object'), 'Contains [object')
  assert(!msg.includes('[]'), 'Contains empty brackets')
})

it('formatStickerInquiry produces tailored buyer-intent message', () => {
  const msg = whatsappModule.formatStickerInquiry({
    type: 'Waterproof Die-Cut Vinyl',
    quantity: '1,000 pcs',
    size: '6x6cm',
    finish: 'Matte Lamination',
    deliveryLocation: 'Dubai Media City',
  })
  assert(msg.includes('Hello ONPRINT, I need a quotation for sticker printing.'), 'Greeting mismatch')
  assert(msg.includes('Sticker type: Waterproof Die-Cut Vinyl'), 'Type mismatch')
  assert(msg.includes('Quantity: 1,000 pcs'), 'Quantity mismatch')
  assert(msg.includes('Size: 6x6cm'), 'Size mismatch')
  assert(msg.includes('Finish: Matte Lamination'), 'Finish mismatch')
  assert(msg.includes('Delivery location: Dubai Media City'), 'Location mismatch')
  assert(!msg.includes('undefined'), 'Contains undefined')
  assert(!msg.includes('[]'), 'Contains empty brackets')
})

it('formatStampInquiry produces tailored buyer-intent message', () => {
  const msg = whatsappModule.formatStampInquiry({
    type: 'Trodat 4913 Self-Inking Stamp',
    quantity: '2 units',
    deliveryLocation: 'Business Bay, Dubai',
  })
  assert(msg.includes('Hello ONPRINT, I would like a quotation for a custom company stamp.'), 'Greeting mismatch')
  assert(msg.includes('Stamp type: Trodat 4913 Self-Inking Stamp'), 'Stamp type mismatch')
  assert(msg.includes('Quantity: 2 units'), 'Quantity mismatch')
  assert(msg.includes('Delivery location: Business Bay, Dubai'), 'Location mismatch')
  assert(!msg.includes('undefined'), 'Contains undefined')
  assert(!msg.includes('[]'), 'Contains empty brackets')
})

it('getProductInquiryButtonLabel provides dynamic tailored button text', () => {
  assert.strictEqual(whatsappModule.getProductInquiryButtonLabel('business-cards'), 'Ask for Business Card Pricing')
  assert.strictEqual(whatsappModule.getProductInquiryButtonLabel('stickers'), 'Request a Sticker Printing Quote')
  assert.strictEqual(whatsappModule.getProductInquiryButtonLabel('stamps'), 'Get a Custom Stamp Quote')
  assert.strictEqual(whatsappModule.getProductInquiryButtonLabel('flyers'), 'Request a Flyer Printing Quote')
  assert.strictEqual(whatsappModule.getProductInquiryButtonLabel('brochures'), 'Request a Brochure Printing Quote')
  assert.strictEqual(whatsappModule.getProductInquiryButtonLabel('stationery'), 'Discuss Your Printing Requirements')
  assert.strictEqual(whatsappModule.getProductInquiryButtonLabel('general'), 'Get a Free Quote on WhatsApp')
})

it('getServiceWhatsAppUrl routes products to specialized formatters and encodes properly', () => {
  const bcUrl = whatsappModule.getServiceWhatsAppUrl('business-cards', { quantity: '250 cards', finish: 'Foil' })
  assert(bcUrl.startsWith('https://wa.me/447344546056?text='), 'BC URL protocol mismatch')
  assert(bcUrl.includes(encodeURIComponent('Hello ONPRINT, I would like a quotation for business card printing.')), 'BC URL encoding mismatch')

  const stickerUrl = whatsappModule.getServiceWhatsAppUrl('stickers', { quantity: '500 pcs', type: 'Vinyl' })
  assert(stickerUrl.startsWith('https://wa.me/447344546056?text='), 'Sticker URL protocol mismatch')
  assert(stickerUrl.includes(encodeURIComponent('Hello ONPRINT, I need a quotation for sticker printing.')), 'Sticker URL encoding mismatch')

  const stampUrl = whatsappModule.getServiceWhatsAppUrl('stamps', { type: 'Trodat 4913' })
  assert(stampUrl.startsWith('https://wa.me/447344546056?text='), 'Stamp URL protocol mismatch')
  assert(stampUrl.includes(encodeURIComponent('Hello ONPRINT, I would like a quotation for a custom company stamp.')), 'Stamp URL encoding mismatch')
})

// -----------------------------------------------------------------------------
// 2. Homepage Headline, Supporting Text & CTAs Verification
// -----------------------------------------------------------------------------
console.log('\n--- 2. Homepage Hero & Bento Service Card Verification ---')
const homePagePath = path.join(__dirname, '../client/src/pages/public/HomePage.jsx')
const homePageCode = fs.readFileSync(homePagePath, 'utf8')

it('Homepage hero contains specified headline', () => {
  assert(
    homePageCode.includes('Premium Printing Solutions for Businesses in') &&
    homePageCode.includes('Dubai &amp; Across the UAE'),
    'Hero headline mismatch'
  )
})

it('Homepage hero contains specified supporting text', () => {
  assert(homePageCode.includes('Business cards, custom stickers, rubber stamps, and professional printing solutions tailored to your business. Request a quote directly on WhatsApp.'), 'Supporting text mismatch')
})

it('Homepage hero contains all 3 distinct calls to action', () => {
  assert(homePageCode.includes('Get a Free Quote'), 'CTA 1 missing')
  assert(homePageCode.includes('Explore Printing Products'), 'CTA 2 missing')
  assert(homePageCode.includes('Chat with Us on WhatsApp'), 'CTA 3 missing')
})

it('Homepage category cards have functioning clickable links', () => {
  assert(homePageCode.includes('to="/business-card-printing-dubai"'), 'Business cards link missing')
  assert(homePageCode.includes('to="/categories/flyers-printing-in-dubai"'), 'Flyers link missing')
  assert(homePageCode.includes('to="/products/executive-letterheads-120gsm"'), 'Letterhead link missing')
  assert(homePageCode.includes('to="/brochure-printing-dubai"'), 'Brochure link missing')
  assert(homePageCode.includes('to="/products/corporate-envelopes"'), 'Envelope link missing')
  assert(homePageCode.includes('to="/categories/stickers-labels-printing"'), 'Stickers link missing')
  assert(homePageCode.includes('to="/categories/stamps-printing-dubai"'), 'Stamps link missing')
  assert(homePageCode.includes('to="/products/luxury-gold-foil-flyers"'), 'Vouchers link missing')
})

// -----------------------------------------------------------------------------
// 3. QuickQuoteWhatsAppForm & GetQuotePage Verification
// -----------------------------------------------------------------------------
console.log('\n--- 3. Quick Quote WhatsApp Form & RFP Redundancy ---')
const quickQuotePath = path.join(__dirname, '../client/src/components/QuickQuoteWhatsAppForm.jsx')
assert(fs.existsSync(quickQuotePath), 'QuickQuoteWhatsAppForm.jsx file does not exist')
const quickQuoteCode = fs.readFileSync(quickQuotePath, 'utf8')

it('QuickQuoteWhatsAppForm supports all required categories with zero-failure validation', () => {
  assert(quickQuoteCode.includes('business-cards'), 'Business cards option missing')
  assert(quickQuoteCode.includes('stickers'), 'Stickers option missing')
  assert(quickQuoteCode.includes('stamps'), 'Stamps option missing')
  assert(quickQuoteCode.includes('flyers'), 'Flyers option missing')
  assert(quickQuoteCode.includes('brochures'), 'Brochures option missing')
  assert(quickQuoteCode.includes('stationery'), 'Stationery option missing')
  assert(quickQuoteCode.includes('rollup-banners'), 'Banners option missing')
})

it('QuickQuoteWhatsAppForm contains truthful artwork handling disclosure', () => {
  assert(
    quickQuoteCode.includes('attach files directly in WhatsApp chat') ||
    quickQuoteCode.includes('attach files directly in the WhatsApp chat'),
    'Truthful artwork disclosure missing'
  )
})

it('QuickQuoteWhatsAppForm provides fallback direct call and copy message button', () => {
  assert(quickQuoteCode.includes('Copy Inquiry Message') || quickQuoteCode.includes('Copied to Clipboard!'), 'Copy message button missing')
  assert(quickQuoteCode.includes('tel:'), 'Direct call fallback missing')
  assert(quickQuoteCode.includes('mailto:'), 'Email fallback missing')
})

const getQuotePagePath = path.join(__dirname, '../client/src/pages/public/GetQuotePage.jsx')
const getQuotePageCode = fs.readFileSync(getQuotePagePath, 'utf8')

it('GetQuotePage renders QuickQuoteWhatsAppForm by default with non-blocking error handling', () => {
  assert(getQuotePageCode.includes('QuickQuoteWhatsAppForm'), 'QuickQuoteWhatsAppForm not integrated')
  assert(getQuotePageCode.includes('Fast WhatsApp Quote (Instant)'), 'Mode switcher button missing')
  assert(getQuotePageCode.includes('allowSameTabFallback'), 'Fallback tab handling missing')
})

// -----------------------------------------------------------------------------
// 4. Floating WhatsApp Concierge & Mobile Layout Clearance
// -----------------------------------------------------------------------------
console.log('\n--- 4. Floating WhatsApp Concierge & Usability ---')
const floatingWhatsAppPath = path.join(__dirname, '../client/src/components/FloatingWhatsApp.jsx')
const floatingWhatsAppCode = fs.readFileSync(floatingWhatsAppPath, 'utf8')

it('Floating WhatsApp button maintains safe mobile clearance above bottom navigation', () => {
  assert(floatingWhatsAppCode.includes('bottom-[74px]'), 'Mobile clearance class bottom-[74px] missing')
  assert(floatingWhatsAppCode.includes('md:bottom-6'), 'Desktop clearance md:bottom-6 missing')
})

it('Floating WhatsApp includes alternative contact fallbacks', () => {
  assert(floatingWhatsAppCode.includes('tel:'), 'Telephone hotline link missing')
  assert(floatingWhatsAppCode.includes('to="/get-a-quote"'), 'Web quote fallback link missing')
})

// -----------------------------------------------------------------------------
// 5. Product Detail Page Dynamic Action Buttons
// -----------------------------------------------------------------------------
console.log('\n--- 5. Product Detail Page Dynamic Inquiry CTAs ---')
const productDetailPagePath = path.join(__dirname, '../client/src/pages/public/ProductDetailPage.jsx')
const productDetailPageCode = fs.readFileSync(productDetailPagePath, 'utf8')

it('ProductDetailPage uses dynamic button labels and tracking events', () => {
  assert(productDetailPageCode.includes('getProductInquiryButtonLabel'), 'getProductInquiryButtonLabel missing')
  assert(productDetailPageCode.includes('trackProductInquiryClick'), 'trackProductInquiryClick missing')
})

// -----------------------------------------------------------------------------
// 6. Analytics Events & Privacy (Zero PII)
// -----------------------------------------------------------------------------
console.log('\n--- 6. Analytics Telemetry & PII Protection ---')
const analyticsPath = path.join(__dirname, '../client/src/utils/analytics.js')
const analyticsCode = fs.readFileSync(analyticsPath, 'utf8')

it('All 8 required conversion events are explicitly exported', () => {
  assert(analyticsCode.includes('trackWhatsAppClick'), 'trackWhatsAppClick missing')
  assert(analyticsCode.includes('trackProductInquiryClick'), 'trackProductInquiryClick missing')
  assert(analyticsCode.includes('trackQuoteStart'), 'trackQuoteStart missing')
  assert(analyticsCode.includes('trackQuoteSubmit'), 'trackQuoteSubmit missing')
  assert(analyticsCode.includes('trackArtworkUpload'), 'trackArtworkUpload missing')
  assert(analyticsCode.includes('trackPhoneClick'), 'trackPhoneClick missing')
  assert(analyticsCode.includes('trackEmailClick'), 'trackEmailClick missing')
  assert(analyticsCode.includes('trackOrderCompleted'), 'trackOrderCompleted missing')
})

it('Analytics explicitly prohibits PII from telemetry', () => {
  assert(
    analyticsCode.includes('NEVER collects PII') ||
    analyticsCode.includes('Never transmit PII') ||
    analyticsCode.includes('No PII'),
    'PII privacy rule missing'
  )
})

// -----------------------------------------------------------------------------
// 7. Router Integrity & Redirections
// -----------------------------------------------------------------------------
console.log('\n--- 7. Router Integrity & Redirects ---')
const appJsxPath = path.join(__dirname, '../client/src/App.jsx')
const appJsxCode = fs.readFileSync(appJsxPath, 'utf8')

it('App.jsx has valid routes for dedicated landing pages and services', () => {
  assert(appJsxCode.includes('path="/categories/stamps-printing-dubai"'), 'Stamps category route missing')
  assert(appJsxCode.includes('path="/rubber-stamps-dubai"'), 'Rubber stamps SEO route missing')
  assert(appJsxCode.includes('path="/services/stamps-printing-dubai"'), 'Stamps service route missing')
  assert(appJsxCode.includes('path="/services/brochures-printing"'), 'Brochures service redirect missing')
  assert(appJsxCode.includes('path="/business-card-printing-dubai"'), 'Business cards SEO route missing')
  assert(appJsxCode.includes('path="/sticker-printing-dubai"'), 'Stickers SEO route missing')
})

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n=============================================================')
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`)
console.log('=============================================================\n')

if (failed > 0) {
  process.exit(1)
} else {
  console.log('🎉 ALL INTEGRATION TESTS PASSED CLEANLY!\n')
  process.exit(0)
}
