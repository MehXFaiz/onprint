import { Link } from 'react-router-dom'
import Container from './Container'
import { CmykDots } from './PrintMarks'
import Logo from './Logo'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Printing Services' },
  { to: '/products', label: 'Products & Gifts' },
  { to: '/portfolio', label: 'Portfolio & Work' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/faq', label: 'FAQ' },
]

const serviceLinks = [
  { to: '/products?category=corporate-gift-items', label: 'Corporate Gifts Dubai' },
  { to: '/products?category=office-stationery-printing', label: 'Office Stationery Printing' },
  { to: '/services/digital-offset-printing', label: 'Digital Press & Offset' },
  { to: '/services/luxury-packaging-custom-boxes', label: 'Packaging & Custom Boxes' },
  { to: '/services/custom-labels-die-cut-stickers', label: 'Labels & Vinyl Stickers' },
  { to: '/services/large-format-exhibition-signage', label: 'Banners & Rollups' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-background/80">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <Logo variant="light" size="md" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-background/70">
            ONPRINT is Dubai’s premier physical branding & print studio. Delivering flawless precision across corporate gifts, office stationery, packaging, and high-impact print collateral.
          </p>
          <div className="pt-2">
            <CmykDots className="mt-2" />
          </div>
        </div>

        {/* Col 2: Navigation */}
        <nav aria-label="Footer navigation">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Navigation</p>
          <ul className="mt-4 space-y-2.5 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-background hover:underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Services */}
        <nav aria-label="Footer services">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Services &amp; Categories</p>
          <ul className="mt-4 space-y-2.5 text-sm font-medium">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-background hover:underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 4: Contact */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Dubai Headquarters</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-accent shrink-0" />
              <a href="tel:+9714800PRINT" className="transition-colors hover:text-background">
                +971 4 800 PRINT
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-accent shrink-0" />
              <a href="mailto:info@onprint.ae" className="transition-colors hover:text-background">
                info@onprint.ae
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>Al Quoz Industrial Area 3, Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-2.5 text-xs text-background/60 pt-1">
              <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>Mon–Sat: 8:30 AM – 6:30 PM</span>
            </li>
          </ul>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-background/10 bg-primary/95 py-6">
        <Container className="flex flex-col items-center justify-between gap-4 text-xs text-background/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ONPRINT Printing &amp; Creative Solutions. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <Link to="/privacy-policy" className="hover:text-background hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-background hover:underline">
              Terms &amp; Conditions
            </Link>
            <Link to="/get-a-quote" className="text-accent hover:underline font-bold">
              Request Quote
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}

