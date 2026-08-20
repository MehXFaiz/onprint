import { useEffect } from 'react'

/**
 * GoogleAnalytics / Google Tag Manager integration
 * Reads VITE_GA_ID or VITE_GTM_ID from environment
 */
export default function GoogleAnalytics() {
  const gaId = import.meta.env.VITE_GA_ID
  const gtmId = import.meta.env.VITE_GTM_ID

  useEffect(() => {
    // 1. Google Analytics (gtag.js)
    if (gaId && !document.getElementById('onprint-ga-script')) {
      const script = document.createElement('script')
      script.id = 'onprint-ga-script'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      document.head.appendChild(script)

      const inlineScript = document.createElement('script')
      inlineScript.id = 'onprint-ga-inline'
      inlineScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { page_path: window.location.pathname });
      `
      document.head.appendChild(inlineScript)
    }

    // 2. Google Tag Manager
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
  }, [gaId, gtmId])

  return null
}
