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
  BadgeCheck,
  Briefcase,
  Megaphone
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import WhatsAppIcon from './WhatsAppIcon'
import { useAuth } from '../context/AuthContext'
import { trackGetQuoteClick, trackWhatsAppClick } from '../utils/analytics'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'
import { getServiceWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../utils/whatsapp'
import { MASTER_DEPARTMENTS, isDepartmentSlug } from '../data/masterDepartments'

const DEPARTMENT_ICONS = {
  'business-office-printing': Briefcase,
  'marketing-promotional-printing': Megaphone,
  'stickers-labels-packaging': Tag,
  'signage-displays-banners': Layers,
  'specialty-corporate-gifts': Sparkles,
}

const NAV_GROUPS = [
  {
    key: 'cards',
    label: 'Business Cards (Dubai Flagship)',
    description: 'Executive 350–700 GSM cotton, soft-touch, 24K hot foil & 3D spot UV',
    icon: CreditCard,
    badge: 'Priority #1',
    keywords: ['business card', 'visiting card', 'card'],
  },
  {
    key: 'signage',
    label: 'Roll-Up Banners & Signage',
    description: 'Retractable roll-up stands, pull-up banners & exhibition displays',
    icon: Layers,
    badge: 'Priority #2',
    keywords: ['banner', 'rollup', 'roll up', 'roll-up', 'pull up', 'stand', 'signage'],
  },
  {
    key: 'stickers',
    label: 'Stickers & Product Labels',
    description: 'Die-cut vinyl, waterproof roll labels & metallic foils',
    icon: Tag,
    badge: 'Priority #3',
    keywords: ['sticker', 'label', 'vinyl', 'decal'],
  },
  {
    key: 'stamps',
    label: 'Company Stamps & Seals',
    description: 'Self-inking Trodat stamps, pocket stamps, dater machines & wax seals',
    icon: Stamp,
    badge: 'Priority #4',
    keywords: ['stamp', 'seal', 'dater', 'wax seal', 'rubber stamp', 'self-inking'],
  },
  {
    key: 'bottles',
    label: 'Custom Bottle Printing',
    description: 'Smart LED temperature bottles, stainless steel flasks & drinkware',
    icon: Sparkles,
    badge: 'Priority #5',
    keywords: ['bottle', 'flask', 'mug', 'tumbler', 'drinkware', 'gift'],
  },
  {
    key: 'stationery',
    label: 'Brochures, Flyers & Stationery',
    description: 'Executive letterheads, presentation folders & marketing collaterals',
    icon: FileText,
    badge: 'Commercial',
    keywords: ['brochure', 'flyer', 'letterhead', 'stationery', 'folder', 'envelope', 'notebook', 'catalog', 'booklet'],
  },
  {
    key: 'badges',
    label: 'ID Cards & Lanyards',
    description: 'NFC PVC smart badges, magnetic name tags & custom neck straps',
    icon: ShieldCheck,
    badge: 'Security',
    keywords: ['id card', 'lanyard', 'name badge', 'badge'],
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
  const [activeMegaDeptSlug, setActiveMegaDeptSlug] = useState('business-office-printing')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [whatsappPopoverOpen, setWhatsappPopoverOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [mobileOpenDept, setMobileOpenDept] = useState('business-office-printing')

  const location = useLocation()
  const searchInputRef = useRef(null)
  const dropdownTimeoutRef = useRef(null)

  const activeMegaDepartment = useMemo(() => {
    return MASTER_DEPARTMENTS.find((d) => d.slug === activeMegaDeptSlug) || MASTER_DEPARTMENTS[0]
  }, [activeMegaDeptSlug])

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
    }, 200)
  }

  const productsLoadedRef = useRef(false)

  const loadSearchProducts = () => {
    if (productsLoadedRef.current) return
    productsLoadedRef.current = true
    getProducts({ active: true, limit: 120 })
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
    }, 2000)

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

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return { products: [], categories: [], departments: [] }

    const matchedProds = (products || [])
      .filter((p) => {
        const name = (p.name || '').toLowerCase()
        const desc = (p.shortDescription || p.description || '').toLowerCase()
        const cat = (p.category?.name || '').toLowerCase()
        return name.includes(q) || desc.includes(q) || cat.includes(q)
      })
      .slice(0, 6)

    const matchedDepts = MASTER_DEPARTMENTS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
    ).slice(0, 3)

    const allSubcats = []
    MASTER_DEPARTMENTS.forEach((dept) => {
      dept.subcategories.forEach((sub) => {
        if (sub.name.toLowerCase().includes(q) || sub.shortDesc.toLowerCase().includes(q)) {
          allSubcats.push({
            ...sub,
            departmentSlug: dept.slug,
            departmentName: dept.name,
          })
        }
      })
    })

    return {
      products: matchedProds,
      categories: allSubcats.slice(0, 4),
      departments: matchedDepts,
    }
  }, [searchQuery, products])

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
        setMobileMenuOpen(false)
        setUserMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full select-none bg-[#101D35]/95 backdrop-blur-md border-b border-[#203357] shadow-md transition-all duration-200 text-[#F5F2EB]">
      {/* Top Utility Bar (Al Quoz Pressroom & Hotline - inspired by DLX Print) */}
      <div className="hidden md:block bg-[#0C1629] border-b border-[#203357] text-[11px] text-[#B0BECE] py-1.5 px-4 sm:px-5 lg:px-6 2xl:px-8">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#B0BECE]">
              <MapPin className="h-3 w-3 text-[#D4AF65]" />
              <span>Al Quoz Industrial 4, Dubai, UAE</span>
            </span>
            <span className="text-[#203357]">•</span>
            <span className="flex items-center gap-1.5 text-[#B0BECE]">
              <Truck className="h-3 w-3 text-emerald-400" />
              <span>Doorstep UAE Delivery • Express 24h Turnaround</span>
            </span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <a href={`tel:+${RAW_WHATSAPP_NUMBER}`} className="flex items-center gap-1 text-[#B0BECE] hover:text-[#D4AF65] transition-colors">
              <Phone className="h-3 w-3 text-[#D4AF65]" />
              <span>Hotline: {FORMATTED_PHONE}</span>
            </a>
            <span className="text-[#203357]">•</span>
            <Link to="/corporate-quotes" className="text-[#B0BECE] hover:text-[#D4AF65] transition-colors">
              Corporate Quotes
            </Link>
            <span className="text-[#203357]">•</span>
            <Link to="/track-order" className="text-[#B0BECE] hover:text-[#D4AF65] transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-6 2xl:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 min-w-0">
        {/* Brand Logo & Dubai Flagship Pill */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group shrink-0 flex items-center gap-2 sm:gap-3 min-w-0"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 25 }}
            className="flex items-center"
          >
            <Logo variant="default" size="md" />
          </motion.div>
          <div className="hidden min-[1180px]:flex items-center gap-1.5 pl-3 border-l border-[#203357]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F5F2EB]">
              DUBAI
            </span>
            <span className="h-1 w-1 rounded-full bg-[#D4AF65]" />
            <span className="text-[9px] font-semibold text-[#D4AF65] uppercase tracking-tight">
              PRESSROOM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — Unified Glider */}
        <nav
          className="hidden lg:flex items-center gap-0.5 bg-[#172644]/90 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-full border border-[#203357] shadow-2xs backdrop-blur-md relative shrink-0"
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
              className={`relative z-10 flex items-center gap-1.5 rounded-full px-2.5 2xl:px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                activeDropdown === 'catalog' || location.pathname === '/products' || location.pathname === '/categories'
                  ? 'text-[#D4AF65] font-black'
                  : 'text-[#F5F2EB] hover:text-[#D4AF65]'
              }`}
            >
              <Layers className={`h-3.5 w-3.5 transition-colors ${activeDropdown === 'catalog' ? 'text-[#D4AF65]' : 'text-[#B0BECE]'}`} />
              <span>Catalog</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === 'catalog' ? 'rotate-180 text-[#D4AF65]' : 'text-[#B0BECE]'
                }`}
              />

              {/* Animated active/hover background pill */}
              {(hoveredNav === 'catalog' || activeDropdown === 'catalog') && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-[#101D35] shadow-xs border border-[#203357] text-[#F5F2EB] -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </button>

            {/* Mega-Menu Dropdown Panel with DLX-Inspired Master Department Architecture */}
            <AnimatePresence>
              {activeDropdown === 'catalog' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 sm:-left-8 lg:-left-20 xl:left-0 top-full mt-3 w-[min(960px,calc(100vw-32px))] max-w-[calc(100vw-32px)] rounded-3xl border border-[#203357] bg-[#172644]/98 backdrop-blur-2xl p-5 shadow-[0_28px_64px_-12px_rgba(11,20,38,0.85)] z-50 text-[#F5F2EB]"
                >
                  <div className="grid grid-cols-12 gap-5">
                    {/* Left Column: 5 Master Departments */}
                    <div className="col-span-5 border-r border-[#203357] pr-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-[#203357]">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF65]">
                            Master Departments
                          </span>
                          <span className="text-[10px] font-bold text-[#B0BECE]">110+ Products</span>
                        </div>
                        <div className="space-y-1">
                          {MASTER_DEPARTMENTS.map((dept) => {
                            const Icon = DEPARTMENT_ICONS[dept.slug] || Layers
                            const isSelected = activeMegaDeptSlug === dept.slug
                            const prodCount = dept.subcategories.reduce((acc, s) => acc + (s.productSlugs?.length || 0), 0)
                            return (
                              <button
                                key={dept.slug}
                                type="button"
                                onMouseEnter={() => setActiveMegaDeptSlug(dept.slug)}
                                onClick={() => setActiveMegaDeptSlug(dept.slug)}
                                className={`w-full text-left flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-[#101D35] to-[#1a2d52] text-white shadow-md'
                                    : 'hover:bg-[#172644] text-[#B0BECE]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 transition-colors ${
                                      isSelected
                                        ? 'bg-[#D4AF65] text-[#101D35]'
                                        : 'bg-[#101D35] border border-[#203357] text-[#B0BECE] group-hover:text-[#D4AF65]'
                                    }`}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#F5F2EB]'}`}>
                                      {dept.name}
                                    </div>
                                    <div className={`text-[10px] truncate ${isSelected ? 'text-[#D4AF65]' : 'text-[#B0BECE]'}`}>
                                      {dept.subcategories.length} subcategories • {prodCount} products
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight
                                  className={`h-4 w-4 shrink-0 transition-transform ${
                                    isSelected ? 'text-[#D4AF65] translate-x-0.5' : 'text-[#B0BECE] group-hover:text-[#D4AF65]'
                                  }`}
                                />
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Bottom Footer Actions */}
                      <div className="pt-3 border-t border-[#203357] space-y-2 mt-2">
                        <Link
                          to="/products"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#101D35] hover:bg-[#203357] border border-[#203357] text-xs font-bold text-[#F5F2EB] transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-[#D4AF65]" />
                            <span>Browse All 110+ Products</span>
                          </span>
                          <ArrowRight className="h-3 w-3 text-[#D4AF65]" />
                        </Link>
                        <Link
                          to="/corporate-quotes"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#D4AF65]/10 hover:bg-[#D4AF65]/20 border border-[#D4AF65]/30 text-xs font-bold text-[#D4AF65] transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-[#D4AF65]" />
                            <span>Corporate &amp; Trade RFQ</span>
                          </span>
                          <ArrowUpRight className="h-3 w-3 text-[#D4AF65]" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Selected Department Subcategories */}
                    <div className="col-span-7 flex flex-col justify-between">
                      <div>
                        {/* Department Header Banner */}
                        <div className="flex items-start justify-between pb-3 mb-3 border-b border-[#203357]">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF65] block">
                              {activeMegaDepartment.eyebrow}
                            </span>
                            <h4 className="text-base font-black text-[#F5F2EB] tracking-tight">
                              {activeMegaDepartment.name}
                            </h4>
                            <p className="text-[11px] text-[#B0BECE] leading-snug line-clamp-1 mt-0.5">
                              {activeMegaDepartment.description}
                            </p>
                          </div>
                          <Link
                            to={`/categories/${activeMegaDepartment.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="shrink-0 inline-flex items-center gap-1 text-[11px] font-black text-[#D4AF65] hover:text-white px-2.5 py-1 rounded-full bg-[#D4AF65]/10 border border-[#D4AF65]/30 hover:bg-[#D4AF65]/20 transition-all"
                          >
                            <span>Explore Department</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>

                        {/* Subcategory Cards Grid */}
                        <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                          {activeMegaDepartment.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              to={`/categories/${sub.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="group p-2.5 rounded-2xl border border-[#203357] bg-[#101D35] hover:bg-[#172644] hover:border-[#D4AF65] hover:shadow-sm transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors truncate">
                                    {sub.name}
                                  </span>
                                  <span className="rounded-full bg-[#172644] border border-[#203357] px-1.5 py-0.2 text-[9px] font-bold text-[#B0BECE] shrink-0">
                                    {sub.productSlugs?.length || 0}
                                  </span>
                                </div>
                                <p className="text-[10px] text-[#B0BECE] leading-snug line-clamp-2">
                                  {sub.shortDesc}
                                </p>
                              </div>
                              {sub.featuredBadge && (
                                <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#203357]">
                                  <span className="text-[9px] font-extrabold text-[#D4AF65] uppercase tracking-wider">
                                    {sub.featuredBadge}
                                  </span>
                                  <ChevronRight className="h-3 w-3 text-[#B0BECE] group-hover:text-[#D4AF65] group-hover:translate-x-0.5 transition-all" />
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Reassurance Footer Banner */}
                      <div className="mt-3 pt-2.5 border-t border-[#203357] flex items-center justify-between text-[10px] text-[#B0BECE]">
                        <span className="flex items-center gap-1 font-semibold text-[#F5F2EB]">
                          <Truck className="h-3 w-3 text-emerald-400" />
                          <span>Al Quoz Pressroom • Express Dispatch Across UAE</span>
                        </span>
                        <span className="font-bold text-[#D4AF65]">Heidelberg &amp; HP Indigo Press</span>
                      </div>
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
                `relative z-10 flex items-center gap-1.5 rounded-full px-2.5 2xl:px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#D4AF65] font-black' : 'text-[#F5F2EB] hover:text-[#D4AF65]'
                }`
              }
            >
              <CreditCard className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>Cards</span>
              <span className="rounded-full bg-[#D4AF65] text-[#101D35] px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider">
                DUBAI
              </span>

              {hoveredNav === 'cards' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-[#101D35] shadow-xs border border-[#203357] text-[#F5F2EB] -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </NavLink>

            {/* Stamps & Seals — Clearly Visible Main Navigation Item */}
            <NavLink
              to="/categories/custom-stamps-seals"
              onMouseEnter={() => setHoveredNav('stamps')}
              className={({ isActive }) =>
                `relative z-10 flex items-center gap-1.5 rounded-full px-2.5 2xl:px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#D4AF65] font-black' : 'text-[#F5F2EB] hover:text-[#D4AF65]'
                }`
              }
            >
              <Stamp className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>Stamps &amp; Seals</span>
              <span className="rounded-full bg-[#101D35] border border-[#203357] text-[#D4AF65] px-1.5 py-0.2 text-[8px] font-black uppercase">
                2H
              </span>

              {hoveredNav === 'stamps' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-[#101D35] shadow-xs border border-[#203357] text-[#F5F2EB] -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </NavLink>

            {/* Stickers & Labels */}
            <NavLink
              to="/categories/stickers-labels-printing"
              onMouseEnter={() => setHoveredNav('stickers')}
              className={({ isActive }) =>
                `relative z-10 hidden xl:flex items-center gap-1.5 rounded-full px-2.5 2xl:px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#D4AF65] font-black' : 'text-[#F5F2EB] hover:text-[#D4AF65]'
                }`
              }
            >
              <Tag className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>Stickers</span>

              {hoveredNav === 'stickers' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-[#101D35] shadow-xs border border-[#203357] text-[#F5F2EB] -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </NavLink>

            {/* Luxury Finishes Showcase */}
            <NavLink
              to="/finishes"
              onMouseEnter={() => setHoveredNav('finishes')}
              className={({ isActive }) =>
                `relative z-10 hidden lg:flex items-center gap-1.5 rounded-full px-2.5 2xl:px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#D4AF65] font-black' : 'text-[#F5F2EB] hover:text-[#D4AF65]'
                }`
              }
            >
              <Palette className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>Finishes</span>

              {hoveredNav === 'finishes' && (
                <motion.div
                  layoutId="navHoverCapsule"
                  className="absolute inset-0 rounded-full bg-[#101D35] shadow-xs border border-[#203357] text-[#F5F2EB] -z-10"
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
                className={`relative z-10 flex items-center gap-1 rounded-full px-2.5 2xl:px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  activeDropdown === 'company' || ['/services', '/about', '/blog', '/contact', '/corporate-quotes'].includes(location.pathname)
                    ? 'text-[#D4AF65] font-black'
                    : 'text-[#F5F2EB] hover:text-[#D4AF65]'
                }`}
              >
                <span>Company</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeDropdown === 'company' ? 'rotate-180 text-[#D4AF65]' : 'text-[#B0BECE]'
                  }`}
                />

                {(hoveredNav === 'company' || activeDropdown === 'company') && (
                  <motion.div
                    layoutId="navHoverCapsule"
                    className="absolute inset-0 rounded-full bg-[#101D35] shadow-xs border border-[#203357] text-[#F5F2EB] -z-10"
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
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 rounded-2xl border border-[#203357] bg-[#172644]/98 backdrop-blur-2xl p-2 shadow-2xl z-50 text-[#F5F2EB]"
                  >
                    <Link
                      to="/services"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#F5F2EB] hover:bg-[#101D35] hover:text-[#D4AF65] transition-colors"
                    >
                      <Sparkles className="h-4 w-4 text-[#D4AF65]" />
                      <div>
                        <div className="leading-tight">All Printing Services</div>
                        <span className="text-[10px] font-normal text-[#B0BECE]">Offset, Digital &amp; Large Format</span>
                      </div>
                    </Link>

                    <Link
                      to="/finishes"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#F5F2EB] hover:bg-[#101D35] hover:text-[#D4AF65] transition-colors"
                    >
                      <Palette className="h-4 w-4 text-[#D4AF65]" />
                      <div>
                        <div className="leading-tight">Luxury Finishes Showcase</div>
                        <span className="text-[10px] font-normal text-[#B0BECE]">Foil, Spot UV, Debossing &amp; Edges</span>
                      </div>
                    </Link>

                    <Link
                      to="/corporate-quotes"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#F5F2EB] hover:bg-[#101D35] hover:text-[#D4AF65] transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-[#D4AF65]" />
                      <div>
                        <div className="leading-tight">Corporate &amp; Bulk Quotes</div>
                        <span className="text-[10px] font-normal text-[#B0BECE]">Trade credit &amp; multi-product RFQ</span>
                      </div>
                    </Link>

                    <Link
                      to="/about"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#F5F2EB] hover:bg-[#101D35] hover:text-[#D4AF65] transition-colors"
                    >
                      <Building2 className="h-4 w-4 text-[#D4AF65]" />
                      <div>
                        <div className="leading-tight">About ONPRINT</div>
                        <span className="text-[10px] font-normal text-[#B0BECE]">Dubai Pressroom &amp; Plant</span>
                      </div>
                    </Link>

                    <Link
                      to="/blog"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#F5F2EB] hover:bg-[#101D35] hover:text-[#D4AF65] transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-[#D4AF65]" />
                      <div>
                        <div className="leading-tight">Printing Insights</div>
                        <span className="text-[10px] font-normal text-[#B0BECE]">Paper stocks &amp; finishing</span>
                      </div>
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[#F5F2EB] hover:bg-[#101D35] hover:text-[#D4AF65] transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-[#D4AF65]" />
                      <div>
                        <div className="leading-tight">Contact &amp; Location</div>
                        <span className="text-[10px] font-normal text-[#B0BECE]">Al Quoz Industrial 4, Dubai</span>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Direct Phone Hotline */}
            <a
              href={`tel:+${RAW_WHATSAPP_NUMBER}`}
              className="hidden 2xl:inline-flex items-center gap-1.5 h-8.5 px-2.5 rounded-full border border-[#203357] bg-[#101D35] hover:bg-[#172644] hover:border-[#D4AF65] text-xs font-bold text-[#F5F2EB] transition-all whitespace-nowrap shadow-2xs"
              title={`Direct Pressroom Hotline: ${FORMATTED_PHONE}`}
              aria-label="Call Pressroom"
            >
              <Phone className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span className="hidden min-[1680px]:inline text-[11px] font-semibold">{FORMATTED_PHONE}</span>
            </a>

            {/* Quick Search Capsule Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex h-8.5 w-8.5 min-[1600px]:w-auto min-[1600px]:px-3 items-center justify-center gap-2 rounded-full border border-[#203357] bg-[#101D35] hover:bg-[#172644] hover:border-[#D4AF65] text-xs text-[#F5F2EB] transition-all cursor-pointer group shrink-0"
              title="Search products (Press / or ⌘K)"
              aria-label="Search products"
            >
              <Search className="h-3.5 w-3.5 text-[#D4AF65] group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden min-[1600px]:inline text-[11px] font-medium text-[#B0BECE]">Search...</span>
              <kbd className="hidden min-[1600px]:inline-block rounded-md bg-[#172644] border border-[#203357] px-1 py-0.2 text-[8px] font-bold text-[#B0BECE]">
                ⌘K
              </kbd>
            </motion.button>

            {/* Track Orders Button */}
            <Link
              to="/track-order"
              className="hidden sm:flex relative h-8.5 w-8.5 items-center justify-center rounded-full border border-[#203357] bg-[#172644] text-[#B0BECE] hover:bg-[#203357] hover:text-[#F5F2EB] transition-all shadow-2xs shrink-0"
              title="Track Production & Delivery"
              aria-label="Track order"
            >
              <Truck className="h-3.5 w-3.5" />
            </Link>

            {/* Direct 1-Click WhatsApp CTA + Concierge Popover Toggle */}
            <div className="relative flex items-center shrink-0">
              <div className="inline-flex items-center h-8.5 rounded-full border border-emerald-500 bg-emerald-50 shadow-2xs overflow-hidden">
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-[#25D366] hover:text-white transition-colors cursor-pointer"
                  aria-label="Get Price on WhatsApp"
                  title="Chat directly on WhatsApp"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
                  <span className="hidden min-[420px]:inline text-[11px] font-extrabold">WhatsApp</span>
                  <span className="relative flex h-2 w-2 shrink-0">
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
                  className={`px-1.5 py-1 border-l border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer h-full flex items-center ${
                    whatsappPopoverOpen ? 'bg-emerald-100' : ''
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
                    className="fixed right-3 left-3 sm:left-auto sm:absolute sm:right-0 top-16 sm:top-full sm:mt-2.5 sm:w-76 rounded-2xl border border-[#203357] bg-[#172644] p-4 shadow-2xl z-50 text-[#F5F2EB]"
                  >
                    <div className="flex items-center justify-between border-b border-[#203357] pb-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs">
                          <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#F5F2EB] leading-tight">WhatsApp Concierge</div>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Online • Instant Turnaround</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWhatsappPopoverOpen(false)}
                        className="text-[#B0BECE] hover:text-[#F5F2EB] p-1 rounded-md hover:bg-[#101D35] transition-colors cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-xl bg-[#101D35] p-3 border border-[#203357] mb-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#B0BECE]">Direct Hotline</span>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-sm font-black tracking-tight text-[#D4AF65]">{FORMATTED_PHONE}</span>
                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          className="flex items-center gap-1 rounded-lg bg-[#172644] px-2 py-1 text-[11px] font-bold text-[#F5F2EB] shadow-2xs border border-[#203357] hover:bg-[#203357] transition-colors cursor-pointer shrink-0"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-[#D4AF65]" />
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
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-[#203357] bg-[#101D35] px-2.5 py-1.5 text-xs font-semibold text-[#F5F2EB] hover:bg-[#172644] cursor-pointer shadow-2xs"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF65] text-[#101D35] text-[10px] font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="hidden xl:inline max-w-[70px] truncate">{user?.name || 'Admin'}</span>
                  <ChevronDown className={`h-3 w-3 text-[#B0BECE] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2.5 w-52 rounded-2xl border border-[#203357] bg-[#172644] p-2 shadow-xl z-50 text-[#F5F2EB]"
                    >
                      <div className="px-3 py-2 border-b border-[#203357] mb-1">
                        <div className="font-bold text-xs text-[#F5F2EB] truncate">{user?.name || 'Administrator'}</div>
                        <div className="text-[10px] text-[#B0BECE] truncate">{user?.email}</div>
                      </div>

                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#F5F2EB] hover:text-[#D4AF65] hover:bg-[#101D35] rounded-lg transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4AF65]" />
                        <span>Admin Dashboard</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1 border-t border-[#203357] cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}

            {/* Primary High-Converting CTA Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:block shrink-0"
            >
              <Link
                to="/get-a-quote"
                className="group/cta relative inline-flex items-center gap-1.5 rounded-full bg-[#D4AF65] hover:bg-[#C8B185] px-3.5 lg:px-4 py-1.5 sm:py-2 text-xs font-black text-[#101D35] shadow-sm transition-all whitespace-nowrap overflow-hidden"
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
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex lg:hidden h-8.5 w-8.5 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-[#203357] bg-[#172644] text-[#F5F2EB] hover:bg-[#203357] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

      {/* 3. UNIVERSAL SEARCH MODAL WITH SPRING ANIMATION */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 px-3 sm:px-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl rounded-3xl border border-[#203357] bg-[#172644] p-4 sm:p-6 shadow-2xl text-[#F5F2EB]"
            >
              {/* Search Bar Input */}
              <div className="flex items-center justify-between border-b border-[#203357] pb-3.5 sm:pb-4 gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                  <Search className="h-5 w-5 text-[#D4AF65] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 200+ products, categories, or finishes..."
                    className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#F5F2EB] placeholder:text-[#B0BECE] focus:outline-none min-w-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="rounded-full p-1.5 text-[#B0BECE] hover:text-[#F5F2EB] hover:bg-[#101D35] cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
                {searchQuery.trim() === '' ? (
                  <div className="py-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF65] block mb-2.5">
                      Explore Master Departments (Dubai Pressroom)
                    </span>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 gap-2">
                      {MASTER_DEPARTMENTS.map((dept) => {
                        const Icon = DEPARTMENT_ICONS[dept.slug] || Layers
                        const count = dept.subcategories.reduce((acc, s) => acc + (s.productSlugs?.length || 0), 0)
                        return (
                          <Link
                            key={dept.slug}
                            to={`/categories/${dept.slug}`}
                            onClick={() => setSearchModalOpen(false)}
                            className="p-3 rounded-2xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] hover:bg-[#172644] text-xs font-bold text-[#F5F2EB] transition-all flex items-center justify-between group shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#172644] border border-[#203357] text-[#D4AF65] shrink-0">
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate group-hover:text-[#F5F2EB] transition-colors font-extrabold text-[#F5F2EB]">{dept.shortName || dept.name}</div>
                                <div className="text-[9px] text-[#B0BECE] font-semibold">{count} products</div>
                              </div>
                            </div>
                            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#D4AF65] shrink-0" />
                          </Link>
                        )
                      })}
                      <Link
                        to="/products"
                        onClick={() => setSearchModalOpen(false)}
                        className="p-3 rounded-2xl border border-dashed border-[#D4AF65] bg-[#D4AF65]/10 hover:bg-[#D4AF65]/20 text-xs font-black text-[#F5F2EB] transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-[#D4AF65]" />
                          <span>All 110+ Products</span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4AF65] group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {searchResults.departments?.length > 0 && (
                      <div className="mb-3.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF65] block mb-2">
                          Matching Master Departments
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.departments.map((dept) => {
                            const Icon = DEPARTMENT_ICONS[dept.slug] || Layers
                            return (
                              <Link
                                key={dept.slug}
                                to={`/categories/${dept.slug}`}
                                onClick={() => setSearchModalOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] hover:bg-[#172644] transition-all"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#172644] text-[#D4AF65] border border-[#203357]">
                                    <Icon className="h-3 w-3" />
                                  </div>
                                  <span className="text-xs font-extrabold text-[#F5F2EB]">{dept.name}</span>
                                </div>
                                <ArrowRight className="h-3 w-3 text-[#D4AF65]" />
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {searchResults.products?.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF65] block mb-2">
                          Matching Products ({searchResults.products.length})
                        </span>
                        <div className="space-y-2">
                          {searchResults.products.map((p) => {
                            const imgSrc = p.images?.[0] || p.image || '/assets/products/luxury_business_cards_dubai.jpg'
                            return (
                              <Link
                                key={p._id || p.id}
                                to={`/products/${p.slug}`}
                                onClick={() => setSearchModalOpen(false)}
                                className="group flex items-center justify-between p-2.5 rounded-2xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] hover:bg-[#172644] hover:shadow-xs transition-all gap-3"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-11 w-11 rounded-xl overflow-hidden bg-[#172644] border border-[#203357] shrink-0">
                                    <img
                                      src={imgSrc}
                                      alt={p.name}
                                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <h6 className="text-xs font-black text-[#F5F2EB] group-hover:text-[#D4AF65] transition-colors truncate">{p.name}</h6>
                                      {p.category?.name && (
                                        <span className="hidden sm:inline-block rounded-full bg-[#101D35] border border-[#203357] px-1.5 py-0.2 text-[8px] font-bold text-[#D4AF65] uppercase shrink-0">
                                          {p.category.name}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-[#B0BECE] line-clamp-1 mt-0.5">{p.shortDescription || p.description}</p>
                                  </div>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#D4AF65] group-hover:text-white px-2.5 py-1 rounded-full bg-[#D4AF65]/10 shrink-0">
                                  <span>View &amp; Quote</span>
                                  <ArrowRight className="h-3 w-3" />
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {searchResults.categories?.length > 0 && (
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF65] block mb-2">
                          Matching Categories &amp; Subcategories
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.categories.map((c) => (
                            <Link
                              key={c.slug || c.id}
                              to={`/categories/${c.slug}`}
                              onClick={() => setSearchModalOpen(false)}
                              className="p-2.5 rounded-xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] hover:bg-[#172644] text-xs font-bold text-[#F5F2EB] hover:text-[#D4AF65] transition-colors flex items-center justify-between"
                            >
                              <div className="truncate">
                                <div>{c.name}</div>
                                {c.departmentName && (
                                  <div className="text-[9px] text-[#B0BECE] font-normal">{c.departmentName}</div>
                                )}
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-[#D4AF65] shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.products?.length === 0 && searchResults.categories?.length === 0 && (!searchResults.departments || searchResults.departments.length === 0) && (
                      <div className="py-8 text-center">
                        <p className="text-xs text-[#B0BECE]">No direct matches found for "{searchQuery}".</p>
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative ml-auto flex h-full w-full max-w-md flex-col bg-[#101D35] border-l border-[#203357] shadow-2xl z-50 overflow-hidden text-[#F5F2EB]"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#203357] p-4 shrink-0">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <Logo variant="default" size="sm" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172644] border border-[#203357] text-[#B0BECE] hover:bg-[#203357] hover:text-[#F5F2EB] transition-colors cursor-pointer"
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
                  className="flex w-full items-center justify-between rounded-xl border border-[#203357] bg-[#172644] p-3 text-xs text-[#B0BECE] hover:bg-[#203357] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#D4AF65]" />
                    <span>Search 200+ print products...</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
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
                  className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-[#F5F2EB] transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs shrink-0">
                      <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#F5F2EB]">WhatsApp Concierge</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400">{FORMATTED_PHONE}</span>
                    </div>
                  </div>
                  <span className="rounded-lg bg-[#25D366] text-white px-2.5 py-1 text-[11px] font-bold shadow-xs">
                    Chat
                  </span>
                </a>

                {/* Navigation Items & Master Department Accordions */}
                <div className="space-y-1">
                  {/* Home */}
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] hover:bg-[#172644]"
                  >
                    <span>Home</span>
                  </Link>

                  {/* Business Cards (Highlighted Dubai Flagship) */}
                  <Link
                    to="/business-card-printing-dubai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] bg-[#D4AF65]/10 border border-[#D4AF65]/30"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-[#D4AF65]" />
                      <span>Luxury Business Cards</span>
                    </div>
                    <span className="rounded bg-[#D4AF65] text-[#101D35] px-1.5 py-0.5 text-[9px] font-black uppercase">
                      DUBAI FLAGSHIP
                    </span>
                  </Link>

                  {/* Stamps & Seals (Clearly Visible Main Navigation Item) */}
                  <Link
                    to="/categories/custom-stamps-seals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] bg-[#172644] border border-[#203357] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Stamp className="h-4 w-4 text-[#D4AF65]" />
                      <span>Stamps &amp; Seals</span>
                    </div>
                    <span className="rounded bg-[#D4AF65] text-[#101D35] px-1.5 py-0.5 text-[9px] font-black uppercase">
                      2-HOUR EXPRESS
                    </span>
                  </Link>

                  {/* Stickers & Product Labels (Dedicated Section in Mobile Drawer) */}
                  <Link
                    to="/categories/stickers-labels-printing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] bg-[#172644] border border-[#203357] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[#D4AF65]" />
                      <span>Stickers &amp; Product Labels</span>
                    </div>
                    <span className="rounded bg-[#D4AF65] text-[#101D35] px-1.5 py-0.5 text-[9px] font-black uppercase">
                      WATERPROOF
                    </span>
                  </Link>

                  {/* Master Department Accordions */}
                  <div className="pt-2 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF65] px-3.5 block mb-1">
                      Departments &amp; Catalog
                    </span>

                    <div className="space-y-1 border-y border-[#203357] py-1.5">
                      {MASTER_DEPARTMENTS.map((dept) => {
                        const Icon = DEPARTMENT_ICONS[dept.slug] || Layers
                        const isOpen = mobileOpenDept === dept.slug
                        const count = dept.subcategories.reduce((acc, s) => acc + (s.productSlugs?.length || 0), 0)

                        return (
                          <div key={dept.slug} className="rounded-xl overflow-hidden border border-[#203357] bg-[#172644]">
                            <button
                              type="button"
                              onClick={() => setMobileOpenDept((cur) => (cur === dept.slug ? null : dept.slug))}
                              className="flex w-full items-center justify-between p-3 text-left text-xs font-bold text-[#F5F2EB] hover:bg-[#203357] transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isOpen ? 'bg-[#D4AF65] text-[#101D35]' : 'bg-[#101D35] text-[#B0BECE] border border-[#203357]'} shrink-0`}>
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate font-extrabold text-[#F5F2EB]">{dept.name}</div>
                                  <div className="text-[9px] text-[#B0BECE] font-semibold">{dept.subcategories.length} subcategories • {count} prods</div>
                                </div>
                              </div>
                              <ChevronDown className={`h-4 w-4 text-[#B0BECE] shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#D4AF65]' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="px-3 pb-3 pt-1 border-t border-[#203357] bg-[#101D35] space-y-1"
                                >
                                  <Link
                                    to={`/categories/${dept.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between rounded-lg p-2 text-xs font-black text-[#D4AF65] bg-[#D4AF65]/10 hover:bg-[#D4AF65]/20 mb-2"
                                  >
                                    <span>Explore Department Overview</span>
                                    <ArrowRight className="h-3 w-3" />
                                  </Link>

                                  {dept.subcategories.map((sub) => (
                                    <Link
                                      key={sub.slug}
                                      to={`/categories/${sub.slug}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-[#F5F2EB] hover:bg-[#172644] hover:text-[#D4AF65] transition-colors"
                                    >
                                      <span className="truncate font-medium">{sub.name}</span>
                                      <span className="text-[10px] text-[#B0BECE] font-bold shrink-0">{sub.productSlugs?.length || 0} items</span>
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

                  {/* All Products Catalog Link */}
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-[#D4AF65] hover:bg-[#D4AF65]/10"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#D4AF65]" />
                      <span>All 110+ Products Catalog</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#D4AF65]" />
                  </Link>

                  {/* Services */}
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] hover:bg-[#172644] hover:text-[#D4AF65]"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#D4AF65]" />
                      <span>Printing Services &amp; Solutions</span>
                    </div>
                  </Link>

                  {/* Luxury Finishes Showcase */}
                  <Link
                    to="/finishes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] hover:bg-[#172644] hover:text-[#D4AF65]"
                  >
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-[#D4AF65]" />
                      <span>Luxury Finishes (Foil &amp; 3D UV)</span>
                    </div>
                    <span className="rounded bg-[#D4AF65] text-[#101D35] px-1.5 py-0.5 text-[9px] font-black uppercase">
                      8 CRAFTS
                    </span>
                  </Link>

                  {/* Corporate & Bulk Quotes */}
                  <Link
                    to="/corporate-quotes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] hover:bg-[#172644] hover:text-[#D4AF65]"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#D4AF65]" />
                      <span>Corporate &amp; Bulk Quotes</span>
                    </div>
                    <span className="rounded bg-[#101D35] border border-[#203357] text-[#D4AF65] px-1.5 py-0.5 text-[9px] font-black uppercase">
                      B2B
                    </span>
                  </Link>

                  {/* About */}
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] hover:bg-[#172644] hover:text-[#D4AF65]"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#D4AF65]" />
                      <span>About ONPRINT Pressroom</span>
                    </div>
                  </Link>

                  {/* Blog */}
                  <Link
                    to="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] hover:bg-[#172644] hover:text-[#D4AF65]"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#D4AF65]" />
                      <span>Blog &amp; Insights</span>
                    </div>
                  </Link>

                  {/* Contact */}
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F5F2EB] hover:bg-[#172644] hover:text-[#D4AF65]"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#D4AF65]" />
                      <span>Contact &amp; Pressroom</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-[#203357] p-4 space-y-2 shrink-0 bg-[#0C1629]">
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF65] hover:bg-[#C8B185] py-3 text-sm font-black text-[#101D35] shadow-md transition-all"
                >
                  <span>Get Instant Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#203357] bg-[#172644] py-2.5 text-xs font-bold text-[#B0BECE] hover:bg-[#203357] hover:text-[#F5F2EB] transition-colors shadow-2xs"
                >
                  <Truck className="h-4 w-4 text-[#D4AF65]" />
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
