import { Link } from 'react-router-dom'
import Container from './Container'
import { CmykDots } from './PrintMarks'
import Logo from './Logo'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const serviceLinks = [
  { to: '/services/digital-printing', label: 'Digital Printing' },
  { to: '/services/packaging-service', label: 'Packaging' },
  { to: '/services/labels-stickers', label: 'Labels & Stickers' },
  { to: '/services/stationery-service', label: 'Stationery' },
  { to: '/services/promotional-materials-service', label: 'Promotional Printing' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-background/70">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/">
            <Logo variant="light" size="md" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Professional printing and packaging solutions — from concept to finished product.
          </p>
          <CmykDots className="mt-6" />
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50">Navigation</p>
          <ul className="mt-4 space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-background">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer services">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50">Services</p>
          <ul className="mt-4 space-y-3 text-sm">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-background">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href="tel:+15550101234" className="transition-colors hover:text-background">
                +1 (555) 010-1234
              </a>
            </li>
            <li>
              <a href="mailto:hello@onprint.com" className="transition-colors hover:text-background">
                hello@onprint.com
              </a>
            </li>
            <li>221 Print District Ave, Suite 4</li>
            <li className="text-background/50">Mon–Fri, 9:00–18:00</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-background/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-background/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ONPRINT. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-background">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-background">
              Terms &amp; Conditions
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}
