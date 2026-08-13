import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from './Container'
import Button from './Button'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-border bg-background/90 backdrop-blur-md' : 'border-transparent bg-background'
      }`}
    >
      <Container className={`flex items-center justify-between transition-[padding] duration-300 ${scrolled ? 'py-4' : 'py-6'}`}>
        <Link
          to="/"
          className="flex items-center font-display text-xl font-extrabold tracking-tight text-primary"
          onClick={() => setMenuOpen(false)}
        >
          ON<span className="text-accent">PRINT</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative py-1 text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
                  isActive ? 'text-primary after:w-full' : 'text-secondary after:w-0 hover:text-primary hover:after:w-full'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link to="/contact" className="text-sm font-medium text-secondary transition-colors hover:text-primary">
            Contact Us
          </Link>
          <Button to="/get-a-quote" variant="accent" icon={false} className="!px-5 !py-2.5">
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex items-center justify-center p-2 text-primary lg:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
            aria-label="Mobile"
          >
            <Container className="flex flex-col gap-1 py-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `px-1 py-3 text-lg font-medium ${isActive ? 'text-accent' : 'text-primary'}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-6">
                <Link to="/contact" className="py-1 text-center text-sm font-medium text-secondary">
                  Contact Us
                </Link>
                <Button to="/get-a-quote" variant="accent" icon={false} className="w-full justify-center">
                  Get a Quote
                </Button>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
