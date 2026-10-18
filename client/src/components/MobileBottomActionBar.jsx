import { Link, useLocation } from 'react-router-dom'
import { Phone, FileText, Package, MessageSquare } from 'lucide-react'
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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#101D35]/95 backdrop-blur-md border-t border-[#D4AF65]/30 shadow-2xl px-2 py-1.5 safe-area-bottom"
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
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl text-emerald-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs">
            <WhatsAppIcon className="h-3.5 w-3.5 fill-white" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-slate-200">WhatsApp</span>
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
              ? 'text-[#D4AF65] bg-white/10 font-black'
              : 'text-[#D4AF65] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF65] text-[#101D35] font-black shadow-xs">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-extrabold tracking-tight mt-1 text-[#D4AF65]">Get Quote</span>
        </Link>

        {/* 3. Direct Phone Call */}
        <a
          href={`tel:+${RAW_WHATSAPP_NUMBER}`}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-200 shadow-xs border border-slate-700">
            <Phone className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-slate-200">Call Us</span>
        </a>

        {/* 4. Track Order / Reference */}
        <Link
          to="/track-order"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-1 rounded-xl active:scale-95 transition-all ${
            pathname === '/track-order'
              ? 'text-[#D4AF65] bg-white/10 font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-200 shadow-xs border border-slate-700">
            <Package className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-slate-200">Track Order</span>
        </Link>
      </div>
    </nav>
  )
}
