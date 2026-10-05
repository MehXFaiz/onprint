import { Link } from 'react-router-dom'
import Container from './Container'
import { CmykDots } from './PrintMarks'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { Mail, MapPin, Clock, PhoneCall, Sparkles, Send, ShieldCheck, Zap, Award } from 'lucide-react'
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
  { to: '/services/business-cards-printing', label: 'Business Cards Printing Service' },
  { to: '/services/flyers-printing-in-dubai', label: 'Flyers Printing Dubai' },
  { to: '/services/id-card-printing-dubai', label: 'ID Card Printing Service' },
  { to: '/services/lanyard-printing-dubai', label: 'Lanyard Printing Service' },
  { to: '/services/letterheads-printing-dubai', label: 'Letterheads Printing Service' },
  { to: '/services/name-badges-printing-dubai', label: 'Name Badges Printing Service' },
  { to: '/categories/mug-printing-dubai', label: 'Mug Printing Dubai' },
  { to: '/categories/bottle-printing-dubai', label: 'Water Bottle Printing Dubai' },
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
  { to: '/brochure-printing-dubai', label: 'Brochure & Catalogue Printing' },
  { to: '/flyer-printing-dubai', label: 'Corporate Flyer Printing' },
  { to: '/promotional-printing-dubai', label: 'Promotional Corporate Gifts' },
  { to: '/corporate-printing-dubai', label: 'Corporate Stationery & Eco Print' },
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
  { to: '/soft-touch-business-cards', label: 'Soft Touch Business Cards' },
  { to: '/embossed-business-cards', label: 'Embossed & Debossed Cards' },
  { to: '/corporate-business-cards', label: 'Corporate Batch Business Cards' },
  { to: '/business-card-design', label: 'Business Card Design Dubai' },
  { to: '/same-day-business-card-printing', label: 'Same Day Business Cards' },
  { to: '/business-card-printing-abu-dhabi', label: 'Business Cards Abu Dhabi' },
  { to: '/business-card-printing-sharjah', label: 'Business Cards Sharjah' },
  { to: '/business-card-printing-ajman', label: 'Business Cards Ajman' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080B] text-neutral-300">
      {/* 1. Main Footer Grid */}
      <Container className="grid grid-cols-1 gap-10 py-12 sm:py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.85fr_1fr_1.15fr_1.25fr]">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <Logo variant="light" size="md" />
          </Link>
          <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-neutral-400">
            ONPRINT is Dubai’s premier physical branding &amp; commercial print atelier located in Al Quoz, Dubai. Delivering industrial precision across bespoke rigid packaging, 600 GSM cotton cards, and large-format exhibition displays.
          </p>
          <div className="pt-1">
            <CmykDots className="mt-2" />
          </div>
        </div>

        {/* Col 2: Navigation */}
        <nav aria-label="Footer navigation">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Navigation</p>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#D4AF37]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Services & Categories */}
        <nav aria-label="Footer services">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Services</p>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm font-medium">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#D4AF37]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 4: Commercial Print Hubs */}
        <nav aria-label="Commercial Print Hubs">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Print Hubs</p>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm font-medium">
            {commercialHubs.slice(0, 8).map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#D4AF37]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 5: Dubai Headquarters */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Dubai Atelier</p>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#D4AF37] shrink-0" />
              <a href="mailto:0nprint183@gmail.com" className="transition-colors hover:text-white">
                0nprint183@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span className="text-neutral-300 leading-snug">
                Al Quoz Production Facility, Dubai, UAE
              </span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-neutral-400 pt-1">
              <Clock className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
              <span>Mon–Sat: 8:30 AM – 6:30 PM</span>
            </li>
          </ul>
        </div>
      </Container>

      {/* 2. Business Cards Dubai & UAE Specialized Production */}
      <div className="border-t border-white/[0.06] bg-[#050608] py-5">
        <Container>
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Business Cards Dubai &amp; UAE Specialized Pressroom
            </p>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
              Al Quoz Pressroom • 350–700 GSM Stocks
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-400">
            {businessCardLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-[#D4AF37]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-white/[0.06] bg-[#040406] py-6">
        <Container className="flex flex-col items-center justify-between gap-4 text-xs text-neutral-400 text-center sm:flex-row sm:text-left">
          <p>&copy; {new Date().getFullYear()} ONPRINT Haute Imprimerie. Al Quoz, Dubai, UAE. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-semibold sm:justify-end">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/track-order" className="hover:text-white transition-colors">
              Track Order
            </Link>
            <Link
              to="/get-a-quote"
              className="text-[#D4AF37] hover:underline font-bold"
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
