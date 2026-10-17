import { Link } from 'react-router-dom'
import Container from './Container'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { Mail, MapPin, Clock, ArrowRight, ShieldCheck, Sparkles, Phone } from 'lucide-react'
import { trackGetQuoteClick, trackWhatsAppClick } from '../utils/analytics'
import { getServiceWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../utils/whatsapp'

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#E4DCD0] bg-[#FAF7F2] text-[#52483F]">
      {/* 1. SIGNATURE ESPRESSO INK & BRUSHED BRASS CALL TO ACTION BANNER */}
      <div className="border-b border-[#C89D54]/25 bg-gradient-to-br from-[#181411] via-[#221C17] to-[#181411] text-[#FAF7F2] py-16 sm:py-20 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#B83A22]/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#C89D54]/15 blur-3xl"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#DFB973] bg-[#C89D54]/15 px-3.5 py-1 rounded-full border border-[#C89D54]/35">
              <Sparkles className="h-3.5 w-3.5" /> DUBAI PRINT ATELIER • AL QUOZ
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Ready to Give Your Brand <span className="foil-text-gradient italic">Unmistakable Weight</span>?
            </h2>
            <p className="text-sm text-[#CFC4B4] leading-relaxed">
              Consult with our prepress masters for physical paper swatches, 24K foil stamping, and rapid 24-hour UAE courier dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/get-a-quote"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#B83A22] to-[#9E2E19] hover:from-[#C94329] hover:to-[#B83A22] border border-[#DFB973]/30 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#B83A22]/30 transition-all hover:-translate-y-0.5"
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
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] border border-white/20 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-current text-white" />
              <span>WhatsApp Concierge ({FORMATTED_PHONE})</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 2. MAIN WARM ALABASTER EDITORIAL FOOTER GRID */}
      <Container className="py-14 sm:py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* Col 1: Brand Info */}
        <div className="space-y-4 lg:col-span-2 pr-4">
          <Link to="/" className="inline-block">
            <Logo variant="default" size="md" />
          </Link>
          <p className="text-sm leading-relaxed text-[#52483F] max-w-sm">
            ONPRINT is Dubai’s bespoke physical branding &amp; commercial print atelier in Al Quoz. Crafting 600–700 GSM cotton business cards, hot-foil corporate stationery, official seals, and architectural signage.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-[#52483F]">
            <a
              href={getServiceWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({ source_page: 'footer_contact_pills', service: 'general', button_location: 'footer_social' })
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50/90 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-[#25D366] hover:text-white transition-colors"
              aria-label="WhatsApp Direct Chat"
            >
              <WhatsAppIcon className="h-4 w-4 fill-current" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={`tel:+${RAW_WHATSAPP_NUMBER}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4DCD0] bg-white px-3.5 py-2 text-xs font-bold text-[#181411] hover:border-[#C89D54] hover:text-[#B83A22] transition-colors shadow-2xs"
              aria-label={`Call ${FORMATTED_PHONE}`}
            >
              <Phone className="h-3.5 w-3.5 text-[#B83A22]" />
              <span>{FORMATTED_PHONE}</span>
            </a>
            <a
              href="mailto:0nprint183@gmail.com"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4DCD0] bg-white px-3.5 py-2 text-xs font-bold text-[#181411] hover:border-[#C89D54] hover:text-[#B83A22] transition-colors shadow-2xs"
              aria-label="Email 0nprint183@gmail.com"
            >
              <Mail className="h-3.5 w-3.5 text-[#C89D54]" />
              <span>Email Studio</span>
            </a>
          </div>
        </div>

        {/* Col 2: Products */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#181411]">Signature Editions</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link to="/business-card-printing-dubai" className="transition-colors hover:text-[#B83A22]">
                Business Card Printing
              </Link>
            </li>
            <li>
              <Link to="/services/rollup-banners" className="transition-colors hover:text-[#B83A22]">
                Roll-Up Banner Printing
              </Link>
            </li>
            <li>
              <Link to="/services/stickers-labels-printing" className="transition-colors hover:text-[#B83A22]">
                Custom Sticker Printing
              </Link>
            </li>
            <li>
              <Link to="/services/stamps-printing-dubai" className="transition-colors hover:text-[#B83A22]">
                Custom Stamp Printing
              </Link>
            </li>
            <li>
              <Link to="/categories/letterheads-printing-dubai" className="transition-colors hover:text-[#B83A22]">
                Letterheads &amp; Envelopes
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition-colors hover:text-[#181411] font-bold text-[#B83A22]">
                Explore Full Catalog →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Services & Company */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#181411]">The Atelier</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link to="/about" className="transition-colors hover:text-[#B83A22]">
                About ONPRINT
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition-colors hover:text-[#B83A22]">
                Print Disciplines
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="transition-colors hover:text-[#B83A22]">
                Client Commissions
              </Link>
            </li>
            <li>
              <Link to="/blog" className="transition-colors hover:text-[#B83A22]">
                Paper &amp; Craft Journal
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="transition-colors hover:text-[#B83A22]">
                Track Existing Order
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-[#B83A22]">
                Prepress &amp; Delivery FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Dubai Atelier & Contact */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#181411]">Dubai Pressroom</p>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#B83A22] shrink-0 mt-0.5" />
              <span className="text-[#52483F] leading-snug">
                Al Quoz Industrial 3 Pressroom, Dubai, UAE
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#C89D54] shrink-0" />
              <a href="mailto:0nprint183@gmail.com" className="transition-colors hover:text-[#181411]">
                0nprint183@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-emerald-700 shrink-0">
                <WhatsAppIcon className="h-3 w-3 fill-current" />
              </div>
              <a
                href={getServiceWhatsAppUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({ source_page: 'footer_contact_list', service: 'general', button_location: 'footer_contact' })
                }
                className="font-bold text-emerald-800 transition-colors hover:text-emerald-600"
              >
                {FORMATTED_PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-[#7A6F63] pt-1">
              <Clock className="h-3.5 w-3.5 text-[#C89D54] shrink-0" />
              <span>Mon–Sat: 8:30 AM – 6:30 PM GST</span>
            </li>
          </ul>

          <div className="mt-4 pt-3 border-t border-[#E4DCD0]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#181411] bg-[#F3EDE2] border border-[#C89D54]/40 rounded-xl p-2.5">
              <ShieldCheck className="h-4 w-4 text-[#B83A22] shrink-0" />
              <span>100% Pre-Flight &amp; Print Insured</span>
            </div>
          </div>
        </div>
      </Container>

      {/* 3. COPYRIGHT & LEGAL BAR */}
      <div className="border-t border-[#E4DCD0] bg-[#F3EDE2]/70 py-6 text-xs text-[#7A6F63]">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ONPRINT Commercial Printing LLC — Dubai, UAE. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy-policy" className="hover:text-[#B83A22] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#B83A22] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="hover:text-[#B83A22] transition-colors">
              Contact Atelier
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}

