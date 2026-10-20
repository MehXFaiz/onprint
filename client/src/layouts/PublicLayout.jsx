import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import LoadingScreen from '../components/LoadingScreen'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import MobileBottomActionBar from '../components/MobileBottomActionBar'

export default function PublicLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#101C35] text-[#F5F1E8] antialiased selection:bg-[#D6BC8A] selection:text-[#101C35]">
      <LoadingScreen />
      <SiteHeader />
      <main className="flex-1 min-w-0 w-full bg-[#101C35] text-[#F5F1E8] pb-16 md:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
      <MobileBottomActionBar />
    </div>
  )
}
