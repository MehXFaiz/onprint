import { Link } from 'react-router-dom'
import Container from './Container'
import { CmykDots } from './PrintMarks'
import Logo from './Logo'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { trackGetQuoteClick } from '../utils/analytics'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Printing Services' },
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
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#000000] bg-[#000000] text-[#FFFFFF]/80">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <Logo variant="light" size="md" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-[#FFFFFF]/70">
            ONPRINT is Dubai’s premier physical branding &amp; print studio. Delivering flawless precision across office stationery, packaging, and high-impact print collateral.
          </p>
          <div className="pt-2">
            <CmykDots className="mt-2" />
          </div>
        </div>

        {/* Col 2: Navigation */}
        <nav aria-label="Footer navigation">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF7A59]">Navigation</p>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#FF7A59] hover:underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Services */}
        <nav aria-label="Footer services">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF7A59]">Services &amp; Categories</p>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#FF7A59] hover:underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 4: Contact */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF7A59]">Dubai Headquarters</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#FF7A59] shrink-0" />
              <a href="tel:+9714800PRINT" className="transition-colors hover:text-[#FF7A59]">
                +971 4 800 PRINT
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#FF7A59] shrink-0" />
              <a href="mailto:info@onprint.ae" className="transition-colors hover:text-[#FF7A59]">
                info@onprint.ae
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#FF7A59] shrink-0 mt-0.5" />
              <span className="text-[#FFFFFF]/80">Al Quoz Industrial Area 3, Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-[#FFFFFF]/60 pt-1">
              <Clock className="h-3.5 w-3.5 text-[#FF7A59] shrink-0" />
              <span>Mon–Sat: 8:30 AM – 6:30 PM</span>
            </li>
          </ul>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-[#FFFFFF]/10 bg-[#000000] py-6">
        <Container className="flex flex-col items-center justify-between gap-4 text-xs text-[#FFFFFF]/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ONPRINT Printing &amp; Creative Solutions. All rights reserved.</p>
          <div className="flex gap-6 font-semibold">
            <Link to="/privacy-policy" className="hover:text-[#FFFFFF] hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#FFFFFF] hover:underline">
              Terms &amp; Conditions
            </Link>
            <Link to="/track-order" className="hover:text-[#FFFFFF] hover:underline">
              Track Order
            </Link>
            <Link
              to="/get-a-quote"
              className="text-[#FF7A59] hover:underline font-bold"
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

