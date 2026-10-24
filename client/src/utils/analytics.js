/**
 * ONPRINT Google Analytics 4 (GA4) Utility
 * 
 * Provides safe, SPA-friendly, privacy-guarded event tracking.
 * Respects user privacy: NEVER collects PII, passwords, payment info, or secret tokens.
 */

// Track the last pageview to prevent duplicate pageview emissions
let lastTrackedPath = null
let isInitialized = false

/**
 * Detects non-personal device category ('mobile' | 'tablet' | 'desktop')
 */
export function getDeviceCategory() {
  if (typeof window === 'undefined') return 'desktop'
  const ua = (navigator?.userAgent || '').toLowerCase()
  const width = window.innerWidth || 1024
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua) || (width >= 768 && width < 1024)) {
    return 'tablet'
  }
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua) || width < 768) {
    return 'mobile'
  }
  return 'desktop'
}

/**
 * Returns current URL path safely
 */
export function getCurrentPagePath(fallback = '/') {
  if (typeof window !== 'undefined' && window.location && window.location.pathname) {
    return window.location.pathname
  }
  return fallback
}

/**
 * Strips potential PII or sensitive keys from event payloads
 */
function sanitizeParams(params = {}) {
  const sensitiveKeys = [
    'password',
    'pass',
    'pwd',
    'secret',
    'token',
    'authtoken',
    'jwt',
    'credit_card',
    'card_number',
    'cvv',
    'cnic',
    'nic',
    'national_id',
    'ssn',
    'customer_name',
    'name',
    'full_name',
    'fullname',
    'email',
    'customer_email',
    'email_address',
    'phone',
    'phone_number',
    'customer_phone',
    'whatsapp_number',
    'message',
    'private_message',
    'notes',
    'artwork',
    'file',
  ]

  const clean = {}
  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase()
    if (sensitiveKeys.includes(lowerKey)) {
      continue
    }
    if (value !== undefined && value !== null && value !== '') {
      clean[key] = value
    }
  }
  return clean
}

/**
 * Initialize Google Analytics 4
 * Injects gtag.js script and sets up window.dataLayer
 */
export function initGA(measurementId) {
  if (typeof window === 'undefined') return
  if (!measurementId || typeof measurementId !== 'string' || !measurementId.trim()) {
    return
  }

  const cleanId = measurementId.trim()

  // Prevent duplicate script tag injection if index.html already has it
  if (
    document.getElementById('onprint-ga4-script') ||
    document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
  ) {
    isInitialized = true
    return
  }

  // 1. Setup dataLayer & gtag function
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
  }

  window.gtag('js', new Date())

  // Important for SPA: Disable automatic pageview emission in config
  // Route changes and initial view will be controlled explicitly by React Router
  window.gtag('config', cleanId, {
    send_page_view: false,
    anonymize_ip: true,
  })

  // 2. Inject official Google tag (gtag.js)
  const script = document.createElement('script')
  script.id = 'onprint-ga4-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`
  document.head.appendChild(script)

  isInitialized = true
}

/**
 * Generic GA4 Event Emitter (with automatic page_path and device_category)
 */
export function trackEvent(eventName, eventParams = {}) {
  if (typeof window === 'undefined') return

  try {
    const enrichedParams = {
      page_path: getCurrentPagePath(),
      device_category: getDeviceCategory(),
      ...eventParams,
    }
    const cleanParams = sanitizeParams(enrichedParams)

    // Push to dataLayer for GTM compatibility even if gtag isn't initialized yet
    window.dataLayer = window.dataLayer || []
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, cleanParams)
    } else {
      window.dataLayer.push({
        event: eventName,
        ...cleanParams,
      })
    }
  } catch {
    // Gracefully handle analytics errors without breaking user experience
  }
}

/**
 * Track SPA Route / Page View
 * Ensures no duplicate page views are dispatched for identical paths
 */
export function trackPageView({ page_title, page_location, page_path } = {}) {
  if (typeof window === 'undefined') return

  const currentPath = page_path || window.location.pathname + window.location.search
  const currentTitle = page_title || document.title || 'ONPRINT Dubai'
  const currentLocation = page_location || window.location.href

  // Deduplicate consecutive identical pageviews
  if (lastTrackedPath === currentPath) {
    return
  }
  lastTrackedPath = currentPath

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: currentTitle,
        page_location: currentLocation,
        page_path: currentPath,
        device_category: getDeviceCategory(),
      })
    }
  } catch {
    // Graceful fallback
  }
}

/* =========================================================================
   ONPRINT Core Business Event Helpers
   ========================================================================= */

/**
 * 1. View Homepage
 */
export function trackViewHomepage() {
  trackEvent('view_homepage', {
    page_name: 'Home',
  })
}

/**
 * 2. View Category
 */
export function trackViewCategory({ category_name, category_slug } = {}) {
  trackEvent('view_category', {
    category_name: category_name || 'All Categories',
    category_slug: category_slug || 'all',
  })
}

/**
 * 3. View Product
 */
export function trackViewProduct({ product_name, product_id, category_name } = {}) {
  trackEvent('view_product', {
    product_name: product_name || 'Untitled Product',
    product_id: product_id ? String(product_id) : undefined,
    category_name: category_name || 'General Printing',
  })
}

/**
 * 4. View Services
 */
export function trackViewServices({ service_name, service_slug } = {}) {
  trackEvent('view_services', {
    service_name: service_name || 'Printing Services Catalog',
    service_slug: service_slug || 'services',
  })
}

/**
 * 5. Get Quote Click
 */
export function trackGetQuoteClick({ source_page, product_name, category_name, button_location } = {}) {
  const pagePath = getCurrentPagePath()
  trackEvent('get_quote_click', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    product_name: product_name || undefined,
    category_name: category_name || undefined,
    button_location: button_location || 'quote_cta',
    device_category: getDeviceCategory(),
  })
}

/**
 * Non-blocking server-side conversion beacon (Privacy-safe, no PII)
 * Separates whatsapp_click, contact_form_submit, quote_request, phone_click, email_click, and product_inquiry.
 * Never reports clicks as confirmed orders.
 */
export function sendConversionBeacon({
  conversion_type,
  source_page,
  source_label,
  product_name,
  button_location,
  device_category,
} = {}) {
  if (typeof window === 'undefined' || typeof fetch !== 'function' || !conversion_type) return
  try {
    const pagePath = getCurrentPagePath()
    const resolvedLandingPage =
      source_page && String(source_page).startsWith('/') ? source_page : pagePath || source_page || '/'
    const payload = {
      conversion_type,
      landing_page: resolvedLandingPage,
      referrer: document.referrer || '',
      source_label: source_label || button_location || product_name || conversion_type,
      product_name: product_name || undefined,
      button_location: button_location || undefined,
      device_category: device_category || getDeviceCategory(),
      query_string: window.location.search || '',
    }
    fetch('/api/seo/conversions/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Gracefully ignore network/beacon errors
  }
}

let lastFormStartKey = ''
let lastFormStartTime = 0

/**
 * 6a. Contact Form Start (No PII)
 */
export function trackContactFormStart({ form_name = 'inquiry_form', source_page, product_name, button_location } = {}) {
  const now = Date.now()
  const pagePath = getCurrentPagePath()
  const key = `${pagePath}-${form_name}`
  if (lastFormStartKey === key && now - lastFormStartTime < 15000) {
    return
  }
  lastFormStartKey = key
  lastFormStartTime = now

  trackEvent('contact_form_start', {
    form_name,
    page_path: pagePath,
    source_page: source_page || pagePath,
    product_name: product_name || undefined,
    button_location: button_location || 'form_field_focus',
    device_category: getDeviceCategory(),
  })
}

let lastFormSubmitTime = 0

/**
 * 6b. Contact Form Submit (No PII)
 */
export function trackContactFormSubmit({ source_page, product_name, button_location, form_name = 'contact_us_form' } = {}) {
  const now = Date.now()
  if (now - lastFormSubmitTime < 1000) return
  lastFormSubmitTime = now

  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()

  trackEvent('contact_form_submit', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    form_name,
    product_name: product_name || undefined,
    button_location: button_location || 'contact_form_submit_button',
    device_category: device,
  })
  sendConversionBeacon({
    conversion_type: 'contact_form_submit',
    source_page: pagePath,
    source_label: form_name,
    product_name,
    button_location: button_location || 'contact_form_submit_button',
    device_category: device,
  })
}

let lastWhatsAppClickTime = 0

/**
 * Checks if a WhatsApp click was already tracked within the deduplication window
 */
export function wasWhatsAppRecentlyTracked(windowMs = 900) {
  return Date.now() - lastWhatsAppClickTime < windowMs
}

/**
 * 7. WhatsApp Click (With strict time-based deduplication to prevent double firing between component & global listeners)
 */
export function trackWhatsAppClick(params = {}) {
  const {
    source_page,
    service,
    service_name,
    button_location,
    label,
    product_id,
    product_name,
  } = typeof params === 'object' && params !== null ? params : { label: String(params || '') }

  const now = Date.now()
  // Deduplicate any rapid consecutive WhatsApp click triggers within 900ms
  if (now - lastWhatsAppClickTime < 900) {
    return
  }
  lastWhatsAppClickTime = now

  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()
  const resolvedProduct = product_name || service_name || service || undefined
  const resolvedLocation = button_location || label || 'whatsapp_cta'
  const resolvedLabel = label || button_location || resolvedProduct || 'whatsapp_inquiry'

  trackEvent('whatsapp_click', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    channel: 'whatsapp',
    product_name: resolvedProduct,
    service: service || service_name || undefined,
    button_location: resolvedLocation,
    label: resolvedLabel,
    product_id: product_id ? String(product_id) : undefined,
    device_category: device,
  })
  sendConversionBeacon({
    conversion_type: 'whatsapp_click',
    source_page: pagePath,
    source_label: resolvedLabel,
    product_name: resolvedProduct,
    button_location: resolvedLocation,
    device_category: device,
  })
}

let lastPhoneClickTime = 0

export function wasPhoneRecentlyTracked(windowMs = 900) {
  return Date.now() - lastPhoneClickTime < windowMs
}

/**
 * 8. Phone Click (No PII / raw phone numbers sent to analytics)
 */
export function trackPhoneClick({ source_page, button_location, product_name } = {}) {
  const now = Date.now()
  if (now - lastPhoneClickTime < 900) return
  lastPhoneClickTime = now

  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()
  const resolvedLocation = button_location || 'phone_contact_link'

  trackEvent('phone_click', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    button_location: resolvedLocation,
    product_name: product_name || undefined,
    device_category: device,
  })
  sendConversionBeacon({
    conversion_type: 'phone_click',
    source_page: pagePath,
    source_label: resolvedLocation,
    product_name,
    button_location: resolvedLocation,
    device_category: device,
  })
}

let lastEmailClickTime = 0

export function wasEmailRecentlyTracked(windowMs = 900) {
  return Date.now() - lastEmailClickTime < windowMs
}

/**
 * 9. Email Click (No PII)
 */
export function trackEmailClick({ source_page, button_location } = {}) {
  const now = Date.now()
  if (now - lastEmailClickTime < 900) return
  lastEmailClickTime = now

  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()
  const resolvedLocation = button_location || 'email_contact_link'

  trackEvent('email_click', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    button_location: resolvedLocation,
    device_category: device,
  })
  sendConversionBeacon({
    conversion_type: 'email_click',
    source_page: pagePath,
    source_label: resolvedLocation,
    button_location: resolvedLocation,
    device_category: device,
  })
}

let lastProductInquiryTime = 0

/**
 * 10. Product Inquiry (Supports object or positional arguments)
 */
export function trackProductInquiry(arg1 = {}, arg2) {
  const now = Date.now()
  if (now - lastProductInquiryTime < 600) return
  lastProductInquiryTime = now

  let params = {}
  if (typeof arg1 === 'string') {
    params = { product_name: arg1, button_location: typeof arg2 === 'string' ? arg2 : 'product_cta' }
  } else if (typeof arg1 === 'object' && arg1 !== null) {
    params = arg1
  }

  const { source_page, product_name, service_name, button_location } = params
  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()
  const resolvedProduct = product_name || service_name || undefined
  const resolvedLocation = button_location || 'product_inquiry_cta'

  trackEvent('product_inquiry', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    product_name: resolvedProduct,
    service_name: service_name || undefined,
    button_location: resolvedLocation,
    device_category: device,
  })
  sendConversionBeacon({
    conversion_type: 'product_inquiry',
    source_page: pagePath,
    source_label: resolvedProduct || resolvedLocation,
    product_name: resolvedProduct,
    button_location: resolvedLocation,
    device_category: device,
  })
}

let lastQuoteRequestTime = 0

/**
 * 11. Quote Request Submission (No PII) - Dispatches quote_request, contact_form_submit, & generate_lead
 */
export function trackQuoteRequest({ source_page, product_name, category_name, button_location } = {}) {
  const now = Date.now()
  if (now - lastQuoteRequestTime < 1000) return
  lastQuoteRequestTime = now

  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()
  const resolvedProduct = product_name || category_name || undefined
  const resolvedLocation = button_location || 'quote_form_submit'

  // Required Task 6 event: quote_request
  trackEvent('quote_request', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    product_name: resolvedProduct,
    category_name: category_name || undefined,
    button_location: resolvedLocation,
    device_category: device,
  })

  // Also emit contact_form_submit so form submission funnel captures both quote & contact forms
  trackEvent('contact_form_submit', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    form_name: 'quote_request_form',
    product_name: resolvedProduct,
    button_location: resolvedLocation,
    device_category: device,
  })

  // Official GA4 conversion event (lead submission, not sale)
  trackEvent('generate_lead', {
    currency: 'AED',
    value: 1,
    lead_type: 'custom_quote',
    page_path: pagePath,
    source_page: source_page || pagePath,
    product_name: resolvedProduct,
    device_category: device,
  })

  sendConversionBeacon({
    conversion_type: 'quote_request',
    source_page: pagePath,
    source_label: resolvedProduct || 'custom_quote',
    product_name: resolvedProduct,
    button_location: resolvedLocation,
    device_category: device,
  })
}

/**
 * 12. Quote Form Start (Also emits contact_form_start for unified funnel tracking)
 */
export function trackQuoteFormStart({ form_name = 'quote_wizard', source_page, product_name, button_location } = {}) {
  const pagePath = getCurrentPagePath()
  trackEvent('quote_form_start', {
    form_name,
    page_path: pagePath,
    source_page: source_page || pagePath,
    product_name: product_name || undefined,
    button_location: button_location || 'quote_form_start',
    device_category: getDeviceCategory(),
  })
  trackContactFormStart({
    form_name,
    source_page: source_page || pagePath,
    product_name,
    button_location: button_location || 'quote_form_start',
  })
}

/**
 * 13. Artwork File Upload Event
 */
export function trackArtworkUpload({ file_count = 1, source_page } = {}) {
  const pagePath = getCurrentPagePath()
  trackEvent('artwork_upload', {
    file_count,
    page_path: pagePath,
    source_page: source_page || pagePath,
    device_category: getDeviceCategory(),
  })
}

/**
 * 14. Search
 */
export function trackSearch({ search_term } = {}) {
  if (!search_term || typeof search_term !== 'string' || !search_term.trim()) return
  trackEvent('search', {
    search_term: search_term.trim(),
    page_path: getCurrentPagePath(),
    device_category: getDeviceCategory(),
  })
}

/**
 * 15. Admin Login (No Credentials)
 */
export function trackAdminLogin({ success = true } = {}) {
  trackEvent('admin_login', {
    method: 'credentials',
    success: Boolean(success),
  })
}

let hasTrackedOrganicLanding = false

/**
 * 16. Phase 5: Organic Landing-Page Visit Tracking
 * Fires once per session when the visitor lands on the website, tagging organic search referrers vs direct/referral.
 */
export function trackOrganicLandingVisit({ page_path, referrer } = {}) {
  if (typeof window === 'undefined' || hasTrackedOrganicLanding) return
  hasTrackedOrganicLanding = true

  const resolvedPath = page_path || getCurrentPagePath()
  const ref = (referrer !== undefined ? referrer : document.referrer || '').toLowerCase()
  const isOrganicSearch = /google\.|bing\.|duckduckgo\.|yahoo\.|yandex\.|ecosia\./i.test(ref)
  let referrerHost = 'direct'
  if (ref) {
    try {
      referrerHost = new URL(ref).hostname
    } catch {
      referrerHost = 'referral'
    }
  }

  trackEvent('organic_landing_visit', {
    landing_page: resolvedPath,
    traffic_channel: isOrganicSearch ? 'organic_search' : ref ? 'referral' : 'direct',
    referrer_host: referrerHost,
    is_business_card_landing: /business-card|foil|spot-uv|embossed|velvet/i.test(resolvedPath),
    device_category: getDeviceCategory(),
  })
}

/**
 * 17. Phase 5: Business-Card Product & Spoke View Tracking
 */
export function trackBusinessCardProductView({ product_name, product_slug, finish_type, gsm_tier } = {}) {
  const pagePath = getCurrentPagePath()
  trackEvent('business_card_product_view', {
    page_path: pagePath,
    product_name: product_name || 'Business Cards',
    product_slug: product_slug || pagePath.replace(/^\//, ''),
    finish_type: finish_type || undefined,
    gsm_tier: gsm_tier || undefined,
    device_category: getDeviceCategory(),
  })
}

/**
 * 18. Phase 5: Confirmed Corporate Enquiry Submission (Separate from mere CTA clicks; zero PII)
 */
export function trackCorporateEnquirySubmit({ source_page, product_name, inquiry_type = 'corporate_print_enquiry' } = {}) {
  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()
  trackEvent('corporate_enquiry_submit', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    product_name: product_name || 'Corporate Printing',
    inquiry_type,
    device_category: device,
  })
}




/**
 * 19. Qualified Lead Tracking (Strictly distinguishes confirmed inquiries from mere link clicks)
 * Fired when a customer submits full quotation specs (contact info, product choice, quantity, finish, delivery location)
 */
export function trackQualifiedLead({
  lead_type = 'business_card_quote',
  product_name = 'Custom Business Cards',
  quantity,
  material,
  finish,
  has_artwork = false,
  delivery_location = 'Dubai, UAE',
  estimated_value,
  source_page,
} = {}) {
  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()

  trackEvent('qualified_lead', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    lead_type,
    product_name,
    quantity: quantity ? Number(quantity) : undefined,
    material: material || undefined,
    finish: finish || undefined,
    has_artwork: Boolean(has_artwork),
    delivery_location,
    value: estimated_value ? Number(estimated_value) : undefined,
    currency: 'AED',
    language: language || (pagePath.startsWith('/ar') ? 'ar' : 'en'),
    device_category: device,
  })

  sendConversionBeacon({
    conversion_type: 'qualified_lead',
    source_page: pagePath,
    source_label: `${lead_type}_${product_name}`,
    product_name,
    button_location: 'quote_form_submit',
    device_category: device,
  })
}

/**
 * 20. Product Inquiry Click (Phase 5 requirement: specifically tracks clicks on product-specific inquiry actions)
 */
export function trackProductInquiryClick({
  source_page,
  product_name,
  category_name,
  service_name,
  button_location,
  label,
} = {}) {
  const pagePath = getCurrentPagePath()
  const resolvedProduct = product_name || service_name || category_name || undefined
  const resolvedLocation = button_location || label || 'product_inquiry_button'

  trackEvent('product_inquiry_click', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    product_name: resolvedProduct,
    category_name: category_name || undefined,
    button_location: resolvedLocation,
    label: label || resolvedLocation,
    device_category: getDeviceCategory(),
  })
}

/**
 * 21. Order Completed (Phase 5 requirement: fired strictly when a real order confirmation exists)
 */
export function trackOrderCompleted({
  order_number,
  product_name,
  quantity,
  total_price,
  currency = 'AED',
  source_page,
} = {}) {
  const pagePath = getCurrentPagePath()
  const device = getDeviceCategory()

  trackEvent('order_completed', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    order_number: order_number ? String(order_number) : undefined,
    product_name: product_name || undefined,
    quantity: quantity ? Number(quantity) : undefined,
    value: total_price ? Number(total_price) : undefined,
    currency,
    device_category: device,
  })

  sendConversionBeacon({
    conversion_type: 'order_completed',
    source_page: pagePath,
    source_label: order_number || 'direct_order',
    product_name,
    button_location: 'order_confirmation',
    device_category: device,
  })
}


/**
 * 20. Dedicated Sticker Inquiry & Quotation Analytics
 * Tracks high-intent sticker conversion funnels in compliance with UAE privacy standards.
 */

export function trackStickerWhatsAppClick({
  sticker_type = 'Custom Stickers',
  quantity,
  button_location = 'sticker_page_cta',
  source_page,
  label,
} = {}) {
  const pagePath = getCurrentPagePath('/sticker-printing-dubai')
  const device = getDeviceCategory()

  trackEvent('sticker_whatsapp_click', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    service_name: 'stickers',
    sticker_type,
    quantity: quantity ? Number(quantity) : undefined,
    button_location,
    label: label || `sticker_whatsapp_${button_location}`,
    device_category: device,
  })

  // Also emit standard whatsapp_click for aggregate reporting
  trackWhatsAppClick({
    source_page: source_page || pagePath,
    service_name: 'stickers',
    product_name: sticker_type,
    button_location,
    label: label || `sticker_whatsapp_${button_location}`,
  })
}

export function trackStickerQuoteStart({
  sticker_type = 'Custom Stickers',
  source_page,
} = {}) {
  const pagePath = getCurrentPagePath('/sticker-printing-dubai')
  const device = getDeviceCategory()

  trackEvent('sticker_quote_start', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    service_name: 'stickers',
    sticker_type,
    device_category: device,
  })
}

export function trackStickerQuoteSubmit({
  sticker_type = 'Custom Stickers',
  quantity,
  material,
  finish,
  shape,
  size,
  source_page,
  estimated_value,
} = {}) {
  const pagePath = getCurrentPagePath('/sticker-printing-dubai')
  const device = getDeviceCategory()

  trackEvent('sticker_quote_submit', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    service_name: 'stickers',
    sticker_type,
    quantity: quantity ? Number(quantity) : undefined,
    material: material || undefined,
    finish: finish || undefined,
    shape: shape || undefined,
    size: size || undefined,
    value: estimated_value ? Number(estimated_value) : undefined,
    currency: 'AED',
    device_category: device,
  })

  // Also emit standard qualified_lead beacon
  trackQualifiedLead({
    lead_type: 'sticker_quote',
    product_name: sticker_type,
    quantity,
    material,
    finish,
    delivery_location: 'Dubai, UAE',
    estimated_value,
    source_page,
  })
}

export function trackStickerArtworkUpload({
  file_type,
  file_size,
  source_page,
} = {}) {
  const pagePath = getCurrentPagePath('/sticker-printing-dubai')
  const device = getDeviceCategory()

  trackEvent('sticker_artwork_upload', {
    page_path: pagePath,
    source_page: source_page || pagePath,
    file_type: file_type || 'unknown',
    file_size_kb: file_size ? Math.round(file_size / 1024) : undefined,
    device_category: device,
  })
}

export function trackStickerOrderCompleted({
  order_id,
  sticker_type = 'Custom Stickers',
  quantity,
  value,
  currency = 'AED',
} = {}) {
  const pagePath = getCurrentPagePath('/sticker-printing-dubai')
  const device = getDeviceCategory()

  trackEvent('sticker_order_completed', {
    page_path: pagePath,
    order_id: order_id || undefined,
    sticker_type,
    quantity: quantity ? Number(quantity) : undefined,
    value: value ? Number(value) : undefined,
    currency,
    device_category: device,
  })
}


// Conversions & Quote Aliases
export const trackQuoteStart = trackQuoteFormStart
export const trackQuoteSubmit = trackQuoteRequest
