import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  initGA,
  trackPageView,
  trackOrganicLandingVisit,
  trackPhoneClick,
  trackEmailClick,
  trackWhatsAppClick,
  wasWhatsAppRecentlyTracked,
  wasPhoneRecentlyTracked,
  wasEmailRecentlyTracked,
} from '../utils/analytics'

/**
 * GoogleAnalytics / GA4 & GTM Integration Component
 * - Reads VITE_GA_MEASUREMENT_ID (or fallback VITE_GA_ID)
 * - Tracks initial page load and every SPA route change
 * - Listens for global tel:, mailto:, and WhatsApp outbound interactions (fallback for links without explicit onClick tracking)
 */
export default function GoogleAnalytics() {
  const location = useLocation()
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || import.meta.env.VITE_GA_ID || 'G-GM4H4QNS0D'
  const gtmId = import.meta.env.VITE_GTM_ID

  // 1. Initialize Google Analytics 4 & optional GTM
  useEffect(() => {
    if (measurementId) {
      initGA(measurementId)
    }

    if (gtmId && !document.getElementById('onprint-gtm-script')) {
      const gtmScript = document.createElement('script')
      gtmScript.id = 'onprint-gtm-script'
      gtmScript.textContent = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `
      document.head.appendChild(gtmScript)
    }
  }, [measurementId, gtmId])

  // 2. Track Route Changes as SPA Pageviews
  useEffect(() => {
    if (!measurementId) return

    // Small delay ensures SEOHead useEffect has updated document.title
    const timer = setTimeout(() => {
      const fullPath = location.pathname + location.search
      trackOrganicLandingVisit({ page_path: fullPath })
      trackPageView({
        page_title: document.title,
        page_location: window.location.href,
        page_path: fullPath,
      })
    }, 60)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search, measurementId])

  // 3. Global click interceptor for Phone, Email & WhatsApp links (Bubble phase so component onClick runs first with rich metadata)
  useEffect(() => {
    function handleGlobalClick(event) {
      const anchor = event.target.closest('a')
      if (!anchor || !anchor.href) return

      const href = anchor.href.toLowerCase()
      const buttonLocation =
        anchor.getAttribute('data-location') ||
        anchor.getAttribute('aria-label') ||
        (anchor.closest('header') ? 'site_header' : anchor.closest('footer') ? 'site_footer' : 'page_link')

      if (href.startsWith('tel:')) {
        if (!wasPhoneRecentlyTracked()) {
          trackPhoneClick({
            source_page: location.pathname,
            button_location: buttonLocation,
          })
        }
      } else if (href.startsWith('mailto:')) {
        if (!wasEmailRecentlyTracked()) {
          trackEmailClick({
            source_page: location.pathname,
            button_location: buttonLocation,
          })
        }
      } else if (
        href.includes('wa.me') ||
        href.includes('whatsapp.com') ||
        anchor.getAttribute('aria-label')?.toLowerCase().includes('whatsapp')
      ) {
        if (!wasWhatsAppRecentlyTracked()) {
          const productName = anchor.getAttribute('data-product') || undefined
          trackWhatsAppClick({
            source_page: location.pathname,
            button_location: buttonLocation,
            product_name: productName,
            label: buttonLocation,
          })
        }
      }
    }

    document.addEventListener('click', handleGlobalClick, false)
    return () => {
      document.removeEventListener('click', handleGlobalClick, false)
    }
  }, [location.pathname, measurementId])

  return null
}

