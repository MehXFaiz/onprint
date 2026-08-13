import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from './Container'
import Button from './Button'
import Logo from './Logo'

// Custom Clean Social SVG Icons
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

function PinterestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.854 0 1.265.641 1.265 1.41 0 .859-.546 2.144-.829 3.335-.236.997.5 1.81 1.484 1.81 1.782 0 3.151-1.879 3.151-4.59 0-2.399-1.724-4.077-4.187-4.077-2.853 0-4.527 2.14-4.527 4.35 0 .862.332 1.787.747 2.29.082.1.094.188.069.29-.076.315-.245.998-.278 1.139-.044.183-.146.222-.338.134-1.264-.588-2.054-2.435-2.054-3.918 0-3.187 2.316-6.115 6.678-6.115 3.506 0 6.231 2.498 6.231 5.839 0 3.484-2.197 6.287-5.246 6.287-1.024 0-1.987-.532-2.317-1.161l-.63 2.4c-.228.877-.845 1.977-1.258 2.645C9.728 21.847 10.84 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  )
}

// Navigation structure matching exact user screenshot content
const corporateGiftsItems = [
  { label: 'Bags Printing Dubai', to: '/products?category=Corporate+Gifts&q=Bags' },
  { label: 'Cap Printing Dubai', to: '/products?category=Corporate+Gifts&q=Cap' },
  { label: 'Custom Water Bottles Printing in Dubai', to: '/products?category=Corporate+Gifts&q=Water+Bottles' },
  { label: 'Mugs Printing Dubai', to: '/products?category=Corporate+Gifts&q=Mugs' },
  { label: 'Keychains Printing', to: '/products?category=Corporate+Gifts&q=Keychains' },
  { label: 'Notebooks Printing', to: '/products?category=Corporate+Gifts&q=Notebooks' },
  { label: 'Pens Printing', to: '/products?category=Corporate+Gifts&q=Pens' },
  { label: 'T-shirt Printing in Dubai', to: '/products?category=Corporate+Gifts&q=T-shirt' },
]

const officeStationeryItems = [
  { label: 'Brochures Printing', to: '/products?category=Office+Stationery&q=Brochures' },
  { label: 'Business Cards Printing', to: '/products?category=Office+Stationery&q=Business+Cards' },
  { label: 'Flyers Printing In Dubai', to: '/products?category=Office+Stationery&q=Flyers' },
  { label: 'Id Card Printing Dubai', to: '/products?category=Office+Stationery&q=ID+Card' },
  { label: 'Lanyard Printing Dubai', to: '/products?category=Office+Stationery&q=Lanyard' },
  { label: 'Letterheads Printing Dubai', to: '/products?category=Office+Stationery&q=Letterheads' },
  { label: 'Name Badges Printing Dubai', to: '/products?category=Office+Stationery&q=Name+Badges' },
]

const otherProductsItems = [
  { label: 'Flags Printing In Dubai', to: '/products?category=Other+Products&q=Flags' },
  { label: 'Name Plates Printing In Dubai', to: '/products?category=Other+Products&q=Name+Plates' },
  { label: 'Roll up Printing In Dubai', to: '/products?category=Other+Products&q=Roll+up' },
  { label: 'Stickers Printing In Dubai', to: '/products?category=Other+Products&q=Stickers' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState({})

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
    setActiveDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const toggleMobileCategory = (key) => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-border bg-background/90 backdrop-blur-md' : 'border-transparent bg-background'
      }`}
    >
      <Container
        className={`flex items-center justify-between transition-[padding] duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        {/* Left Section: Social Links + Brand Logo */}
        <div className="flex items-center gap-6">
          {/* Social Links (Matching User's Screenshot: Facebook, Instagram, Pinterest) */}
          <div className="hidden sm:flex items-center gap-3 text-secondary border-r border-border pr-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 transition-colors hover:text-accent"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 transition-colors hover:text-accent"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 transition-colors hover:text-accent"
              aria-label="Pinterest"
            >
              <PinterestIcon className="h-4 w-4" />
            </a>
          </div>

          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo size="md" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Primary">
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative py-1 text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
                isActive ? 'text-primary after:w-full' : 'text-secondary after:w-0 hover:text-primary hover:after:w-full'
              }`
            }
          >
            Home
          </NavLink>

          {/* 2. About us */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative py-1 text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
                isActive ? 'text-primary after:w-full' : 'text-secondary after:w-0 hover:text-primary hover:after:w-full'
              }`
            }
          >
            About us
          </NavLink>

          {/* 3. Best Selling Items */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `relative py-1 text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
                isActive ? 'text-primary after:w-full' : 'text-secondary after:w-0 hover:text-primary hover:after:w-full'
              }`
            }
          >
            Best Selling Items
          </NavLink>

          {/* 4. Corporate Gifts Dubai Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('gifts')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'gifts' ? null : 'gifts')}
              className="flex items-center gap-1 py-1 text-sm font-medium tracking-wide text-secondary transition-colors hover:text-primary"
            >
              <span>Corporate Gifts Dubai</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'gifts' ? 'rotate-180 text-accent' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'gifts' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full mt-2 w-72 rounded-lg border border-border bg-background p-2 shadow-xl backdrop-blur-md"
                >
                  <div className="flex flex-col divide-y divide-border/50">
                    {corporateGiftsItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="px-3 py-2.5 text-xs sm:text-sm font-medium text-secondary transition-colors hover:bg-accent/10 hover:text-accent rounded-md"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Office Stationery Printing Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('stationery')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'stationery' ? null : 'stationery')}
              className="flex items-center gap-1 py-1 text-sm font-medium tracking-wide text-secondary transition-colors hover:text-primary"
            >
              <span>Office Stationery Printing</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'stationery' ? 'rotate-180 text-accent' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'stationery' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full mt-2 w-72 rounded-lg border border-border bg-background p-2 shadow-xl backdrop-blur-md"
                >
                  <div className="flex flex-col divide-y divide-border/50">
                    {officeStationeryItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="px-3 py-2.5 text-xs sm:text-sm font-medium text-secondary transition-colors hover:bg-accent/10 hover:text-accent rounded-md"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. Other Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('other')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'other' ? null : 'other')}
              className="flex items-center gap-1 py-1 text-sm font-medium tracking-wide text-secondary transition-colors hover:text-primary"
            >
              <span>Other Products</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'other' ? 'rotate-180 text-accent' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'other' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full mt-2 w-72 rounded-lg border border-border bg-background p-2 shadow-xl backdrop-blur-md"
                >
                  <div className="flex flex-col divide-y divide-border/50">
                    {otherProductsItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="px-3 py-2.5 text-xs sm:text-sm font-medium text-secondary transition-colors hover:bg-accent/10 hover:text-accent rounded-md"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 7. Contact us */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `relative py-1 text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
                isActive ? 'text-primary after:w-full' : 'text-secondary after:w-0 hover:text-primary hover:after:w-full'
              }`
            }
          >
            Contact us
          </NavLink>

          {/* 8. Blog */}
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `relative py-1 text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
                isActive ? 'text-primary after:w-full' : 'text-secondary after:w-0 hover:text-primary hover:after:w-full'
              }`
            }
          >
            Blog
          </NavLink>
        </nav>

        {/* Right CTA Button */}
        <div className="hidden items-center gap-4 xl:flex">
          <Button to="/get-a-quote" variant="accent" icon={false} className="!px-5 !py-2.5">
            Get a Quote
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
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

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
            aria-label="Mobile Navigation"
          >
            <Container className="flex flex-col gap-2 py-6">
              {/* Social icons in mobile drawer */}
              <div className="flex items-center gap-4 pb-4 border-b border-border text-secondary">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon className="h-5 w-5 hover:text-accent" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon className="h-5 w-5 hover:text-accent" />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                  <PinterestIcon className="h-5 w-5 hover:text-accent" />
                </a>
              </div>

              {/* Direct links */}
              <NavLink to="/" end className="py-2.5 text-base font-medium text-primary">
                Home
              </NavLink>
              <NavLink to="/about" className="py-2.5 text-base font-medium text-primary">
                About us
              </NavLink>
              <NavLink to="/products" className="py-2.5 text-base font-medium text-primary">
                Best Selling Items
              </NavLink>

              {/* Accordion 1: Corporate Gifts Dubai */}
              <div className="border-b border-border/60 py-2">
                <button
                  type="button"
                  onClick={() => toggleMobileCategory('gifts')}
                  className="flex w-full items-center justify-between py-1 text-base font-medium text-primary"
                >
                  <span>Corporate Gifts Dubai</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded.gifts ? 'rotate-180 text-accent' : ''}`} />
                </button>
                {mobileExpanded.gifts && (
                  <div className="mt-2 flex flex-col gap-2 pl-3 border-l-2 border-accent/40 py-2">
                    {corporateGiftsItems.map((item) => (
                      <Link key={item.label} to={item.to} className="py-1 text-sm text-secondary hover:text-accent">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 2: Office Stationery Printing */}
              <div className="border-b border-border/60 py-2">
                <button
                  type="button"
                  onClick={() => toggleMobileCategory('stationery')}
                  className="flex w-full items-center justify-between py-1 text-base font-medium text-primary"
                >
                  <span>Office Stationery Printing</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded.stationery ? 'rotate-180 text-accent' : ''}`} />
                </button>
                {mobileExpanded.stationery && (
                  <div className="mt-2 flex flex-col gap-2 pl-3 border-l-2 border-accent/40 py-2">
                    {officeStationeryItems.map((item) => (
                      <Link key={item.label} to={item.to} className="py-1 text-sm text-secondary hover:text-accent">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 3: Other Products */}
              <div className="border-b border-border/60 py-2">
                <button
                  type="button"
                  onClick={() => toggleMobileCategory('other')}
                  className="flex w-full items-center justify-between py-1 text-base font-medium text-primary"
                >
                  <span>Other Products</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded.other ? 'rotate-180 text-accent' : ''}`} />
                </button>
                {mobileExpanded.other && (
                  <div className="mt-2 flex flex-col gap-2 pl-3 border-l-2 border-accent/40 py-2">
                    {otherProductsItems.map((item) => (
                      <Link key={item.label} to={item.to} className="py-1 text-sm text-secondary hover:text-accent">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink to="/contact" className="py-2.5 text-base font-medium text-primary">
                Contact us
              </NavLink>
              <NavLink to="/portfolio" className="py-2.5 text-base font-medium text-primary">
                Blog
              </NavLink>

              <div className="mt-4 pt-4 border-t border-border">
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
