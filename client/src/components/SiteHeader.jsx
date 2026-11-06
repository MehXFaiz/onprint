import LanguageSwitcher from './LanguageSwitcher'
import { useEffect, useMemo, useState, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  Menu,
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
  Zap,
  Tag,
  Palette,
  Stamp,
  BadgeCheck,
  Briefcase,
  Megaphone,
  Package,
  Home,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { useAuth } from '../context/AuthContext'
import { trackGetQuoteClick, trackWhatsAppClick } from '../utils/analytics'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'
import { getServiceWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../utils/whatsapp'

// ---------------------------------------------------------------------------
// 1. STRUCTURED MEGA MENU ARCHITECTURE (5 Core Product Categories)
// ---------------------------------------------------------------------------
const MEGA_MENU_CATEGORIES = [
  {
    key: 'business-corporate',
    title: 'Business & Corporate Printing',
    subtitle: 'Executive Cards & Office Identity',
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
        label: 'Envelopes',
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
        desc: 'A3, A2, A1 & A0 high-resolution photo prints',
      },
      {
        label: 'Roll-Up Banners',
        to: '/services/rollup-banners',
        badge: 'Same-Day',
        desc: '85×200cm curl-free stands with carry case',
      },
      {
        label: 'Catalogs & Booklets',
        to: '/categories/catalogs-booklets-printing',
        desc: 'Saddle-stitched & PUR perfect-bound books',
      },
      {
        label: 'Hospitality & Menus',
        to: '/categories/hospitality-event-printing',
        desc: 'Waterproof café menus, tent cards & coasters',
      },
    ],
  },
  {
    key: 'stickers-labels',
    title: 'Stickers & Labels',
    subtitle: 'Waterproof Vinyl & Roll Labels',
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
        desc: 'Machine & hand-dispensed BOPP packaging rolls',
      },
      {
        label: 'Vinyl Stickers',
        to: '/products/waterproof-vinyl-stickers',
        badge: 'Waterproof',
        desc: 'UV-resistant outdoor & dishwasher-safe vinyl',
      },
      {
        label: 'Die-Cut Stickers',
        to: '/products/die-cut-stickers',
        desc: 'Precision optical contour-cut brand decals',
      },
      {
        label: 'Custom Packaging Labels',
        to: '/products/cosmetic-bottle-labels',
        desc: 'Oil-proof jar, bottle & retail box seals',
      },
      {
        label: 'Gold Foil & Clear Labels',
        to: '/products/gold-foil-stickers',
        desc: 'Metallic hot-stamped & transparent labels',
      },
    ],
  },
  {
    key: 'stamps-seals',
    title: 'Stamps & Seals',
    subtitle: 'Official UAE Company Stamps',
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
        desc: 'Original Trodat & Shiny 10,000+ impressions',
      },
      {
        label: 'Rubber & Dater Stamps',
        to: '/products/heavy-duty-dater-stamps',
        desc: 'Heavy-duty steel frame date & received stamps',
      },
      {
        label: 'Pocket Mobile Stamps',
        to: '/products/pocket-mobile-stamps',
        desc: 'Compact flip-open stamps for executives',
      },
      {
        label: 'Custom Seals',
        to: '/products/luxury-brass-wax-seal-stamps',
        badge: 'Bespoke',
        desc: '3D CNC-engraved brass wax seals & embossers',
      },
    ],
  },
  {
    key: 'packaging-custom',
    title: 'Packaging & Custom Printing',
    subtitle: 'Bottles, Boxes, Signage & Merch',
    icon: Package,
    overviewPath: '/services/luxury-packaging-custom-boxes',
    items: [
      {
        label: 'Bottle Printing',
        to: '/bottle-printing-dubai',
        badge: '360° UV / Laser',
        desc: 'Smart LED flasks, thermal bottles & tumblers',
      },
      {
        label: 'Custom Packaging',
        to: '/services/luxury-packaging-custom-boxes',
        desc: 'Magnetic rigid boxes, mailers & paper bags',
      },
      {
        label: 'Custom Ceramic Mugs',
        to: '/categories/mug-printing-dubai',
        desc: 'Dishwasher-safe corporate & magic photo mugs',
      },
      {
        label: 'Name Badges & Plaques',
        to: '/categories/name-badges-printing-dubai',
        desc: 'Magnetic brushed gold/silver staff badges',
      },
      {
        label: 'Signage & Event Flags',
        to: '/categories/signage-banners-printing',
        desc: '3D acrylic letters, backdrops & feather flags',
      },
      {
        label: 'Corporate Gifts & Apparel',
        to: '/categories/corporate-gift-items',
        desc: 'VIP onboarding kits, polo shirts & uniforms',
      },
    ],
  },
]

// Featured Spotlight Products shown inside the Mega Menu
const FEATURED_MEGA_PRODUCTS = [
  {
    title: '600 GSM Luxury Foil Cards',
    category: 'Business & Corporate',
    badge: 'Same-Day Express',
    image: '/assets/products/luxury_business_cards_dubai.jpg',
    to: '/premium-business-cards',
    priceText: 'From AED 149',
  },
  {
    title: 'Waterproof Die-Cut Stickers',
    category: 'Stickers & Labels',
    badge: '100% Weatherproof',
    image: '/assets/products/stickers/die-cut-vinyl-stickers.jpg',
    to: '/sticker-printing-dubai',
    priceText: 'From AED 40',
  },
  {
    title: 'Official UAE Company Stamps',
    category: 'Stamps & Seals',
    badge: 'Ready in 2 Hours',
    image: '/assets/products/stamps/self-inking-company-stamp.jpg',
    to: '/categories/stamps-printing-dubai',
    priceText: 'From AED 65',
  },
]

// Primary Main Navigation Links
const PRIMARY_NAV_ITEMS = [
  { label: 'Home', to: '/', end: true },
  { label: 'Products', to: '/products', isMegaTrigger: true },
  { label: 'Business Cards', to: '/business-card-printing-dubai' },
  { label: 'Stickers', to: '/sticker-printing-dubai' },
  { label: 'Stamps & Seals', to: '/categories/stamps-printing-dubai' },
  { label: 'Finishing', to: '/finishes' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

// Quick Search Popular Suggestions
const POPULAR_SEARCHES = [
  { label: 'Luxury Foil Business Cards', to: '/premium-business-cards' },
  { label: 'Waterproof Vinyl Stickers', to: '/sticker-printing-dubai' },
  { label: 'Roll-Up Banner 85×200cm', to: '/services/rollup-banners' },
  { label: 'Self-Inking Company Stamp', to: '/categories/stamps-printing-dubai' },
  { label: 'Custom Bottle Printing', to: '/bottle-printing-dubai' },
  { label: 'Folded Company Brochures', to: '/brochure-printing-dubai' },
]

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [whatsappMenuOpen, setWhatsappMenuOpen] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Mobile Drawer Accordion State (default open first category)
  const [mobileOpenCategory, setMobileOpenCategory] = useState('business-corporate')

  // Universal Search Modal State
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  // Refs for outside-click detection & hover intent
  const headerRef = useRef(null)
  const megaMenuTimeoutRef = useRef(null)
  const whatsappMenuRef = useRef(null)
  const userMenuRef = useRef(null)

  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
    setUserMenuOpen(false)
    setWhatsappMenuOpen(false)
    setSearchOpen(false)
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current)
    }
  }, [location.pathname])

  // Load categories & products for Universal Search
  useEffect(() => {
    let isMounted = true
    async function loadNavigationData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories({ status: 'active' }),
          getProducts({ status: 'active', limit: 150 }),
        ])
        if (isMounted) {
          if (catRes?.success) {
            setCategories(catRes.data.categories || [])
          }
          if (prodRes?.success) {
            setProducts(prodRes.data.products || [])
          }
        }
      } catch (err) {
        console.warn('Could not load navigation catalog data:', err.message)
      }
    }
    loadNavigationData()
    return () => {
      isMounted = false
    }
  }, [])

  // Sticky Header Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled((prev) => (prev ? y > 8 : y > 24))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Outside-Click Handler for Dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMegaMenuOpen(false)
        setWhatsappMenuOpen(false)
        setUserMenuOpen(false)
      } else {
        if (whatsappMenuRef.current && !whatsappMenuRef.current.contains(event.target)) {
          setWhatsappMenuOpen(false)
        }
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
          setUserMenuOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Global Keyboard Shortcuts (Escape to close, '/' or Cmd+K to search)
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
        setUserMenuOpen(false)
        setWhatsappMenuOpen(false)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [searchOpen])

  // Prevent background scrolling when Mobile Drawer or Search Modal is open
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

  // Hover intent handlers for Products Mega Menu
  const handleMegaMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
    setWhatsappMenuOpen(false)
    setUserMenuOpen(false)
    setMegaMenuOpen(true)
  }

  const handleMegaMouseLeave = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false)
    }, 180)
  }

  // Filter products & categories for Universal Search Modal
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return { matchedCategories: [], matchedProducts: [], matchedMenuLinks: [] }

    const matchedCategories = categories
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.shortDescription?.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q)
      )
      .slice(0, 6)

    const matchedProducts = products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q)
      )
      .slice(0, 10)

    const allMenuItems = MEGA_MENU_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({ ...item, groupTitle: cat.title }))
    )
    const matchedMenuLinks = allMenuItems
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.desc?.toLowerCase().includes(q) ||
          item.groupTitle.toLowerCase().includes(q)
      )
      .slice(0, 6)

    return { matchedCategories, matchedProducts, matchedMenuLinks }
  }, [searchQuery, categories, products])

  const handleCopyPhone = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(FORMATTED_PHONE)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  // Helper to check if a primary nav item is active
  const isNavItemActive = (item) => {
    const path = location.pathname
    if (item.to === '/') return path === '/'
    if (item.isMegaTrigger) {
      return (
        path === '/products' ||
        path === '/categories' ||
        path.startsWith('/products/') ||
        (path.startsWith('/categories/') && !path.includes('stamps-printing-dubai'))
      )
    }
    if (item.to === '/business-card-printing-dubai') {
      return (
        path === '/business-card-printing-dubai' ||
        path === '/premium-business-cards' ||
        path === '/luxury-business-cards' ||
        path === '/foil-business-cards' ||
        path === '/spot-uv-business-cards' ||
        path === '/matte-business-cards' ||
        path === '/corporate-business-cards' ||
        path === '/categories/business-cards-printing'
      )
    }
    if (item.to === '/sticker-printing-dubai') {
      return (
        path === '/sticker-printing-dubai' ||
        path === '/stickers' ||
        path === '/categories/stickers-labels-printing'
      )
    }
    if (item.to === '/categories/stamps-printing-dubai') {
      return path === '/categories/stamps-printing-dubai' || path === '/stamps'
    }
    return path === item.to || path.startsWith(`${item.to}/`)
  }

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F5F0E7]/98 backdrop-blur-xl border-b border-[#DED2C1] shadow-[0_8px_30px_rgb(53,39,25,0.08)]'
          : 'bg-[#F5F0E7] border-b border-[#DED2C1]'
      }`}
    >
      {/* =====================================================================
          1. TOP INFORMATION BAR (Desktop & Tablet — Compact Corporate Utility)
         ===================================================================== */}
      <div
        className={`hidden md:block bg-[#EDE3D5] text-[#5C4938] transition-all duration-300 overflow-hidden ${
          scrolled
            ? 'max-h-0 opacity-0 border-b-0'
            : 'max-h-11 opacity-100 border-b border-[#DED2C1]/80'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] font-medium">
          {/* Left: Dubai Pressroom Credentials */}
          <div className="flex items-center gap-4 min-w-0">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#352719] truncate">
              <MapPin className="h-3.5 w-3.5 text-[#795C43] shrink-0" />
              <span>Al Quoz Industrial Area, Dubai • Commercial Offset &amp; Digital Pressroom</span>
            </span>
            <span className="hidden xl:inline-block h-3 w-px bg-[#C5A989]/60" />
            <span className="hidden xl:inline-flex items-center gap-1.5 text-[#5C4938]">
              <Zap className="h-3.5 w-3.5 text-[#795C43] shrink-0" />
              <span>Same-Day Express Print &amp; 24h UAE Delivery</span>
            </span>
          </div>

          {/* Right: Customer Service Links & Language Switcher */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:+${RAW_WHATSAPP_NUMBER}`}
              className="inline-flex items-center gap-1.5 font-bold text-[#352719] hover:text-[#795C43] transition-colors"
              title="Call ONPRINT Pressroom Hotline"
            >
              <Phone className="h-3 w-3 text-[#795C43]" />
              <span>{FORMATTED_PHONE}</span>
            </a>

            <span className="h-3 w-px bg-[#C5A989]/60" />

            <Link
              to="/corporate-quotes"
              className="hidden lg:inline-flex items-center gap-1 font-semibold text-[#5C4938] hover:text-[#352719] transition-colors"
            >
              <Building2 className="h-3 w-3 text-[#795C43]" />
              <span>Corporate B2B Accounts</span>
            </Link>

            <span className="hidden lg:inline-block h-3 w-px bg-[#C5A989]/60" />

            <Link
              to="/track-order"
              className="inline-flex items-center gap-1 font-semibold text-[#5C4938] hover:text-[#352719] transition-colors"
            >
              <Truck className="h-3.5 w-3.5 text-[#795C43]" />
              <span>Track Order</span>
            </Link>

            <span className="h-3 w-px bg-[#C5A989]/60" />

            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. MAIN NAVIGATION BAR (Logo + Primary Nav + Customer Action Area)
         ===================================================================== */}
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between gap-2 lg:gap-4 transition-all duration-300 ${
            scrolled ? 'h-16' : 'h-18 sm:h-20'
          }`}
        >
          {/* A. BRAND LOGO */}
          <div className="flex items-center shrink-0">
            <Logo
              variant="default"
              size={scrolled ? 'sm' : 'md'}
              className="transition-transform duration-200 hover:scale-[1.01]"
            />
          </div>

          {/* B. PRIMARY DESKTOP NAVIGATION (lg and above) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-1.5"
          >
            {PRIMARY_NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item)

              // Products Mega Menu Trigger + Crawlable Anchor Link
              if (item.isMegaTrigger) {
                const isOpen = megaMenuOpen
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={handleMegaMouseEnter}
                    onMouseLeave={handleMegaMouseLeave}
                  >
                    <Link
                      to={item.to}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls="products-mega-menu"
                      onClick={(e) => {
                        // On touch/keyboard toggle if not already open, while keeping real href for crawlers
                        if (!isOpen && window.innerWidth < 1280) {
                          e.preventDefault()
                          setMegaMenuOpen(true)
                        } else {
                          setMegaMenuOpen(false)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            setMegaMenuOpen(true)
                          }
                        }
                      }}
                      className={`group inline-flex items-center gap-1 rounded-lg px-2.5 xl:px-3 py-2 text-[13px] xl:text-[13.5px] font-bold tracking-tight transition-all duration-200 whitespace-nowrap ${
                        isOpen || active
                          ? 'bg-[#EDE3D5] text-[#352719] shadow-2xs'
                          : 'text-[#352719] hover:bg-[#EDE3D5]/70 hover:text-[#795C43]'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5 text-[#795C43] shrink-0" />
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-[#756657] transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#795C43]' : 'group-hover:text-[#795C43]'
                        }`}
                      />
                    </Link>
                  </div>
                )
              }

              // Hide 'Home' on tight 1024px–1180px screens if needed (Logo already links Home), show from xl+
              const responsiveVisibility =
                item.to === '/'
                  ? 'hidden xl:inline-flex'
                  : item.to === '/about'
                  ? 'hidden min-[1140px]:inline-flex'
                  : 'inline-flex'

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  onMouseEnter={() => {
                    if (megaMenuOpen) handleMegaMouseLeave()
                  }}
                  className={`${responsiveVisibility} relative items-center rounded-lg px-2.5 xl:px-3 py-2 text-[13px] xl:text-[13.5px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                    active
                      ? 'bg-[#EDE3D5] font-bold text-[#352719]'
                      : 'text-[#352719]/90 hover:bg-[#EDE3D5]/60 hover:text-[#795C43]'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-[#795C43]" />
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* C. CUSTOMER SERVICES & ACTION AREA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search printing products and categories"
              title="Search Products (Press / or Ctrl+K)"
              className="inline-flex items-center gap-2 rounded-xl border border-[#DED2C1] bg-[#FAF8F3] hover:bg-[#EDE3D5] hover:border-[#C5A989] px-2.5 sm:px-3 h-10 text-xs font-bold text-[#352719] transition-all cursor-pointer shadow-2xs"
            >
              <Search className="h-4 w-4 text-[#795C43] shrink-0" />
              <span className="hidden 2xl:inline text-[#756657] font-semibold">Search...</span>
              <kbd className="hidden 2xl:inline-block rounded bg-[#EDE3D5] px-1.5 py-0.5 text-[10px] font-bold text-[#5C4938] border border-[#DED2C1]">
                /
              </kbd>
            </button>

            {/* 2. Direct Phone Action (Desktop/Tablet) */}
            <a
              href={`tel:+${RAW_WHATSAPP_NUMBER}`}
              title={`Call ONPRINT Dubai: ${FORMATTED_PHONE}`}
              aria-label={`Call ONPRINT Dubai at ${FORMATTED_PHONE}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#DED2C1] bg-[#FAF8F3] hover:bg-[#EDE3D5] hover:border-[#C5A989] px-2.5 h-10 text-xs font-bold text-[#352719] transition-all shadow-2xs"
            >
              <Phone className="h-4 w-4 text-[#795C43] shrink-0" />
              <span className="hidden min-[1360px]:inline whitespace-nowrap">{FORMATTED_PHONE}</span>
            </a>

            {/* 3. Track Order Action (Scrolled or Tablet/Desktop quick utility) */}
            <Link
              to="/track-order"
              title="Track Existing Order"
              aria-label="Track Existing Order"
              className="hidden md:inline-flex lg:hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-[#DED2C1] bg-[#FAF8F3] hover:bg-[#EDE3D5] hover:border-[#C5A989] px-2.5 h-10 text-xs font-bold text-[#352719] transition-all shadow-2xs"
            >
              <Truck className="h-4 w-4 text-[#795C43] shrink-0" />
              <span className="hidden min-[1420px]:inline whitespace-nowrap">Track Order</span>
            </Link>

            {/* 4. WhatsApp Action + Concierge Dropdown */}
            <div className="relative" ref={whatsappMenuRef}>
              <div className="inline-flex items-center rounded-xl border border-[#25D366]/40 bg-[#FAF8F3] hover:bg-[#EDE3D5] transition-all h-10 shadow-2xs overflow-hidden">
                <a
                  href={getServiceWhatsAppUrl(location.pathname)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: location.pathname,
                      button_location: 'header_navbar',
                      label: 'navbar_whatsapp_direct',
                    })
                  }
                  title={`WhatsApp Instant Quote: ${FORMATTED_PHONE}`}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-full text-xs font-bold text-[#352719] hover:text-[#1da851] transition-colors"
                >
                  <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white shrink-0">
                    <WhatsAppIcon className="h-3 w-3 fill-current" />
                  </span>
                  <span className="hidden sm:inline font-extrabold">WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMegaMenuOpen(false)
                    setWhatsappMenuOpen((prev) => !prev)
                  }}
                  aria-label="Open WhatsApp print desk details"
                  aria-expanded={whatsappMenuOpen}
                  className="hidden sm:inline-flex items-center justify-center px-1.5 h-full border-l border-[#DED2C1] text-[#756657] hover:text-[#352719] hover:bg-[#EDE3D5] transition-colors cursor-pointer"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      whatsappMenuOpen ? 'rotate-180 text-[#795C43]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* WhatsApp Concierge Popover */}
              <AnimatePresence>
                {whatsappMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-[#DED2C1] bg-[#FAF8F3] p-4 shadow-[0_20px_50px_rgba(53,39,25,0.16)] z-50"
                  >
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DED2C1]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm shrink-0">
                          <WhatsAppIcon className="h-5 w-5 fill-current" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-[#352719]">
                              ONPRINT WhatsApp Desk
                            </span>
                            <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                          </div>
                          <p className="text-[11px] text-[#756657]">
                            Direct Pre-Press &amp; Pricing Specialist
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-3 space-y-2.5">
                      <div className="flex items-center justify-between rounded-xl bg-[#F5F0E7] border border-[#DED2C1] px-3 py-2">
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#756657]">
                            Official Hotline
                          </span>
                          <span className="text-sm font-black text-[#352719]">
                            {FORMATTED_PHONE}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyPhone}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#DED2C1] bg-[#FAF8F3] px-2.5 py-1.5 text-[11px] font-bold text-[#352719] hover:border-[#795C43] transition-colors cursor-pointer"
                        >
                          {copiedPhone ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-700" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-[#795C43]" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <a
                        href={getServiceWhatsAppUrl(location.pathname)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setWhatsappMenuOpen(false)
                          trackWhatsAppClick({
                            source_page: location.pathname,
                            button_location: 'header_popover',
                            label: 'start_whatsapp_chat',
                          })
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1da851] py-2.5 px-4 text-xs font-black text-white shadow-sm transition-all"
                      >
                        <WhatsAppIcon className="h-4 w-4 fill-current" />
                        <span>Start WhatsApp Chat Now</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>

                      <a
                        href={`tel:+${RAW_WHATSAPP_NUMBER}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DED2C1] bg-[#F5F0E7] hover:bg-[#EDE3D5] py-2 px-4 text-xs font-bold text-[#352719] transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#795C43]" />
                        <span>Call Pressroom Directly</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 5. Prominent Primary CTA: Get a Quote */}
            <Link
              to="/get-a-quote"
              onClick={() => trackGetQuoteClick({ source_page: 'header_navbar' })}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#795C43] hover:bg-[#5D442E] px-3.5 xl:px-4 h-10 text-xs xl:text-[13px] font-bold text-white shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
            >
              <span>Get a Quote</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>

            {/* 6. Admin User Dropdown (Only when authenticated as admin) */}
            {isAuthenticated && isAdmin && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#C5A989] bg-[#FAF8F3] px-2.5 h-10 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5] transition-colors cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-[#795C43]" />
                  <span className="hidden xl:inline max-w-[90px] truncate">
                    {user?.name || 'Admin'}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#756657]" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#DED2C1] bg-[#FAF8F3] p-2 shadow-xl z-50"
                    >
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                      >
                        <ShieldCheck className="h-4 w-4 text-[#795C43]" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* 7. Mobile & Tablet Hamburger Button (Visible below lg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className="inline-flex lg:hidden items-center justify-center rounded-xl border border-[#DED2C1] bg-[#FAF8F3] hover:bg-[#EDE3D5] h-10 w-10 text-[#352719] transition-colors cursor-pointer shadow-2xs"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. PREMIUM MULTI-COLUMN PRODUCTS MEGA MENU (Desktop lg+)
         ===================================================================== */}
      <AnimatePresence>
        {megaMenuOpen && (
          <motion.div
            id="products-mega-menu"
            role="region"
            aria-label="Products Mega Menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMegaMouseLeave}
            className="hidden lg:block absolute left-0 right-0 top-full border-b border-[#C5A989] bg-[#FAF8F3] shadow-[0_28px_60px_-12px_rgba(53,39,25,0.22)] z-50"
          >
            <div className="mx-auto max-w-[1440px] px-6 lg:px-8 py-6">
              {/* Top 5-Column Category Grid */}
              <div className="grid grid-cols-5 gap-5 xl:gap-6">
                {MEGA_MENU_CATEGORIES.map((category) => {
                  const Icon = category.icon
                  return (
                    <div key={category.key} className="flex flex-col">
                      {/* Category Column Header */}
                      <Link
                        to={category.overviewPath}
                        onClick={() => setMegaMenuOpen(false)}
                        className="group flex items-start gap-2.5 pb-3 mb-2.5 border-b border-[#DED2C1] hover:border-[#795C43] transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EDE3D5] text-[#795C43] group-hover:bg-[#795C43] group-hover:text-white transition-colors shrink-0 mt-0.5">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-extrabold text-[#352719] group-hover:text-[#795C43] transition-colors leading-snug">
                            {category.title}
                          </h3>
                          <p className="text-[11px] text-[#756657] truncate mt-0.5">
                            {category.subtitle}
                          </p>
                        </div>
                      </Link>

                      {/* Category Product Links */}
                      <ul className="space-y-1 flex-1">
                        {category.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              to={item.to}
                              onClick={() => setMegaMenuOpen(false)}
                              className="group flex flex-col rounded-xl px-2.5 py-1.5 hover:bg-[#EDE3D5]/80 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-[12.5px] font-bold text-[#352719] group-hover:text-[#795C43] transition-colors">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="shrink-0 rounded-md bg-[#EDE3D5] group-hover:bg-[#795C43] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#795C43] group-hover:text-white transition-colors">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.desc && (
                                <span className="text-[11px] text-[#756657] line-clamp-1 mt-0.5">
                                  {item.desc}
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

              {/* Bottom Featured Products Showcase + View All Bar */}
              <div className="mt-6 pt-5 border-t border-[#DED2C1] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                {/* Featured Product Cards with Lazy-Loaded Real Product Images */}
                <div className="grid grid-cols-3 gap-3.5 flex-1">
                  {FEATURED_MEGA_PRODUCTS.map((feat) => (
                    <Link
                      key={feat.title}
                      to={feat.to}
                      onClick={() => setMegaMenuOpen(false)}
                      className="group flex items-center gap-3 rounded-xl border border-[#DED2C1] bg-[#F5F0E7] hover:bg-[#EDE3D5] hover:border-[#C5A989] p-2.5 transition-all"
                    >
                      <div className="h-14 w-16 rounded-lg overflow-hidden bg-[#EDE3D5] border border-[#DED2C1] shrink-0">
                        <img
                          src={feat.image}
                          alt={feat.title}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#795C43]">
                            {feat.badge}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-[#352719] group-hover:text-[#795C43] truncate mt-0.5">
                          {feat.title}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[11px] font-bold text-[#5C4938]">
                            {feat.priceText}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#795C43] group-hover:translate-x-0.5 transition-transform">
                            <span>Explore</span>
                            <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Action Links: View All Products & Categories */}
                <div className="flex items-center justify-end gap-2.5 shrink-0">
                  <Link
                    to="/categories"
                    onClick={() => setMegaMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#C5A989] bg-[#F5F0E7] hover:bg-[#EDE3D5] px-4 py-2.5 text-xs font-bold text-[#352719] transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-[#795C43]" />
                    <span>All 19 Categories</span>
                  </Link>

                  <Link
                    to="/products"
                    onClick={() => setMegaMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#795C43] hover:bg-[#5D442E] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
                  >
                    <span>View All Products</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          4. UNIVERSAL SEARCH MODAL
         ===================================================================== */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-60 flex items-start justify-center pt-12 sm:pt-20 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-[#352719]/50 backdrop-blur-xs"
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
              className="relative z-10 w-full max-w-2xl rounded-2xl border border-[#C5A989] bg-[#FAF8F3] shadow-[0_25px_70px_rgba(53,39,25,0.28)] overflow-hidden"
            >
              {/* Search Input Bar */}
              <div className="flex items-center gap-3 border-b border-[#DED2C1] bg-[#F5F0E7] px-4 py-3.5">
                <Search className="h-5 w-5 text-[#795C43] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search business cards, stickers, stamps, roll-up banners, bottles..."
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-[#352719] placeholder:text-[#756657] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-[#756657] hover:bg-[#EDE3D5] hover:text-[#352719]"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="rounded-lg border border-[#DED2C1] bg-[#FAF8F3] p-1.5 text-[#756657] hover:text-[#352719] hover:bg-[#EDE3D5] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Body */}
              <div className="max-h-[68vh] overflow-y-auto p-4 sm:p-5 space-y-5">
                {!searchQuery.trim() ? (
                  <>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#795C43] block mb-2.5">
                        Popular Printing Searches
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setSearchOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DED2C1] bg-[#F5F0E7] hover:bg-[#EDE3D5] hover:border-[#C5A989] px-3 py-2 text-xs font-bold text-[#352719] transition-colors"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-[#795C43]" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#795C43] block mb-2.5">
                        Browse by Department
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {MEGA_MENU_CATEGORIES.map((cat) => {
                          const Icon = cat.icon
                          return (
                            <Link
                              key={cat.key}
                              to={cat.overviewPath}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#F5F0E7] hover:bg-[#EDE3D5] p-3 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EDE3D5] text-[#795C43] shrink-0">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-extrabold text-[#352719] truncate">
                                    {cat.title}
                                  </div>
                                  <div className="text-[11px] text-[#756657] truncate">
                                    {cat.subtitle}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-[#795C43] shrink-0" />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Quick Menu Matches */}
                    {searchResults.matchedMenuLinks.length > 0 && (
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#795C43] block mb-2">
                          Recommended Solutions
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.matchedMenuLinks.map((item) => (
                            <Link
                              key={`${item.groupTitle}-${item.label}`}
                              to={item.to}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#F5F0E7] hover:bg-[#EDE3D5] p-2.5 transition-colors"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-extrabold text-[#352719] truncate">
                                  {item.label}
                                </div>
                                <div className="text-[11px] text-[#756657] truncate">
                                  {item.desc || item.groupTitle}
                                </div>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-[#795C43] shrink-0 ml-2" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Category Matches */}
                    {searchResults.matchedCategories.length > 0 && (
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#795C43] block mb-2">
                          Matching Categories ({searchResults.matchedCategories.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.matchedCategories.map((cat) => (
                            <Link
                              key={cat.slug || cat.id}
                              to={`/categories/${cat.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#F5F0E7] hover:bg-[#EDE3D5] p-2.5 transition-colors"
                            >
                              <span className="text-xs font-bold text-[#352719] truncate">
                                {cat.name}
                              </span>
                              <ChevronRight className="h-3.5 w-3.5 text-[#795C43] shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Matches */}
                    {searchResults.matchedProducts.length > 0 && (
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#795C43] block mb-2">
                          Matching Products ({searchResults.matchedProducts.length})
                        </span>
                        <div className="space-y-1.5">
                          {searchResults.matchedProducts.map((prod) => (
                            <Link
                              key={prod.slug || prod.id}
                              to={`/products/${prod.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#F5F0E7] hover:bg-[#EDE3D5] px-3 py-2.5 transition-colors"
                            >
                              <div className="min-w-0 pr-3">
                                <div className="text-xs font-extrabold text-[#352719] truncate">
                                  {prod.name}
                                </div>
                                {prod.shortDescription && (
                                  <div className="text-[11px] text-[#756657] truncate">
                                    {prod.shortDescription}
                                  </div>
                                )}
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-[#795C43] shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {searchResults.matchedCategories.length === 0 &&
                      searchResults.matchedProducts.length === 0 &&
                      searchResults.matchedMenuLinks.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-sm font-bold text-[#352719]">
                            No exact matches found for &ldquo;{searchQuery}&rdquo;
                          </p>
                          <p className="text-xs text-[#756657] mt-1">
                            Explore our full catalog or request a custom quote from our Dubai pressroom.
                          </p>
                          <div className="mt-4 flex items-center justify-center gap-3">
                            <Link
                              to="/products"
                              onClick={() => setSearchOpen(false)}
                              className="rounded-xl bg-[#795C43] px-4 py-2 text-xs font-bold text-white"
                            >
                              Browse All Products
                            </Link>
                            <Link
                              to="/get-a-quote"
                              onClick={() => setSearchOpen(false)}
                              className="rounded-xl border border-[#C5A989] bg-[#F5F0E7] px-4 py-2 text-xs font-bold text-[#352719]"
                            >
                              Request Custom Quote
                            </Link>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          5. MOBILE & TABLET SLIDE-IN NAVIGATION DRAWER (Below lg)
         ===================================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="fixed inset-0 z-60 lg:hidden"
          >
            {/* Dark Warm Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#352719]/55 backdrop-blur-xs"
            />

            {/* Slide-In Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.26, ease: 'easeOut' }}
              className="fixed inset-y-0 right-0 z-10 flex w-full max-w-[380px] flex-col bg-[#F5F0E7] border-l border-[#DED2C1] shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#DED2C1] bg-[#EDE3D5] px-4 py-3.5 shrink-0">
                <Logo variant="default" size="sm" />
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DED2C1] bg-[#FAF8F3] text-[#352719] hover:bg-[#EDE3D5] transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                {/* Quick Search Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setTimeout(() => setSearchOpen(true), 120)
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-3 text-left text-xs font-bold text-[#756657] hover:border-[#C5A989] transition-colors shadow-2xs"
                >
                  <span className="flex items-center gap-2.5">
                    <Search className="h-4 w-4 text-[#795C43]" />
                    <span>Search 120+ printing products...</span>
                  </span>
                  <span className="rounded bg-[#EDE3D5] px-2 py-0.5 text-[10px] font-extrabold text-[#352719]">
                    Search
                  </span>
                </button>

                {/* Expandable Product Categories (Accordion) */}
                <div>
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#795C43]">
                      Product Categories
                    </span>
                    <Link
                      to="/products"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] font-bold text-[#352719] hover:text-[#795C43] inline-flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {MEGA_MENU_CATEGORIES.map((category) => {
                      const Icon = category.icon
                      const isExpanded = mobileOpenCategory === category.key

                      return (
                        <div
                          key={category.key}
                          className="rounded-xl border border-[#DED2C1] bg-[#FAF8F3] overflow-hidden"
                        >
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() =>
                              setMobileOpenCategory((prev) =>
                                prev === category.key ? null : category.key
                              )
                            }
                            className="flex w-full items-center justify-between px-3.5 py-3 text-left transition-colors hover:bg-[#EDE3D5]/60 cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-colors ${
                                  isExpanded
                                    ? 'bg-[#795C43] text-white'
                                    : 'bg-[#EDE3D5] text-[#795C43]'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[13px] font-extrabold text-[#352719] truncate">
                                  {category.title}
                                </div>
                                <div className="text-[11px] text-[#756657] truncate">
                                  {category.subtitle}
                                </div>
                              </div>
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 text-[#756657] shrink-0 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-[#795C43]' : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-[#DED2C1] bg-[#F5F0E7] px-3 py-2 space-y-1"
                              >
                                {category.items.map((item) => (
                                  <Link
                                    key={item.label}
                                    to={item.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-bold text-[#352719] hover:bg-[#FAF8F3] hover:text-[#795C43] transition-colors"
                                  >
                                    <span className="truncate">{item.label}</span>
                                    {item.badge ? (
                                      <span className="rounded bg-[#EDE3D5] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#795C43] shrink-0">
                                        {item.badge}
                                      </span>
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5 text-[#756657] shrink-0" />
                                    )}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Main Navigation Links */}
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#795C43] px-1 block mb-2">
                    Main Navigation
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Home className="h-4 w-4 text-[#795C43]" />
                        <span>Home</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#756657]" />
                    </Link>

                    <Link
                      to="/business-card-printing-dubai"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <CreditCard className="h-4 w-4 text-[#795C43]" />
                        <span>Business Cards</span>
                      </span>
                      <span className="rounded bg-[#EDE3D5] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#795C43]">
                        Flagship
                      </span>
                    </Link>

                    <Link
                      to="/sticker-printing-dubai"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Tag className="h-4 w-4 text-[#795C43]" />
                        <span>Stickers &amp; Labels</span>
                      </span>
                      <span className="rounded bg-[#EDE3D5] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#795C43]">
                        Waterproof
                      </span>
                    </Link>

                    <Link
                      to="/categories/stamps-printing-dubai"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Stamp className="h-4 w-4 text-[#795C43]" />
                        <span>Stamps &amp; Seals</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#756657]" />
                    </Link>

                    <Link
                      to="/finishes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Palette className="h-4 w-4 text-[#795C43]" />
                        <span>Finishing (Foil &amp; 3D Spot UV)</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#756657]" />
                    </Link>

                    <Link
                      to="/corporate-quotes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Building2 className="h-4 w-4 text-[#795C43]" />
                        <span>Corporate &amp; Bulk Quotes</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#756657]" />
                    </Link>

                    <Link
                      to="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <BadgeCheck className="h-4 w-4 text-[#795C43]" />
                        <span>About Us</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#756657]" />
                    </Link>

                    <Link
                      to="/blog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-[#795C43]" />
                        <span>Blog &amp; Print Guides</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#756657]" />
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#DED2C1] bg-[#FAF8F3] px-3.5 py-2.5 text-xs font-bold text-[#352719] hover:bg-[#EDE3D5]"
                    >
                      <span className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 text-[#795C43]" />
                        <span>Contact Us</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#756657]" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sticky Drawer Footer: Customer Service & Quote Actions */}
              <div className="border-t border-[#DED2C1] bg-[#EDE3D5] p-4 space-y-2.5 shrink-0">
                <Link
                  to="/get-a-quote"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    trackGetQuoteClick({ source_page: 'header_mobile_drawer' })
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#795C43] hover:bg-[#5D442E] py-3 text-xs font-black text-white shadow-sm transition-all"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="grid grid-cols-2 gap-2">
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
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#1da851] py-2.5 px-3 text-xs font-black text-white shadow-2xs transition-colors"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-current shrink-0" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:+${RAW_WHATSAPP_NUMBER}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#DED2C1] bg-[#FAF8F3] hover:bg-[#F5F0E7] py-2.5 px-3 text-xs font-bold text-[#352719] transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#795C43] shrink-0" />
                    <span>Call Us</span>
                  </a>
                </div>

                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DED2C1] bg-[#FAF8F3] py-2 text-xs font-bold text-[#5C4938] hover:text-[#352719] transition-colors"
                >
                  <Truck className="h-3.5 w-3.5 text-[#795C43]" />
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
