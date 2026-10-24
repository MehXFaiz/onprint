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
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#101D35] text-[#F5F2EB] antialiased selection:bg-[#D4AF65] selection:text-[#101D35]">
      <SiteHeader />
      <main className="flex-1 min-w-0 w-full bg-[#101D35] text-[#F5F2EB] pb-16 md:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
      <MobileBottomActionBar />
    </div>
  )
}
