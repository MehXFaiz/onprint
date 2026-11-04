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
        className={`${className.includes('hidden') ? '' : 'inline-flex '}items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
          isArabic
            ? 'text-[#795C43] hover:text-white'
            : 'text-[#352719] hover:text-[#795C43]'
        } ${className}`}
        title={isArabic ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
        aria-label={isArabic ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
      >
        <Globe className="h-3.5 w-3.5 text-[#795C43] shrink-0" />
        <span className="font-semibold">{isArabic ? 'English' : 'عربي'}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`${className.includes('hidden') ? '' : 'inline-flex '}items-center gap-1.5 h-8.5 px-3 rounded-full border transition-all cursor-pointer shadow-2xs ${
        isArabic
          ? 'bg-[#FAF8F3] border-[#C5A989] text-[#795C43] hover:bg-[#795C43] hover:text-white'
          : 'bg-[#F5F0E7] border-[#DED2C1] text-[#352719] hover:border-[#C5A989] hover:text-[#795C43]'
      } text-xs font-bold shrink-0 ${className}`}
      title={isArabic ? 'Switch to English version' : 'التبديل إلى النسخة العربية'}
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى النسخة العربية'}
    >
      <Globe className="h-3.5 w-3.5 text-[#795C43] shrink-0" />
      <span className="tracking-wide">{isArabic ? 'EN' : 'عربي'}</span>
    </button>
  )
}
