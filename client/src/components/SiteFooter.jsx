import { Link } from 'react-router-dom'
import Container from './Container'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { Mail, MapPin, Clock, ArrowRight, ShieldCheck, Sparkles, Phone } from 'lucide-react'
import { trackGetQuoteClick, trackWhatsAppClick } from '../utils/analytics'
import { getServiceWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../utils/whatsapp'

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-400">
      {/* 1. HIGH-CONTRAST CALL TO ACTION BANNER */}
      <div className="border-b border-zinc-800 bg-zinc-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#FF5500]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5500] bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Sparkles className="h-3 w-3 text-[#FF5500]" /> DUBAI COMMERCIAL PRESSROOM • AL QUOZ
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Ready to Give Your Brand <span className="text-[#FF5500]">Unmistakable Presence</span>?
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Consult with our prepress engineers for physical paper swatches, 24K hot foil stamping, and rapid same-day UAE courier dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/get-a-quote"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF5500] hover:bg-white hover:text-zinc-950 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all"
              onClick={() => trackGetQuoteClick({ source_page: 'footer_cta_banner' })}
            >
              <span>Request Custom Quote</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={getServiceWhatsAppUrl('general')}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackWhatsAppClick({ source_page: 'footer_cta_banner', service: 'general', button_location: 'footer_banner' })
              }
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-[#25D366] hover:text-white border border-zinc-800 hover:border-[#25D366] px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer"
            >
              <WhatsAppIcon className="h-4 w-4 fill-current text-white" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 2. MAIN MODERNIST FOOTER GRID */}
      <Container className="py-14 sm:py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 text-zinc-400">
        {/* Col 1: Brand Info */}
        <div className="space-y-4 lg:col-span-2 pr-4">
          <Link to="/" className="inline-block">
            <Logo variant="light" size="md" />
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 max-w-sm">
            ONPRINT is Dubai’s premier commercial printing house in Al Quoz. Delivering precision 600–700 GSM cotton business cards, metallic foil packaging, corporate stationery, official seals, and high-impact signage across the UAE.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-zinc-300">
            <a
              href={getServiceWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({ source_page: 'footer_contact_pills', service: 'general', button_location: 'footer_social' })
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-[#25D366] hover:text-white transition-colors"
              aria-label="WhatsApp Direct Chat"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={`tel:+${RAW_WHATSAPP_NUMBER}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:border-zinc-700 hover:text-[#FF5500] transition-colors"
              aria-label={`Call ${FORMATTED_PHONE}`}
            >
              <Phone className="h-3 w-3 text-[#FF5500]" />
              <span>{FORMATTED_PHONE}</span>
            </a>
            <a
              href="mailto:0nprint183@gmail.com"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:border-zinc-700 hover:text-[#FF5500] transition-colors"
              aria-label="Email 0nprint183@gmail.com"
            >
              <Mail className="h-3 w-3 text-zinc-400" />
              <span>0nprint183@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Col 2: Products */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Signature Products</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link to="/business-card-printing-dubai" className="transition-colors hover:text-white">
                Business Card Printing Dubai
              </Link>
            </li>
            <li>
              <Link to="/categories/custom-stamps-seals" className="transition-colors hover:text-white">
                Company Stamps &amp; Seals
              </Link>
            </li>
            <li>
              <Link to="/categories/stickers-printing-dubai" className="transition-colors hover:text-white">
                Stickers &amp; Roll Labels
              </Link>
            </li>
            <li>
              <Link to="/categories/roll-up-banners-dubai" className="transition-colors hover:text-white">
                Roll-Up Banner Displays
              </Link>
            </li>
            <li>
              <Link to="/categories/letterheads-printing-dubai" className="transition-colors hover:text-white">
                Corporate Letterheads
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition-colors font-bold text-[#FF5500] hover:text-white">
                Browse Full Catalog →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Services & Company */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Pressroom</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link to="/about" className="transition-colors hover:text-white">
                About ONPRINT
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition-colors hover:text-white">
                Printing Disciplines
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="transition-colors hover:text-white">
                Client Portfolio
              </Link>
            </li>
            <li>
              <Link to="/blog" className="transition-colors hover:text-white">
                Printing Journal &amp; Guides
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="transition-colors hover:text-white">
                Track Existing Order
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-white">
                Prepress &amp; Delivery FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Dubai Atelier & Contact */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Dubai Facility</p>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#FF5500] shrink-0 mt-0.5" />
              <span className="text-zinc-300 leading-snug">
                Al Quoz Industrial 4 Pressroom, Dubai, UAE
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
              <a href="mailto:0nprint183@gmail.com" className="transition-colors hover:text-white">
                0nprint183@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                <WhatsAppIcon className="h-3 w-3 fill-current" />
              </div>
              <a
                href={getServiceWhatsAppUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({ source_page: 'footer_contact_list', service: 'general', button_location: 'footer_contact' })
                }
                className="font-bold text-emerald-400 transition-colors hover:text-emerald-300"
              >
                {FORMATTED_PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-zinc-500 pt-1">
              <Clock className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span>Mon–Sat: 8:30 AM – 6:30 PM GST</span>
            </li>
          </ul>

          <div className="mt-4 pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-white bg-zinc-900 border border-zinc-800 rounded-xl p-2.5">
              <ShieldCheck className="h-4 w-4 text-[#FF5500] shrink-0" />
              <span>100% Pre-Flight Insured Quality</span>
            </div>
          </div>
        </div>
      </Container>

      {/* 3. COPYRIGHT & LEGAL BAR */}
      <div className="border-t border-zinc-900 bg-black py-6 text-xs text-zinc-500">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ONPRINT Commercial Printing LLC — Dubai, UAE. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact Pressroom
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}
