import { Link } from 'react-router-dom'
import Container from './Container'
import { CmykDots } from './PrintMarks'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { Mail, MapPin, Clock, PhoneCall, Sparkles, Send, ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react'
import { trackGetQuoteClick } from '../utils/analytics'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Printing Services' },
  { to: '/categories', label: 'All Categories' },
  { to: '/products', label: 'Products' },
  { to: '/track-order', label: 'Track Your Order' },
  { to: '/portfolio', label: 'Portfolio & Work' },
  { to: '/blog', label: 'Printing & Gifting Blog' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/faq', label: 'FAQ' },
]

const serviceLinks = [
  { to: '/services/brochures-printing', label: 'Brochures Printing Service' },
  { to: '/services/business-cards-printing', label: 'Business Cards Printing' },
  { to: '/services/flyers-printing-in-dubai', label: 'Flyers Printing Dubai' },
  { to: '/services/id-card-printing-dubai', label: 'ID Card Printing' },
  { to: '/services/lanyard-printing-dubai', label: 'Lanyard Printing' },
  { to: '/services/letterheads-printing-dubai', label: 'Letterheads Printing' },
  { to: '/services/name-badges-printing-dubai', label: 'Name Badges Printing' },
  { to: '/categories/mug-printing-dubai', label: 'Mug Printing Dubai' },
  { to: '/categories/bottle-printing-dubai', label: 'Water Bottle Printing' },
]

const commercialHubs = [
  { to: '/printing-services-dubai', label: 'Printing Services Dubai' },
  { to: '/business-card-printing-dubai', label: 'Business Card Printing Dubai' },
  { to: '/packaging-printing-dubai', label: 'Custom Packaging & Boxes' },
  { to: '/custom-packaging-dubai', label: 'Luxury Rigid Boxes Dubai' },
  { to: '/large-format-printing-dubai', label: 'Large Format & Rollup Banners' },
  { to: '/signage-printing-dubai', label: 'Signage & 3D Letters Dubai' },
  { to: '/sticker-printing-dubai', label: 'Custom Sticker Printing Dubai' },
  { to: '/label-printing-dubai', label: 'Product & Roll Label Printing' },
]

const businessCardLinks = [
  { to: '/business-card-printing-dubai', label: 'Business Card Printing Dubai' },
  { to: '/business-card-printing-uae', label: 'Business Card Printing UAE' },
  { to: '/visiting-card-printing-dubai', label: 'Visiting Card Printing Dubai' },
  { to: '/premium-business-cards', label: 'Premium Business Cards' },
  { to: '/luxury-business-cards', label: 'Luxury Business Cards' },
  { to: '/foil-business-cards', label: 'Foil Stamped Business Cards' },
  { to: '/spot-uv-business-cards', label: 'Raised 3D Spot UV Cards' },
  { to: '/velvet-business-cards', label: 'Velvet Soft-Touch Cards' },
  { to: '/corporate-business-cards', label: 'Corporate Batch Business Cards' },
  { to: '/same-day-business-card-printing', label: 'Same Day Business Cards' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      {/* 1. Newsletter & Quick Contact Strip */}
      <div className="border-b border-slate-200/80 bg-white">
        <Container className="py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
                <Sparkles className="h-3.5 w-3.5" /> Direct Pressroom Assistance
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                Need urgent custom printing or physical proofs in Dubai?
              </h3>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:shadow cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                <span>WhatsApp: +44 7344 546056</span>
              </a>
              <Link
                to="/get-a-quote"
                className="inline-flex items-center gap-2 rounded-xl bg-[#A82F19] hover:bg-[#8e2614] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm shadow-[#A82F19]/20 transition-all hover:shadow cursor-pointer"
                onClick={() => trackGetQuoteClick({ source_page: 'footer_strip' })}
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Main Footer Grid */}
      <Container className="grid grid-cols-1 gap-10 py-12 sm:py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.85fr_1fr_1.15fr_1.25fr]">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <Logo variant="dark" size="md" />
          </Link>
          <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-slate-500">
            ONPRINT is Dubai’s premier physical branding &amp; commercial print atelier located in Al Quoz. Delivering industrial precision across bespoke rigid packaging, 600 GSM cotton cards, and exhibition displays.
          </p>
          <div className="pt-1">
            <CmykDots className="mt-2" />
          </div>
        </div>

        {/* Col 2: Navigation */}
        <nav aria-label="Footer navigation">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Navigation</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#A82F19]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Services & Categories */}
        <nav aria-label="Footer services">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Services</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#A82F19]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 4: Commercial Print Hubs */}
        <nav aria-label="Commercial Print Hubs">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Print Hubs</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-medium">
            {commercialHubs.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#A82F19]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 5: Dubai Headquarters */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Dubai Atelier</p>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm">
            <li className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 shrink-0">
                <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
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
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#A82F19] shrink-0" />
              <a href="mailto:0nprint183@gmail.com" className="transition-colors hover:text-slate-900">
                0nprint183@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
              <span className="text-slate-600 leading-snug">
                Al Quoz Production Facility, Dubai, UAE
              </span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-slate-500 pt-1">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Mon–Sat: 8:30 AM – 6:30 PM</span>
            </li>
          </ul>
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>100% Quality Insured Guarantee</span>
            </div>
          </div>
        </div>
      </Container>

      {/* 3. Business Cards Dubai & UAE Specialized Production */}
      <div className="border-t border-slate-200/90 bg-white py-5">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900">
              Business Cards Dubai &amp; UAE Specialized Pressroom
            </p>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
              Al Quoz Pressroom • 350–700 GSM Cotton &amp; Specialty Stocks
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {businessCardLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-[#A82F19]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>

      {/* 4. Bottom Bar */}
      <div className="border-t border-slate-200 bg-slate-100 py-6">
        <Container className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 text-center sm:flex-row sm:text-left">
          <p>&copy; {new Date().getFullYear()} ONPRINT Haute Imprimerie. Al Quoz, Dubai, UAE. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-semibold sm:justify-end text-slate-600">
            <Link to="/privacy-policy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-900 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/track-order" className="hover:text-slate-900 transition-colors">
              Track Order
            </Link>
            <Link
              to="/get-a-quote"
              className="text-[#A82F19] hover:underline font-bold"
              onClick={() => trackGetQuoteClick({ source_page: 'footer' })}
            >
              Request Quote
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}
