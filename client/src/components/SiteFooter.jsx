import { Link } from 'react-router-dom'
import Container from './Container'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { Mail, MapPin, Clock, ArrowRight, ShieldCheck, Sparkles, Phone } from 'lucide-react'
import { trackGetQuoteClick, trackWhatsAppClick } from '../utils/analytics'
import { getServiceWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../utils/whatsapp'

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#1E2C4F] bg-[#070D1E] text-[#A0AEC0]">
      {/* 1. HIGH-CONTRAST CALL TO ACTION BANNER */}
      <div className="border-b border-[#1E2C4F] bg-[#0B132B] text-[#F5F3EE] py-16 sm:py-20 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#D6C29A]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#14213D]/60 blur-3xl"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D6C29A] bg-[#D6C29A]/10 px-3 py-1 rounded-full border border-[#D6C29A]/30">
              <Sparkles className="h-3 w-3 text-[#D6C29A]" /> DUBAI COMMERCIAL PRESSROOM • AL QUOZ
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F3EE] tracking-tight leading-tight">
              Ready to Give Your Brand <span className="text-[#D6C29A]">Unmistakable Presence</span>?
            </h2>
            <p className="text-sm text-[#A0AEC0] leading-relaxed">
              Consult with our prepress engineers for physical paper swatches, 24K hot foil stamping, and rapid same-day UAE courier dispatch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              to="/get-a-quote"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D6C29A] hover:bg-[#C8B185] px-6 sm:px-7 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#0B132B] shadow-lg shadow-[#D6C29A]/25 transition-all text-center"
              onClick={() => trackGetQuoteClick({ source_page: 'footer_cta_banner' })}
            >
              <span>Request Custom Quote</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>

            <a
              href={getServiceWhatsAppUrl('general')}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackWhatsAppClick({ source_page: 'footer_cta_banner', service: 'general', button_location: 'footer_banner' })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer text-center shadow-md shadow-emerald-500/20"
            >
              <WhatsAppIcon className="h-4 w-4 fill-white text-white shrink-0" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 2. MAIN MODERNIST FOOTER GRID */}
      <Container className="py-14 sm:py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 text-[#A0AEC0]">
        {/* Col 1: Brand Info */}
        <div className="space-y-4 lg:col-span-2 lg:pr-4">
          <Link to="/" className="inline-block">
            <Logo variant="light" size="lg" />
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed text-[#A0AEC0] max-w-sm">
            ONPRINT is Dubai’s premier commercial printing house in Al Quoz. Delivering precision 600–700 GSM cotton business cards, metallic foil packaging, corporate stationery, official seals, and high-impact signage across the UAE.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[#F5F3EE]">
            <a
              href={getServiceWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({ source_page: 'footer_contact_pills', service: 'general', button_location: 'footer_social' })
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-[#25D366] hover:text-white transition-colors"
              aria-label="WhatsApp Direct Chat"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={`tel:+${RAW_WHATSAPP_NUMBER}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1E2C4F] bg-[#14213D] px-3 py-1.5 text-xs font-bold text-[#F5F3EE] hover:border-[#D6C29A] hover:text-[#D6C29A] transition-colors"
              aria-label={`Call ${FORMATTED_PHONE}`}
            >
              <Phone className="h-3 w-3 text-[#D6C29A]" />
              <span>{FORMATTED_PHONE}</span>
            </a>
            <a
              href="mailto:0nprint183@gmail.com"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1E2C4F] bg-[#14213D] px-3 py-1.5 text-xs font-bold text-[#F5F3EE] hover:border-[#D6C29A] hover:text-[#D6C29A] transition-colors"
              aria-label="Email 0nprint183@gmail.com"
            >
              <Mail className="h-3 w-3 text-[#D6C29A]" />
              <span>0nprint183@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Col 2: Products */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6C29A]">Signature Products</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link to="/business-card-printing-dubai" className="transition-colors hover:text-[#D6C29A]">
                Business Card Printing Dubai
              </Link>
            </li>
            <li>
              <Link to="/categories/custom-stamps-seals" className="transition-colors hover:text-[#D6C29A]">
                Company Stamps &amp; Seals
              </Link>
            </li>
            <li>
              <Link to="/categories/stickers-printing-dubai" className="transition-colors hover:text-[#D6C29A]">
                Custom Sticker &amp; Label Printing
              </Link>
            </li>
            <li>
              <Link to="/categories/roll-up-banners-dubai" className="transition-colors hover:text-[#D6C29A]">
                Roll-Up Banners Dubai
              </Link>
            </li>
            <li>
              <Link to="/categories/letterheads-printing-dubai" className="transition-colors hover:text-[#D6C29A]">
                Executive Letterheads
              </Link>
            </li>
            <li>
              <Link to="/categories/bottle-printing-dubai" className="transition-colors hover:text-[#D6C29A]">
                Custom Bottle Printing
              </Link>
            </li>
            <li>
              <Link to="/products" className="inline-flex items-center gap-1 text-[#D6C29A] hover:underline font-bold pt-1">
                <span>View Full 110+ Catalog</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Services & Pressroom */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6C29A]">Commercial Services</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link to="/services" className="transition-colors hover:text-[#D6C29A]">
                All Printing Services
              </Link>
            </li>
            <li>
              <Link to="/services#production-process" className="transition-colors hover:text-[#D6C29A]">
                German Heidelberg Offset
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition-colors hover:text-[#D6C29A]">
                HP Indigo Digital Press
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition-colors hover:text-[#D6C29A]">
                24K Hot Foil Stamping
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition-colors hover:text-[#D6C29A]">
                Raised 3D Spot UV
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition-colors hover:text-[#D6C29A]">
                Same-Day Rush Dispatch
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="transition-colors hover:text-[#D6C29A]">
                Selected Portfolio
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Pressroom Address & Hours */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6C29A]">Pressroom &amp; Atelier</p>
          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#A0AEC0]">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-[#D6C29A] mt-0.5" />
              <span>Al Quoz Industrial Area 4, Dubai, United Arab Emirates</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-[#D6C29A] mt-0.5" />
              <div>
                <p className="text-[#F5F3EE]">Monday – Saturday: 9:00 AM – 8:00 PM</p>
                <p className="text-emerald-400 font-semibold mt-0.5">24h Priority Emergency Hotline</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>UAE Delivery Across All 7 Emirates: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, UAQ</span>
            </div>
          </div>
        </div>
      </Container>

      {/* 3. BOTTOM COPYRIGHT & LEGAL BAR */}
      <div className="border-t border-[#1E2C4F] bg-[#080E1B] py-6 pb-20 sm:pb-6 text-xs text-[#52647D]">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} ONPRINT Commercial Printing LLC. All rights reserved. Registered in Dubai, UAE.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6">
            <Link to="/privacy-policy" className="hover:text-[#D6C29A] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#1E2C4F] hidden sm:inline">|</span>
            <Link to="/terms" className="hover:text-[#D6C29A] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-[#1E2C4F] hidden sm:inline">|</span>
            <Link to="/track-order" className="hover:text-[#D6C29A] transition-colors">
              Track Order
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}
