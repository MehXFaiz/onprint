import { useLocation, useNavigate } from 'react-router-dom'
import { Globe } from 'lucide-react'

// Bi-directional mapping between English and Arabic URLs
const ROUTE_MAP = {
  // English to Arabic
  '/': '/ar',
  '/business-card-printing-dubai': '/ar/business-cards',
  '/business-cards': '/ar/business-cards',
  '/premium-business-cards': '/ar/business-cards',
  '/luxury-business-cards': '/ar/business-cards',
  '/business-cards-dubai': '/ar/business-cards',
  '/stickers': '/ar/stickers',
  '/stickers-labels-printing': '/ar/stickers',
  '/sticker-printing-dubai': '/ar/stickers',
  '/custom-stickers': '/ar/stickers',
  '/categories/stickers-labels-packaging': '/ar/stickers',
  '/stamps': '/ar/stamps',
  '/custom-stamps': '/ar/stamps',
  '/company-stamps-dubai': '/ar/stamps',
  '/categories/custom-stamps-seals': '/ar/stamps',
  '/categories/stamps-printing-dubai': '/ar/stamps',
  '/services': '/ar/printing-services',
  '/services/stamps-printing-dubai': '/ar/stamps',
  '/flyers-printing-in-dubai': '/ar/printing-services',
  '/brochure-printing-dubai': '/ar/printing-services',
  '/rollup-banner-printing-dubai': '/ar/printing-services',
  '/services/rollup-banners': '/ar/printing-services',
  '/corporate-quotes': '/ar/printing-services',
  '/get-a-quote': '/ar/printing-services',

  // Arabic to English
  '/ar': '/',
  '/ar/': '/',
  '/ar/business-cards': '/business-card-printing-dubai',
  '/ar/business-card-printing-dubai': '/business-card-printing-dubai',
  '/ar/stickers': '/stickers-labels-printing',
  '/ar/stickers-labels-printing': '/stickers-labels-printing',
  '/ar/stamps': '/categories/custom-stamps-seals',
  '/ar/custom-stamps-seals': '/categories/custom-stamps-seals',
  '/ar/printing-services': '/services',
}

export function getCounterpartUrl(pathname) {
  const cleanPath = pathname.replace(/\/$/, '') || '/'
  if (ROUTE_MAP[cleanPath]) {
    return ROUTE_MAP[cleanPath]
  }

  // If on an Arabic subpath without explicit map, go to English equivalent or home
  if (cleanPath.startsWith('/ar/')) {
    const sub = cleanPath.slice(4)
    return `/${sub}`
  }

  // If on an English path, default to /ar
  return '/ar'
}

export default function LanguageSwitcher({ className = '', variant = 'pill' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isArabic = location.pathname.startsWith('/ar')

  const toggleLanguage = () => {
    const targetUrl = getCounterpartUrl(location.pathname)
    navigate(targetUrl)
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
          isArabic
            ? 'text-[#D4AF65] hover:text-white'
            : 'text-[#F5F2EB] hover:text-[#D4AF65]'
        } ${className}`}
        title={isArabic ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
        aria-label={isArabic ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
      >
        <Globe className="h-3.5 w-3.5 text-[#D4AF65] shrink-0" />
        <span className="font-semibold">{isArabic ? 'English' : 'عربي'}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 h-8.5 px-3 rounded-full border transition-all cursor-pointer shadow-2xs ${
        isArabic
          ? 'bg-[#172644] border-[#D4AF65] text-[#D4AF65] hover:bg-[#D4AF65] hover:text-[#101D35]'
          : 'bg-[#101D35] border-[#203357] text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65]'
      } text-xs font-bold shrink-0 ${className}`}
      title={isArabic ? 'Switch to English version' : 'التبديل إلى النسخة العربية'}
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى النسخة العربية'}
    >
      <Globe className="h-3.5 w-3.5 text-[#D4AF65] shrink-0" />
      <span className="tracking-wide">{isArabic ? 'EN' : 'عربي'}</span>
    </button>
  )
}
