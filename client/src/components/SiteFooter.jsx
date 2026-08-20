import { Link } from 'react-router-dom'
import Container from './Container'
import { CmykDots } from './PrintMarks'
import Logo from './Logo'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Printing Services' },
  { to: '/products', label: 'Products' },
  { to: '/portfolio', label: 'Portfolio & Work' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/faq', label: 'FAQ' },
]

const serviceLinks = [
  { to: '/products?category=office-stationery-printing', label: 'Office Stationery Printing' },
  { to: '/products?category=other-products', label: 'Other Products & Signage' },
  { to: '/services/digital-offset-printing', label: 'Digital Press & Offset' },
  { to: '/services/luxury-packaging-custom-boxes', label: 'Packaging & Custom Boxes' },
  { to: '/services/custom-labels-die-cut-stickers', label: 'Labels & Vinyl Stickers' },
  { to: '/services/large-format-exhibition-signage', label: 'Banners & Rollups' },
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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A82F19]">Navigation</p>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#A82F19] hover:underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Services */}
        <nav aria-label="Footer services">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A82F19]">Services &amp; Categories</p>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-[#A82F19] hover:underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 4: Contact */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A82F19]">Dubai Headquarters</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#A82F19] shrink-0" />
              <a href="tel:+9714800PRINT" className="transition-colors hover:text-[#A82F19]">
                +971 4 800 PRINT
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#A82F19] shrink-0" />
              <a href="mailto:info@onprint.ae" className="transition-colors hover:text-[#A82F19]">
                info@onprint.ae
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
              <span className="text-[#FFFFFF]/80">Al Quoz Industrial Area 3, Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-[#FFFFFF]/60 pt-1">
              <Clock className="h-3.5 w-3.5 text-[#A82F19] shrink-0" />
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
            <Link to="/get-a-quote" className="text-[#A82F19] hover:underline font-bold">
              Request Quote
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}

