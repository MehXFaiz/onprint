import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tag,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Phone,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Layers,
  MapPin,
  Check,
  Award,
  Scissors,
  FileCheck,
  AlertCircle,
  Upload,
  Send,
  Boxes,
  Palette,
  Droplets,
  Sun,
  Flame,
  CheckCircle,
  ExternalLink,
  Info
} from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import Reveal from '../../components/Reveal'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import {
  formatStickerInquiry,
  getStickerWhatsAppUrl,
  openWhatsAppDirectly,
  WHATSAPP_PHONE,
  FORMATTED_PHONE,
} from '../../utils/whatsapp'
import {
  trackStickerWhatsAppClick,
  trackStickerQuoteStart,
  trackStickerQuoteSubmit,
  trackWhatsAppClick,
  trackGetQuoteClick,
} from '../../utils/analytics'
import { createQuote } from '../../services/quotes'

// 15 Comprehensive Commercial Sticker Products
const STICKER_PRODUCTS = [
  {
    id: 1301,
    slug: 'die-cut-stickers',
    name: 'Die-Cut Stickers',
    category: 'vinyl',
    badge: 'Bestseller • Custom Contour',
    basePrice: 40,
    minQty: 100,
    image: '/assets/products/stickers/die-cut-vinyl-stickers.jpg',
    description: 'Precision contour-cut through both the vinyl and backing paper to the exact silhouette of your artwork or logo.',
    specs: '100μ Polymeric Vinyl • Waterproof • UV Protective Matte or Gloss',
    shapes: ['Custom Contour', 'Freeform Silhouette', 'Custom Badge'],
    suitableFor: 'Brand Handouts, Laptop Decals, Streetwear Merch, Event Swag',
  },
  {
    id: 1302,
    slug: 'waterproof-vinyl-stickers',
    name: 'Waterproof Vinyl Stickers & Decals',
    category: 'vinyl',
    badge: 'Heavy-Duty • Outdoor Rated',
    basePrice: 45,
    minQty: 100,
    image: '/assets/products/stickers/waterproof-vinyl-stickers.jpg',
    description: 'Industrial-grade weather-resistant vinyl engineered to withstand UAE desert heat (up to 80°C), sun UV, and car washes.',
    specs: 'Permanent Solvent Adhesive • UV Protective Overlaminate • Dishwasher Safe',
    shapes: ['Die-Cut', 'Rectangle', 'Circle', 'Square'],
    suitableFor: 'Vehicles, Outdoor Equipment, Metal Flasks, Industrial Assets',
  },
  {
    id: 1303,
    slug: 'custom-roll-labels',
    name: 'Custom Roll Labels & Product Packaging Stickers',
    category: 'labels',
    badge: 'Machine & Hand Dispensed',
    basePrice: 85,
    minQty: 500,
    image: '/assets/products/stickers/custom-roll-labels.jpg',
    description: 'High-speed roll labels wound onto 25mm (1") or 76mm (3") cores for automated applicator machines or fast manual labeling.',
    specs: 'BOPP Polypropylene Film • 500+ Labels/Roll • Custom Rewind Orientation',
    shapes: ['Roll Circle', 'Roll Rectangle', 'Roll Oval'],
    suitableFor: 'Production Bottling, Beverage Cans, E-Commerce Mailers, Retail Boxes',
  },
  {
    id: 1304,
    slug: 'clear-transparent-stickers',
    name: 'Clear & Transparent Vinyl Stickers',
    category: 'specialty',
    badge: 'Selective White Underprint',
    basePrice: 55,
    minQty: 100,
    image: '/assets/products/stickers/clear-transparent-vinyl-stickers.jpg',
    description: 'Ultra-clear see-through vinyl printed with an opaque white base coat so your graphics remain rich and vivid on glass or dark surfaces.',
    specs: 'Optically Clear Film • Opaque White Ink Layer • No Background Border',
    shapes: ['Custom Cutline', 'Square', 'Circle', 'Window Decal'],
    suitableFor: 'Glass Bottles, Perfume Vials, Window Graphics, Clear Cosmetic Jars',
  },
  {
    id: 1305,
    slug: 'holographic-stickers',
    name: 'Holographic Vinyl Stickers',
    category: 'specialty',
    badge: 'Iridescent Rainbow Sheen',
    basePrice: 65,
    minQty: 100,
    image: '/assets/products/stickers/holographic-foil-stickers.jpg',
    description: 'Eye-catching rainbow metallic prism film that dynamically shimmers in changing light. Adds instant luxury to logos and badges.',
    specs: 'Rainbow Metallized Substrate • High-Gloss Seal • Scratch Resistant',
    shapes: ['Custom Contour', 'Badge', 'Geometric'],
    suitableFor: 'Luxury Branding, Tech Startups, Skate/Gaming Communities, VIP Badges',
  },
  {
    id: 1306,
    slug: 'cosmetic-bottle-labels',
    name: 'Cosmetic, Bottle & Jar Packaging Labels',
    category: 'labels',
    badge: 'Oil & Moisture Proof',
    basePrice: 75,
    minQty: 250,
    image: '/assets/products/stickers/cosmetic-bottle-labels.jpg',
    description: 'Resistant to essential oils, lotions, alcohol, and moisture condensation. Matte anti-fingerprint and soft-touch laminates available.',
    specs: 'BOPP Synthetic Substrate • Oil-Resistant Emulsion • Anti-Scuff Coating',
    shapes: ['Wrap-Around', 'Front & Back Pair', 'Oval', 'Circle Lid'],
    suitableFor: 'Perfumes, Skincare Bottles, Candle Jars, Essential Oils, Shampoos',
  },
  {
    id: 1307,
    slug: 'gold-foil-stickers',
    name: 'Luxury Gold Foil Stamped Stickers & Seals',
    category: 'luxury',
    badge: '24K Metallic Foil Reflection',
    basePrice: 95,
    minQty: 100,
    image: '/assets/products/stickers/gold-foil-stamped-stickers.jpg',
    description: 'Gleaming 24K mirror gold, silver, or rose gold foil hot-stamped on rich matte black or silk white stocks for prestigious packaging seals.',
    specs: 'Metallic Hot Foil Stamping • Embossed Border Option • Premium Adhesive',
    shapes: ['Serrated Notary Seal', 'Circle', 'Monogram Crest', 'Ribbon Tail'],
    suitableFor: 'Luxury Gift Wrapping, Certificate Seals, High-End Chocolatiers, Perfumery',
  },
  {
    id: 1308,
    slug: 'kraft-paper-stickers',
    name: 'Eco-Friendly Kraft Paper Packaging Stickers',
    category: 'eco',
    badge: '100% Recycled & Organic Look',
    basePrice: 50,
    minQty: 100,
    image: '/assets/products/stickers/kraft-eco-friendly-stickers.jpg',
    description: 'Natural brown unbleached kraft paper offering an authentic, organic, rustic aesthetic for artisanal food, coffee, and eco-conscious brands.',
    specs: '100% Recycled Kraft Paper • Compostable Fiber • Natural Matte Uncoated',
    shapes: ['Round', 'Square', 'Custom Contour'],
    suitableFor: 'Specialty Coffee Bags, Artisan Bakeries, Handmade Soaps, Kraft Boxes',
  },
  {
    id: 1309,
    slug: 'domed-epoxy-stickers',
    name: '3D Domed Epoxy Resin Decals & Badges',
    category: 'luxury',
    badge: '3D Crystal Lens Effect',
    basePrice: 110,
    minQty: 50,
    image: '/assets/products/stickers/domed-epoxy-stickers.jpg',
    description: 'Coated with a crystal-clear polyurethane resin dome that magnifies your logo with a 3D tactile feel while protecting against heavy abrasion.',
    specs: 'Self-Healing UV Polyurethane Dome • Scratch-Proof • Heavy Automotive Tack',
    shapes: ['Oval', 'Circle', 'Rectangle', 'Custom Contour'],
    suitableFor: 'Automotive Dealership Badges, Machinery ID, Hardware & Tech Appliances',
  },
  {
    id: 1310,
    slug: 'custom-logo-stickers',
    name: 'Custom Logo Stickers & Brand Decals',
    category: 'vinyl',
    badge: 'Crisp Pre-Press Contour',
    basePrice: 45,
    minQty: 100,
    image: '/assets/products/stickers/die-cut-vinyl-stickers.jpg',
    description: 'High-contrast logo decals produced to your exact corporate brand guidelines with pantone spot-color calibration.',
    specs: 'Color-Calibrated Inkjet • Matte or Gloss Lamination • Zero Background Fringing',
    shapes: ['Exact Logo Cutline', 'Square with Rounded Corners', 'Circle'],
    suitableFor: 'Corporate Identity Kits, Retail Bag Seals, Trade Show Giveaways',
  },
  {
    id: 1311,
    slug: 'round-packaging-stickers',
    name: 'Round & Circle Packaging Stickers',
    category: 'labels',
    badge: 'Standard Box & Bag Seals',
    basePrice: 35,
    minQty: 100,
    image: '/assets/products/stickers/custom-roll-labels.jpg',
    description: 'The everyday staple for retail unboxing. Perfect circular stickers for sealing shopping bags, tissue wrapping, and takeout containers.',
    specs: 'High-Tack Gloss Artboard / Matte Vinyl • Rapid Peel • 25mm to 100mm',
    shapes: ['Perfect 30mm, 40mm, 50mm, 60mm Circles'],
    suitableFor: 'Boutique Packaging, Bakery Bags, Coffee Cups, Shipping Carton Seals',
  },
  {
    id: 1312,
    slug: 'food-packaging-labels',
    name: 'Food Packaging Labels & Freezer-Safe Stickers',
    category: 'labels',
    badge: 'Certified Food & Deep-Freeze',
    basePrice: 60,
    minQty: 250,
    image: '/assets/products/stickers/cosmetic-bottle-labels.jpg',
    description: 'Engineered with certified food-grade adhesives and deep-freeze substrates that will not peel or flag in cold storage down to -20°C.',
    specs: 'Freezer-Grade Acrylic Adhesive • Moisture Repellent • Direct Food Safe Inks',
    shapes: ['Rectangular Nutrition Panel', 'Jar Seal with Safety Tab', 'Oval'],
    suitableFor: 'Gourmet Sauces, Frozen Meals, Honey Jars, Meal-Prep Delivery Containers',
  },
  {
    id: 1313,
    slug: 'qr-code-barcode-labels',
    name: 'QR Code & Variable Barcode Asset Labels',
    category: 'labels',
    badge: 'High-Contrast Scannable',
    basePrice: 50,
    minQty: 100,
    image: '/assets/products/stickers/custom-roll-labels.jpg',
    description: 'Anti-glare matte synthetic stickers engineered for rapid optical scanning by laser and smartphone barcode readers.',
    specs: 'Variable Data Serialization • EAN-13, Code 128, QR Codes • Scuff-Proof',
    shapes: ['Small Asset Rectangle', 'Square QR Code'],
    suitableFor: 'Inventory Tracking, Digital Restaurant Menus, Warehouse Pallets',
  },
  {
    id: 1314,
    slug: 'promotional-handout-stickers',
    name: 'Promotional Event & Giveaway Stickers',
    category: 'vinyl',
    badge: 'Budget Event Handouts',
    basePrice: 40,
    minQty: 250,
    image: '/assets/products/stickers/die-cut-vinyl-stickers.jpg',
    description: 'Economical, high-yield sticker prints with easy crack-and-peel backing designed for mass marketing distributions at Dubai World Trade Centre (DWTC).',
    specs: 'Crack-Back Paper Backing • Fast Dispensing • Vivid Full-Color Digital',
    shapes: ['Die-Cut', 'Rectangle Handout Card', 'Square'],
    suitableFor: 'Exhibitions, Music Festivals, School Marketing, Community Campaigns',
  },
  {
    id: 1315,
    slug: 'bulk-sticker-printing',
    name: 'Bulk Custom Sticker Printing (Rolls & Sheets)',
    category: 'labels',
    badge: 'Tiered Wholesale Rates',
    basePrice: 180,
    minQty: 1000,
    image: '/assets/products/stickers/custom-roll-labels.jpg',
    description: 'High-volume commercial press runs for industrial manufacturers, retail chains, and packaging converters across the UAE.',
    specs: 'Rotary Flexo & Industrial UV Curable Press • Down to AED 0.08 / sticker',
    shapes: ['All Custom Shapes on Rolls or Multi-Item Sheets'],
    suitableFor: 'High-Volume FMCG Brands, Distribution Hubs, Chain Supermarkets',
  },
]

const STICKER_SHAPES = [
  { id: 'die-cut', name: 'Custom Contour Die-Cut', desc: 'Cut through both sticker and liner to your exact logo silhouette.', icon: Scissors },
  { id: 'kiss-cut', name: 'Kiss-Cut Sheet', desc: 'Peelable stickers cut only through vinyl on an easy-to-handle sheet.', icon: Layers },
  { id: 'circle', name: 'Round / Circle', desc: 'Symmetrical circular seals ideal for jars, lids, and packaging boxes.', icon: CheckCircle },
  { id: 'square', name: 'Square & Rectangle', desc: 'Classic straight-edged labels with optional sharp or rounded corners.', icon: Boxes },
  { id: 'roll', name: 'Roll Labels', desc: 'Supplied on machine-ready cores for rapid hand or automatic labeling.', icon: Tag },
  { id: 'domed', name: '3D Domed Epoxy', desc: 'Polyurethane crystal resin dome with automotive-grade durability.', icon: Sparkles },
]

const STICKER_SIZES = [
  { label: '25 × 25 mm (1" x 1")', desc: 'Coins, tiny jar lids, security tags, barcode labels', priceMod: 0 },
  { label: '38 × 38 mm (1.5" x 1.5")', desc: 'Coffee cups, bakery bags, product jar closures', priceMod: 5 },
  { label: '50 × 50 mm (2" x 2")', desc: 'Most popular standard for brand logos, box seals', priceMod: 10 },
  { label: '75 × 75 mm (3" x 3")', desc: 'Laptop decals, water bottles, medium packaging', priceMod: 20 },
  { label: '100 × 100 mm (4" x 4")', desc: 'Shipping mailers, equipment branding, large logos', priceMod: 35 },
  { label: 'Custom Contour Size', desc: 'Laser contour cut to your exact millimetric vector cutline', priceMod: 25 },
]

const STICKER_MATERIALS = [
  { id: 'poly-vinyl', name: '100% Waterproof Heavy-Duty Vinyl', desc: '100μ polymer film. Sun UV, oil, water, and desert heat resistant.', priceMod: 0 },
  { id: 'clear-film', name: 'Ultra-Clear Transparent Film', desc: 'See-through backing with opaque white ink underprint layer.', priceMod: 15 },
  { id: 'holographic', name: 'Iridescent Rainbow Holographic Film', desc: 'Shimmering metallic rainbow reflection that shifts in light.', priceMod: 25 },
  { id: 'gold-foil', name: 'Metallic Hot Stamped 24K Gold Foil', desc: 'Reflective mirror gold, rose gold, or silver foil stamping.', priceMod: 40 },
  { id: 'kraft-paper', name: 'Natural Recycled Brown Kraft Paper', desc: 'Organic, earthy textured paper for artisanal & eco packaging.', priceMod: 10 },
  { id: 'epoxy-resin', name: '3D Polyurethane Epoxy Resin', desc: 'Flexible crystal clear resin lens with high scratch resistance.', priceMod: 60 },
]

const STICKER_FINISHES = [
  { id: 'matte', name: 'UV Protective Silk Matte Lamination', desc: 'Smooth, non-reflective finish that eliminates glare and resists fingerprints.', priceMod: 0 },
  { id: 'gloss', name: 'Ultra-Vibrant High-Gloss Lamination', desc: 'Deep color saturation with maximum water and chemical shine.', priceMod: 0 },
  { id: 'soft-touch', name: 'Velvet Soft-Touch Lamination', desc: 'Luxurious peach-skin tactile feel for prestige cosmetic packaging.', priceMod: 20 },
  { id: 'spot-uv', name: 'Raised 3D Spot Gloss UV Accent', desc: 'Gloss texture raised above a matte background for tactile contrast.', priceMod: 35 },
]

const USE_CASES = [
  { name: 'Cosmetic & Perfume Bottles', desc: 'Oil-proof, alcohol-resistant, waterproof films that do not peel with moisture.' },
  { name: 'Food Jars, Honey & Bakery Boxes', desc: 'Freezer-grade adhesives (-20°C) and food packaging compliance.' },
  { name: 'Candle Packaging & Tins', desc: 'Heat-resistant adhesives that withstand warmth from burning candles.' },
  { name: 'Laptop Decals & Streetwear Swag', desc: 'Thick, scuff-resistant die-cut vinyl handouts that fans love to stick.' },
  { name: 'Corporate E-Commerce Shipping Seals', desc: 'Branded box seals and tamper-evident security tabs for delivery parcels.' },
  { name: 'Coffee Cups & Takeaway Containers', desc: 'Condensation-resistant stickers for hot and iced beverages.' },
]

const VOLUME_TIERS = [
  { qty: 100, label: '100 pcs', discPct: 0, tag: 'Sample / Pilot' },
  { qty: 250, label: '250 pcs', discPct: 8, tag: 'Small Brand' },
  { qty: 500, label: '500 pcs', discPct: 15, tag: 'Most Popular' },
  { qty: 1000, label: '1,000 pcs', discPct: 22, tag: 'Best Value' },
  { qty: 2500, label: '2,500 pcs', discPct: 28, tag: 'Commercial' },
  { qty: 5000, label: '5,000+ pcs', discPct: 35, tag: 'Wholesale Press' },
]

const STICKER_FAQS = [
  {
    question: 'How much does custom sticker printing cost in Dubai?',
    answer: 'Custom stickers at ONPRINT start from AED 40 for 100 die-cut or round vinyl stickers. Unit prices decrease significantly with volume: 1,000 custom vinyl stickers cost approximately AED 0.15–0.18 per piece, and bulk roll labels for packaging start from AED 0.08 per label. Pricing depends on your chosen dimensions, substrate (vinyl, clear, holographic, kraft, foil), and protective lamination.'
  },
  {
    question: 'Are ONPRINT stickers genuinely waterproof and heat-resistant in Dubai summers?',
    answer: 'Yes. Our stickers are printed on industrial 100-micron polymeric PVC and synthetic BOPP polypropylene films with permanent solvent acrylic adhesives. Sealed with UV-inhibiting overlaminates, they resist water immersion, oils, cleaning chemicals, car washes, and ambient Middle Eastern summer temperatures up to 80°C without curling or fading.'
  },
  {
    question: 'What is the difference between Die-Cut and Kiss-Cut stickers?',
    answer: 'Die-cut stickers are cut completely through both the printed vinyl face and the protective backing liner to the exact silhouette of your artwork. Kiss-cut stickers are cut through only the top vinyl layer, leaving the sticker on a larger square or rectangular backing paper, making them easier to peel in fast-paced retail packaging.'
  },
  {
    question: 'Can you print transparent stickers with opaque white ink?',
    answer: 'Yes. Standard CMYK inks are translucent on clear films. ONPRINT utilizes advanced UV curable and eco-solvent press technology that lays down a dense opaque white ink base coat beneath your color artwork, ensuring your logos appear bold and solid even when applied to dark surfaces or tinted glass.'
  },
  {
    question: 'Can you supply custom roll labels for automatic packaging machines?',
    answer: 'Yes. We manufacture precision roll labels compatible with commercial automatic label applicators and tabletop dispensers, supplied on standard 25mm (1 inch) or 76mm (3 inch) inner cardboard cores with customized rewind winding directions (top-off, bottom-off, left, or right).'
  },
  {
    question: 'What is the fastest turnaround time for urgent sticker printing in Dubai?',
    answer: 'We provide Same-Day 4-Hour Express production for print-ready vector artwork approved before 11:00 AM with rapid courier dispatch across Dubai. Standard production turnaround is 1 to 2 business days with express courier delivery across Dubai, Abu Dhabi, Sharjah, and all UAE emirates.'
  },
  {
    question: 'What artwork file formats are required for sticker printing?',
    answer: 'We recommend vector files: Adobe Illustrator (.AI), PDF, EPS, or SVG with fonts outlined and images embedded at 300 DPI in CMYK color mode. Please include a 2mm external bleed. If your design has a custom contour, include the vector cutline as a 100% magenta spot color stroke labeled "CutContour". We also accept high-resolution transparent PNG files.'
  },
  {
    question: 'How do I get a sticker printing quote on WhatsApp?',
    answer: 'Simply select your specifications in our interactive calculator above and click "Get a Sticker Printing Quote on WhatsApp". Your selected sticker type, quantity, size, material, and finish will be prefilled automatically. You can attach your artwork file directly in chat (+44 7344546056) for a free pre-press verification proof.'
  }
]

export default function StickersLandingPage() {
  // Filter for Gallery
  const [activeCategory, setActiveCategory] = useState('all')

  // Live Interactive Calculator States
  const [selectedProduct, setSelectedProduct] = useState(STICKER_PRODUCTS[0])
  const [selectedShape, setSelectedShape] = useState(STICKER_SHAPES[0])
  const [selectedSize, setSelectedSize] = useState(STICKER_SIZES[2]) // 50x50 mm
  const [selectedMaterial, setSelectedMaterial] = useState(STICKER_MATERIALS[0])
  const [selectedFinish, setSelectedFinish] = useState(STICKER_FINISHES[0])
  const [selectedQtyTier, setSelectedQtyTier] = useState(VOLUME_TIERS[2]) // 500 pcs
  const [customQty, setCustomQty] = useState('')
  const [intendedUse, setIntendedUse] = useState('Product Packaging & Branding')
  const [deliveryLocation, setDeliveryLocation] = useState('Dubai, UAE')
  const [additionalRequirements, setAdditionalRequirements] = useState('')

  // Form Modal States
  const [modalOpen, setModalOpen] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerCompany, setCustomerCompany] = useState('')

  // Filtered Products for Gallery
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return STICKER_PRODUCTS
    return STICKER_PRODUCTS.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  // Calculation Logic
  const effectiveQty = useMemo(() => {
    if (customQty && Number(customQty) > 0) return Number(customQty)
    return selectedQtyTier.qty
  }, [customQty, selectedQtyTier])

  const calculatedDiscountPct = useMemo(() => {
    if (effectiveQty >= 5000) return 35
    if (effectiveQty >= 2500) return 28
    if (effectiveQty >= 1000) return 22
    if (effectiveQty >= 500) return 15
    if (effectiveQty >= 250) return 8
    return 0
  }, [effectiveQty])

  const pricingBreakdown = useMemo(() => {
    const base = Number(selectedProduct.basePrice) || 40
    const minQ = Number(selectedProduct.minQty) || 100
    const rawUnit = base / minQ

    const discMultiplier = 1 - calculatedDiscountPct / 100
    const sizeMod = Number(selectedSize.priceMod || 0) / minQ
    const matMod = Number(selectedMaterial.priceMod || 0) / minQ
    const finMod = Number(selectedFinish.priceMod || 0) / minQ

    const adjustedUnit = (rawUnit * discMultiplier) + sizeMod + matMod + finMod
    let subtotal = Math.round(adjustedUnit * effectiveQty * 100) / 100
    subtotal = Math.max(subtotal, 40) // Minimum starting setup

    const vat = Math.round(subtotal * 0.05 * 100) / 100
    const total = Math.round((subtotal + vat) * 100) / 100
    const unitPrice = Math.round((subtotal / effectiveQty) * 100) / 100

    return {
      subtotal,
      vat,
      total,
      unitPrice,
      discountPct: calculatedDiscountPct,
    }
  }, [selectedProduct, selectedSize, selectedMaterial, selectedFinish, effectiveQty, calculatedDiscountPct])

  // Formatted WhatsApp URL based on user prompt template
  const dynamicWhatsAppUrl = useMemo(() => {
    return getStickerWhatsAppUrl({
      stickerType: selectedProduct.name,
      quantity: `${effectiveQty} pcs`,
      size: selectedSize.label,
      material: selectedMaterial.name,
      shape: selectedShape.name,
      finish: selectedFinish.name,
      intendedUse,
      deliveryLocation,
      additionalRequirements: additionalRequirements.trim() || undefined,
    })
  }, [selectedProduct, effectiveQty, selectedSize, selectedMaterial, selectedShape, selectedFinish, intendedUse, deliveryLocation, additionalRequirements])

  const handleWhatsAppClick = (btnLocation) => {
    trackStickerWhatsAppClick({
      sticker_type: selectedProduct.name,
      quantity: effectiveQty,
      button_location: btnLocation,
      source_page: '/sticker-printing-dubai',
    })
    openWhatsAppDirectly(dynamicWhatsAppUrl)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!customerName || !customerPhone) return

    setFormSubmitting(true)
    setFormError(null)
    trackStickerQuoteStart({ sticker_type: selectedProduct.name, source_page: '/sticker-printing-dubai' })

    const refNumber = `ONP-STK-${Math.floor(100000 + Math.random() * 900000)}`

    try {
      await createQuote({
        quoteNumber: refNumber,
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail.trim() || null,
        company: customerCompany.trim() || null,
        productName: `Custom Stickers: ${selectedProduct.name}`,
        quantity: `${effectiveQty} pcs`,
        specs: `Shape: ${selectedShape.name} | Size: ${selectedSize.label} | Material: ${selectedMaterial.name} | Finish: ${selectedFinish.name}`,
        notes: `Intended Use: ${intendedUse} | Location: ${deliveryLocation} | ${additionalRequirements}`,
        status: 'New',
      })

      trackStickerQuoteSubmit({
        sticker_type: selectedProduct.name,
        quantity: effectiveQty,
        material: selectedMaterial.name,
        finish: selectedFinish.name,
        shape: selectedShape.name,
        size: selectedSize.label,
        estimated_value: pricingBreakdown.total,
        source_page: '/sticker-printing-dubai',
      })

      setFormSuccess(true)
      setTimeout(() => {
        openWhatsAppDirectly(dynamicWhatsAppUrl)
      }, 800)
    } catch (err) {
      console.error('Sticker quote submission error:', err)
      setFormError('We encountered an issue saving your quote to our server. Your entered details have been preserved. Tap below to send directly via WhatsApp.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const breadcrumbsList = [
    { name: 'Services', url: '/services' },
    { name: 'Sticker Printing Dubai', url: '/sticker-printing-dubai' },
  ]

  return (
    <div className="bg-[#101D35] text-slate-200 min-h-screen">
      {/* 1. SEO Head Metadata with FAQ & LocalBusiness Schema */}
      <SEOHead
        title="Sticker Printing Dubai | Custom Stickers & Labels | ONPRINT"
        description="Order custom stickers and product labels from ONPRINT in Dubai. Explore available materials, shapes and finishes, and request a quote for your printing requirements."
        keywords="sticker printing dubai, custom stickers dubai, sticker printing in dubai, vinyl sticker printing dubai, waterproof stickers dubai, label printing dubai, product label printing dubai, custom packaging labels uae, die cut stickers dubai, holographic stickers dubai, bulk sticker printing dubai"
        canonicalPath="/sticker-printing-dubai"
        breadcrumbs={breadcrumbsList}
        faqList={STICKER_FAQS}
        ogType="website"
      />

      {/* Sticky Mobile WhatsApp Inquiry Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#101D35]/95 backdrop-blur-md border-t border-[#203357] p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-[#D4AF65] uppercase truncate">Fast Quote on WhatsApp</p>
          <p className="text-xs font-black text-white truncate">{selectedProduct.name}</p>
        </div>
        <button
          type="button"
          onClick={() => handleWhatsAppClick('mobile_sticky_bar')}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
        >
          <WhatsAppIcon className="h-4 w-4 fill-white" />
          <span>Get Quote</span>
        </button>
      </div>

      {/* Hero Section: Section 2 Optimization */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:py-20 border-b border-[#203357] bg-radial-at-t from-[#172644] to-[#101D35]">
        <Container>
          <Breadcrumbs items={breadcrumbsList} />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headings & Intros */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/40 bg-[#172644] px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                    <Sparkles className="h-4 w-4 text-[#D4AF65]" />
                    <span>Dubai Sticker Printing • 100% Waterproof Heavy-Duty Vinyl</span>
                  </div>
                  <Link
                    to="/ar/sticker-printing-dubai"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF65]/60 bg-[#172644] hover:bg-[#D4AF65]/15 px-3 py-1.5 text-xs font-bold text-[#D4AF65] transition-colors shadow-xs"
                    title="النسخة العربية - طباعة استيكرات وملصقات دبي"
                  >
                    <span>🇦🇪 النسخة العربية (Arabic)</span>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
                  Custom Sticker Printing in Dubai
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-sans">
                  Give your products and packaging a professional look with custom stickers from ONPRINT. Explore available sticker types, shapes, sizes, materials, and finishing options for your business. Contact our team for a quotation based on your requirements.
                </p>
              </Reveal>

              {/* Value Highlights */}
              <Reveal delay={0.25}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-2 rounded-xl bg-[#172644]/80 border border-[#203357] p-2.5">
                    <Droplets className="h-4 w-4 text-[#D4AF65] shrink-0" />
                    <span>Waterproof &amp; Oil-Proof</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#172644]/80 border border-[#203357] p-2.5">
                    <Scissors className="h-4 w-4 text-[#D4AF65] shrink-0" />
                    <span>Optical Contour Die-Cut</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#172644]/80 border border-[#203357] p-2.5 col-span-2 sm:col-span-1">
                    <Clock className="h-4 w-4 text-[#D4AF65] shrink-0" />
                    <span>Same-Day / 24h Express</span>
                  </div>
                </div>
              </Reveal>

              {/* Primary Dual CTAs */}
              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppClick('hero_primary_button')}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <WhatsAppIcon className="h-5 w-5 fill-white" />
                    <span>Get a Sticker Printing Quote on WhatsApp</span>
                  </button>

                  <a
                    href="#calculator-section"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF65] bg-[#D4AF65]/10 hover:bg-[#D4AF65]/20 px-5 py-4 text-sm font-bold text-[#D4AF65] transition-all hover:-translate-y-0.5 cursor-pointer text-center"
                  >
                    <span>Instant Price Calculator</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <p className="text-[11px] text-[#B0BECE] mt-2 flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-[#D4AF65]" />
                  <span>Direct Pressroom Hotline: <strong>{FORMATTED_PHONE}</strong> • Free Pre-Press Proofs</span>
                </p>
              </Reveal>
            </div>

            {/* Right Column: Hero Showcase Visual */}
            <div className="lg:col-span-5">
              <Reveal delay={0.2}>
                <div className="relative rounded-3xl border border-[#203357] bg-[#172644] p-4 shadow-2xl overflow-hidden group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0C1629]">
                    <img
                      src="/assets/products/stickers/die-cut-vinyl-stickers.jpg"
                      alt="Custom Die-Cut Sticker Printing Dubai - Waterproof Vinyl"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      width="600"
                      height="450"
                      loading="eager"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="rounded-full bg-[#101D35]/90 border border-[#203357] px-3 py-1 text-[10px] font-black uppercase text-[#D4AF65] backdrop-blur-xs">
                        15 Sticker Styles
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="rounded-lg bg-[#25D366] px-2.5 py-1 text-xs font-bold text-white shadow-md">
                        From AED 40
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-2 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Free CMYK &amp; Bleed Check
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Dubai Production Desk
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 1: Custom Sticker Printing Product Gallery */}
      <section className="py-14 sm:py-20 border-b border-[#203357]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
                COMPLETE COMMERCIAL CATALOGUE
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
                Custom Sticker &amp; Label Product Gallery
              </h2>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Explore our full line of 15 commercial sticker and product packaging solutions produced directly in our Dubai press facility.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#172644] border border-[#203357]">
              {[
                { id: 'all', label: 'All 15 Products' },
                { id: 'vinyl', label: 'Waterproof Vinyl' },
                { id: 'labels', label: 'Product Labels' },
                { id: 'specialty', label: 'Holographic & Clear' },
                { id: 'luxury', label: 'Gold Foil & 3D' },
                { id: 'eco', label: 'Eco Kraft' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#D4AF65] text-[#101D35] shadow-xs'
                      : 'text-[#B0BECE] hover:text-white hover:bg-[#203357]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-[#203357] bg-[#172644] text-[#F5F2EB] p-5 flex flex-col justify-between hover:border-[#D4AF65] transition-all hover:shadow-xl group"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0C1629] mb-4 border border-[#203357]">
                    <img
                      src={prod.image}
                      alt={`${prod.name} Dubai - ONPRINT`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      width="400"
                      height="300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-[#101D35]/90 border border-[#203357] px-2.5 py-0.5 text-[9px] font-black uppercase text-[#D4AF65]">
                        {prod.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#D4AF65] transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#B0BECE] mt-2 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#203357] text-[11px] text-slate-300 space-y-1">
                    <p><strong className="text-white">Specs:</strong> {prod.specs}</p>
                    <p><strong className="text-white">Uses:</strong> {prod.suitableFor}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#203357] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#B0BECE] uppercase block">Starting from</span>
                    <span className="text-base font-black text-[#D4AF65]">AED {prod.basePrice}</span>
                    <span className="text-[10px] text-[#B0BECE] ml-1">/ {prod.minQty} pcs</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/${prod.slug}`}
                      className="rounded-lg border border-[#203357] hover:border-[#D4AF65] bg-[#101D35] px-3 py-2 text-xs font-bold text-white transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(prod)
                        handleWhatsAppClick(`gallery_card_${prod.slug}`)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5 fill-white" />
                      <span>Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Section 2 & 3: Sticker Types, Shapes, Sizes & Dimensions */}
      <section className="py-14 sm:py-20 border-b border-[#203357] bg-[#101D35]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Shapes & Types */}
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
                PRECISION CONTOUR CUTTING
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 mb-6">
                Available Sticker Shapes &amp; Formats
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STICKER_SHAPES.map((shape) => {
                  const IconC = shape.icon
                  return (
                    <div
                      key={shape.id}
                      className="rounded-xl border border-[#203357] bg-[#172644] p-4 space-y-2 hover:border-[#D4AF65] transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-[#D4AF65]/10 flex items-center justify-center text-[#D4AF65]">
                          <IconC className="h-4 w-4" />
                        </div>
                        <h3 className="font-serif text-sm font-bold text-white">{shape.name}</h3>
                      </div>
                      <p className="text-xs text-[#B0BECE] leading-relaxed">{shape.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Sizes & Dimensions */}
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
                METRIC &amp; IMPERIAL STANDARDS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 mb-6">
                Standard Sizes &amp; Dimensions
              </h2>

              <div className="space-y-3">
                {STICKER_SIZES.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[#203357] bg-[#172644] hover:border-[#D4AF65] transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{s.label}</p>
                      <p className="text-[11px] text-[#B0BECE]">{s.desc}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#D4AF65] bg-[#D4AF65]/10 px-2 py-0.5 rounded">
                      Standard
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 4: Materials and Finishes */}
      <section className="py-14 sm:py-20 border-b border-[#203357] bg-[#172644]/50">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
              COMMERCIAL SUBSTRATES &amp; COATINGS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
              Engineered Materials &amp; Luxury Finishes
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Every material option is selected for tactile appeal and durability under UAE ambient temperatures and humidity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STICKER_MATERIALS.map((mat) => (
              <div
                key={mat.id}
                className="rounded-2xl border border-[#203357] bg-[#172644] p-5 space-y-3 hover:border-[#D4AF65] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="h-8 w-8 rounded-lg bg-[#D4AF65]/10 flex items-center justify-center text-[#D4AF65]">
                    <Layers className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-bold text-[#D4AF65] bg-[#101D35] px-2 py-0.5 rounded border border-[#203357]">
                    100% Tested
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-white">{mat.name}</h3>
                <p className="text-xs text-[#B0BECE] leading-relaxed">{mat.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#203357]">
            {STICKER_FINISHES.map((fin) => (
              <div key={fin.id} className="p-4 rounded-xl bg-[#101D35] border border-[#203357]">
                <p className="text-xs font-bold text-white">{fin.name}</p>
                <p className="text-[11px] text-[#B0BECE] mt-1">{fin.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Section 5 & 6: Use Cases: Packaging, Bottles, Jars & Brand Merch */}
      <section className="py-14 sm:py-20 border-b border-[#203357] bg-[#101D35]">
        <Container>
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
              DUBAI SECTOR SOLUTIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
              Product Labels, Bottles, Jars &amp; Brand Decals
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              From artisan bakeries in Al Quoz and luxury perfumers in Downtown to fast-growing D2C e-commerce brands across the UAE.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((uc, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#203357] bg-[#172644] p-5 space-y-2 hover:border-[#D4AF65] transition-all"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF65] shrink-0" />
                  <h3 className="font-serif text-sm font-bold text-white">{uc.name}</h3>
                </div>
                <p className="text-xs text-[#B0BECE] leading-relaxed pl-6">{uc.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Section 7 & 8: Interactive Sticker Cost & Quote Calculator */}
      <section id="calculator-section" className="py-14 sm:py-20 border-b border-[#203357] bg-[#172644]">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF65]/10 border border-[#D4AF65] px-3.5 py-1 text-xs font-black uppercase text-[#D4AF65]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>LIVE INTERACTIVE ESTIMATOR</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-3">
              Configure Your Custom Sticker Quotation
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Choose your specifications below to calculate estimated pricing and generate your instant prefilled WhatsApp inquiry message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Specification Selectors */}
            <div className="lg:col-span-7 bg-[#101D35] rounded-3xl border border-[#203357] p-6 sm:p-8 space-y-6">
              {/* Product Type Selector */}
              <div>
                <label className="block text-xs font-black uppercase text-[#D4AF65] mb-2">
                  1. Select Sticker Style
                </label>
                <select
                  value={selectedProduct.slug}
                  onChange={(e) => {
                    const found = STICKER_PRODUCTS.find((p) => p.slug === e.target.value)
                    if (found) setSelectedProduct(found)
                  }}
                  className="w-full rounded-xl border border-[#203357] bg-[#172644] px-4 py-3 text-xs font-bold text-white focus:border-[#D4AF65] focus:outline-none"
                >
                  {STICKER_PRODUCTS.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} (from AED {p.basePrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* Shape Selector */}
              <div>
                <label className="block text-xs font-black uppercase text-[#D4AF65] mb-2">
                  2. Cutting Shape / Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STICKER_SHAPES.map((sh) => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => setSelectedShape(sh)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        selectedShape.id === sh.id
                          ? 'border-[#D4AF65] bg-[#D4AF65]/15 text-[#D4AF65]'
                          : 'border-[#203357] bg-[#172644] text-[#B0BECE] hover:text-white'
                      }`}
                    >
                      {sh.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <label className="block text-xs font-black uppercase text-[#D4AF65] mb-2">
                  3. Dimensions / Size
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STICKER_SIZES.map((sz, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        selectedSize.label === sz.label
                          ? 'border-[#D4AF65] bg-[#D4AF65]/15 text-[#D4AF65]'
                          : 'border-[#203357] bg-[#172644] text-[#B0BECE] hover:text-white'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material & Finish */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#D4AF65] mb-2">
                    4. Adhesive Substrate
                  </label>
                  <select
                    value={selectedMaterial.id}
                    onChange={(e) => {
                      const found = STICKER_MATERIALS.find((m) => m.id === e.target.value)
                      if (found) setSelectedMaterial(found)
                    }}
                    className="w-full rounded-xl border border-[#203357] bg-[#172644] px-3.5 py-2.5 text-xs font-bold text-white focus:border-[#D4AF65] focus:outline-none"
                  >
                    {STICKER_MATERIALS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#D4AF65] mb-2">
                    5. Protective Finish
                  </label>
                  <select
                    value={selectedFinish.id}
                    onChange={(e) => {
                      const found = STICKER_FINISHES.find((f) => f.id === e.target.value)
                      if (found) setSelectedFinish(found)
                    }}
                    className="w-full rounded-xl border border-[#203357] bg-[#172644] px-3.5 py-2.5 text-xs font-bold text-white focus:border-[#D4AF65] focus:outline-none"
                  >
                    {STICKER_FINISHES.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity Tiers */}
              <div>
                <label className="block text-xs font-black uppercase text-[#D4AF65] mb-2">
                  6. Batch Quantity (Volume Tier Discounts)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {VOLUME_TIERS.map((tier) => (
                    <button
                      key={tier.qty}
                      type="button"
                      onClick={() => {
                        setSelectedQtyTier(tier)
                        setCustomQty('')
                      }}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        !customQty && selectedQtyTier.qty === tier.qty
                          ? 'border-[#D4AF65] bg-[#D4AF65]/15 text-[#D4AF65] font-black'
                          : 'border-[#203357] bg-[#172644] text-[#B0BECE] hover:text-white font-bold'
                      }`}
                    >
                      <div className="text-xs">{tier.label}</div>
                      {tier.discPct > 0 && (
                        <div className="text-[9px] text-emerald-600 font-extrabold">-{tier.discPct}%</div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-[#B0BECE]">Or custom qty:</span>
                  <input
                    type="number"
                    min="50"
                    placeholder="e.g. 750"
                    value={customQty}
                    onChange={(e) => setCustomQty(e.target.value)}
                    className="w-32 rounded-lg border border-[#203357] bg-[#172644] px-3 py-1.5 text-xs font-bold text-white focus:border-[#D4AF65] focus:outline-none"
                  />
                  <span className="text-xs text-[#B0BECE]">units</span>
                </div>
              </div>

              {/* Intended Use & Delivery Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#D4AF65] mb-1">
                    7. Intended Use (Optional)
                  </label>
                  <input
                    type="text"
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value)}
                    placeholder="e.g. Bottle label, box seal"
                    className="w-full rounded-xl border border-[#203357] bg-[#172644] px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF65] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-[#D4AF65] mb-1">
                    8. Delivery Location
                  </label>
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="Dubai, UAE"
                    className="w-full rounded-xl border border-[#203357] bg-[#172644] px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF65] focus:outline-none"
                  />
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-black uppercase text-[#D4AF65] mb-1">
                  9. Additional Requirements / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. Need 2mm bleed check, vector cutline review"
                  className="w-full rounded-xl border border-[#203357] bg-[#172644] px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF65] focus:outline-none"
                />
              </div>
            </div>

            {/* Right: Price Breakdown & Prominent WhatsApp Button */}
            <div className="lg:col-span-5 bg-[#101D35] rounded-3xl border border-[#203357] p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
              <div className="border-b border-[#203357] pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF65]">
                  ESTIMATED QUOTATION
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-[#B0BECE]">
                  {effectiveQty} units • {selectedShape.name} • {selectedSize.label}
                </p>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Batch Production:</span>
                  <span className="font-bold text-white">AED {pricingBreakdown.subtotal.toFixed(2)}</span>
                </div>
                {pricingBreakdown.discountPct > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Volume Tier Discount:</span>
                    <span>-{pricingBreakdown.discountPct}%</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Standard UAE VAT (5%):</span>
                  <span>AED {pricingBreakdown.vat.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#203357] pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Estimated Total:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#D4AF65]">
                      AED {pricingBreakdown.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#B0BECE] block">
                      (~AED {pricingBreakdown.unitPrice.toFixed(2)} per sticker)
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4 WhatsApp Prefilled CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleWhatsAppClick('calculator_primary_button')}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-4 px-4 text-xs sm:text-sm font-black text-white shadow-xl shadow-emerald-600/30 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  <WhatsAppIcon className="h-5 w-5 fill-white shrink-0" />
                  <span>Get a Sticker Printing Quote on WhatsApp</span>
                </button>

                {/* Alternative Route if WhatsApp unavailable */}
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="w-full rounded-xl border border-[#203357] hover:border-[#D4AF65] bg-[#172644] py-3 px-4 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  Or Submit Official Quotation Form
                </button>
              </div>

              {/* Live Preview of Prefilled WhatsApp Message */}
              <div className="rounded-xl bg-[#172644]/70 border border-[#203357] p-3.5 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-[#D4AF65]">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Prefilled WhatsApp Inquiry Format:</span>
                </div>
                <pre className="text-[#B0BECE] font-mono text-[10px] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto bg-[#0C1629] p-2 rounded-lg border border-[#203357]">
                  {formatStickerInquiry({
                    stickerType: selectedProduct.name,
                    quantity: `${effectiveQty} pcs`,
                    size: selectedSize.label,
                    material: selectedMaterial.name,
                    shape: selectedShape.name,
                    finish: selectedFinish.name,
                    intendedUse,
                    deliveryLocation,
                    additionalRequirements: additionalRequirements.trim() || undefined,
                  })}
                </pre>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#B0BECE]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  No Hidden Setup Fees
                </span>
                <span className="flex items-center gap-1">
                  <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Free PDF Proof
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 9: Artwork & Print-Ready File Requirements */}
      <section className="py-14 sm:py-20 border-b border-[#203357] bg-[#101D35]">
        <Container>
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
              PRE-PRESS SPECIFICATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
              Artwork &amp; Print-Ready File Guidelines
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Our pre-press technicians inspect every file prior to press execution to prevent blurry typography or cutline misalignment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-[#203357] bg-[#172644] p-5 space-y-2">
              <span className="h-8 w-8 rounded-lg bg-[#D4AF65]/10 flex items-center justify-center text-[#D4AF65] font-bold text-xs">
                01
              </span>
              <h3 className="font-serif text-sm font-bold text-white">Vector File Formats</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Preferred: Adobe Illustrator (.AI), Vector PDF, EPS, or SVG. We also accept high-res transparent PNGs (300 DPI minimum).
              </p>
            </div>

            <div className="rounded-2xl border border-[#203357] bg-[#172644] p-5 space-y-2">
              <span className="h-8 w-8 rounded-lg bg-[#D4AF65]/10 flex items-center justify-center text-[#D4AF65] font-bold text-xs">
                02
              </span>
              <h3 className="font-serif text-sm font-bold text-white">Bleed &amp; Safety Zone</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Provide a 2mm external bleed beyond the contour cutline. Keep text and essential logo elements 2mm inside the cutline.
              </p>
            </div>

            <div className="rounded-2xl border border-[#203357] bg-[#172644] p-5 space-y-2">
              <span className="h-8 w-8 rounded-lg bg-[#D4AF65]/10 flex items-center justify-center text-[#D4AF65] font-bold text-xs">
                03
              </span>
              <h3 className="font-serif text-sm font-bold text-white">CMYK Color Mode</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Convert all RGB elements to CMYK to prevent color shifts. Pantone spot color matches available upon request.
              </p>
            </div>

            <div className="rounded-2xl border border-[#203357] bg-[#172644] p-5 space-y-2">
              <span className="h-8 w-8 rounded-lg bg-[#D4AF65]/10 flex items-center justify-center text-[#D4AF65] font-bold text-xs">
                04
              </span>
              <h3 className="font-serif text-sm font-bold text-white">Cutline Designation</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Designate your contour cutline with a 100% Magenta spot color stroke labeled &apos;CutContour&apos;. Free assistance provided!
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 10: Production & Delivery Information */}
      <section className="py-14 sm:py-20 border-b border-[#203357] bg-[#172644]/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
                DUBAI PRODUCTION & LOGISTICS
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Production &amp; UAE-Wide Express Delivery
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Serving Dubai and the wider UAE, ONPRINT provides high-precision digital sticker printing, die-cutting, and rapid courier delivery directly to your doorstep.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Same-Day 4-Hour Express Courier Delivery</h4>
                    <p className="text-xs text-[#B0BECE]">Available for print-ready vector artwork approved before 11:00 AM.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">UAE Next-Day Delivery (All Emirates)</h4>
                    <p className="text-xs text-[#B0BECE]">Express courier dispatch directly to offices in Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, and Fujairah.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Secure Moisture-Sealed Packaging</h4>
                    <p className="text-xs text-[#B0BECE]">Shrink-wrapped in poly-bundles and packed in reinforced protective cartons to prevent corner damage.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-[#203357] bg-[#101D35] p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#D4AF65]" />
                <span>Express Doorstep Delivery in Dubai &amp; UAE</span>
              </h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                ONPRINT Online Printing &amp; Logistics<br />
                Direct doorstep dispatch to offices, studios &amp; residences across Dubai (Downtown, DIFC, Business Bay, Marina, Deira) and all 7 Emirates.<br />
                Fully tracked delivery with WhatsApp status updates.
              </p>
              <div className="border-t border-[#203357] pt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleWhatsAppClick('pressroom_location_card')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Chat with Production Desk</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 11: Frequently Asked Questions (FAQ) with Schema */}
      <section className="py-14 sm:py-20 border-b border-[#203357] bg-[#101D35]">
        <Container>
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
              Sticker Printing Dubai FAQs
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Everything you need to know about custom sticker materials, weatherproof durability, pricing, and ordering in Dubai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STICKER_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#203357] bg-[#172644] p-6 space-y-2 hover:border-[#D4AF65] transition-colors"
              >
                <h3 className="font-serif text-base font-bold text-white">
                  {faq.question}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Section 11.5: GEO FactSheet for AI-Assisted Search & Perplexity / Gemini Optimization */}
      <section id="geo-factsheet" className="py-14 sm:py-20 border-b border-[#203357] bg-[#172644]/40">
        <Container>
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
              GEO &amp; SEARCH ENGINE SPECIFICATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              ONPRINT Commercial Pressroom FactSheet: Dubai Operations
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Verified operational capabilities, material certifications, minimum order quantities (MOQ), and turnaround guidelines for business procurement and AI search agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl border border-[#203357] bg-[#101D35] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#D4AF65]">Operating Facility</span>
              <h3 className="font-serif text-sm font-bold text-white">Dubai Production &amp; Courier Hub</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Industrial digital printing presses serving Dubai and the UAE with Roland Eco-Solvent, UV flatbed, and digital contour cutting plotters.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#203357] bg-[#101D35] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#D4AF65]">Substrate Range</span>
              <h3 className="font-serif text-sm font-bold text-white">7 Commercial Substrates</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                100μ Polymeric Vinyl, Ultra-Clear Film (with opaque white underprint), Rainbow Holographic, 24K Hot Stamped Gold Foil, 100% Recycled Kraft, Food-Safe BOPP, and 3D Epoxy Resin.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#203357] bg-[#101D35] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#D4AF65]">Weather &amp; Heat Durability</span>
              <h3 className="font-serif text-sm font-bold text-white">-20°C to +80°C Rating</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Engineered for UAE summers: UV-inhibited face stocks and permanent solvent acrylic glues resist direct sunlight, car washes, humidity condensation, and commercial dishwashers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#203357] bg-[#101D35] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#D4AF65]">Batch MOQs &amp; Wholesale</span>
              <h3 className="font-serif text-sm font-bold text-white">50 pcs to 50,000+ pcs</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Flexible short-run pilot runs from 50 to 100 units starting at AED 40. High-volume rotary roll labels scaled down to AED 0.08 per piece for UAE FMCG brands.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#203357] bg-[#101D35] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#D4AF65]">Delivery Timelines</span>
              <h3 className="font-serif text-sm font-bold text-white">Same-Day 4-Hour Express</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Rush same-day pickup and courier in Dubai for files approved by 11:00 AM. Tracked 24–48h express delivery across Abu Dhabi, Sharjah, Ajman, RAK, and Fujairah.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#203357] bg-[#101D35] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#D4AF65]">Artwork Inspection</span>
              <h3 className="font-serif text-sm font-bold text-white">Free Pre-Press Verification</h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                Every customer order receives a complimentary 300 DPI resolution, CMYK profile, and vector cutline inspection with digital PDF approval before press execution.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 11.6: Supporting Customer Guides (Section 7) */}
      <section className="py-14 sm:py-20 border-b border-[#203357] bg-[#101D35]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
                TECHNICAL KNOWLEDGE BASE
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
                Helpful Guides for Sticker &amp; Label Buyers
              </h2>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Practical guides written by our Dubai print specialists to help UAE businesses choose materials, format artwork, and reduce packaging costs.
              </p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF65] hover:underline shrink-0"
            >
              <span>View All Technical Guides</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                title: 'How to Choose the Right Sticker Material for Your Product',
                slug: 'how-to-choose-stickers-product-packaging-dubai',
                readTime: '8 min read',
                desc: 'Compare vinyl, BOPP, kraft, and clear substrates for cartons, pouches, and delivery boxes.',
              },
              {
                title: 'Waterproof vs. Standard Stickers: Which Should You Choose?',
                slug: 'vinyl-stickers-vs-paper-stickers-uae',
                readTime: '7 min read',
                desc: 'Climate durability tests: how Dubai heat and condensation impact paper labels vs polymeric vinyl.',
              },
              {
                title: 'How to Prepare Artwork for Custom Sticker Printing',
                slug: 'how-to-prepare-artwork-sticker-printing-dubai',
                readTime: '8 min read',
                desc: 'Setting up 2mm bleed margins, vector contour cutlines, CMYK colors, and white ink underprints.',
              },
              {
                title: 'Custom Product Labels for Packaging: Sizes, Materials and Finishes',
                slug: 'labels-for-bottles-and-jars-guide-uae',
                readTime: '7 min read',
                desc: 'Complete sizing and oil-resistant substrate guidelines for cosmetic bottles and food jars.',
              },
              {
                title: 'How Businesses Can Use Branded Stickers for Packaging',
                slug: 'how-to-choose-sticker-sizes-and-finishes-brand',
                readTime: '8 min read',
                desc: 'Unboxing psychology: elevating brand perception with 24K gold foil, velvet touch, and box seals.',
              },
            ].map((art, idx) => (
              <Link
                key={idx}
                to={`/blog/${art.slug}`}
                className="rounded-2xl border border-[#203357] bg-[#172644] p-4 flex flex-col justify-between hover:border-[#D4AF65] hover:shadow-lg transition-all group"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#D4AF65] block mb-2">
                    {art.readTime}
                  </span>
                  <h3 className="font-serif text-xs font-bold text-white group-hover:text-[#D4AF65] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-[#B0BECE] mt-2 line-clamp-3 leading-relaxed">
                    {art.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#203357] flex items-center gap-1 text-[11px] font-bold text-[#D4AF65]">
                  <span>Read Guide</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Section 11.7: Related Commercial Printing Services */}
      <section className="py-12 sm:py-16 border-b border-[#203357] bg-[#172644]/50">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF65]">
                EXPAND YOUR CORPORATE BRANDING
              </span>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-white mt-1">
                Related Commercial Printing Services in Dubai
              </h2>
            </div>
            <Link to="/services" className="text-xs font-bold text-[#D4AF65] hover:underline flex items-center gap-1">
              <span>All Printing Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/business-card-printing-dubai"
              className="p-4 rounded-xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] transition-all group"
            >
              <h3 className="font-serif text-sm font-bold text-white group-hover:text-[#D4AF65] transition-colors">
                Luxury Business Cards
              </h3>
              <p className="text-xs text-[#B0BECE] mt-1.5 leading-relaxed">
                350gsm to 600gsm cotton, 24K gold foil, raised 3D spot UV, and painted gilded edges in Dubai.
              </p>
              <span className="mt-3 inline-block text-[11px] font-bold text-[#D4AF65]">Explore Cards →</span>
            </Link>

            <Link
              to="/categories/custom-stamps-seals"
              className="p-4 rounded-xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] transition-all group"
            >
              <h3 className="font-serif text-sm font-bold text-white group-hover:text-[#D4AF65] transition-colors">
                Official Company Stamps
              </h3>
              <p className="text-xs text-[#B0BECE] mt-1.5 leading-relaxed">
                Self-inking round LLC seals, notary stamps, and VAT TRN markers with 2-hour rush service.
              </p>
              <span className="mt-3 inline-block text-[11px] font-bold text-[#D4AF65]">Explore Stamps →</span>
            </Link>

            <Link
              to="/services/rollup-banners"
              className="p-4 rounded-xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] transition-all group"
            >
              <h3 className="font-serif text-sm font-bold text-white group-hover:text-[#D4AF65] transition-colors">
                Roll-Up Banners &amp; Stands
              </h3>
              <p className="text-xs text-[#B0BECE] mt-1.5 leading-relaxed">
                Vivid anti-curl rollups (85x200cm) with heavy aluminum cassettes for DWTC exhibitions.
              </p>
              <span className="mt-3 inline-block text-[11px] font-bold text-[#D4AF65]">Explore Banners →</span>
            </Link>

            <Link
              to="/services/luxury-packaging-custom-boxes"
              className="p-4 rounded-xl border border-[#203357] bg-[#101D35] hover:border-[#D4AF65] transition-all group"
            >
              <h3 className="font-serif text-sm font-bold text-white group-hover:text-[#D4AF65] transition-colors">
                Custom Boxes &amp; Packaging
              </h3>
              <p className="text-xs text-[#B0BECE] mt-1.5 leading-relaxed">
                Rigid luxury gift boxes, corrugated shipping mailers, and custom printed product cartons.
              </p>
              <span className="mt-3 inline-block text-[11px] font-bold text-[#D4AF65]">Explore Packaging →</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Final Section 12 Bottom CTA Banner */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#101D35] to-[#0A1222] text-center border-t border-[#203357]">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65] bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#D4AF65]">
              <Sparkles className="h-4 w-4" />
              <span>Ready to Print Custom Stickers in Dubai?</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight">
              Get Your Custom Stickers Printed Fast
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Connect directly with our Dubai production team on WhatsApp for instantaneous quotes, artwork checks, and production schedules.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => handleWhatsAppClick('footer_cta_banner')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-8 py-4 text-sm font-black text-white shadow-xl shadow-emerald-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <WhatsAppIcon className="h-5 w-5 fill-white" />
                <span>Get a Sticker Printing Quote on WhatsApp</span>
              </button>

              <Link
                to="/quote/stickers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#203357] hover:border-[#D4AF65] bg-[#172644] px-6 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              >
                <span>Upload Artwork for Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Quotation Modal Fallback */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-[#203357] bg-[#172644] p-6 sm:p-8 text-white shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#203357] pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold">Request Official PDF Quote</h3>
                  <p className="text-xs text-[#B0BECE]">{selectedProduct.name} • {effectiveQty} pcs</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 text-[#B0BECE] hover:text-white hover:bg-[#203357]"
                >
                  ✕
                </button>
              </div>

              {formSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-600/20 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold">Quotation Request Received!</h4>
                  <p className="text-xs text-slate-300">
                    Our sales estimators will send your itemized PDF proposal to {customerEmail || customerPhone} within 2 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSuccess(false)
                      setModalOpen(false)
                    }}
                    className="mt-4 rounded-xl bg-[#D4AF65] px-6 py-2.5 text-xs font-bold text-[#101D35]"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200 space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white">Direct Server Submission Unavailable</p>
                          <p className="text-[11px] text-amber-200/90">{formError}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          trackStickerWhatsAppClick({
                            source_page: '/sticker-printing-dubai',
                            sticker_type: selectedProduct.name,
                            button_location: 'sticker_modal_error_fallback',
                          })
                          openWhatsAppDirectly(dynamicWhatsAppUrl)
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-4 text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        <WhatsAppIcon className="h-4 w-4 fill-white" />
                        <span>Send Quote via WhatsApp Directly</span>
                      </button>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-[#B0BECE] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Tariq Al Mansoori"
                      className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF65] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#B0BECE] mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+971 50 123 4567"
                        className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF65] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#B0BECE] mb-1">Email Address</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="tariq@brand.ae"
                        className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF65] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#B0BECE] mb-1">Company / Brand Name</label>
                    <input
                      type="text"
                      value={customerCompany}
                      onChange={(e) => setCustomerCompany(e.target.value)}
                      placeholder="e.g. Al Quoz Roastery LLC"
                      className="w-full rounded-xl border border-[#203357] bg-[#101D35] px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF65] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-3.5 bg-[#D4AF65] hover:bg-[#C8B185] text-[#101D35] font-black rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#D4AF65]/25"
                  >
                    {formSubmitting ? 'Submitting Request…' : 'Submit Quotation Request →'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
