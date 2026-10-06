import { Link } from 'react-router-dom'
import Container from './Container'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { Mail, MapPin, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { trackGetQuoteClick } from '../utils/analytics'

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      {/* 1. PREMIUM FINAL CALL TO ACTION BANNER */}
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 text-white py-14 sm:py-16 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[#A82F19]/20 blur-3xl"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#A82F19] bg-[#A82F19]/15 px-3 py-1 rounded-full border border-[#A82F19]/30">
              <Sparkles className="h-3.5 w-3.5" /> DUBAI COMMERCIAL PRESSROOM
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              Ready to Make Your Brand <span className="text-[#A82F19] italic">Stand Out</span>?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Consult with our prepress specialists today for physical proofs, tailored finishes, and rapid 24h UAE delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/get-a-quote"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#A82F19] hover:bg-[#8F2412] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#A82F19]/30 transition-all hover:-translate-y-0.5"
              onClick={() => trackGetQuoteClick({ source_page: 'footer_cta_banner' })}
            >
              <span>Get a Quote</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xs transition-all hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-current text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 2. MAIN FOOTER GRID */}
      <Container className="py-14 sm:py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* Col 1: Brand Info */}
        <div className="space-y-4 lg:col-span-2 pr-4">
          <Link to="/" className="inline-block">
            <Logo variant="default" size="md" />
          </Link>
          <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
            ONPRINT is Dubai’s premier physical branding &amp; commercial print atelier located in Al Quoz. Delivering industrial precision across bespoke rigid packaging, 600 GSM cotton cards, and exhibition displays.
          </p>

          <div className="pt-2 flex items-center gap-3 text-slate-400">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-[#A82F19] hover:border-[#A82F19]/40 transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-[#A82F19] hover:border-[#A82F19]/40 transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-[#A82F19] hover:border-[#A82F19]/40 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
            </a>
          </div>
        </div>

        {/* Col 2: Products */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Products</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link to="/business-card-printing-dubai" className="transition-colors hover:text-[#A82F19]">
                Business Cards
              </Link>
            </li>
            <li>
              <Link to="/packaging-printing-dubai" className="transition-colors hover:text-[#A82F19]">
                Custom Packaging
              </Link>
            </li>
            <li>
              <Link to="/categories/brochure-printing-dubai" className="transition-colors hover:text-[#A82F19]">
                Brochures &amp; Flyers
              </Link>
            </li>
            <li>
              <Link to="/categories/sticker-printing-dubai" className="transition-colors hover:text-[#A82F19]">
                Stickers &amp; Labels
              </Link>
            </li>
            <li>
              <Link to="/categories/mug-printing-dubai" className="transition-colors hover:text-[#A82F19]">
                Mugs &amp; Drinkware
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition-colors hover:text-[#A82F19] font-bold text-[#A82F19]">
                View All Products →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Services & Company */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Company</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            <li>
              <Link to="/about" className="transition-colors hover:text-[#A82F19]">
                About ONPRINT
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition-colors hover:text-[#A82F19]">
                Print Services
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="transition-colors hover:text-[#A82F19]">
                Client Portfolio
              </Link>
            </li>
            <li>
              <Link to="/blog" className="transition-colors hover:text-[#A82F19]">
                Printing &amp; Gifting Blog
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="transition-colors hover:text-[#A82F19]">
                Track Existing Order
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-[#A82F19]">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Dubai Atelier & Contact */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Dubai Atelier</p>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
              <span className="text-slate-600 leading-snug">
                Al Quoz Production Facility, Dubai, UAE
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#A82F19] shrink-0" />
              <a href="mailto:0nprint183@gmail.com" className="transition-colors hover:text-slate-900">
                0nprint183@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-emerald-700 shrink-0">
                <WhatsAppIcon className="h-3 w-3 fill-current" />
              </div>
              <a
                href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-800 transition-colors hover:text-emerald-600"
              >
                +44 7344 546056
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-slate-500 pt-1">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Mon–Sat: 8:30 AM – 6:30 PM</span>
            </li>
          </ul>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>100% Quality Insured Guarantee</span>
            </div>
          </div>
        </div>
      </Container>

      {/* 3. COPYRIGHT & LEGAL BAR */}
      <div className="border-t border-slate-200 bg-slate-50 py-6 text-xs text-slate-500">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ONPRINT Commercial Printing LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-[#A82F19] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#A82F19] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="hover:text-[#A82F19] transition-colors">
              Contact Us
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}
