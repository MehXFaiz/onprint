import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  Menu,
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
  ShoppingBag,
  Layers,
  ArrowUpRight,
  Search,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from './Container'
import Button from './Button'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { useAuth } from '../context/AuthContext'
import { trackGetQuoteClick } from '../utils/analytics'
import { getCategories } from '../services/categories'

const NAV_GROUPS = [
  {
    key: 'drinkware',
    label: 'Mugs & Water Bottles',
    keywords: ['mug', 'bottle', 'flask', 'tumbler', 'shaker', 'drinkware', 'cup'],
  },
  {
    key: 'printing',
    label: 'Paper & Commercial Print',
    keywords: ['brochure', 'business card', 'letterhead', 'flyer', 'envelope', 'invoice', 'receipt', 'voucher', 'folder', 'notepad', 'calendar', 'certificate', 'catalog', 'booklet'],
  },
  {
    key: 'badges',
    label: 'ID Cards & Badges',
    keywords: ['id card', 'lanyard', 'name badge', 'badge'],
  },
  {
    key: 'packaging',
    label: 'Packaging & Boxes',
    keywords: ['packaging', 'box', 'mailer', 'bag'],
  },
  {
    key: 'promotional',
    label: 'Corporate Gifts & Promo',
    keywords: ['gift', 'promo', 'merchandise', 'keychain', 'pen', 'tech', 'power bank'],
  },
  {
    key: 'stickers',
    label: 'Stickers & Labels',
    keywords: ['sticker', 'label'],
  },
  {
    key: 'signs',
    label: 'Signs & Displays',
    keywords: ['banner', 'poster', 'sign', 'foam', 'acrylic', 'display', 'roll-up', 'x-banner', 'flag'],
  },
  {
    key: 'apparel',
    label: 'Apparel & Uniforms',
    keywords: ['shirt', 'polo', 'hoodie', 'cap', 'jersey', 'uniform', 'fabric', 'wearable'],
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

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function PinterestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* 1. 2026 Executive Top Utility Bar */}
      <div className="hidden border-b border-white/[0.06] bg-[#06070A] py-1.5 text-[11px] text-neutral-400 lg:block">
        <Container className="flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Social Icons + Atelier Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-neutral-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#D4AF37]"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#D4AF37]"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#D4AF37]"
                aria-label="Pinterest"
              >
                <PinterestIcon />
              </a>
            </div>
            <span className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 font-medium text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Al Quoz Pressfloor • Same-Day &amp; Express 24h UAE Turnaround</span>
            </div>
          </div>

          {/* Quick Contact & WhatsApp Concierge */}
          <div className="flex items-center gap-4 font-medium text-neutral-400">
            <Link
              to="/track-order"
              className="flex items-center gap-1.5 transition-colors hover:text-white px-2 py-0.5 rounded text-neutral-300"
            >
              <Truck className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span className="font-semibold text-[11px]">Track Order</span>
            </Link>
            <span className="h-3 w-px bg-white/10" />
            <a
              href="mailto:0nprint183@gmail.com"
              className="flex items-center gap-1.5 transition-colors hover:text-[#D4AF37]"
            >
              <Mail className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>0nprint183@gmail.com</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 2. Main Luxury Floating Navigation Bar */}
      <div
        className={`border-b border-white/[0.08] bg-[#090A0D]/90 backdrop-blur-2xl transition-all duration-300 ${
          scrolled ? 'py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)]' : 'py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
        }`}
      >
        <Container className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Logo */}
          <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0 flex items-center group">
            <Logo variant="light" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 min-w-0" aria-label="Primary">
            {/* 1. Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/15 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              Home
            </NavLink>

            {/* 2. Products */}
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/15 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              Products
            </NavLink>

            {/* 3. Categories with Luxury Mega Menu Dropdown */}
            <div
              className="relative py-1"
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <NavLink
                to="/categories"
                onClick={() => setActiveDropdown(null)}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive || activeDropdown === 'categories' || location.pathname.startsWith('/categories')
                      ? 'text-white bg-white/[0.08] border border-white/15 font-bold shadow-xs'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                  }`
                }
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'categories' ? 'rotate-180 text-[#D4AF37]' : 'text-neutral-500'}`} />
              </NavLink>

              {/* 2026 Mega Menu Overlay */}
              <AnimatePresence>
                {activeDropdown === 'categories' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-2 w-[min(820px,calc(100vw-32px))] rounded-2xl border border-white/[0.12] bg-[#0F1118]/98 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-3xl z-50"
                  >
                    <div className="flex gap-6">
                      {/* Left Hub Banner */}
                      <div className="w-64 shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 flex flex-col justify-between">
                        <div>
                          <span className="inline-block rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                            Dubai Pressfloor
                          </span>
                          <h4 className="mt-2 text-sm font-black text-white leading-snug">
                            Commercial Print Catalog
                          </h4>
                          <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
                            FSC-certified paper stocks, Pantone PMS matching, and express UAE delivery.
                          </p>

                          {/* Quick Trending Links */}
                          <div className="mt-3.5 pt-3 border-t border-white/[0.08] space-y-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                              Signature Crafts
                            </span>
                            <Link
                              to="/business-card-printing-dubai"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37] hover:bg-white/[0.08] text-xs font-bold text-white transition-all group"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="text-[#D4AF37]">★</span>
                                <span>Business Cards Dubai</span>
                              </span>
                              <ArrowUpRight className="h-3 w-3 text-neutral-400 group-hover:text-[#D4AF37]" />
                            </Link>
                            <Link
                              to="/categories/mug-printing-dubai"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37] hover:bg-white/[0.08] text-xs font-bold text-white transition-all group"
                            >
                              <span className="flex items-center gap-1.5">
                                <span>☕</span>
                                <span>Mug Printing Dubai</span>
                              </span>
                              <ArrowUpRight className="h-3 w-3 text-neutral-400 group-hover:text-[#D4AF37]" />
                            </Link>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-white/[0.08]">
                          <Link
                            to="/categories"
                            onClick={() => setActiveDropdown(null)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline"
                          >
                            <span>View All Categories</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Right Grid of Category Groups */}
                      <div className="flex-1 grid grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                        {megaMenuGroups.map((group) => (
                          <div key={group.key} className="space-y-1.5">
                            <h5 className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37]">
                              {group.label}
                            </h5>
                            <ul className="space-y-1">
                              {group.items.slice(0, 8).map((item) => (
                                <li key={item.slug || item.id}>
                                  <Link
                                    to={`/categories/${item.slug}`}
                                    onClick={() => setActiveDropdown(null)}
                                    className="group flex items-center justify-between py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                                  >
                                    <span className="truncate">{item.name}</span>
                                    <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 transition-opacity group-hover:opacity-100 text-[#D4AF37]" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Business Cards Flagship Link */}
            <NavLink
              to="/business-card-printing-dubai"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/15 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              <span>Business Cards</span>
              <span className="rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">
                Dubai
              </span>
            </NavLink>

            {/* 4. Services */}
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/15 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              Services
            </NavLink>

            {/* 5. About Us */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/15 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              About Us
            </NavLink>

            {/* 6. Blogs */}
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/15 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              Blogs
            </NavLink>

            {/* 7. Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/15 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right CTA, Icons & Account Menu */}
          <div className="hidden items-center gap-3 lg:flex shrink-0">
            {/* Search Icon Link */}
            <Link
              to="/products"
              className="flex items-center justify-center h-8 w-8 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Search products"
              aria-label="Search products"
            >
              <Search className="h-4 w-4" />
            </Link>

            {/* Cart / Orders Icon Link */}
            <Link
              to="/track-order"
              className="flex items-center justify-center h-8 w-8 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Track Order"
              aria-label="Track Order"
            >
              <ShoppingBag className="h-4 w-4" />
            </Link>

            {isAuthenticated && isAdmin ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A82F19] text-white text-[10px] font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="max-w-[90px] truncate">{user?.name || 'Admin'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/15 bg-[#12141D] p-2 shadow-2xl z-50 backdrop-blur-2xl"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <div className="font-bold text-xs text-white truncate">{user?.name || 'Administrator'}</div>
                        <div className="text-[10px] text-neutral-400 truncate">{user?.email}</div>
                        <span className="mt-1 inline-block rounded bg-[#A82F19]/20 border border-[#A82F19]/40 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#FF8573]">
                          Administrator
                        </span>
                      </div>

                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Admin Control Panel</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40 rounded-lg transition-colors mt-1 border-t border-white/10 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            {/* Glowing CTA Button */}
            <Button
              to="/get-a-quote"
              variant="accent"
              icon={false}
              className="!rounded-xl !bg-gradient-to-r !from-[#A82F19] !to-[#C7371E] hover:!from-[#8f2513] hover:!to-[#A82F19] !px-4 xl:!px-5 !py-2 text-xs xl:text-sm font-black shadow-md shadow-[#A82F19]/40 hover:-translate-y-0.5 transition-all whitespace-nowrap"
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Container>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-b border-white/10 bg-[#090A0D]/98 backdrop-blur-2xl lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <Container className="py-5 space-y-4 px-4">
              <nav className="flex flex-col space-y-1">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-neutral-200 hover:bg-white/10 hover:text-white"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-neutral-200 hover:bg-white/10 hover:text-white"
                >
                  Products
                </Link>
                <Link
                  to="/categories"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-neutral-200 hover:bg-white/10 hover:text-white"
                >
                  All Categories
                </Link>
                <Link
                  to="/business-card-printing-dubai"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-[#D4AF37] hover:bg-white/10"
                >
                  <span>Business Cards Dubai</span>
                  <span className="rounded bg-[#D4AF37]/20 px-1.5 py-0.5 text-[9px] font-black uppercase">
                    Signature
                  </span>
                </Link>
                <Link
                  to="/services"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-neutral-200 hover:bg-white/10 hover:text-white"
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-neutral-200 hover:bg-white/10 hover:text-white"
                >
                  About Us
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-neutral-200 hover:bg-white/10 hover:text-white"
                >
                  Blog &amp; Guides
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-neutral-200 hover:bg-white/10 hover:text-white"
                >
                  Contact
                </Link>
              </nav>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <Button
                  to="/get-a-quote"
                  variant="accent"
                  className="w-full !rounded-xl justify-center font-black !py-3 !bg-gradient-to-r !from-[#A82F19] !to-[#C7371E]"
                  onClick={() => {
                    setMenuOpen(false)
                    trackGetQuoteClick({ source_page: 'header_mobile' })
                  }}
                >
                  Request Bespoke Quote
                </Button>
                <Link
                  to="/track-order"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <Truck className="h-4 w-4 text-[#D4AF37]" />
                  <span>Track Existing Order</span>
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
