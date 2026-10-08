import { useEffect, useMemo, useState, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Menu,
  Mail,
  X,
  LogOut,
  ShieldCheck,
  Truck,
  ShoppingBag,
  ArrowUpRight,
  Search,
  Sparkles,
  MapPin,
  Copy,
  Check,
  ArrowRight,
  Phone,
  Layers,
  Box,
  FileText,
  CreditCard,
  Building2,
  BookOpen,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from './Container'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { useAuth } from '../context/AuthContext'
import { trackGetQuoteClick } from '../utils/analytics'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'

const NAV_GROUPS = [
  {
    key: 'printing',
    label: 'Cards & Commercial Print',
    description: 'Business cards, letterheads, brochures & marketing collaterals',
    icon: CreditCard,
    keywords: ['brochure', 'business card', 'letterhead', 'flyer', 'envelope', 'invoice', 'folder', 'notepad', 'catalog', 'booklet'],
  },
  {
    key: 'packaging',
    label: 'Custom Packaging & Boxes',
    description: 'Rigid luxury boxes, mailers, product cartons & bags',
    icon: Box,
    keywords: ['packaging', 'box', 'mailer', 'bag', 'rigid'],
  },
  {
    key: 'stationery',
    label: 'Corporate Stationery',
    description: '120gsm letterheads, presentation folders & executive envelopes',
    icon: FileText,
    keywords: ['letterhead', 'stationery', 'folder', 'envelope', 'notebook'],
  },
  {
    key: 'stickers',
    label: 'Stickers & Product Labels',
    description: 'Die-cut vinyl, waterproof roll labels & metallic foils',
    icon: Layers,
    keywords: ['sticker', 'label', 'vinyl', 'decal'],
  },
  {
    key: 'badges',
    label: 'ID Cards & Lanyards',
    description: 'NFC PVC smart badges, magnetic name tags & custom neck straps',
    icon: ShieldCheck,
    keywords: ['id card', 'lanyard', 'name badge', 'badge'],
  },
  {
    key: 'promotional',
    label: 'Corporate Gifts & Drinkware',
    description: 'Custom ceramic mugs, smart LED bottles & promotional merchandise',
    icon: Sparkles,
    keywords: ['mug', 'bottle', 'flask', 'gift', 'promo', 'keychain', 'tumbler'],
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
      description: 'Explore full commercial printing solutions',
      icon: Layers,
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

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function SiteHeader() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [whatsappPopoverOpen, setWhatsappPopoverOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [mobileAccordion, setMobileAccordion] = useState({ catalog: false, services: false, company: false })

  const location = useLocation()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)
  const dropdownTimeoutRef = useRef(null)

  const handleCopyNumber = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('+44 7344 546056')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMouseEnterDropdown = (key) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(key)
  }

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [catList, prodList] = await Promise.all([
          getCategories({ status: 'active', sort: 'display_order_asc' }).catch(() => []),
          getProducts({ active: true, limit: 30 }).catch(() => ({ products: [] })),
        ])
        if (isMounted) {
          setCategories(catList || [])
          setProducts(Array.isArray(prodList) ? prodList : prodList?.products || [])
        }
      } catch (error) {
        console.warn('[Header] Failed to load header catalog data:', error)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const megaMenuGroups = useMemo(() => buildMegaMenuGroups(categories), [categories])

  // Quick search filtered list
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return { products: [], categories: [] }

    const matchedProds = (products || [])
      .filter((p) => (p.name || '').toLowerCase().includes(q) || (p.shortDescription || '').toLowerCase().includes(q))
      .slice(0, 5)

    const matchedCats = (categories || [])
      .filter((c) => (c.name || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q))
      .slice(0, 4)

    return { products: matchedProds, categories: matchedCats }
  }, [searchQuery, products, categories])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on route navigation
  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
    setWhatsappPopoverOpen(false)
    setSearchModalOpen(false)
    setUserMenuOpen(false)
    setSearchQuery('')
  }, [location.pathname])

  // Prevent background scroll when mobile drawer or search is open
  useEffect(() => {
    document.body.style.overflow = (mobileMenuOpen || searchModalOpen) ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, searchModalOpen])

  // Focus search input
  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 80)
    }
  }, [searchModalOpen])

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        setSearchModalOpen(true)
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false)
        setActiveDropdown(null)
        setWhatsappPopoverOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full select-none transition-all duration-300">
      {/* 1. TOP ANNOUNCEMENT / UTILITY BAR */}
      <div className="hidden md:block border-b border-slate-800 bg-[#0B0F17] py-1.5 text-[11px] text-slate-300">
        <Container className="flex items-center justify-between gap-4">
          {/* Left: Location & Delivery Guarantee */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 font-medium text-slate-200">
              <MapPin className="h-3 w-3 text-[#A82F19]" />
              <span className="truncate max-w-[150px] lg:max-w-none">Al Quoz, Dubai Pressroom</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-bold text-white">Same-Day &amp; Express 24h</span>
              <span className="text-slate-400">UAE Delivery</span>
            </div>
          </div>

          {/* Right: Direct Hotline + Track Order + Email + Socials */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0 text-slate-300">
            <Link
              to="/track-order"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <Truck className="h-3.5 w-3.5 text-[#A82F19]" />
              <span>Track Order</span>
            </Link>

            <span className="hidden lg:inline h-3 w-px bg-white/15" />

            <a
              href="mailto:0nprint183@gmail.com"
              className="hidden lg:inline-flex items-center gap-1.5 font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>0nprint183@gmail.com</span>
            </a>

            <span className="hidden xl:inline h-3 w-px bg-white/15" />

            {/* Social Icons */}
            <div className="hidden xl:flex items-center gap-2 text-slate-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:text-white hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div
        className={`border-b border-slate-200/90 bg-white/95 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? 'py-2 shadow-md shadow-slate-900/5' : 'py-3 shadow-2xs'
        }`}
      >
        <Container className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          {/* Brand Logo & Subtitle */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group shrink-0 flex items-center gap-2.5 sm:gap-3"
          >
            <Logo variant="default" size="md" />
            <div className="hidden 2xl:flex flex-col text-left leading-tight pl-3 border-l border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 group-hover:text-[#A82F19] transition-colors">
                ONPRINT DUBAI
              </span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-tight">
                Commercial Press
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-bold text-slate-700"
            aria-label="Main Navigation"
          >
            {/* Catalog Mega-Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnterDropdown('catalog')}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown((prev) => (prev === 'catalog' ? null : 'catalog'))}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all cursor-pointer ${
                  activeDropdown === 'catalog' || location.pathname === '/products' || location.pathname === '/categories'
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-extrabold'
                    : 'hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Layers className="h-4 w-4 text-[#A82F19]" />
                <span>Catalog</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeDropdown === 'catalog' ? 'rotate-180 text-[#A82F19]' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Mega-Menu Dropdown Panel */}
              <AnimatePresence>
                {activeDropdown === 'catalog' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-2 w-[min(840px,calc(100vw-32px))] rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-50 text-slate-800"
                  >
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left Spotlight Banner */}
                      <div className="col-span-4 rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-slate-100/80 p-5 flex flex-col justify-between">
                        <div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#A82F19]/10 border border-[#A82F19]/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#A82F19]">
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>Pressroom Suite</span>
                          </div>
                          <h4 className="mt-2.5 text-sm font-black text-slate-900 leading-snug">
                            Precision Commercial Printing
                          </h4>
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                            FSC certified papers, Pantone precision color fidelity, and hot foil finishes.
                          </p>

                          <div className="mt-4 pt-3.5 border-t border-slate-200 space-y-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                              Popular Categories
                            </span>
                            <Link
                              to="/business-card-printing-dubai"
                              onClick={() => setActiveDropdown(null)}
                              className="group flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-[#A82F19] text-xs font-bold text-slate-800 transition-all shadow-2xs"
                            >
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#A82F19]" />
                                <span>Luxury Business Cards</span>
                              </span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#A82F19] transition-colors" />
                            </Link>
                            <Link
                              to="/packaging-printing-dubai"
                              onClick={() => setActiveDropdown(null)}
                              className="group flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-[#A82F19] text-xs font-bold text-slate-800 transition-all shadow-2xs"
                            >
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                <span>Custom Packaging</span>
                              </span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#A82F19]" />
                            </Link>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                          <Link
                            to="/products"
                            onClick={() => setActiveDropdown(null)}
                            className="text-xs font-black text-[#A82F19] hover:underline flex items-center gap-1"
                          >
                            <span>Browse All Products</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Right Categories Grid */}
                      <div className="col-span-8 grid grid-cols-2 gap-x-5 gap-y-4 max-h-[380px] overflow-y-auto pr-1">
                        {megaMenuGroups.map((group) => {
                          const Icon = group.icon || Layers
                          return (
                            <div key={group.key} className="p-2.5 rounded-xl hover:bg-slate-50/90 transition-colors">
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#A82F19]/10 text-[#A82F19] shrink-0">
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-slate-900 truncate">
                                    {group.label}
                                  </h5>
                                </div>
                              </div>

                              <ul className="mt-2 space-y-1 pl-8">
                                {group.items.slice(0, 5).map((item) => (
                                  <li key={item.slug || item.id}>
                                    <Link
                                      to={`/categories/${item.slug}`}
                                      onClick={() => setActiveDropdown(null)}
                                      className="group/link flex items-center justify-between text-xs font-medium text-slate-600 hover:text-[#A82F19] transition-colors"
                                    >
                                      <span className="truncate">{item.name}</span>
                                      <ChevronRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 text-[#A82F19] transition-opacity shrink-0" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Business Cards Link */}
            <NavLink
              to="/business-card-printing-dubai"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-extrabold'
                    : 'hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <span>Business Cards</span>
              <span className="rounded-full bg-[#A82F19] text-white px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider">
                Dubai
              </span>
            </NavLink>

            {/* Custom Packaging Link */}
            <NavLink
              to="/packaging-printing-dubai"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-extrabold'
                    : 'hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <span>Packaging</span>
            </NavLink>

            {/* Stickers & Labels (Visible on xl+, moved to More on lg) */}
            <NavLink
              to="/categories/stickers-printing-dubai"
              className={({ isActive }) =>
                `hidden xl:flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-extrabold'
                    : 'hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <span>Stickers</span>
            </NavLink>

            {/* Letterheads (Visible on 2xl+, moved to More on lg/xl) */}
            <NavLink
              to="/categories/letterheads-printing-dubai"
              className={({ isActive }) =>
                `hidden 2xl:flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-extrabold'
                    : 'hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <span>Letterheads</span>
            </NavLink>

            {/* Company & Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnterDropdown('company')}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown((prev) => (prev === 'company' ? null : 'company'))}
                className={`flex items-center gap-1 rounded-xl px-3 py-2 transition-all cursor-pointer ${
                  activeDropdown === 'company' || ['/services', '/about', '/blog', '/contact'].includes(location.pathname)
                    ? 'text-[#A82F19] bg-[#A82F19]/8 font-extrabold'
                    : 'hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span>Company</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeDropdown === 'company' ? 'rotate-180 text-[#A82F19]' : 'text-slate-400'
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'company' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 text-slate-800"
                  >
                    <Link
                      to="/services"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#A82F19] transition-colors"
                    >
                      <Sparkles className="h-4 w-4 text-[#A82F19]" />
                      <div>
                        <div className="leading-tight">All Printing Services</div>
                        <span className="text-[10px] font-normal text-slate-400">Offset, Digital &amp; Large Format</span>
                      </div>
                    </Link>

                    <Link
                      to="/categories/stickers-printing-dubai"
                      onClick={() => setActiveDropdown(null)}
                      className="xl:hidden flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#A82F19] transition-colors"
                    >
                      <Layers className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="leading-tight">Stickers &amp; Labels</div>
                        <span className="text-[10px] font-normal text-slate-400">Vinyl, roll labels &amp; foil</span>
                      </div>
                    </Link>

                    <Link
                      to="/categories/letterheads-printing-dubai"
                      onClick={() => setActiveDropdown(null)}
                      className="2xl:hidden flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#A82F19] transition-colors"
                    >
                      <FileText className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="leading-tight">Letterheads &amp; Stationery</div>
                        <span className="text-[10px] font-normal text-slate-400">Executive folders &amp; envelopes</span>
                      </div>
                    </Link>

                    <Link
                      to="/about"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#A82F19] transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="leading-tight">About ONPRINT</div>
                        <span className="text-[10px] font-normal text-slate-400">Dubai Pressroom &amp; Mission</span>
                      </div>
                    </Link>

                    <Link
                      to="/blog"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#A82F19] transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="leading-tight">Printing Insights &amp; Blog</div>
                        <span className="text-[10px] font-normal text-slate-400">Guides, materials &amp; finishes</span>
                      </div>
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#A82F19] transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="leading-tight">Contact &amp; Location</div>
                        <span className="text-[10px] font-normal text-slate-400">Al Quoz, Dubai Facility</span>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-white transition-all shadow-2xs cursor-pointer"
              title="Search products (Press /)"
            >
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden xl:inline text-[11px] font-medium text-slate-500">Search print catalog...</span>
              <kbd className="hidden xl:inline-block rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                /
              </kbd>
            </button>

            {/* Shopping Bag / Orders Button */}
            <Link
              to="/track-order"
              className="hidden sm:flex relative h-8.5 w-8.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white hover:text-[#A82F19] hover:border-[#A82F19]/40 transition-all shadow-2xs"
              title="Track Orders"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#A82F19] text-[8px] font-extrabold text-white">
                0
              </span>
            </Link>

            {/* WhatsApp VIP Concierge Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setWhatsappPopoverOpen((v) => !v)
                  setUserMenuOpen(false)
                }}
                className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  whatsappPopoverOpen
                    ? 'bg-[#25D366] text-white shadow-md shadow-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200/90 hover:bg-[#25D366] hover:text-white'
                }`}
                title="WhatsApp Concierge"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
                <span className="hidden md:inline text-[11px]">WhatsApp</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </button>

              {/* WhatsApp Dropdown Popover */}
              <AnimatePresence>
                {whatsappPopoverOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-76 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 text-slate-800"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs">
                          <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">WhatsApp Concierge</div>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Online • Instant Reply</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWhatsappPopoverOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 mb-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Hotline</span>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-black tracking-tight text-slate-900">+44 7344 546056</span>
                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-slate-700 shadow-2xs border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setWhatsappPopoverOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="h-4 w-4 fill-current" />
                      <span>Start Chat on WhatsApp</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Authenticated Admin Badge */}
            {isAuthenticated && isAdmin ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A82F19] text-white text-[10px] font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="hidden xl:inline max-w-[70px] truncate">{user?.name || 'Admin'}</span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-slate-800"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="font-bold text-xs text-slate-900 truncate">{user?.name || 'Administrator'}</div>
                        <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
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

            {/* Primary High-Converting CTA Button (Hidden on tiny mobile < 400px to avoid squishing) */}
            <Link
              to="/get-a-quote"
              className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-[#A82F19] to-[#C0392B] hover:from-[#932511] hover:to-[#A82F19] px-3.5 sm:px-4.5 py-1.5 sm:py-2 text-xs font-black text-white shadow-md shadow-[#A82F19]/25 hover:shadow-lg hover:shadow-[#A82F19]/35 hover:-translate-y-0.5 transition-all whitespace-nowrap"
              onClick={() => trackGetQuoteClick({ source_page: 'header_desktop' })}
            >
              <span>Get Quote</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </div>

      {/* 3. UNIVERSAL SEARCH MODAL */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl text-slate-800"
            >
              {/* Search Bar Input */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="h-5 w-5 text-[#A82F19]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 200+ products, categories, or finishes..."
                    className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
                {searchQuery.trim() === '' ? (
                  <div className="py-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">
                      Popular Print Categories
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <Link
                        to="/business-card-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#A82F19] hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                      >
                        <span>Business Cards</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                      <Link
                        to="/packaging-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#A82F19] hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                      >
                        <span>Custom Packaging</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                      <Link
                        to="/categories/letterheads-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#A82F19] hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                      >
                        <span>Letterheads</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                      <Link
                        to="/categories/stickers-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#A82F19] hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                      >
                        <span>Stickers &amp; Labels</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                      <Link
                        to="/categories/brochures-printing"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#A82F19] hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                      >
                        <span>Brochures</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                      <Link
                        to="/categories/mug-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#A82F19] hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                      >
                        <span>Mugs &amp; Tumblers</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {searchResults.products.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#A82F19] block mb-2">
                          Matching Products ({searchResults.products.length})
                        </span>
                        <div className="space-y-1.5">
                          {searchResults.products.map((p) => (
                            <Link
                              key={p._id || p.id}
                              to={`/products/${p.slug}`}
                              onClick={() => setSearchModalOpen(false)}
                              className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-[#A82F19]/40 hover:bg-slate-50 transition-all"
                            >
                              <div>
                                <h6 className="text-xs font-bold text-slate-900 group-hover:text-[#A82F19]">{p.name}</h6>
                                <p className="text-[10px] text-slate-400 line-clamp-1">{p.shortDescription}</p>
                              </div>
                              <span className="text-xs font-black text-slate-900">
                                {p.price ? `${p.price} AED` : 'Quote'}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.categories.length > 0 && (
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                          Matching Categories
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {searchResults.categories.map((c) => (
                            <Link
                              key={c.id || c._id}
                              to={`/categories/${c.slug}`}
                              onClick={() => setSearchModalOpen(false)}
                              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#A82F19] text-xs font-bold text-slate-800"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.products.length === 0 && searchResults.categories.length === 0 && (
                      <div className="py-8 text-center">
                        <p className="text-xs text-slate-500">No direct matches found for "{searchQuery}".</p>
                        <Link
                          to={`/products?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setSearchModalOpen(false)}
                          className="mt-2 inline-block text-xs font-bold text-[#A82F19] underline"
                        >
                          Search entire store catalog
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODERN MOBILE & TABLET DRAWER (OFF-CANVAS SHEET) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl z-50 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-4 shrink-0">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <Logo variant="default" size="sm" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Search Box Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSearchModalOpen(true)
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#A82F19]" />
                    <span>Search 200+ print products...</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* WhatsApp Concierge Card */}
                <a
                  href="https://wa.me/447344546056?text=Hi%20ONPRINT%2C%20I%20need%20a%20printing%20quote"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3 text-emerald-950 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs shrink-0">
                      <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-950">WhatsApp Concierge</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800">+44 7344 546056</span>
                    </div>
                  </div>
                  <span className="rounded-lg bg-[#25D366] text-white px-2.5 py-1 text-[11px] font-bold shadow-xs">
                    Chat
                  </span>
                </a>

                {/* Navigation Items & Accordions */}
                <div className="space-y-1">
                  {/* Home */}
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                  >
                    <span>Home</span>
                  </Link>

                  {/* Business Cards (Highlighted) */}
                  <Link
                    to="/business-card-printing-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#A82F19] bg-[#A82F19]/5"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Business Cards</span>
                    </div>
                    <span className="rounded bg-[#A82F19] text-white px-1.5 py-0.5 text-[9px] font-black uppercase">
                      DUBAI
                    </span>
                  </Link>

                  {/* Packaging */}
                  <Link
                    to="/packaging-printing-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                  >
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-slate-400" />
                      <span>Custom Packaging Boxes</span>
                    </div>
                  </Link>

                  {/* Stickers */}
                  <Link
                    to="/categories/stickers-printing-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-slate-400" />
                      <span>Stickers &amp; Labels</span>
                    </div>
                  </Link>

                  {/* Letterheads & Stationery */}
                  <Link
                    to="/categories/letterheads-printing-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span>Letterheads &amp; Stationery</span>
                    </div>
                  </Link>

                  {/* Product Catalog Accordion */}
                  <div className="border-t border-b border-slate-100 py-1 my-1">
                    <button
                      type="button"
                      onClick={() => setMobileAccordion((p) => ({ ...p, catalog: !p.catalog }))}
                      className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#A82F19]" />
                        <span>All Print Categories</span>
                      </div>
                      {mobileAccordion.catalog ? (
                        <Minus className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Plus className="h-4 w-4 text-slate-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {mobileAccordion.catalog && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 pr-2 pb-2 space-y-1 overflow-hidden"
                        >
                          <Link
                            to="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-[#A82F19] hover:bg-[#A82F19]/5"
                          >
                            <span>Browse All Products Catalog</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          {categories.slice(0, 10).map((cat) => (
                            <Link
                              key={cat.slug || cat.id}
                              to={`/categories/${cat.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-[#A82F19]"
                            >
                              <span>{cat.name}</span>
                              <ChevronRight className="h-3 w-3 text-slate-300" />
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Services */}
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-slate-400" />
                      <span>Printing Services</span>
                    </div>
                  </Link>

                  {/* About */}
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>About ONPRINT</span>
                    </div>
                  </Link>

                  {/* Blog */}
                  <Link
                    to="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-slate-400" />
                      <span>Blog &amp; Insights</span>
                    </div>
                  </Link>

                  {/* Contact */}
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#A82F19]"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>Contact &amp; Pressroom</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-slate-200 p-4 space-y-2 shrink-0 bg-slate-50/50">
                <Link
                  to="/get-a-quote"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    trackGetQuoteClick({ source_page: 'header_mobile_drawer' })
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A82F19] to-[#C0392B] py-3 text-sm font-black text-white shadow-md shadow-[#A82F19]/25 hover:shadow-lg transition-all"
                >
                  <span>Get Instant Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Truck className="h-4 w-4 text-[#A82F19]" />
                  <span>Track Existing Order</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
