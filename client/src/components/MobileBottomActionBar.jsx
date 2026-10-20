import { Link, useLocation } from 'react-router-dom'
import { Phone, FileText, Package } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { RAW_WHATSAPP_NUMBER } from '../utils/whatsapp'
import { trackWhatsAppClick, trackGetQuoteClick } from '../utils/analytics'

export default function MobileBottomActionBar() {
  const { pathname } = useLocation()

  // Hide on admin routes
  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      aria-label="Mobile Bottom Actions"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#101C35]/95 backdrop-blur-md border-t border-[#263654] shadow-2xl px-2 py-1.5 safe-area-bottom"
    >
      <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
        {/* 1. WhatsApp Action */}
        <a
          href={`https://wa.me/${RAW_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ONPRINT Dubai, I would like to inquire about printing products, volume rates, and custom quotes.')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackWhatsAppClick({
              source_page: pathname,
              service_name: 'Mobile Bottom Sticky WhatsApp',
              button_location: 'mobile_sticky_bottom_bar',
            })
          }}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl text-emerald-400 hover:bg-[#1B2943] active:scale-95 transition-all"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs">
            <WhatsAppIcon className="h-3.5 w-3.5 fill-white" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-[#F5F1E8]">WhatsApp</span>
        </a>

        {/* 2. Get Quote Wizard */}
        <Link
          to="/get-a-quote"
          onClick={() => {
            trackGetQuoteClick({
              source_page: pathname,
              button_location: 'mobile_sticky_bottom_bar',
            })
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl active:scale-95 transition-all ${
            pathname === '/get-a-quote'
              ? 'text-[#D6BC8A] bg-[#1B2943] font-black'
              : 'text-[#D6BC8A] hover:bg-[#1B2943]'
          }`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D6BC8A] text-[#101C35] font-black shadow-xs">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-extrabold tracking-tight mt-1 text-[#D6BC8A]">Get Quote</span>
        </Link>

        {/* 3. Direct Phone Call */}
        <a
          href={`tel:+${RAW_WHATSAPP_NUMBER}`}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl text-[#F5F1E8] hover:bg-[#1B2943] active:scale-95 transition-all"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1B2943] text-[#F5F1E8] shadow-2xs border border-[#263654]">
            <Phone className="h-3.5 w-3.5 text-[#D6BC8A]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-[#F5F1E8]">Call Us</span>
        </a>

        {/* 4. Track Order / Reference */}
        <Link
          to="/track-order"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl active:scale-95 transition-all ${
            pathname === '/track-order'
              ? 'text-[#D6BC8A] bg-[#1B2943] font-black'
              : 'text-[#F5F1E8] hover:bg-[#1B2943]'
          }`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1B2943] text-[#F5F1E8] shadow-2xs border border-[#263654]">
            <Package className="h-3.5 w-3.5 text-[#D6BC8A]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-[#F5F1E8]">Track Order</span>
        </Link>
      </div>
    </nav>
  )
}
