import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  Menu,
  Phone,
  Mail,
  X,
  LogOut,
  ShieldCheck,
  Home,
  Info,
  LayoutGrid,
  Printer,
  BookOpen,
  CreditCard,
  FileText,
  UserCheck,
  Award,
  FileSpreadsheet,
  PhoneCall,
  Truck,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from './Container'
import Button from './Button'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { trackGetQuoteClick } from '../utils/analytics'
import { getCategories } from '../services/categories'

const NAV_GROUPS = [
  {
    key: 'printing',
    label: 'Printing',
    keywords: ['brochure', 'business card', 'letterhead', 'envelope', 'invoice', 'receipt', 'voucher', 'folder', 'notepad', 'calendar', 'certificate', 'printing'],
  },
  {
    key: 'stickers',
    label: 'Stickers & Labels',
    keywords: ['sticker', 'label'],
  },
  {
    key: 'signs',
    label: 'Signs & Displays',
    keywords: ['banner', 'poster', 'sign', 'foam', 'acrylic', 'display', 'roll-up', 'x-banner'],
  },
  {
    key: 'packaging',
    label: 'Packaging',
    keywords: ['bag', 'box', 'packaging', 'tag', 'gift'],
  },
  {
    key: 'apparel',
    label: 'Apparel & Textile',
    keywords: ['shirt', 'polo', 'hoodie', 'cap', 'jersey', 'uniform', 'fabric'],
  },
  {
    key: 'promotional',
    label: 'Promotional Products',
    keywords: ['pen', 'keychain', 'lanyard', 'mug', 'bottle', 'trophy', 'award', 'gift', 'promo', 'merchandise'],
  },
  {
    key: 'events',
    label: 'Events & Branding',
    keywords: ['event', 'flag', 'backdrop', 'table', 'badge', 'id card', 'exhibition', 'display'],
  },
  {
    key: 'design',
    label: 'Design Services',
    keywords: ['logo', 'branding', 'design'],
  },
]

function normalizeText(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim()
}

function buildMegaMenuGroups(categories = []) {
  const activeCategories = (categories || []).filter((cat) => {
    const status = cat?.status || (cat?.active ? 'active' : 'inactive')
    return status === 'active' || cat?.active !== false
  })

  const grouped = NAV_GROUPS.map((group) => {
    const items = activeCategories.filter((cat) => {
      const haystack = normalizeText(`${cat?.name || ''} ${cat?.slug || ''} ${cat?.description || ''}`)
      return group.keywords.some((keyword) => haystack.includes(normalizeText(keyword)))
    })

    return {
      ...group,
      items: items.sort((a, b) => (Number(a.displayOrder ?? a.display_order ?? 0) - Number(b.displayOrder ?? b.display_order ?? 0))),
    }
  }).filter((group) => group.items.length > 0)

  if (!grouped.length && activeCategories.length > 0) {
    return [{
      key: 'all',
      label: 'All Categories',
      items: activeCategories.slice(0, 8).sort((a, b) => (Number(a.displayOrder ?? a.display_order ?? 0) - Number(b.displayOrder ?? b.display_order ?? 0))),
    }]
  }

  return grouped
}

function chunkArray(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Custom Clean Social SVG Icons
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function PinterestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.854 0 1.265.641 1.265 1.41 0 .859-.546 2.144-.829 3.335-.236.997.5 1.81 1.484 1.81 1.782 0 3.151-1.879 3.151-4.59 0-2.399-1.724-4.077-4.187-4.077-2.853 0-4.527 2.14-4.527 4.35 0 .862.332 1.787.747 2.29.082.1.094.188.069.29-.076.315-.245.998-.278 1.139-.044.183-.146.222-.338.134-1.264-.588-2.054-2.435-2.054-3.918 0-3.187 2.316-6.115 6.678-6.115 3.506 0 6.231 2.498 6.231 5.839 0 3.484-2.197 6.287-5.246 6.287-1.024 0-1.987-.532-2.317-1.161l-.63 2.4c-.228.877-.845 1.977-1.258 2.645C9.728 21.847 10.84 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  )
}

export default function SiteHeader() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState({})
  const [categories, setCategories] = useState([])

  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      try {
        const list = await getCategories({ status: 'active', sort: 'display_order_asc' })
        if (isMounted) setCategories(list || [])
      } catch (error) {
        console.warn('[Header] Failed to load categories:', error)
        if (isMounted) setCategories([])
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const megaMenuGroups = useMemo(() => buildMegaMenuGroups(categories), [categories])

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
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* Executive Top Utility Bar */}
      <div className="hidden border-b border-slate-200 bg-slate-50 py-2 text-xs text-slate-600 lg:block">
        <Container className="flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-6 2xl:px-12">
          {/* Social Icons + Tagline */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-slate-600">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#A82F19]"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#A82F19]"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#A82F19]"
                aria-label="Pinterest"
              >
                <PinterestIcon />
              </a>
            </div>
            <span className="h-3 w-[1px] bg-slate-200" />
            <span className="font-medium tracking-normal text-slate-600">
              Dubai’s Premier Printing &amp; Custom Creative Services
            </span>
          </div>

          {/* Quick Contact Details & Order Tracking */}
          <div className="flex items-center gap-4 font-medium text-slate-600">
            <Link to="/track-order" className="flex items-center gap-1.5 transition-colors hover:text-[#A82F19] text-slate-700 hover:bg-slate-100 px-2 py-0.5 rounded">
              <Truck className="h-3.5 w-3.5 text-[#A82F19]" />
              <span className="font-semibold text-[11px]">Track Order</span>
            </Link>
            <span className="h-3 w-[1px] bg-slate-200" />
            <a href="tel:+9714800PRINT" className="flex items-center gap-1.5 transition-colors hover:text-[#A82F19]">
              <Phone className="h-3.5 w-3.5 text-[#A82F19]" />
              <span>+971 4 800 PRINT</span>
            </a>
            <span className="h-3 w-[1px] bg-slate-200" />
            <a href="mailto:info@onprint.ae" className="flex items-center gap-1.5 transition-colors hover:text-[#A82F19]">
              <Mail className="h-3.5 w-3.5 text-[#A82F19]" />
              <span>info@onprint.ae</span>
            </a>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar (Menubar Style) */}
      <div
        className={`border-b border-slate-200 bg-white shadow-sm transition-all duration-300 ${
          scrolled ? 'py-2.5 backdrop-blur-md bg-white/95' : 'py-3.5'
        }`}
      >
        <Container className="flex items-center justify-between gap-3 xl:gap-4 2xl:gap-6 px-4 sm:px-6 lg:px-8 xl:px-6 2xl:px-12">
          {/* Logo */}
          <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links (Menubar styling with icons) */}
          <nav className="hidden items-center gap-1 xl:gap-1.5 2xl:gap-2 xl:flex shrink min-w-0" aria-label="Primary">
            {/* 1. Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-tight transition-colors ${
                  isActive
                    ? 'bg-red-50 text-[#A82F19] font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </NavLink>

            {/* 2. About us */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-tight transition-colors ${
                  isActive
                    ? 'bg-red-50 text-[#A82F19] font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>About us</span>
            </NavLink>

            {/* 3. Categories */}
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-tight transition-colors ${
                  isActive
                    ? 'bg-red-50 text-[#A82F19] font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Categories</span>
            </NavLink>

            {/* 4. Live Product Categories Mega Menu */}
            {megaMenuGroups.map((group) => {
              const isActive = activeDropdown === group.key
              const columnChunks = chunkArray(group.items, 3)

              return (
                <div
                  key={group.key}
                  className="relative py-1"
                  onMouseEnter={() => setActiveDropdown(group.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isActive ? null : group.key)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-tight transition-colors cursor-pointer ${
                      isActive || location.pathname.startsWith('/categories/')
                        ? 'bg-red-50 text-[#A82F19] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isActive ? 'rotate-180 text-[#A82F19]' : 'text-slate-500'}`} />
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-[680px] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg z-50"
                      >
                        <div className="flex gap-4">
                          <div className="w-56 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <div className="mb-3 h-20 overflow-hidden rounded-xl bg-gradient-to-br from-[#A82F19]/10 via-white to-[#F6F1ED] p-2">
                              {group.items[0]?.image_url ? (
                                <img
                                  src={group.items[0].image_url}
                                  alt={group.items[0].name}
                                  className="h-full w-full rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center rounded-lg bg-white text-[#A82F19]">
                                  <Printer className="h-8 w-8" />
                                </div>
                              )}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A82F19]">Category Hub</div>
                            <h3 className="mt-2 text-sm font-black text-slate-900">{group.label}</h3>
                            <p className="mt-1 text-[11px] leading-5 text-slate-600">
                              {group.items.length} live category option{group.items.length > 1 ? 's' : ''} available for your print needs.
                            </p>
                            <Link
                              to="/categories"
                              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#A82F19] px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#8b2414]"
                            >
                              View all
                              <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
                            </Link>
                          </div>

                          <div className="grid flex-1 grid-cols-3 gap-3">
                            {columnChunks.map((chunk, columnIndex) => (
                              <div key={`${group.key}-${columnIndex}`} className="space-y-2">
                                {chunk.map((item) => (
                                  <Link
                                    key={item.slug || item.id}
                                    to={`/categories/${item.slug}`}
                                    className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#A82F19]"
                                  >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[9px] font-bold text-slate-500 transition-colors group-hover:bg-[#A82F19]/10 group-hover:text-[#A82F19]">
                                      {item.name?.charAt(0)?.toUpperCase() || 'P'}
                                    </span>
                                    <span className="line-clamp-1">{item.name}</span>
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {/* 5. Contact us */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-tight transition-colors ${
                  isActive
                    ? 'bg-red-50 text-[#A82F19] font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Contact us</span>
            </NavLink>

            {/* 6. Blog */}
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap text-xs xl:text-[13px] 2xl:text-sm font-semibold tracking-tight transition-colors ${
                  isActive
                    ? 'bg-red-50 text-[#A82F19] font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Blog</span>
            </NavLink>
          </nav>

          {/* Right CTA & Admin Account Menu */}
          <div className="hidden items-center gap-3 xl:flex shrink-0">
            {isAuthenticated && isAdmin ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-xs"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A82F19] text-white text-[10px] font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name || 'Admin'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-slate-200 bg-white p-1.5 shadow-md z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="font-bold text-xs text-slate-900 truncate">{user?.name || 'Administrator'}</div>
                        <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
                        <span className="mt-1 inline-block rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#A82F19]">
                          Administrator
                        </span>
                      </div>

                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#A82F19] hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>Admin Control Panel</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1 border-t border-slate-100 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            <Button
              to="/get-a-quote"
              variant="accent"
              icon={false}
              className="!px-5 2xl:!px-6 !py-2 text-xs xl:text-sm font-bold shadow-sm shadow-[#A82F19]/20"
              onClick={() => trackGetQuoteClick({ source_page: 'header_desktop' })}
            >
              Get a Quote
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex items-center justify-center p-2 text-slate-700 xl:hidden rounded-md border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Container>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-b border-slate-200 bg-white shadow-sm xl:hidden"
            aria-label="Mobile Navigation"
          >
            <Container className="flex flex-col gap-1 py-4">
              {/* Social icons in mobile drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-slate-500">
                <div className="flex items-center gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-1 rounded hover:bg-slate-100">
                    <FacebookIcon />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1 rounded hover:bg-slate-100">
                    <InstagramIcon />
                  </a>
                  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="p-1 rounded hover:bg-slate-100">
                    <PinterestIcon />
                  </a>
                </div>
                <span className="text-xs font-medium text-slate-400">Dubai, UAE</span>
              </div>

              {/* Direct links */}
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive ? 'bg-red-50 text-[#A82F19]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive ? 'bg-red-50 text-[#A82F19]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Info className="w-4 h-4 text-slate-500" />
                <span>About us</span>
              </NavLink>

              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive ? 'bg-red-50 text-[#A82F19]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <LayoutGrid className="w-4 h-4 text-slate-500" />
                <span>Categories</span>
              </NavLink>

              {/* Accordion: Dynamic database-driven category groups */}
              {megaMenuGroups.map((group) => (
                <div key={`mobile-${group.key}`} className="border-y border-slate-100 py-1">
                  <button
                    type="button"
                    onClick={() => toggleMobileCategory(group.key)}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Printer className="w-4 h-4 text-slate-500" />
                      <span>{group.label}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded[group.key] ? 'rotate-180 text-[#A82F19]' : 'text-slate-400'}`} />
                  </button>
                  {mobileExpanded[group.key] && (
                    <div className="mt-1 flex flex-col gap-1 pl-6 pr-2 py-1 border-l-2 border-slate-200 ml-4">
                      {group.items.map((item) => (
                        <Link
                          key={item.slug || item.id}
                          to={`/categories/${item.slug}`}
                          className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-[#A82F19] hover:bg-slate-50 rounded-md transition-colors"
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-slate-100 text-[8px] font-bold text-slate-500">
                            {item.name?.charAt(0)?.toUpperCase() || 'P'}
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      ))}

                      <Link
                        to="/categories"
                        className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#A82F19] hover:bg-slate-50 rounded-md"
                      >
                        View all
                        <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive ? 'bg-red-50 text-[#A82F19]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <PhoneCall className="w-4 h-4 text-slate-500" />
                <span>Contact us</span>
              </NavLink>

              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive ? 'bg-red-50 text-[#A82F19]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Blog</span>
              </NavLink>

              <NavLink
                to="/track-order"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive ? 'bg-red-50 text-[#A82F19]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Truck className="w-4 h-4 text-slate-500" />
                <span>Track Order</span>
              </NavLink>

              {/* Mobile CTA */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <Button
                  to="/get-a-quote"
                  variant="accent"
                  icon={false}
                  className="w-full justify-center !py-2.5 shadow-sm shadow-[#A82F19]/20"
                  onClick={() => {
                    setMenuOpen(false)
                    trackGetQuoteClick({ source_page: 'header_mobile_drawer' })
                  }}
                >
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
