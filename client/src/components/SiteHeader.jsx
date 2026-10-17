import { useEffect, useMemo, useState, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
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
  FileText,
  CreditCard,
  Building2,
  BookOpen,
  ChevronRight,
  Plus,
  Minus,
  Zap,
  Tag,
  Palette,
  Stamp,
  BadgeCheck
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { useAuth } from '../context/AuthContext'
import { trackGetQuoteClick, trackWhatsAppClick } from '../utils/analytics'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'
import { getServiceWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../utils/whatsapp'

const NAV_GROUPS = [
  {
    key: 'printing',
    label: 'Cards & Commercial Print',
    description: 'Luxury business cards, letterheads, brochures & marketing collaterals',
    icon: CreditCard,
    badge: 'Popular',
    keywords: ['brochure', 'business card', 'letterhead', 'flyer', 'envelope', 'invoice', 'folder', 'notepad', 'catalog', 'booklet'],
  },
  {
    key: 'stamps',
    label: 'Company Stamps & Seals',
    description: 'Self-inking Trodat stamps, pocket stamps, dater machines & wax seals',
    icon: Stamp,
    badge: 'Express 2h',
    keywords: ['stamp', 'seal', 'dater', 'wax seal', 'rubber stamp', 'self-inking'],
  },
  {
    key: 'stationery',
    label: 'Corporate Stationery',
    description: '120gsm letterheads, presentation folders & executive envelopes',
    icon: FileText,
    badge: 'Executive',
    keywords: ['letterhead', 'stationery', 'folder', 'envelope', 'notebook'],
  },
  {
    key: 'stickers',
    label: 'Stickers & Product Labels',
    description: 'Die-cut vinyl, waterproof roll labels & metallic foils',
    icon: Layers,
    badge: 'Die-Cut',
    keywords: ['sticker', 'label', 'vinyl', 'decal'],
  },
  {
    key: 'badges',
    label: 'ID Cards & Lanyards',
    description: 'NFC PVC smart badges, magnetic name tags & custom neck straps',
    icon: ShieldCheck,
    badge: 'Security',
    keywords: ['id card', 'lanyard', 'name badge', 'badge'],
  },
  {
    key: 'promotional',
    label: 'Corporate Gifts & Drinkware',
    description: 'Custom ceramic mugs, smart LED bottles & promotional merchandise',
    icon: Sparkles,
    badge: 'Merchandise',
    keywords: ['mug', 'bottle', 'flask', 'gift', 'promo', 'keychain', 'tumbler'],
  },
  {
    key: 'signage',
    label: 'Rollup Banners & Signage',
    description: 'Retractable roll-up stands, pull-up banners & exhibition displays',
    icon: Layers,
    badge: 'Exhibition',
    keywords: ['banner', 'rollup', 'roll up', 'roll-up', 'pull up', 'stand', 'signage'],
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

export default function SiteHeader() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [hoveredNav, setHoveredNav] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [whatsappPopoverOpen, setWhatsappPopoverOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [mobileAccordion, setMobileAccordion] = useState({ catalog: false, services: false, company: false })

  const location = useLocation()
  const searchInputRef = useRef(null)
  const dropdownTimeoutRef = useRef(null)

  const handleCopyNumber = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(FORMATTED_PHONE)
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
    }, 180)
  }

  const productsLoadedRef = useRef(false)

  const loadSearchProducts = () => {
    if (productsLoadedRef.current) return
    productsLoadedRef.current = true
    getProducts({ active: true, limit: 30 })
      .then((prodList) => {
        setProducts(Array.isArray(prodList) ? prodList : prodList?.products || [])
      })
      .catch(() => {})
  }

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const catList = await getCategories({ status: 'active', sort: 'display_order_asc' }).catch(() => [])
        if (isMounted) {
          setCategories(catList || [])
        }
      } catch (error) {
        console.warn('[Header] Failed to load header catalog data:', error)
      }
    }

    loadData()

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadSearchProducts(), { timeout: 4000 })
      } else {
        loadSearchProducts()
      }
    }, 2500)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (searchModalOpen) {
      loadSearchProducts()
    }
  }, [searchModalOpen])

  const megaMenuGroups = useMemo(() => buildMegaMenuGroups(categories), [categories])

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

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
    setWhatsappPopoverOpen(false)
    setSearchModalOpen(false)
    setUserMenuOpen(false)
    setSearchQuery('')
    setHoveredNav(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = (mobileMenuOpen || searchModalOpen) ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, searchModalOpen])

  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 80)
    }
  }, [searchModalOpen])

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
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
    <header className="sticky top-0 z-50 w-full select-none pt-1.5 sm:pt-2.5">
      {/* 1. TOP MINIMAL MICRO-TICKER RIBBON */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 mb-1.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-zinc-500 tracking-tight">
          {/* Left: Pressroom Live Status Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-1.5 text-zinc-900 font-bold uppercase tracking-wider text-[10px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF65] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF65]"></span>
              </span>
              <span>Dubai Commercial Pressroom</span>
            </div>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-600">Al Quoz 4, Dubai</span>
            <span className="text-zinc-300 hidden lg:inline">•</span>
            <span className="hidden lg:inline text-zinc-900 font-semibold">Same-Day 4H Rush Available</span>
            <span className="text-zinc-300 hidden xl:inline">•</span>
            <span className="hidden xl:inline text-zinc-500">Free 300 DPI Pre-Flight Audit</span>
          </div>

          {/* Right: Hotline + Track Order + WhatsApp */}
          <div className="flex items-center gap-3.5 text-zinc-600 shrink-0">
            <a
              href={`tel:+${RAW_WHATSAPP_NUMBER}`}
              className="inline-flex items-center gap-1.5 font-bold text-zinc-900 hover:text-[#D4AF65] transition-colors"
            >
              <Phone className="h-3 w-3 text-[#D4AF65]" />
              <span>{FORMATTED_PHONE}</span>
            </a>

            <span className="text-zinc-300">/</span>

            <Link
              to="/track-order"
              className="inline-flex items-center gap-1.5 font-medium hover:text-zinc-950 transition-colors"
            >
              <Truck className="h-3 w-3 text-zinc-400" />
              <span>Track Order</span>
            </Link>

            <span className="text-zinc-300">/</span>

            <a
              href={getServiceWhatsAppUrl(location.pathname)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({
                  source_page: location.pathname,
                  button_location: 'header_top_bar',
                  label: 'header_top_bar_whatsapp',
                })
              }
              className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <WhatsAppIcon className="h-3 w-3 fill-current" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. FLOATING ARCHITECTURAL CAPSULE DOCK */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div
          className={`rounded-full border transition-all duration-300 px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-2xl border-[#E5E7EB] shadow-[0_12px_36px_rgba(16,29,53,0.08)]'
              : 'bg-white/90 backdrop-blur-xl border-[#E5E7EB] shadow-[0_6px_24px_rgba(16,29,53,0.04)]'
          }`}
        >
          {/* Brand Logo & Dubai Flagship Pill */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group shrink-0 flex items-center gap-2.5"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Logo variant="default" size="md" />
            </motion.div>
            <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-zinc-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-950">
                DUBAI
              </span>
              <span className="h-1 w-1 rounded-full bg-[#D4AF65]" />
              <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-tight">
                PRESSROOM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Minimalist Pill Glider */}
          <nav
            className="hidden lg:flex items-center gap-0.5 bg-[#F5F2EB]/90 p-1 rounded-full border border-[#E5E7EB] shadow-2xs backdrop-blur-md relative"
            aria-label="Main Navigation"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {/* Catalog Mega-Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => {
                handleMouseEnterDropdown('catalog')
                setHoveredNav('catalog')
              }}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown((prev) => (prev === 'catalog' ? null : 'catalog'))}
                className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  activeDropdown === 'catalog' || location.pathname === '/products' || location.pathname === '/categories'
                    ? 'text-zinc-950 font-black'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Layers className={`h-3.5 w-3.5 transition-colors ${activeDropdown === 'catalog' ? 'text-[#D4AF65]' : 'text-zinc-400'}`} />
                <span>Catalog</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeDropdown === 'catalog' ? 'rotate-180 text-zinc-950' : 'text-zinc-400'
                  }`}
                />

                {/* Animated active/hover background pill */}
                {(hoveredNav === 'catalog' || activeDropdown === 'catalog') && (
                  <motion.div
                    layoutId="navHoverCapsule"
                    className="absolute inset-0 rounded-full bg-white shadow-xs border border-zinc-300/70 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
              </button>

              {/* Mega-Menu Dropdown Panel with High-Contrast Bento Layout */}
              <AnimatePresence>
                {activeDropdown === 'catalog' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-3 w-[min(940px,calc(100vw-48px))] rounded-3xl border border-zinc-200 bg-white/98 backdrop-blur-2xl p-6 shadow-[0_28px_64px_-12px_rgba(0,0,0,0.12)] z-50 text-zinc-900"
                  >
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left Spotlight Banner — Deep Obsidian & Electric Orange */}
                      <div className="col-span-4 rounded-2xl bg-[#101D35] p-5 flex flex-col justify-between text-white relative overflow-hidden shadow-xl border border-[#343D4F]/50">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-[#D4AF65]/15 blur-2xl pointer-events-none" />

                        <div className="relative z-10">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#D4AF65]">
                            <Sparkles className="h-2.5 w-2.5 text-[#D4AF65]" />
                            <span>Pressroom Master</span>
                          </div>
                          <h4 className="mt-3 text-base font-bold text-white tracking-tight leading-snug">
                            Commercial Precision &amp; Tactile Craft
                          </h4>
                          <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                            Heidelberg offset, HP Indigo digital, 24K hot foil stamping, and 700 GSM cotton stocks.
                          </p>

                          <div className="mt-4 pt-3.5 border-t border-zinc-800 space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                              Popular Categories
                            </span>
                            <Link
                              to="/business-card-printing-dubai"
                              onClick={() => setActiveDropdown(null)}
                              className="group flex items-center justify-between p-2.5 rounded-xl bg-[#0B1426] hover:bg-[#162544] border border-[#343D4F]/60 text-xs font-bold text-white transition-all"
                            >
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#D4AF65]" />
                                <span>Luxury Business Cards</span>
                              </span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                            </Link>
                            <Link
                              to="/categories/custom-stamps-seals"
                              onClick={() => setActiveDropdown(null)}
                              className="group flex items-center justify-between p-2.5 rounded-xl bg-[#0B1426] hover:bg-[#162544] border border-[#343D4F]/60 text-xs font-bold text-white transition-all"
                            >
                              <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span>Official Stamps &amp; Seals</span>
                              </span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                            </Link>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between relative z-10">
                          <Link
                            to="/products"
                            onClick={() => setActiveDropdown(null)}
                            className="text-xs font-black text-white hover:text-[#D4AF65] transition-colors flex items-center gap-1.5"
                          >
                            <span>Browse All 200+ Products</span>
                            <ArrowRight className="h-3.5 w-3.5 text-[#D4AF65]" />
                          </Link>
                        </div>
                      </div>

                      {/* Right Categories Grid */}
                      <div className="col-span-8 grid grid-cols-2 gap-x-4 gap-y-3 max-h-[390px] overflow-y-auto pr-1">
                        {megaMenuGroups.map((group) => {
                          const Icon = group.icon || Layers
                          return (
                            <div key={group.key} className="p-3 rounded-2xl bg-[#F5F2EB]/50 hover:bg-[#F5F2EB] border border-[#E5E7EB] transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#101D35] text-[#D4AF65] shrink-0">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <h5 className="text-xs font-bold text-zinc-950 truncate">
                                    {group.label}
                                  </h5>
                                </div>
                                {group.badge && (
                                  <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 text-[9px] font-bold text-zinc-700">
                                    {group.badge}
                                  </span>
                                )}
                              </div>

                              <ul className="space-y-1 pl-9">
                                {group.items.slice(0, 4).map((item) => (
                                  <li key={item.slug || item.id}>
                                    <Link
                                      to={`/categories/${item.slug}`}
                                      onClick={() => setActiveDropdown(null)}
                                      className="group/link flex items-center justify-between text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors py-0.5"
                                    >
                                      <span className="truncate group-hover/link:translate-x-0.5 transition-transform">{item.name}</span>
                                      <ChevronRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 text-[#D4AF65] transition-opacity shrink-0" />
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
              onMouseEnter={() => setHoveredNav('cards')}
              className={({ isActive }) =>
                `relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-zinc-950 font-black' : 'text-zinc-600 hover:text-zinc-950'
                }`
              }
            >
              <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
              <span>Cards</span>
              <span className="rounded-full bg-[#D4AF65] text-[#101D35] px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider">
                DUBAI
              </span>

              {hoveredNav === 'cards' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-white shadow-xs border border-zinc-300/70 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </NavLink>

            {/* Stamps & Seals */}
            <NavLink
              to="/categories/custom-stamps-seals"
              onMouseEnter={() => setHoveredNav('stamps')}
              className={({ isActive }) =>
                `relative z-10 hidden xl:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-zinc-950 font-black' : 'text-zinc-600 hover:text-zinc-950'
                }`
              }
            >
              <Stamp className="h-3.5 w-3.5 text-zinc-400" />
              <span>Stamps</span>
              <span className="rounded-full bg-zinc-200 text-zinc-800 px-1.5 py-0.2 text-[8px] font-black uppercase">
                2H
              </span>

              {hoveredNav === 'stamps' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-white shadow-xs border border-zinc-300/70 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </NavLink>

            {/* Stickers & Labels */}
            <NavLink
              to="/categories/stickers-printing-dubai"
              onMouseEnter={() => setHoveredNav('stickers')}
              className={({ isActive }) =>
                `relative z-10 hidden 2xl:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-zinc-950 font-black' : 'text-zinc-600 hover:text-zinc-950'
                }`
              }
            >
              <Tag className="h-3.5 w-3.5 text-zinc-400" />
              <span>Stickers</span>

              {hoveredNav === 'stickers' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-white shadow-xs border border-zinc-300/70 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </NavLink>

            {/* Rollup Banners */}
            <NavLink
              to="/categories/roll-up-banners-dubai"
              onMouseEnter={() => setHoveredNav('banners')}
              className={({ isActive }) =>
                `relative z-10 hidden 2xl:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-zinc-950 font-black' : 'text-zinc-600 hover:text-zinc-950'
                }`
              }
            >
              <Layers className="h-3.5 w-3.5 text-zinc-400" />
              <span>Banners</span>

              {hoveredNav === 'banners' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-white shadow-xs border border-zinc-300/70 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </NavLink>

            {/* Services Link */}
            <NavLink
              to="/services"
              onMouseEnter={() => setHoveredNav('services')}
              className={({ isActive }) =>
                `relative z-10 hidden xl:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-zinc-950 font-black' : 'text-zinc-600 hover:text-zinc-950'
                }`
              }
            >
              <Palette className="h-3.5 w-3.5 text-zinc-400" />
              <span>Services</span>

              {hoveredNav === 'services' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-white shadow-xs border border-zinc-300/70 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </NavLink>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                handleMouseEnterDropdown('company')
                setHoveredNav('company')
              }}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown((prev) => (prev === 'company' ? null : 'company'))}
                className={`relative z-10 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  activeDropdown === 'company' || ['/services', '/about', '/blog', '/contact'].includes(location.pathname)
                    ? 'text-zinc-950 font-black'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <span>Company</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeDropdown === 'company' ? 'rotate-180 text-zinc-950' : 'text-zinc-400'
                  }`}
                />

                {(hoveredNav === 'company' || activeDropdown === 'company') && (
                  <motion.div
                    layoutId="navHoverCapsule"
                    className="absolute inset-0 rounded-full bg-white shadow-xs border border-zinc-300/70 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
              </button>

              <AnimatePresence>
                {activeDropdown === 'company' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 rounded-2xl border border-zinc-200 bg-white/98 backdrop-blur-2xl p-2 shadow-xl z-50 text-zinc-800"
                  >
                    <Link
                      to="/services"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                    >
                      <Sparkles className="h-4 w-4 text-[#D4AF65]" />
                      <div>
                        <div className="leading-tight">All Printing Services</div>
                        <span className="text-[10px] font-normal text-zinc-400">Offset, Digital &amp; Large Format</span>
                      </div>
                    </Link>

                    <Link
                      to="/about"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-zinc-400" />
                      <div>
                        <div className="leading-tight">About ONPRINT</div>
                        <span className="text-[10px] font-normal text-zinc-400">Dubai Pressroom &amp; Plant</span>
                      </div>
                    </Link>

                    <Link
                      to="/blog"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-zinc-400" />
                      <div>
                        <div className="leading-tight">Printing Insights</div>
                        <span className="text-[10px] font-normal text-zinc-400">Paper stocks &amp; finishing</span>
                      </div>
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-zinc-400" />
                      <div>
                        <div className="leading-tight">Contact &amp; Location</div>
                        <span className="text-[10px] font-normal text-zinc-400">Al Quoz Industrial 4, Dubai</span>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Search Capsule Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F5F2EB]/60 hover:bg-white hover:border-[#D4AF65]/60 px-3 py-1.5 text-xs text-[#343D4F] transition-all cursor-pointer group"
              title="Search products (Press / or ⌘K)"
            >
              <Search className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
              <span className="hidden xl:inline text-[11px] font-medium text-zinc-500">Search catalog...</span>
              <kbd className="hidden xl:inline-block rounded-md bg-white border border-zinc-200 px-1.5 py-0.5 text-[9px] font-bold text-zinc-500 shadow-2xs">
                ⌘K
              </kbd>
            </motion.button>

            {/* Track Orders / Shopping Bag Button */}
            <Link
              to="/track-order"
              className="hidden sm:flex relative h-8.5 w-8.5 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F5F2EB]/60 text-[#343D4F] hover:bg-white hover:text-[#101D35] transition-all shadow-2xs"
              title="Track Orders"
            >
              <Truck className="h-4 w-4" />
            </Link>

            {/* Direct 1-Click WhatsApp CTA + Concierge Popover Toggle */}
            <div className="relative flex items-center">
              <div className="inline-flex items-center rounded-full border border-emerald-300/80 bg-emerald-50/80 shadow-2xs overflow-hidden">
                <a
                  href={getServiceWhatsAppUrl(location.pathname)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: location.pathname,
                      button_location: 'site_header_primary',
                      label: 'header_whatsapp_direct',
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-950 hover:bg-[#25D366] hover:text-white transition-colors cursor-pointer"
                  aria-label="Get Price on WhatsApp"
                  title="Chat directly on WhatsApp"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
                  <span className="inline text-[11px] font-extrabold">WhatsApp</span>
                  <span className="relative flex h-2 w-2 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setWhatsappPopoverOpen((v) => !v)
                    setUserMenuOpen(false)
                  }}
                  className={`px-1.5 py-1.5 border-l border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer ${
                    whatsappPopoverOpen ? 'bg-emerald-200/70' : ''
                  }`}
                  aria-label="Show WhatsApp hotline number"
                  title="View & copy WhatsApp number"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              {/* WhatsApp Dropdown Popover */}
              <AnimatePresence>
                {whatsappPopoverOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-full mt-2.5 w-72 sm:w-76 rounded-2xl border border-zinc-200 bg-white/98 backdrop-blur-2xl p-4 shadow-2xl z-50 text-zinc-800"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs">
                          <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-950 leading-tight">WhatsApp Concierge</div>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Online • Instant Turnaround</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWhatsappPopoverOpen(false)}
                        className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-200/80 mb-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Direct Hotline</span>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-black tracking-tight text-zinc-950">{FORMATTED_PHONE}</span>
                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-zinc-700 shadow-2xs border border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-zinc-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <a
                      href={getServiceWhatsAppUrl(location.pathname)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setWhatsappPopoverOpen(false)
                        trackWhatsAppClick({
                          source_page: location.pathname,
                          button_location: 'header_concierge_popover',
                          label: 'header_concierge_start_chat',
                        })
                      }}
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
                  className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer shadow-2xs"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 text-white text-[10px] font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="hidden xl:inline max-w-[70px] truncate">{user?.name || 'Admin'}</span>
                  <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2.5 w-52 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 text-zinc-800"
                    >
                      <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                        <div className="font-bold text-xs text-zinc-950 truncate">{user?.name || 'Administrator'}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{user?.email}</div>
                      </div>

                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-zinc-400" />
                        <span>Admin Dashboard</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1 border-t border-zinc-100 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            {/* Primary High-Converting CTA Button: Minimal Obsidian Pill */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/get-a-quote"
                className="group/cta relative inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#D4AF65] hover:bg-[#B89245] px-4 sm:px-5 py-2 text-xs font-black text-[#101D35] shadow-sm hover:shadow-md transition-all whitespace-nowrap overflow-hidden"
                onClick={() => trackGetQuoteClick({ source_page: 'header_desktop' })}
              >
                <span>Get Instant Quote</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-1" />
              </Link>
            </motion.div>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. UNIVERSAL SEARCH MODAL WITH SPRING ANIMATION */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-zinc-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl text-zinc-800"
            >
              {/* Search Bar Input */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="h-5 w-5 text-[#D4AF65]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 200+ products, categories, or luxury finishes..."
                    className="w-full bg-transparent text-sm sm:text-base font-semibold text-zinc-950 placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
                {searchQuery.trim() === '' ? (
                  <div className="py-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-2.5">
                      Popular Print Categories in Dubai
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <Link
                        to="/business-card-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 text-xs font-bold text-zinc-800 transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:text-zinc-950 transition-colors">Business Cards</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-950" />
                      </Link>
                      <Link
                        to="/categories/custom-stamps-seals"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 text-xs font-bold text-zinc-800 transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:text-zinc-950 transition-colors">Stamps &amp; Seals</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-950" />
                      </Link>
                      <Link
                        to="/categories/letterheads-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 text-xs font-bold text-zinc-800 transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:text-zinc-950 transition-colors">Letterheads</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-950" />
                      </Link>
                      <Link
                        to="/categories/stickers-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 text-xs font-bold text-zinc-800 transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:text-zinc-950 transition-colors">Stickers &amp; Labels</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-950" />
                      </Link>
                      <Link
                        to="/categories/brochures-printing"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 text-xs font-bold text-zinc-800 transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:text-zinc-950 transition-colors">Brochures &amp; Flyers</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-950" />
                      </Link>
                      <Link
                        to="/categories/mug-printing-dubai"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 text-xs font-bold text-zinc-800 transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:text-zinc-950 transition-colors">Corporate Gifts</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-950" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {searchResults.products.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF65] block mb-2">
                          Matching Products ({searchResults.products.length})
                        </span>
                        <div className="space-y-1.5">
                          {searchResults.products.map((p) => (
                            <Link
                              key={p._id || p.id}
                              to={`/products/${p.slug}`}
                              onClick={() => setSearchModalOpen(false)}
                              className="group flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 hover:border-zinc-950 hover:bg-zinc-50 transition-all"
                            >
                              <div>
                                <h6 className="text-xs font-bold text-zinc-950 group-hover:text-[#D4AF65] transition-colors">{p.name}</h6>
                                <p className="text-[10px] text-zinc-400 line-clamp-1">{p.shortDescription}</p>
                              </div>
                              <span className="text-xs font-black text-zinc-950">
                                {p.price ? `${p.price} AED` : 'Quote'}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.categories.length > 0 && (
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
                          Matching Categories
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {searchResults.categories.map((c) => (
                            <Link
                              key={c.id || c._id}
                              to={`/categories/${c.slug}`}
                              onClick={() => setSearchModalOpen(false)}
                              className="p-2.5 rounded-xl border border-zinc-200 hover:border-zinc-950 text-xs font-bold text-zinc-800 hover:text-zinc-950 transition-colors"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.products.length === 0 && searchResults.categories.length === 0 && (
                      <div className="py-8 text-center">
                        <p className="text-xs text-zinc-500">No direct matches found for "{searchQuery}".</p>
                        <Link
                          to={`/products?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setSearchModalOpen(false)}
                          className="mt-2 inline-block text-xs font-bold text-[#D4AF65] underline"
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

      {/* 4. MODERN MOBILE & TABLET DRAWER WITH STAGGERED SPRING ANIMATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl z-50 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 p-4 shrink-0">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <Logo variant="default" size="sm" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
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
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#D4AF65]" />
                    <span>Search 200+ print products...</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                </button>

                {/* WhatsApp Concierge Card */}
                <a
                  href={getServiceWhatsAppUrl('general')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    trackWhatsAppClick({ source_page: 'header_mobile_menu', service: 'general', button_location: 'mobile_concierge' })
                  }}
                  className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-950 transition-all shadow-xs"
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
                      <span className="text-[11px] font-bold text-emerald-800">{FORMATTED_PHONE}</span>
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
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <span>Home</span>
                  </Link>

                  {/* Business Cards (Highlighted) */}
                  <Link
                    to="/business-card-printing-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-950 bg-zinc-100"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-[#D4AF65]" />
                      <span>Business Cards</span>
                    </div>
                    <span className="rounded bg-[#D4AF65] text-[#101D35] px-1.5 py-0.5 text-[9px] font-black uppercase">
                      DUBAI
                    </span>
                  </Link>

                  {/* Stamps & Seals */}
                  <Link
                    to="/categories/custom-stamps-seals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <div className="flex items-center gap-2">
                      <Stamp className="h-4 w-4 text-zinc-400" />
                      <span>Company Stamps &amp; Seals</span>
                    </div>
                    <span className="rounded bg-zinc-200 text-zinc-800 px-1.5 py-0.5 text-[9px] font-black uppercase">
                      2H
                    </span>
                  </Link>

                  {/* Stickers */}
                  <Link
                    to="/categories/stickers-printing-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-zinc-400" />
                      <span>Stickers &amp; Labels</span>
                    </div>
                  </Link>

                  {/* Rollup Banners */}
                  <Link
                    to="/categories/roll-up-banners-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-zinc-400" />
                      <span>Roll-Up Banners</span>
                    </div>
                  </Link>

                  {/* Letterheads & Stationery */}
                  <Link
                    to="/categories/letterheads-printing-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <span>Letterheads &amp; Stationery</span>
                    </div>
                  </Link>

                  {/* Product Catalog Accordion */}
                  <div className="border-t border-b border-zinc-100 py-1 my-1">
                    <button
                      type="button"
                      onClick={() => setMobileAccordion((p) => ({ ...p, catalog: !p.catalog }))}
                      className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-zinc-950" />
                        <span>All Print Categories</span>
                      </div>
                      {mobileAccordion.catalog ? (
                        <Minus className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <Plus className="h-4 w-4 text-zinc-400" />
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
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-100"
                          >
                            <span>Browse All Products Catalog</span>
                            <ArrowRight className="h-3 w-3 text-[#D4AF65]" />
                          </Link>
                          {categories.slice(0, 10).map((cat) => (
                            <Link
                              key={cat.slug || cat.id}
                              to={`/categories/${cat.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                            >
                              <span>{cat.name}</span>
                              <ChevronRight className="h-3 w-3 text-zinc-300" />
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
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-zinc-400" />
                      <span>Printing Services &amp; Finishes</span>
                    </div>
                  </Link>

                  {/* About */}
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-zinc-400" />
                      <span>About ONPRINT Pressroom</span>
                    </div>
                  </Link>

                  {/* Blog */}
                  <Link
                    to="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-zinc-400" />
                      <span>Blog &amp; Insights</span>
                    </div>
                  </Link>

                  {/* Contact */}
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-zinc-400" />
                      <span>Contact &amp; Pressroom</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-zinc-200 p-4 space-y-2 shrink-0 bg-zinc-50">
                <a
                  href={getServiceWhatsAppUrl(location.pathname)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    trackWhatsAppClick({
                      source_page: location.pathname,
                      button_location: 'header_mobile_drawer',
                      label: 'mobile_drawer_whatsapp',
                    })
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition-all"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                  <span>Get Price on WhatsApp</span>
                </a>

                <Link
                  to="/get-a-quote"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    trackGetQuoteClick({ source_page: 'header_mobile_drawer' })
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF65] hover:bg-[#B89245] py-3 text-sm font-black text-[#101D35] shadow-md transition-all"
                >
                  <span>Get Instant Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs"
                >
                  <Truck className="h-4 w-4 text-zinc-950" />
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
