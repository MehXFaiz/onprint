import { Link, NavLink, Outlet } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200">
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
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-ink-900 text-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm">
          <p className="font-semibold text-white">ONPRINT</p>
          <p className="mt-2 text-gray-400">
            Professional printing solutions for businesses, brands and individuals.
          </p>
          <p className="mt-8 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ONPRINT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
