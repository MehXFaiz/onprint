import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  Menu,
  Mail,
  X,
  LogOut,
  ShieldCheck,
  Printer,
  FileText,
  Truck,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  Search,
  Sparkles,
  PhoneCall,
  Clock,
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
    key: 'printing',
    label: 'Business Cards & Paper Print',
    keywords: ['brochure', 'business card', 'letterhead', 'flyer', 'envelope', 'invoice', 'folder', 'notepad', 'catalog', 'booklet'],
  },
  {
    key: 'packaging',
    label: 'Custom Packaging & Boxes',
    keywords: ['packaging', 'box', 'mailer', 'bag', 'rigid'],
  },
  {
    key: 'drinkware',
    label: 'Mugs & Water Bottles',
    keywords: ['mug', 'bottle', 'flask', 'tumbler', 'shaker', 'drinkware', 'cup'],
  },
  {
    key: 'stickers',
    label: 'Stickers & Product Labels',
    keywords: ['sticker', 'label', 'vinyl', 'decal'],
  },
  {
    key: 'badges',
    label: 'ID Cards & Lanyards',
    keywords: ['id card', 'lanyard', 'name badge', 'badge'],
  },
  {
    key: 'promotional',
    label: 'Corporate Gifts & Promo',
    keywords: ['gift', 'promo', 'merchandise', 'keychain', 'pen', 'tech', 'power bank'],
  },
  {
    key: 'signs',
    label: 'Signage & Displays',
    keywords: ['banner', 'poster', 'sign', 'foam', 'acrylic', 'display', 'roll-up', 'x-banner', 'flag'],
  },
  {
    key: 'apparel',
    label: 'Apparel & Uniforms',
    keywords: ['shirt', 'polo', 'hoodie', 'cap', 'jersey', 'uniform'],
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

export default function SiteHeader() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
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
      setScrolled(window.scrollY > 10)
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

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* 1. Clean Light Top Announcement Bar */}
      <div className="hidden border-b border-slate-200/70 bg-slate-50/90 py-1.5 text-[11px] text-slate-600 lg:block">
        <Container className="flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Social Icons + Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-slate-500">
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
            </div>
            <span className="h-3 w-px bg-slate-300" />
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Al Quoz Production Pressfloor • Same-Day &amp; Express 24h UAE Delivery</span>
            </div>
          </div>

          {/* Quick Contact, WhatsApp Hotline & Order Tracking */}
          <div className="flex items-center gap-3.5 font-medium text-slate-600">
            <a
              href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 px-2.5 py-0.5 text-emerald-800 transition-all font-bold shadow-2xs hover:shadow-xs"
              aria-label="WhatsApp Hotline +44 7344 546056"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-600 group-hover:scale-110 transition-transform fill-current" />
              <span className="text-[11px] tracking-tight">+44 7344 546056</span>
            </a>

            <span className="h-3 w-px bg-slate-300" />

            <Link
              to="/track-order"
              className="flex items-center gap-1.5 transition-colors hover:text-[#A82F19] text-slate-700"
            >
              <Truck className="h-3.5 w-3.5 text-[#A82F19]" />
              <span className="font-semibold text-[11px]">Track Order</span>
            </Link>

            <span className="h-3 w-px bg-slate-300" />

            <a
              href="mailto:0nprint183@gmail.com"
              className="flex items-center gap-1.5 transition-colors hover:text-[#A82F19] text-slate-700"
            >
              <Mail className="h-3.5 w-3.5 text-[#A82F19]" />
              <span>0nprint183@gmail.com</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 2. Main Clean Light Navigation Bar */}
      <div
        className={`border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? 'py-2.5 shadow-md shadow-slate-200/50' : 'py-3.5 shadow-xs'
        }`}
      >
        <Container className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Logo */}
          <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0 flex items-center">
            <Logo variant="default" size="md" />
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
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                    : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
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
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                    : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
                }`
              }
            >
              Products
            </NavLink>

            {/* 3. Categories with Clean Light Mega Menu */}
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
                      ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                      : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
                  }`
                }
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'categories' ? 'rotate-180 text-[#A82F19]' : 'text-slate-400'}`} />
              </NavLink>

              {/* Clean Light Mega Menu */}
              <AnimatePresence>
                {activeDropdown === 'categories' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-2 w-[min(820px,calc(100vw-32px))] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl z-50"
                  >
                    <div className="flex gap-6">
                      {/* Left Spotlight Banner */}
                      <div className="w-64 shrink-0 rounded-xl border border-slate-100 bg-slate-50/80 p-4 flex flex-col justify-between">
                        <div>
                          <span className="inline-block rounded-full bg-[#A82F19]/10 border border-[#A82F19]/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-[#A82F19]">
                            Dubai Pressroom
                          </span>
                          <h4 className="mt-2 text-sm font-black text-slate-900 leading-snug">
                            Commercial Print Catalog
                          </h4>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                            FSC-certified paper stocks, Pantone PMS matching, and fast UAE delivery.
                          </p>

                          {/* Quick Highlight Links */}
                          <div className="mt-3.5 pt-3 border-t border-slate-200/70 space-y-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                              Popular Services
                            </span>
                            <Link
                              to="/business-card-printing-dubai"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-[#A82F19] hover:text-[#A82F19] text-xs font-bold text-slate-800 transition-all shadow-xs group"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="text-[#A82F19]">★</span>
                                <span>Business Cards Dubai</span>
                              </span>
                              <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-[#A82F19]" />
                            </Link>
                            <Link
                              to="/categories/mug-printing-dubai"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-[#A82F19] hover:text-[#A82F19] text-xs font-bold text-slate-800 transition-all shadow-xs group"
                            >
                              <span className="flex items-center gap-1.5">
                                <span>☕</span>
                                <span>Mug Printing Dubai</span>
                              </span>
                              <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-[#A82F19]" />
                            </Link>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-200/70">
                          <Link
                            to="/categories"
                            onClick={() => setActiveDropdown(null)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A82F19] hover:underline"
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
                            <h5 className="text-[11px] font-black uppercase tracking-wider text-[#A82F19]">
                              {group.label}
                            </h5>
                            <ul className="space-y-1">
                              {group.items.slice(0, 8).map((item) => (
                                <li key={item.slug || item.id}>
                                  <Link
                                    to={`/categories/${item.slug}`}
                                    onClick={() => setActiveDropdown(null)}
                                    className="group flex items-center justify-between py-1 text-xs font-medium text-slate-700 hover:text-[#A82F19] transition-colors"
                                  >
                                    <span className="truncate">{item.name}</span>
                                    <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 transition-opacity group-hover:opacity-100 text-[#A82F19]" />
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
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                    : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
                }`
              }
            >
              <span>Business Cards</span>
              <span className="rounded bg-[#A82F19]/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#A82F19]">
                Dubai
              </span>
            </NavLink>

            {/* Packaging Link */}
            <NavLink
              to="/packaging-printing-dubai"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                    : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
                }`
              }
            >
              Packaging
            </NavLink>

            {/* Services */}
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                    : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
                }`
              }
            >
              Services
            </NavLink>

            {/* About Us */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                    : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
                }`
              }
            >
              About Us
            </NavLink>

            {/* Blogs */}
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                    : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
                }`
              }
            >
              Blog
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-bold'
                    : 'text-slate-700 hover:text-[#A82F19] hover:bg-slate-50'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action Icons & Quote CTA */}
          <div className="hidden items-center gap-2.5 lg:flex shrink-0">
            {/* WhatsApp Direct Hotline Pill */}
            <a
              href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-2 rounded-xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/90 px-3 py-1.5 text-xs font-bold text-emerald-900 transition-all hover:shadow-xs group"
              title="Direct WhatsApp Hotline (+44 7344 546056)"
              aria-label="Direct WhatsApp Hotline"
            >
              <div className="relative flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-2xs group-hover:scale-110 transition-transform">
                <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider">WhatsApp</span>
                <span className="text-[11.5px] font-extrabold text-emerald-950 mt-0.5">+44 7344 546056</span>
              </div>
            </a>

            <Link
              to="/products"
              className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-700 hover:text-[#A82F19] hover:bg-slate-100 transition-colors"
              title="Search products"
              aria-label="Search products"
            >
              <Search className="h-4 w-4" />
            </Link>

            <Link
              to="/track-order"
              className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-700 hover:text-[#A82F19] hover:bg-slate-100 transition-colors"
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
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A82F19] text-white text-[10px] font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="max-w-[90px] truncate">{user?.name || 'Admin'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50"
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
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#A82F19] hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>Admin Dashboard</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1 border-t border-slate-100 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            {/* High-Converting Red CTA Button */}
            <Button
              to="/get-a-quote"
              variant="accent"
              icon={false}
              className="!rounded-xl !bg-[#A82F19] hover:!bg-[#8F2412] !px-5 !py-2.5 text-xs xl:text-sm font-bold text-white shadow-md shadow-[#A82F19]/25 hover:shadow-lg hover:shadow-[#A82F19]/35 hover:-translate-y-0.5 transition-all whitespace-nowrap"
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
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
            className="border-b border-slate-200 bg-white/98 backdrop-blur-md lg:hidden max-h-[85vh] overflow-y-auto shadow-xl"
          >
            <Container className="py-5 space-y-4 px-4">
              {/* WhatsApp Mobile Quick Contact Banner */}
              <a
                href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-emerald-950 transition-all hover:bg-emerald-100 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
                    <WhatsAppIcon className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-emerald-950">WhatsApp Concierge</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-xs font-black text-emerald-800 tracking-tight">+44 7344 546056</span>
                  </div>
                </div>
                <span className="rounded-lg bg-[#25D366] text-white px-3 py-1.5 text-[11px] font-bold shadow-xs">
                  Chat Now
                </span>
              </a>

              <nav className="flex flex-col space-y-1">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                >
                  Products
                </Link>
                <Link
                  to="/categories"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                >
                  All Categories
                </Link>
                <Link
                  to="/business-card-printing-dubai"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-[#A82F19] bg-[#A82F19]/5"
                >
                  <span>Business Cards Dubai</span>
                  <span className="rounded bg-[#A82F19] text-white px-1.5 py-0.5 text-[9px] font-black uppercase">
                    Signature
                  </span>
                </Link>
                <Link
                  to="/packaging-printing-dubai"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                >
                  Packaging &amp; Boxes
                </Link>
                <Link
                  to="/services"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                >
                  About Us
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                >
                  Blog &amp; Guides
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                >
                  Contact
                </Link>
              </nav>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                <Button
                  to="/get-a-quote"
                  variant="accent"
                  className="w-full !rounded-xl justify-center font-bold !py-3 !bg-[#A82F19] hover:!bg-[#8F2412]"
                  onClick={() => {
                    setMenuOpen(false)
                    trackGetQuoteClick({ source_page: 'header_mobile' })
                  }}
                >
                  Request a Quote
                </Button>
                <Link
                  to="/track-order"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Truck className="h-4 w-4 text-[#A82F19]" />
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
