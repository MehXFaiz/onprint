import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Contact' },
]

const footerLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/faq', label: 'FAQ' },
  { to: '/get-a-quote', label: 'Get a Quote' },
]

const legalLinks = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
]

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
      )}
    </svg>
  )
}

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight text-ink-900">
            ONPRINT
          </Link>

          <nav className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-ink-700 hover:text-brand-600'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden gap-3 md:flex">
            <Link
              to="/contact"
              className="rounded-md px-4 py-2 text-sm font-medium text-ink-700 hover:text-brand-600"
            >
              Contact Us
            </Link>
            <Link
              to="/get-a-quote"
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Get a Quote
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="-mr-2 flex items-center justify-center rounded-md p-2 text-ink-900 md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-gray-200 bg-white px-6 pb-6 pt-2 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2.5 text-base font-medium ${
                      isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/contact"
                className="rounded-md border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-ink-700"
              >
                Contact Us
              </Link>
              <Link
                to="/get-a-quote"
                className="rounded-md bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white"
              >
                Get a Quote
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-ink-900 text-gray-300">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">ONPRINT</p>
            <p className="mt-3 text-sm text-gray-400">
              Professional printing solutions for businesses, brands and individuals.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-3 space-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li>hello@onprint.com</li>
              <li>+1 (555) 010-1234</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <p className="mx-auto max-w-7xl px-6 py-6 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ONPRINT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
