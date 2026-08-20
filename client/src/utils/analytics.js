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
 * Strips potential PII or sensitive keys from event payloads
 */
function sanitizeParams(params = {}) {
  const sensitiveKeys = [
    'password',
    'pass',
    'pwd',
    'secret',
    'token',
    'authToken',
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
    'email',
    'customer_email',
    'phone',
    'phone_number',
    'customer_phone',
    'message',
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
    if (value !== undefined && value !== null) {
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

  // Prevent duplicate script tag injection
  if (document.getElementById('onprint-ga4-script')) {
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
 * Generic GA4 Event Emitter
 */
export function trackEvent(eventName, eventParams = {}) {
  if (typeof window === 'undefined') return
  if (!window.gtag) return

  try {
    const cleanParams = sanitizeParams(eventParams)
    window.gtag('event', eventName, cleanParams)
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
  if (!window.gtag) return

  const currentPath = page_path || window.location.pathname + window.location.search
  const currentTitle = page_title || document.title || 'ONPRINT Dubai'
  const currentLocation = page_location || window.location.href

  // Deduplicate consecutive identical pageviews
  if (lastTrackedPath === currentPath) {
    return
  }
  lastTrackedPath = currentPath

  try {
    window.gtag('event', 'page_view', {
      page_title: currentTitle,
      page_location: currentLocation,
      page_path: currentPath,
    })
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
export function trackViewCategory({ category_name, category_slug }) {
  trackEvent('view_category', {
    category_name: category_name || 'All Categories',
    category_slug: category_slug || 'all',
  })
}

/**
 * 3. View Product
 */
export function trackViewProduct({ product_name, product_id, category_name }) {
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
export function trackGetQuoteClick({ source_page, product_name, category_name } = {}) {
  trackEvent('get_quote_click', {
    source_page: source_page || 'unknown',
    product_name: product_name || undefined,
    category_name: category_name || undefined,
  })
}

/**
 * 6. Contact Form Submit (No PII)
 */
export function trackContactFormSubmit({ source_page } = {}) {
  trackEvent('contact_form_submit', {
    source_page: source_page || 'contact_page',
    form_name: 'contact_us_form',
  })
}

/**
 * 7. WhatsApp Click
 */
export function trackWhatsAppClick({ source_page, label } = {}) {
  trackEvent('whatsapp_click', {
    source_page: source_page || 'website',
    channel: 'whatsapp',
    label: label || 'chat_support',
  })
}

/**
 * 8. Phone Click
 */
export function trackPhoneClick({ source_page, phone_number } = {}) {
  trackEvent('phone_click', {
    source_page: source_page || 'website',
    phone_label: phone_number || '+971 4 800 PRINT',
  })
}

/**
 * 9. Email Click
 */
export function trackEmailClick({ source_page, email_address } = {}) {
  trackEvent('email_click', {
    source_page: source_page || 'website',
    email_label: email_address || 'info@onprint.ae',
  })
}

/**
 * 10. Product Inquiry
 */
export function trackProductInquiry({ source_page, product_name, service_name } = {}) {
  trackEvent('product_inquiry', {
    source_page: source_page || 'product_detail',
    product_name: product_name || undefined,
    service_name: service_name || undefined,
  })
}

/**
 * 11. Quote Request Submission (No PII)
 */
export function trackQuoteRequest({ source_page, product_name, category_name } = {}) {
  trackEvent('quote_request', {
    source_page: source_page || 'get_quote_page',
    product_name: product_name || undefined,
    category_name: category_name || undefined,
  })
}

/**
 * 12. Search
 */
export function trackSearch({ search_term } = {}) {
  if (!search_term || typeof search_term !== 'string' || !search_term.trim()) return
  trackEvent('search', {
    search_term: search_term.trim(),
  })
}

/**
 * 13. Admin Login (No Credentials)
 */
export function trackAdminLogin({ success = true } = {}) {
  trackEvent('admin_login', {
    method: 'credentials',
    success: Boolean(success),
  })
}
