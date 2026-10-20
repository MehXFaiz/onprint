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
  }, [pathname])

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#0B132B] text-[#F5F3EE] antialiased selection:bg-[#D6C29A] selection:text-[#0B132B]">
      <SiteHeader />
      <main className="flex-1 min-w-0 w-full bg-[#0B132B] text-[#F5F3EE] pb-16 md:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
      <MobileBottomActionBar />
    </div>
  )
}
