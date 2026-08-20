import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  initGA,
  trackPageView,
  trackPhoneClick,
  trackEmailClick,
  trackWhatsAppClick,
} from '../utils/analytics'

/**
 * GoogleAnalytics / GA4 & GTM Integration Component
 * - Reads VITE_GA_MEASUREMENT_ID (or fallback VITE_GA_ID)
 * - Tracks initial page load and every SPA route change
 * - Listens for global tel:, mailto:, and WhatsApp outbound interactions
 */
export default function GoogleAnalytics() {
  const location = useLocation()
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || import.meta.env.VITE_GA_ID
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
      trackPageView({
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      })
    }, 60)

    return () => clearTimeout(timer)
  }, [location.pathname, location.search, measurementId])

  // 3. Global click interceptor for Phone, Email & WhatsApp links
  useEffect(() => {
    if (!measurementId) return

    function handleGlobalClick(event) {
      const anchor = event.target.closest('a')
      if (!anchor || !anchor.href) return

      const href = anchor.href.toLowerCase()

      if (href.startsWith('tel:')) {
        trackPhoneClick({
          source_page: location.pathname,
          phone_number: anchor.href.replace(/^tel:/i, '').trim(),
        })
      } else if (href.startsWith('mailto:')) {
        trackEmailClick({
          source_page: location.pathname,
          email_address: anchor.href.replace(/^mailto:/i, '').trim(),
        })
      } else if (href.includes('wa.me') || href.includes('whatsapp.com') || anchor.getAttribute('aria-label')?.toLowerCase().includes('whatsapp')) {
        trackWhatsAppClick({
          source_page: location.pathname,
          label: anchor.getAttribute('aria-label') || 'whatsapp_link',
        })
      }
    }

    document.addEventListener('click', handleGlobalClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true })
    }
  }, [location.pathname, measurementId])

  return null
}
