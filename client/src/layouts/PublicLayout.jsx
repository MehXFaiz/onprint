import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import MobileBottomActionBar from '../components/MobileBottomActionBar'

export default function PublicLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    const isArabic = pathname.startsWith('/ar')
    document.documentElement.lang = isArabic ? 'ar' : 'en'
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [pathname])

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#F5F0E7] text-[#352719] antialiased selection:bg-[#C5A989] selection:text-[#352719]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-xl focus:bg-[#795C43] focus:px-4 focus:py-2.5 focus:text-xs focus:font-black focus:uppercase focus:tracking-wider focus:text-white focus:shadow-2xl"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 w-full bg-[#F5F0E7] text-[#352719] pb-20 md:pb-0 focus:outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
      <MobileBottomActionBar />
    </div>
  )
}
