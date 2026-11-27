import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MapPin,
  Truck,
  Phone,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Menu,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  Briefcase,
  Megaphone,
  Tag,
  Stamp,
  Package,
  HelpCircle,
  Building2,
  Clock,
  Layers,
  BookOpen,
  Info,
  Send,
  ExternalLink,
} from 'lucide-react'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import WhatsAppIcon from './WhatsAppIcon'
import { trackGetQuoteClick, trackWhatsAppClick } from '../utils/analytics'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'
import { FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../utils/whatsapp'

// ---------------------------------------------------------------------------
// 1. STRUCTURED MEGA MENU DEPARTMENTS (Catalog)
// ---------------------------------------------------------------------------
const MEGA_MENU_CATEGORIES = [
  {
    key: 'business-corporate',
    title: 'Business & Corporate Printing',
    subtitle: 'Executive Identity & Presswork',
    icon: Briefcase,
    overviewPath: '/categories/office-stationery-printing',
    items: [
      {
        label: 'Business Cards',
        to: '/business-card-printing-dubai',
        badge: 'Popular',
        desc: '350–450 GSM matte, gloss & silk cards',
      },
      {
        label: 'Premium Business Cards',
        to: '/premium-business-cards',
        badge: 'Luxury',
        desc: '600 GSM cotton, 24K foil & 3D spot UV',
      },
      {
        label: 'Corporate Stationery',
        to: '/categories/office-stationery-printing',
        desc: 'Complete brand stationery suites',
      },
      {
        label: 'Letterheads',
        to: '/categories/letterheads-printing-dubai',
        desc: '120 GSM laser-safe Conqueror & bond',
      },
      {
        label: 'Corporate Envelopes',
        to: '/products/matching-corporate-envelopes',
        desc: 'Custom DL, C5 & C4 window envelopes',
      },
      {
        label: 'Presentation Folders & NCR',
        to: '/products/corporate-presentation-folders',
        desc: 'Die-cut pocket folders & invoice books',
      },
      {
        label: 'PVC ID Cards & Lanyards',
        to: '/categories/id-card-printing-dubai',
        desc: 'CR80 smart cards & sublimated lanyards',
      },
    ],
  },
  {
    key: 'marketing-promotional',
    title: 'Marketing & Promotional',
    subtitle: 'Campaigns, Events & Displays',
    icon: Megaphone,
    overviewPath: '/categories/flyers-printing-in-dubai',
    items: [
      {
        label: 'Flyers & Leaflets',
        to: '/categories/flyers-printing-in-dubai',
        badge: 'Express',
        desc: 'A6, A5, A4 & DL high-speed handouts',
      },
      {
        label: 'Folded Brochures',
        to: '/brochure-printing-dubai',
        desc: 'Bi-fold, tri-fold & Z-fold company profiles',
      },
      {
        label: 'Large Format Posters',
        to: '/products/large-format-posters',
        desc: 'A3, A2, A1 & A0 high-resolution prints',
      },
      {
        label: 'Roll-Up Banners',
        to: '/services/rollup-banners',
        badge: 'Same-Day',
        desc: '85×200cm curl-free stands with bag',
      },
      {
        label: 'Catalogs & Booklets',
        to: '/categories/catalogs-booklets-printing',
        desc: 'Saddle-stitched & PUR bound catalogs',
      },
      {
        label: 'Hospitality Menus',
        to: '/categories/hospitality-event-printing',
        desc: 'Waterproof café menus & tent cards',
      },
    ],
  },
  {
    key: 'stickers-labels',
    title: 'Stickers & Labels',
    subtitle: 'Waterproof Vinyl & Packaging Rolls',
    icon: Tag,
    overviewPath: '/sticker-printing-dubai',
    items: [
      {
        label: 'Custom Stickers',
        to: '/sticker-printing-dubai',
        badge: 'Bestseller',
        desc: 'All custom shapes, finishes & sizes',
      },
      {
        label: 'Product Roll Labels',
        to: '/products/custom-roll-labels',
        desc: 'Machine & hand-dispensed BOPP rolls',
      },
      {
        label: 'Vinyl Stickers',
        to: '/products/waterproof-vinyl-stickers',
        badge: 'Waterproof',
        desc: 'UV-resistant outdoor & jar vinyl',
      },
      {
        label: 'Die-Cut Stickers',
        to: '/products/die-cut-stickers',
        desc: 'Precision optical contour-cut brand decals',
      },
      {
        label: 'Custom Packaging Labels',
        to: '/products/cosmetic-bottle-labels',
        desc: 'Oil-proof jar & retail box seals',
      },
      {
        label: 'Gold Foil & Clear Labels',
        to: '/products/gold-foil-stickers',
        desc: 'Metallic hot-stamped & clear labels',
      },
    ],
  },
  {
    key: 'stamps-seals',
    title: 'Stamps & Seals',
    subtitle: 'Official UAE Company Seals',
    icon: Stamp,
    overviewPath: '/categories/stamps-printing-dubai',
    items: [
      {
        label: 'Company Stamps',
        to: '/categories/stamps-printing-dubai',
        badge: 'DED Approved',
        desc: 'Official Arabic/English mainland & freezone',
      },
      {
        label: 'Self-Inking Stamps',
        to: '/products/self-inking-company-stamps',
        desc: 'Original Trodat 10,000+ impressions',
      },
      {
        label: 'Rubber & Dater Stamps',
        to: '/products/heavy-duty-dater-stamps',
        desc: 'Heavy-duty steel frame date stamps',
      },
      {
        label: 'Pocket Mobile Stamps',
        to: '/products/pocket-mobile-stamps',
        desc: 'Compact flip-open stamps for executives',
      },
      {
        label: 'Custom Brass Wax Seals',
        to: '/products/luxury-brass-wax-seal-stamps',
        badge: 'Bespoke',
        desc: '3D CNC-engraved brass seals & embossers',
      },
    ],
  },
  {
    key: 'packaging-custom',
    title: 'Packaging & Custom Printing',
    subtitle: 'Bottles, Boxes, Merch & Finishes',
    icon: Package,
    overviewPath: '/services/luxury-packaging-custom-boxes',
    items: [
      {
        label: 'Bottle Printing',
        to: '/bottle-printing-dubai',
        badge: '360° UV',
        desc: 'Thermal bottles, LED flasks & tumblers',
      },
      {
        label: 'Custom Luxury Packaging',
        to: '/services/luxury-packaging-custom-boxes',
        desc: 'Magnetic rigid boxes & mailers',
      },
      {
        label: 'Custom Ceramic Mugs',
        to: '/categories/mug-printing-dubai',
        desc: 'Dishwasher-safe corporate & photo mugs',
      },
      {
        label: 'Name Badges & Plaques',
        to: '/categories/name-badges-printing-dubai',
        desc: 'Magnetic brushed gold/silver staff badges',
      },
      {
        label: 'Signage & Flags',
        to: '/categories/signage-banners-printing',
        desc: 'Acrylic letters, backdrops & flags',
      },
      {
        label: 'Corporate Gifts & Apparel',
        to: '/categories/corporate-gift-items',
        desc: 'VIP onboarding kits, polo shirts & merch',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// 2. COMPANY DROPDOWN LINKS
// ---------------------------------------------------------------------------
const COMPANY_LINKS = [
  {
    label: 'About ONPRINT',
    to: '/about',
    desc: 'Commercial pressroom atelier in Al Quoz, Dubai',
    icon: Info,
  },
  {
    label: 'Printing Services',
    to: '/services',
    desc: 'Complete overview of offset & digital press services',
    icon: Layers,
  },
  {
    label: 'Portfolio Showcase',
    to: '/portfolio',
    desc: 'Selected client works, luxury cards & packaging',
    icon: Sparkles,
  },
  {
    label: 'Technical Print Blog',
    to: '/blog',
    desc: 'Expert paper specs, GSM guide & luxury finishes',
    icon: BookOpen,
  },
  {
    label: 'Contact Pressroom',
    to: '/contact',
    desc: 'Al Quoz facility address, pre-press consultations',
    icon: Send,
  },
  {
    label: 'FAQ & Specifications',
    to: '/faq',
    desc: 'Turnaround, artwork setup, bleed & delivery',
    icon: HelpCircle,
  },
]

// 4. POPULAR SEARCH SUGGESTIONS
// ---------------------------------------------------------------------------
const POPULAR_SEARCHES = [
  { label: 'Luxury Foil Business Cards', to: '/premium-business-cards' },
  { label: 'Waterproof Vinyl Stickers', to: '/sticker-printing-dubai' },
  { label: 'Roll-Up Banner 85×200cm', to: '/services/rollup-banners' },
  { label: 'Official Company Stamp', to: '/categories/stamps-printing-dubai' },
  { label: 'Custom Bottle Printing', to: '/bottle-printing-dubai' },
  { label: 'Luxury Paper Finishes', to: '/finishes' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false)
  const [supportMenuOpen, setSupportMenuOpen] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  // Mobile Accordion States
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false)

  // Universal Search Modal State
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const searchInputRef = useRef(null)

  // Refs for click outside
  const headerRef = useRef(null)
  const supportRef = useRef(null)
  const companyRef = useRef(null)
  const megaRef = useRef(null)
  const megaTimeoutRef = useRef(null)

  const location = useLocation()

  // Scroll listener for sticky compact glass transition
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled((prev) => (prev ? y > 12 : y > 24))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
    setCompanyMenuOpen(false)
    setSupportMenuOpen(false)
    setSearchOpen(false)
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current)
  }, [location.pathname])

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (supportRef.current && !supportRef.current.contains(e.target)) {
        setSupportMenuOpen(false)
      }
      if (companyRef.current && !companyRef.current.contains(e.target)) {
        setCompanyMenuOpen(false)
      }
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard escape & search shortcut (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMegaMenuOpen(false)
        setCompanyMenuOpen(false)
        setSupportMenuOpen(false)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto focus search input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 60)
      return () => clearTimeout(timer)
    }
  }, [searchOpen])

  // Prevent scroll when search or mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, searchOpen])

  // Lazy load categories & products for Universal Search
  const searchDataLoadedRef = useRef(false)
  const loadSearchData = async () => {
    if (searchDataLoadedRef.current) return
    searchDataLoadedRef.current = true
    try {
      const [catRes, prodRes] = await Promise.all([
        getCategories({ status: 'active' }),
        getProducts({ status: 'active', limit: 150 }),
      ])
      if (catRes?.success) setCategories(catRes.data.categories || [])
      if (prodRes?.success) setProducts(prodRes.data.products || [])
    } catch {
      searchDataLoadedRef.current = false
    }
  }

  useEffect(() => {
    if (searchOpen) loadSearchData()
  }, [searchOpen])

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return { matchedCategories: [], matchedProducts: [], matchedMenuLinks: [] }

    const matchedCategories = categories
      .filter((c) => c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q))
      .slice(0, 4)

    const matchedProducts = products
      .filter((p) => p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q))
      .slice(0, 6)

    const allLinks = MEGA_MENU_CATEGORIES.flatMap((c) =>
      c.items.map((item) => ({ ...item, groupTitle: c.title }))
    )
    const matchedMenuLinks = allLinks
      .filter((item) => item.label.toLowerCase().includes(q) || item.desc?.toLowerCase().includes(q))
      .slice(0, 5)

    return { matchedCategories, matchedProducts, matchedMenuLinks }
  }, [searchQuery, categories, products])

  const handleCopyPhone = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(FORMATTED_PHONE)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  const isCatalogActive = () => {
    const path = location.pathname
    return (
      path === '/products' ||
      path === '/categories' ||
      path.startsWith('/products/') ||
      (path.startsWith('/categories/') && !path.includes('stamps-printing-dubai'))
    )
  }

  const isCompanyActive = () => {
    return ['/about', '/services', '/portfolio', '/blog', '/contact', '/faq'].some((p) =>
      location.pathname.startsWith(p)
    )
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full pt-2 sm:pt-3 pb-2 px-3 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none select-none"
    >
      <div className="mx-auto max-w-[1360px] flex flex-col items-center">
        {/* =================================================================== */}
        {/* 1. TOP INFORMATION SYSTEM — TRANSLUCENT GLASS UTILITY STRIP         */}
        {/* =================================================================== */}
        <div
          className={`hidden md:flex items-center justify-between w-full max-w-[1320px] px-5 py-1.5 rounded-full bg-[#101D35]/70 backdrop-blur-xl border border-[#D4AF65]/25 text-[#F5F2EB] shadow-[0_4px_24px_rgba(16,29,53,0.35)] text-[11px] font-medium transition-all duration-300 pointer-events-auto mb-2 relative z-20 ${
            scrolled ? 'max-h-0 opacity-0 -translate-y-2 pointer-events-none overflow-hidden mb-0 py-0 border-0' : 'max-h-10 opacity-100 translate-y-0'
          }`}
        >
          {/* Left Side: Dispatch & Delivery Badges */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-white/90 font-semibold truncate">
              <MapPin className="h-3 w-3 text-[#D4AF65] shrink-0" />
              <span>Dubai, UAE</span>
            </span>
            <span className="text-[#D4AF65]/50">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#F5F2EB]/85 font-medium truncate">
              <span>Doorstep Express Dispatch</span>
            </span>
            <span className="text-[#D4AF65]/50">•</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold truncate">
              <Truck className="h-3 w-3 text-emerald-400 shrink-0" />
              <span>Doorstep UAE Delivery</span>
            </span>
            <span className="text-[#D4AF65]/50">•</span>
            <span className="inline-flex items-center gap-1 text-[#D4AF65] font-semibold truncate">
              <Clock className="h-3 w-3 text-[#D4AF65] shrink-0" />
              <span>Express 24h Turnaround</span>
            </span>
          </div>

          {/* Right Side: Hotline & Help & Support Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Direct Clickable Hotline */}
            <a
              href={`https://wa.me/${RAW_WHATSAPP_NUMBER}?text=Hi%20ONPRINT%20Hotline,%20I%20have%20an%20urgent%20print%20inquiry`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('header_top_hotline')}
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-[#D4AF65] transition-colors font-semibold group"
              title="Direct Al Quoz Press Hotline"
            >
              <Phone className="h-3 w-3 text-[#D4AF65] group-hover:scale-110 transition-transform" />
              <span>Hotline: <span className="text-[#D4AF65] font-mono tracking-wide">{FORMATTED_PHONE}</span></span>
            </a>

            <span className="text-[#D4AF65]/50">•</span>

            {/* Help & Support Dropdown Trigger */}
            <div ref={supportRef} className="relative">
              <button
                type="button"
                onClick={() => setSupportMenuOpen(!supportMenuOpen)}
                className="inline-flex items-center gap-1 text-white/90 hover:text-[#D4AF65] font-semibold transition-colors cursor-pointer"
                aria-expanded={supportMenuOpen}
              >
                <HelpCircle className="h-3 w-3 text-[#D4AF65]" />
                <span>Help &amp; Support</span>
                <ChevronDown
                  className={`h-3 w-3 text-white/60 transition-transform duration-200 ${
                    supportMenuOpen ? 'rotate-180 text-[#D4AF65]' : ''
                  }`}
                />
              </button>

              {/* Help & Support Dropdown Panel */}
              <AnimatePresence>
                {supportMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#101D35]/95 backdrop-blur-2xl border border-[#D4AF65]/35 shadow-[0_20px_45px_rgba(16,29,53,0.65)] p-2.5 z-50 text-white"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF65] block">
                        Assistance &amp; Tracking
                      </span>
                    </div>

                    <div className="space-y-1">
                      {/* 1. Hotline item with copy button */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <a
                          href={`https://wa.me/${RAW_WHATSAPP_NUMBER}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 min-w-0"
                        >
                          <div className="h-7 w-7 rounded-lg bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0">
                            <Phone className="h-3.5 w-3.5 text-[#D4AF65]" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block">Hotline Concierge</span>
                            <span className="text-[10px] text-[#F5F2EB]/75 font-mono block truncate">
                              {FORMATTED_PHONE}
                            </span>
                          </div>
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyPhone}
                          title="Copy Phone Number"
                          className="h-6 w-6 rounded-md bg-white/10 hover:bg-[#D4AF65]/20 hover:text-[#D4AF65] text-white/70 flex items-center justify-center shrink-0 transition-colors"
                        >
                          {copiedPhone ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>

                      {/* 2. Corporate Quotes */}
                      <Link
                        to="/corporate-quotes"
                        onClick={() => setSupportMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                      >
                        <div className="h-7 w-7 rounded-lg bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF65] transition-colors">
                          <Building2 className="h-3.5 w-3.5 text-[#D4AF65] group-hover:text-[#101D35] transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-[#D4AF65] transition-colors block">
                            Corporate Quotes
                          </span>
                          <span className="text-[10px] text-[#F5F2EB]/70 block truncate">
                            B2B contracts &amp; volume pricing
                          </span>
                        </div>
                      </Link>

                      {/* 3. Order Update */}
                      <Link
                        to="/track-order"
                        onClick={() => setSupportMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                      >
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors">
                          <Truck className="h-3.5 w-3.5 text-emerald-400 group-hover:text-[#101D35] transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block">
                            Order Update
                          </span>
                          <span className="text-[10px] text-[#F5F2EB]/70 block truncate">
                            Ask our team for an order update via WhatsApp
                          </span>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. MAIN FLOATING GLASSMORPHISM CAPSULE NAVBAR                        */}
        {/* =================================================================== */}
        <nav
          aria-label="Main Navigation"
          className={`pointer-events-auto w-full max-w-[1360px] relative rounded-full bg-[#101D35]/80 backdrop-blur-2xl border border-[#D4AF65]/30 shadow-[0_12px_42px_rgba(16,29,53,0.4)] transition-all duration-300 ring-1 ring-white/10 flex items-center justify-between ${
            scrolled
              ? 'h-14 sm:h-14.5 px-3.5 sm:px-6 shadow-[0_16px_50px_rgba(16,29,53,0.55)] border-[#D4AF65]/45 bg-[#101D35]/88'
              : 'h-16 sm:h-17 px-4 sm:px-6'
          } before:absolute before:inset-x-8 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:pointer-events-none`}
        >
          {/* --------------------------------------------------------------- */}
          {/* LEFT: BRAND LOGO                                                */}
          {/* --------------------------------------------------------------- */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2 group cursor-pointer focus:outline-none"
              aria-label="ONPRINT Dubai Homepage"
            >
              <Logo
                variant="glass"
                size={scrolled ? 'sm' : 'md'}
                className="site-header-logo transition-all duration-300"
              />
            </Link>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* CENTER: DESKTOP NAVIGATION ITEMS (Design 3 Spec)                */}
          {/* --------------------------------------------------------------- */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* 1. Catalog Dropdown Trigger */}
            <div
              ref={megaRef}
              className="relative"
              onMouseEnter={() => {
                if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current)
                loadSearchData()
                setMegaMenuOpen(true)
              }}
              onMouseLeave={() => {
                megaTimeoutRef.current = setTimeout(() => setMegaMenuOpen(false), 220)
              }}
            >
              <button
                type="button"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  megaMenuOpen || isCatalogActive()
                    ? 'text-[#D4AF65] bg-white/10 shadow-xs'
                    : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5'
                }`}
                aria-expanded={megaMenuOpen}
              >
                <span>Catalog</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#D4AF65] transition-transform duration-200 ${
                    megaMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Glass Mega Menu Dropdown */}
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: 0.18 }}
                    className="fixed left-1/2 -translate-x-1/2 top-full mt-2.5 w-[min(1240px,96vw)] max-h-[82vh] overflow-y-auto rounded-3xl bg-[#101D35]/95 backdrop-blur-2xl border border-[#D4AF65]/35 shadow-[0_25px_80px_rgba(16,29,53,0.75)] p-5 xl:p-6 z-50 text-white"
                  >
                    {/* Top Mega Menu Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#D4AF65] animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
                          Commercial Print Disciplines &amp; Catalog
                        </span>
                      </div>
                      <Link
                        to="/products"
                        onClick={() => setMegaMenuOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#F5F2EB] hover:text-[#D4AF65] transition-colors group"
                      >
                        <span>View All Catalog Products</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4AF65] group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* 5 Departments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 xl:gap-5">
                      {MEGA_MENU_CATEGORIES.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <div
                            key={cat.key}
                            className="flex flex-col rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#D4AF65]/40 p-3.5 transition-all duration-200"
                          >
                            <Link
                              to={cat.overviewPath}
                              onClick={() => setMegaMenuOpen(false)}
                              className="flex items-start gap-2.5 mb-3 group"
                            >
                              <div className="h-8 w-8 rounded-xl bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF65] transition-colors">
                                <Icon className="h-4 w-4 text-[#D4AF65] group-hover:text-[#101D35] transition-colors" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xs font-black text-white group-hover:text-[#D4AF65] transition-colors leading-snug">
                                  {cat.title}
                                </h3>
                                <p className="text-[10px] text-[#F5F2EB]/65 truncate">
                                  {cat.subtitle}
                                </p>
                              </div>
                            </Link>

                            <ul className="space-y-1.5 flex-1">
                              {cat.items.map((item) => (
                                <li key={item.label}>
                                  <Link
                                    to={item.to}
                                    onClick={() => setMegaMenuOpen(false)}
                                    className="group/item flex items-baseline justify-between p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                  >
                                    <div className="min-w-0 pr-1">
                                      <span className="text-[11px] font-semibold text-[#F5F2EB]/90 group-hover/item:text-[#D4AF65] transition-colors block truncate">
                                        {item.label}
                                      </span>
                                    </div>
                                    {item.badge && (
                                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#D4AF65]/20 text-[#D4AF65] border border-[#D4AF65]/30 shrink-0">
                                        {item.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>

                    {/* Bottom Quick Bar */}
                    <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#F5F2EB]/70 gap-3">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5 text-white/90 font-medium">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Same-Day &amp; 24h Express Dubai Dispatch</span>
                        </span>
                        <span className="text-white/30">•</span>
                        <span className="inline-flex items-center gap-1.5 text-white/90 font-medium">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Direct Al Quoz Pressroom (Zero Broker Fees)</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to="/finishes"
                          onClick={() => setMegaMenuOpen(false)}
                          className="font-bold text-[#D4AF65] hover:underline"
                        >
                          Explore Luxury Finishes →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Business Cards Link */}
            <NavLink
              to="/business-card-printing-dubai"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-[#D4AF65] bg-white/10 shadow-xs'
                    : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5'
                }`
              }
            >
              Business Cards
            </NavLink>

            {/* 3. Stickers Link */}
            <NavLink
              to="/sticker-printing-dubai"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-[#D4AF65] bg-white/10 shadow-xs'
                    : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5'
                }`
              }
            >
              Stickers
            </NavLink>

            {/* 4. Stamps & Seals Link */}
            <NavLink
              to="/categories/stamps-printing-dubai"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-[#D4AF65] bg-white/10 shadow-xs'
                    : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5'
                }`
              }
            >
              Stamps &amp; Seals
            </NavLink>

            {/* 5. Finishes Link */}
            <NavLink
              to="/finishes"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-[#D4AF65] bg-white/10 shadow-xs'
                    : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5'
                }`
              }
            >
              Finishes
            </NavLink>

            {/* 6. Company Dropdown Trigger */}
            <div
              ref={companyRef}
              className="relative"
              onMouseEnter={() => setCompanyMenuOpen(true)}
              onMouseLeave={() => setCompanyMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  companyMenuOpen || isCompanyActive()
                    ? 'text-[#D4AF65] bg-white/10 shadow-xs'
                    : 'text-[#F5F2EB]/90 hover:text-[#D4AF65] hover:bg-white/5'
                }`}
                aria-expanded={companyMenuOpen}
              >
                <span>Company</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#D4AF65] transition-transform duration-200 ${
                    companyMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Company Dropdown Panel */}
              <AnimatePresence>
                {companyMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-[#101D35]/95 backdrop-blur-2xl border border-[#D4AF65]/35 shadow-[0_20px_50px_rgba(16,29,53,0.65)] p-2.5 z-50 text-white"
                  >
                    <div className="px-3 py-1.5 border-b border-white/10 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF65] block">
                        ONPRINT Dubai Pressfloor
                      </span>
                    </div>

                    <div className="space-y-1">
                      {COMPANY_LINKS.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setCompanyMenuOpen(false)}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                          >
                            <div className="h-7 w-7 rounded-lg bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF65] transition-colors mt-0.5">
                              <Icon className="h-3.5 w-3.5 text-[#D4AF65] group-hover:text-[#101D35] transition-colors" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white group-hover:text-[#D4AF65] transition-colors block">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-[#F5F2EB]/65 block truncate">
                                {item.desc}
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* RIGHT: CONTROLS, SEARCH, ARABIC, WHATSAPP, GET A QUOTE          */}
          {/* --------------------------------------------------------------- */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* 1. Universal Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              onMouseEnter={loadSearchData}
              onFocus={loadSearchData}
              aria-label="Search catalog"
              title="Search products (Press / or Ctrl+K)"
              className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-full border border-[#D4AF65]/30 bg-white/5 hover:bg-[#D4AF65]/20 hover:border-[#D4AF65]/60 text-[#F5F2EB] hover:text-[#D4AF65] transition-all duration-200 cursor-pointer shadow-xs shrink-0"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* 2. Arabic Language Switcher */}
            <div className="hidden sm:inline-flex">
              <LanguageSwitcher variant="glass" />
            </div>

            {/* 3. WhatsApp Direct Click-to-Chat Button */}
            <a
              href={`https://wa.me/${RAW_WHATSAPP_NUMBER}?text=Hi%20ONPRINT,%20I%20would%20like%20to%20inquire%20about%20commercial%20printing%20in%20Dubai`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('header_capsule')}
              title={`WhatsApp Concierge (+${RAW_WHATSAPP_NUMBER})`}
              aria-label="Direct WhatsApp Concierge"
              className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/25 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 transition-all duration-200 cursor-pointer shadow-xs shrink-0 group"
            >
              <WhatsAppIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </a>

            {/* 4. Get a Quote CTA Button (Design 3 Champagne Gold Specification) */}
            <Link
              to="/get-a-quote"
              onClick={() => trackGetQuoteClick('header_capsule_cta')}
              aria-label="Get a Quote"
              title="Get a Quote"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-full bg-[#D4AF65] hover:bg-[#c9a150] text-[#101D35] font-black text-xs sm:text-[13px] tracking-wide shadow-[0_0_20px_rgba(212,175,101,0.35)] hover:shadow-[0_0_28px_rgba(212,175,101,0.6)] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#101D35] shrink-0" />
              <span className="hidden sm:inline">Get a Quote</span>
            </Link>

            {/* 5. Mobile Hamburger Button (lg:hidden) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Drawer"
              className="lg:hidden inline-flex items-center justify-center h-8.5 w-8.5 rounded-full border border-[#D4AF65]/35 bg-white/5 hover:bg-[#D4AF65]/20 text-white hover:text-[#D4AF65] transition-all cursor-pointer shadow-xs shrink-0"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* ===================================================================== */}
      {/* 3. MOBILE SLIDE-OUT GLASSMORPHISM DRAWER                               */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-60 pointer-events-auto lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#101D35]/70 backdrop-blur-md"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-[#101D35]/95 backdrop-blur-2xl border-l border-[#D4AF65]/30 shadow-2xl text-white flex flex-col p-5 overflow-y-auto"
            >
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <Logo variant="glass" size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Navigation"
                  className="h-8.5 w-8.5 rounded-full border border-[#D4AF65]/30 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Primary Mobile CTA Button */}
              <div className="mb-5">
                <Link
                  to="/get-a-quote"
                  onClick={() => {
                    trackGetQuoteClick('mobile_drawer_cta')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#D4AF65] hover:bg-[#c9a150] text-[#101D35] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,101,0.35)] transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#101D35]" />
                  <span>Request Custom Quotation</span>
                </Link>
              </div>

              {/* Navigation Stack */}
              <div className="space-y-2 flex-1">
                {/* 1. Catalog Accordion */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                    className="w-full flex items-center justify-between p-3.5 text-left font-bold text-sm text-white hover:text-[#D4AF65] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#D4AF65]" />
                      <span>Product Catalog</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#D4AF65] transition-transform duration-200 ${
                        mobileCatalogOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileCatalogOpen && (
                    <div className="p-3 pt-0 space-y-3 border-t border-white/10 mt-1">
                      {MEGA_MENU_CATEGORIES.map((dept) => (
                        <div key={dept.key} className="space-y-1">
                          <Link
                            to={dept.overviewPath}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs font-black text-[#D4AF65] hover:underline block pt-1"
                          >
                            {dept.title}
                          </Link>
                          <div className="grid grid-cols-2 gap-1.5 pl-2">
                            {dept.items.slice(0, 4).map((it) => (
                              <Link
                                key={it.label}
                                to={it.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-[11px] text-[#F5F2EB]/80 hover:text-white py-1 truncate block"
                              >
                                {it.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Primary Links */}
                <Link
                  to="/business-card-printing-dubai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-bold text-white hover:text-[#D4AF65] transition-colors"
                >
                  <span>Business Cards</span>
                  <ChevronRight className="h-4 w-4 text-[#D4AF65]" />
                </Link>

                <Link
                  to="/sticker-printing-dubai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-bold text-white hover:text-[#D4AF65] transition-colors"
                >
                  <span>Stickers &amp; Labels</span>
                  <ChevronRight className="h-4 w-4 text-[#D4AF65]" />
                </Link>

                <Link
                  to="/categories/stamps-printing-dubai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-bold text-white hover:text-[#D4AF65] transition-colors"
                >
                  <span>Stamps &amp; Seals</span>
                  <ChevronRight className="h-4 w-4 text-[#D4AF65]" />
                </Link>

                <Link
                  to="/finishes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-bold text-white hover:text-[#D4AF65] transition-colors"
                >
                  <span>Finishes &amp; Foils</span>
                  <ChevronRight className="h-4 w-4 text-[#D4AF65]" />
                </Link>

                {/* Company Accordion */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                    className="w-full flex items-center justify-between p-3.5 text-left font-bold text-sm text-white hover:text-[#D4AF65] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#D4AF65]" />
                      <span>Company &amp; Atelier</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#D4AF65] transition-transform duration-200 ${
                        mobileCompanyOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileCompanyOpen && (
                    <div className="p-3 pt-0 space-y-2 border-t border-white/10 mt-1">
                      {COMPANY_LINKS.map((c) => (
                        <Link
                          key={c.label}
                          to={c.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between py-1.5 text-xs text-[#F5F2EB]/85 hover:text-[#D4AF65] transition-colors"
                        >
                          <span>{c.label}</span>
                          <ChevronRight className="h-3 w-3 text-white/40" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dedicated Support Section */}
                <div className="pt-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF65] block mb-2 px-1">
                    Support &amp; Rapid Assistance
                  </span>

                  <div className="space-y-1.5">
                    <a
                      href={`https://wa.me/${RAW_WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-[#D4AF65]" />
                        <span>Hotline: {FORMATTED_PHONE}</span>
                      </span>
                      <ExternalLink className="h-3 w-3 text-[#D4AF65]" />
                    </a>

                    <Link
                      to="/corporate-quotes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#D4AF65]/40 text-xs font-semibold text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-[#D4AF65]" />
                        <span>Corporate Quotes</span>
                      </span>
                      <ChevronRight className="h-3 w-3 text-white/40" />
                    </Link>

                    <Link
                      to="/track-order"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Order Update</span>
                      </span>
                      <ChevronRight className="h-3 w-3 text-white/40" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Utility */}
              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <LanguageSwitcher variant="glass" />
                <span className="text-[11px] text-[#F5F2EB]/60">Al Quoz, Dubai, UAE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 4. UNIVERSAL SEARCH MODAL (GLASSMORPHISM SPECIFICATION)               */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-60 pointer-events-auto flex items-start justify-center pt-12 sm:pt-20 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-[#101D35]/75 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search ONPRINT Catalog"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 w-full max-w-2xl rounded-3xl border border-[#D4AF65]/40 bg-[#101D35]/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] overflow-hidden text-white"
            >
              {/* Search Input Bar */}
              <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 sm:px-5 py-4">
                <Search className="h-5 w-5 text-[#D4AF65] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search business cards, stickers, stamps, roll-up banners, bottles..."
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-white placeholder:text-[#F5F2EB]/50 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-[#F5F2EB]/70 hover:bg-white/10 hover:text-white"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="rounded-lg border border-[#D4AF65]/30 bg-white/5 p-1.5 text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Body */}
              <div className="max-h-[68vh] overflow-y-auto p-4 sm:p-5 space-y-5">
                {!searchQuery.trim() ? (
                  <>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D4AF65] block mb-2.5">
                        Popular Printing Searches
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setSearchOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-[#D4AF65]/20 hover:border-[#D4AF65]/60 px-3 py-2 text-xs font-bold text-[#F5F2EB] transition-colors"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D4AF65] block mb-2.5">
                        Browse by Category
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {MEGA_MENU_CATEGORIES.map((cat) => {
                          const Icon = cat.icon
                          return (
                            <Link
                              key={cat.key}
                              to={cat.overviewPath}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#D4AF65]/50 p-2.5 transition-colors group"
                            >
                              <div className="h-8 w-8 rounded-lg bg-[#D4AF65]/15 border border-[#D4AF65]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF65] transition-colors">
                                <Icon className="h-4 w-4 text-[#D4AF65] group-hover:text-[#101D35] transition-colors" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-white group-hover:text-[#D4AF65] transition-colors block truncate">
                                  {cat.title}
                                </span>
                                <span className="text-[10px] text-[#F5F2EB]/60 block truncate">
                                  {cat.subtitle}
                                </span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Live Query Results */}
                    {searchResults.matchedMenuLinks.length === 0 &&
                    searchResults.matchedCategories.length === 0 &&
                    searchResults.matchedProducts.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-sm text-[#F5F2EB]/80 font-semibold mb-2">
                          No exact products found for &ldquo;{searchQuery}&rdquo;
                        </p>
                        <p className="text-xs text-[#F5F2EB]/60 mb-4">
                          Our Al Quoz pressroom handles custom dimensions, substrates, and bespoke finishes.
                        </p>
                        <a
                          href={`https://wa.me/${RAW_WHATSAPP_NUMBER}?text=Hi%20ONPRINT,%20I%20am%20looking%20for:%20${encodeURIComponent(
                            searchQuery
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#D4AF65] px-4 py-2 text-xs font-bold text-[#101D35] hover:bg-[#c9a150] transition-colors"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5" />
                          <span>Inquire Custom Job on WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {searchResults.matchedMenuLinks.length > 0 && (
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF65] block mb-2">
                              Suggested Printing Services ({searchResults.matchedMenuLinks.length})
                            </span>
                            <div className="space-y-1.5">
                              {searchResults.matchedMenuLinks.map((item) => (
                                <Link
                                  key={item.label}
                                  to={item.to}
                                  onClick={() => setSearchOpen(false)}
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#D4AF65]/40 transition-colors"
                                >
                                  <div>
                                    <span className="text-xs font-bold text-white hover:text-[#D4AF65] block">
                                      {item.label}
                                    </span>
                                    <span className="text-[10px] text-[#F5F2EB]/60 block">{item.desc}</span>
                                  </div>
                                  <ArrowRight className="h-3.5 w-3.5 text-[#D4AF65] shrink-0" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.matchedProducts.length > 0 && (
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF65] block mb-2">
                              Matching Catalog Products ({searchResults.matchedProducts.length})
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {searchResults.matchedProducts.map((prod) => (
                                <Link
                                  key={prod._id || prod.slug}
                                  to={`/products/${prod.slug}`}
                                  onClick={() => setSearchOpen(false)}
                                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#D4AF65]/40 transition-colors"
                                >
                                  <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                    <Tag className="h-4 w-4 text-[#D4AF65]" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-white hover:text-[#D4AF65] block truncate">
                                      {prod.name}
                                    </span>
                                    <span className="text-[10px] text-[#D4AF65] block">
                                      {prod.price ? `From AED ${prod.price}` : 'Custom Pricing'}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
