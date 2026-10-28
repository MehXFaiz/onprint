import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, ShieldCheck, Truck, RotateCcw, HelpCircle, Compass, Image as ImageIcon, Layers, ZoomIn } from 'lucide-react'
import Container from '../../components/Container'
import Button from '../../components/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import Breadcrumbs from '../../components/Breadcrumbs'
import SEOHead from '../../components/SEOHead'
import ProductCard from '../../components/ProductCard'
import Product360Viewer from '../../components/Product360Viewer'
import { getProductBySlug, getProducts } from '../../services/products'
import { getProductImage, getProductCategoriesWithImages, getAllProductCategoryImages } from '../../assets/productImages'
import { trackViewProduct, trackGetQuoteClick, trackProductInquiry, trackProductInquiryClick, trackWhatsAppClick, trackContactFormStart } from '../../utils/analytics'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { getServiceWhatsAppUrl, getProductInquiryButtonLabel } from '../../utils/whatsapp'
import ProductReviewsSection from '../../components/ProductReviewsSection'

const CARD_FALLBACK_SIZES = [
  { label: 'EU Standard (85 × 55 mm)', priceModifier: 0 },
  { label: 'US Standard (90 × 50 mm)', priceModifier: 0 },
  { label: 'Square (65 × 65 mm)', priceModifier: 15 },
]

const CARD_FALLBACK_MATERIALS = [
  { label: '350 GSM Premium Silk Artboard', priceModifier: 0 },
  { label: '400 GSM Heavyweight Matte', priceModifier: 25 },
  { label: '450 GSM Velvet Soft-Touch', priceModifier: 50 },
  { label: '600 GSM Archival Italian Cotton', priceModifier: 95 },
]

const CARD_FALLBACK_FINISHES = [
  { label: 'Standard Matte Lamination', priceModifier: 0 },
  { label: '24K Hot Stamped Gold Foil', priceModifier: 75 },
  { label: 'Raised 3D Spot UV (Scodix)', priceModifier: 65 },
  { label: 'Blind Letterpress Debossing', priceModifier: 85 },
  { label: 'Gold Gilded / Painted Edges', priceModifier: 95 },
]

const STICKER_FALLBACK_SIZES = [
  { label: '50 × 50 mm (Standard)', priceModifier: 0 },
  { label: '75 × 75 mm (Medium)', priceModifier: 15 },
  { label: '100 × 100 mm (Large)', priceModifier: 30 },
  { label: 'Custom Die-Cut Contour', priceModifier: 20 },
]

const STICKER_FALLBACK_MATERIALS = [
  { label: 'Gloss Waterproof Vinyl', priceModifier: 0 },
  { label: 'Matte Waterproof Vinyl', priceModifier: 5 },
  { label: 'Clear Transparent Vinyl', priceModifier: 15 },
  { label: 'Kraft Paper (Eco-Friendly)', priceModifier: 10 },
  { label: 'Metallic Gold / Holographic', priceModifier: 25 },
]

const STICKER_FALLBACK_FINISHES = [
  { label: 'UV Protective Gloss Lamination', priceModifier: 0 },
  { label: 'Silk Matte Soft-Touch', priceModifier: 10 },
  { label: 'Raised Spot Gloss 3D', priceModifier: 35 },
  { label: '24K Gold Hot Foil Accent', priceModifier: 45 },
]

function getCategorySpecProfile(product) {
  if (!product) {
    return {
      sizes: CARD_FALLBACK_SIZES,
      materials: CARD_FALLBACK_MATERIALS,
      finishes: CARD_FALLBACK_FINISHES,
      printTech: 'German Heidelberg Speedmaster Offset & HP Indigo HD Digital Press',
      substratesText: '350 GSM Silk Artboard, 400 GSM Matte, 450 GSM Velvet Soft-Touch, 600 GSM Archival Cotton',
      embellishmentsText: '24K Gold & Silver Hot Foil, Raised 3D Spot UV, Blind Debossing, Gilded Painted Edges',
      whoNeedsIt: 'Corporate executives, sales teams, luxury retail brands, and exhibition exhibitors across Dubai and the UAE.',
    }
  }

  const haystack = `${product.name || ''} ${product.slug || ''} ${product.category?.name || ''} ${product.category?.slug || ''}`.toLowerCase()

  if (/sticker|label|decal/.test(haystack)) {
    return {
      sizes: STICKER_FALLBACK_SIZES,
      materials: STICKER_FALLBACK_MATERIALS,
      finishes: STICKER_FALLBACK_FINISHES,
      printTech: 'Roland Eco-Solvent Print & Cut, UV DTF Transfer Press & Rotary Flexo Label System',
      substratesText: 'Waterproof White Vinyl (100μ), Clear Transparent BOPP, Brushed Metallic Foil, Eco Kraft & Holographic Film',
      embellishmentsText: 'Optical Kiss-Cut & Die-Cut Contour, Weatherproof UV Lamination, 3D Crystal Resin & Hot Foil',
      whoNeedsIt: 'F&B cafes, specialty coffee roasters, cosmetic & perfume brands, e-commerce packaging, and industrial logistics across the UAE.',
    }
  }

  if (/stamp|seal|trodat|colop|dater/.test(haystack)) {
    return {
      sizes: [
        { label: '40 × 40 mm Round Official Seal', priceModifier: 0 },
        { label: '47 × 18 mm Rectangular (4–5 Lines)', priceModifier: 0 },
        { label: '58 × 22 mm Large Corporate (6 Lines)', priceModifier: 20 },
        { label: '30 × 30 mm Compact Pocket Stamp', priceModifier: 10 },
      ],
      materials: [
        { label: 'Trodat Printy Self-Inking Casing', priceModifier: 0 },
        { label: 'Heavy-Duty Professional Metal Frame', priceModifier: 45 },
        { label: 'Pre-Inked Flash Microporous Stamp', priceModifier: 25 },
        { label: 'Portable Folding Pocket Casing', priceModifier: 15 },
      ],
      finishes: [
        { label: 'Official Corporate Blue Ink', priceModifier: 0 },
        { label: 'Archival Document Black Ink', priceModifier: 0 },
        { label: 'Red / Green Accounting Ink', priceModifier: 5 },
        { label: 'Bilingual Arabic + English Layout', priceModifier: 10 },
      ],
      printTech: 'High-Precision CO2 Laser Rubber Engraving & Flash Microporous Exposure Unit',
      substratesText: 'Original Austrian Trodat & Colop Self-Inking Mechanisms, Heavy-Duty Steel Frames, High-Density Laser Rubber',
      embellishmentsText: 'Bilingual Arabic/English Trade License Ring Alignment, Custom Logo Centerpiece, Replaceable Ink Cartridges',
      whoNeedsIt: 'PROs, mainland & free-zone companies, legal offices, accounting departments, clinics, and logistics signatories in Dubai.',
    }
  }

  if (/mug|cup|tumbler/.test(haystack)) {
    return {
      sizes: [
        { label: '11 oz Standard Corporate Mug (325 ml)', priceModifier: 0 },
        { label: '15 oz Executive Large Mug (440 ml)', priceModifier: 10 },
        { label: '350 ml Insulated Travel Tumbler', priceModifier: 25 },
      ],
      materials: [
        { label: 'AAA-Grade Gloss White Ceramic', priceModifier: 0 },
        { label: 'Executive Matte Black / Navy Ceramic', priceModifier: 12 },
        { label: 'Heat-Sensitive Magic Color-Reveal Coating', priceModifier: 18 },
        { label: 'Double-Wall Stainless Steel Interior', priceModifier: 25 },
      ],
      finishes: [
        { label: 'Full-Wrap High-Def Dye Sublimation', priceModifier: 0 },
        { label: 'Raised 3D UV Direct Logo Print', priceModifier: 15 },
        { label: 'Permanent Laser-Engraved Crest', priceModifier: 20 },
        { label: 'Individual White / Kraft Presentation Box', priceModifier: 8 },
      ],
      printTech: '360° Rotary UV LED Direct-to-Object Press & High-Temperature Dye-Sublimation Kiln',
      substratesText: 'AAA-Grade Chip-Resistant Ceramic, Soft-Touch Matte Glaze, Thermochromic Heat-Reveal Coating & 304 Stainless Steel',
      embellishmentsText: 'Dishwasher-Resistant Curing, Wrap-Around Full-Color Graphics, Metallic Rim Accents & Individual Gift Boxing',
      whoNeedsIt: 'Corporate offices, employee onboarding kits, trade show giveaways, hospitality lounges, and promotional campaigns in Dubai.',
    }
  }

  if (/bottle|flask|drinkware/.test(haystack)) {
    return {
      sizes: [
        { label: '500 ml Vacuum Insulated Flask', priceModifier: 0 },
        { label: '750 ml Executive Sports Bottle', priceModifier: 15 },
        { label: '1000 ml Large Thermal Bottle', priceModifier: 25 },
      ],
      materials: [
        { label: '304 Food-Grade Double-Wall Stainless Steel', priceModifier: 0 },
        { label: 'Smart LED Touch-Cap Temperature Flask', priceModifier: 20 },
        { label: 'Matte Powder-Coated Thermal Steel', priceModifier: 15 },
        { label: 'Lightweight Brushed Aluminum / Bamboo Lid', priceModifier: 10 },
      ],
      finishes: [
        { label: 'Permanent Fiber Laser Engraving', priceModifier: 0 },
        { label: '360° Full-Color Rotary UV Print', priceModifier: 18 },
        { label: 'Personalized Individual Name Engraving', priceModifier: 25 },
        { label: 'VIP Cylinder Gift Tube Packaging', priceModifier: 12 },
      ],
      printTech: 'Precision Rotary Fiber Laser Engraving & 360° Cylindrical UV LED Curing System',
      substratesText: 'Food-Grade 304 Double-Wall Vacuum Insulated Stainless Steel, Copper-Lined Thermal Core, Powder-Coated Matte Finishes',
      embellishmentsText: 'Scratch-Proof Laser Etching, Tactile Raised UV Brand Logos, Smart LED Thermal Caps & Individual Gift Boxes',
      whoNeedsIt: 'Corporate wellness programs, VIP client gifting, fitness & sports events, universities, and conferences across the UAE.',
    }
  }

  if (/rollup|roll-up|banner|signage|flag|backdrop|exhibition/.test(haystack)) {
    return {
      sizes: [
        { label: '85 × 200 cm (Standard Retractable)', priceModifier: 0 },
        { label: '100 × 200 cm (Wide Presentation)', priceModifier: 45 },
        { label: '120 × 200 cm (Exhibition Backdrop)', priceModifier: 85 },
        { label: 'Custom Architectural / Stand Dimension', priceModifier: 60 },
      ],
      materials: [
        { label: '440 GSM Blockout Anti-Curl PVC Film', priceModifier: 0 },
        { label: 'Grey-Back Tear-Resistant Polypropylene', priceModifier: 25 },
        { label: 'Double-Sided Heavyweight Blockout Banner', priceModifier: 55 },
        { label: 'Laser-Cut Cast Acrylic / Brushed Aluminum', priceModifier: 90 },
      ],
      finishes: [
        { label: 'Anti-Glare Matte Exhibition Overlaminate', priceModifier: 0 },
        { label: 'Standard Aluminum Cassette + Padded Carry Bag', priceModifier: 0 },
        { label: 'Luxury Broad-Base Teardrop Chrome Stand', priceModifier: 65 },
        { label: 'UV Weatherproof Outdoor Protection', priceModifier: 35 },
      ],
      printTech: '1440 DPI Large-Format Eco-Solvent & Latex Exhibition Press with Optical Contour Finishing',
      substratesText: '440 GSM Anti-Curl Blockout Polypropylene, Heavy-Duty Outdoor PVC Vinyl, Cast Acrylic & Anodized Aluminum Hardware',
      embellishmentsText: 'Studio-Light Anti-Glare Lamination, Reinforced Spring Rollers, Padded Canvas Transport Bags & Express DWTC Delivery',
      whoNeedsIt: 'Trade show exhibitors at DWTC & Expo City, retail malls, conferences, real estate roadshows, and corporate lobbies in Dubai.',
    }
  }

  if (/id-card|id card|name-badge|badge|nameplate|plaque/.test(haystack)) {
    return {
      sizes: [
        { label: 'CR80 Standard ID (86 × 54 mm)', priceModifier: 0 },
        { label: '70 × 25 mm Executive Magnetic Badge', priceModifier: 0 },
        { label: '75 × 30 mm Hospitality Staff Tag', priceModifier: 10 },
      ],
      materials: [
        { label: '760 Micron Solid White CR80 PVC', priceModifier: 0 },
        { label: 'RFID / Mifare 13.56MHz Smart Access Card', priceModifier: 20 },
        { label: 'Brushed Champagne Gold / Silver Aluminum', priceModifier: 15 },
        { label: 'Polished Cast Acrylic / Stainless Steel', priceModifier: 25 },
      ],
      finishes: [
        { label: 'Double-Sided High-Def UV Print', priceModifier: 0 },
        { label: 'Triple-Magnet Clothing-Safe Fastener', priceModifier: 12 },
        { label: 'Crystal Domed Polyurethane Epoxy Coating', priceModifier: 15 },
        { label: 'Slot Punch + Clear Rigid Badge Holder', priceModifier: 8 },
      ],
      printTech: 'High-Definition Direct-to-Card UV LED Press, Thermal Retransfer & Precision Fiber Laser Engraving',
      substratesText: '760 Micron Laminated PVC, Embedded NXP Mifare/RFID Chips, Brushed Anodized Aluminum & Cast Acrylic',
      embellishmentsText: 'Clothing-Safe Triple Neodymium Magnets, Scratch-Proof Polyurethane Domed Resin, Variable Staff Data & Barcode Serialization',
      whoNeedsIt: 'Hotels, airlines, hospitals, corporate headquarters, schools, security contractors, and luxury retail teams across the UAE.',
    }
  }

  if (/lanyard/.test(haystack)) {
    return {
      sizes: [
        { label: '20 mm Executive Width × 900 mm', priceModifier: 0 },
        { label: '15 mm Slim Width × 900 mm', priceModifier: 0 },
        { label: '25 mm Wide Exhibition Strap × 900 mm', priceModifier: 10 },
      ],
      materials: [
        { label: 'Ultra-Smooth Satin Sublimation Polyester', priceModifier: 0 },
        { label: 'Heavy-Duty Ribbed Woven Polyester', priceModifier: 8 },
        { label: 'Eco-Friendly Recycled PET / Bamboo Fiber', priceModifier: 15 },
      ],
      finishes: [
        { label: 'Metal Lobster Trigger Hook + Safety Breakaway', priceModifier: 0 },
        { label: 'Dual Bulldog Clips (No-Twist Event Pass)', priceModifier: 10 },
        { label: 'Detachable Quick-Release Buckle + Retractable Reel', priceModifier: 18 },
      ],
      printTech: 'Double-Sided Edge-to-Edge High-Definition Dye Sublimation & Precision Screen Printing',
      substratesText: 'High-Tensile Satin Polyester, Ribbed Jacquard Weave, Eco-RPET Fabric & Heavy-Duty Die-Cast Metal Hardware',
      embellishmentsText: 'Pantone-Matched Brand Colors, Rear Neck Safety Breakaway Release, Detachable Buckles & Retractable Yo-Yo Reels',
      whoNeedsIt: 'Conferences, exhibitions, corporate offices, schools, government summits, and VIP hospitality events in Dubai.',
    }
  }

  if (/flyer|leaflet|door-hanger|postcard/.test(haystack)) {
    return {
      sizes: [
        { label: 'A5 Standard (148 × 210 mm)', priceModifier: 0 },
        { label: 'A4 Full Page (210 × 297 mm)', priceModifier: 25 },
        { label: 'DL Slim Menu / Event (99 × 210 mm)', priceModifier: 0 },
        { label: 'A6 Compact Pocket (105 × 148 mm)', priceModifier: 0 },
      ],
      materials: [
        { label: '150 GSM Gloss Coated Art Paper', priceModifier: 0 },
        { label: '170 GSM Silk Matte Art Paper', priceModifier: 15 },
        { label: '250 GSM Heavyweight Promotional Card', priceModifier: 30 },
        { label: '300 GSM Luxury Artboard / Recycled Kraft', priceModifier: 45 },
      ],
      finishes: [
        { label: 'Double-Sided Full-Color CMYK Satin', priceModifier: 0 },
        { label: 'High-Gloss UV Protective Lamination', priceModifier: 25 },
        { label: 'Anti-Glare Matte Lamination', priceModifier: 25 },
        { label: 'Precision Bi-Fold / Tri-Fold Scoring', priceModifier: 30 },
      ],
      printTech: 'Heidelberg Speedmaster Commercial Offset & High-Speed HP Indigo Digital Press',
      substratesText: '130 GSM to 350 GSM FSC-Certified Gloss & Silk Matte Art Paper, Uncoated Bond & Natural Brown Kraft',
      embellishmentsText: 'Double-Sided Full-Bleed Printing, Gloss/Matte Lamination, Die-Cut Door Hanger Hooks & Express Same-Day Dispatch',
      whoNeedsIt: 'Restaurants, real estate brokers, retail promotions, clinics, fitness studios, and exhibition marketers across Dubai.',
    }
  }

  if (/brochure|catalog|booklet|menu/.test(haystack)) {
    return {
      sizes: [
        { label: 'A4 Portrait (210 × 297 mm)', priceModifier: 0 },
        { label: 'A4 Landscape (297 × 210 mm)', priceModifier: 15 },
        { label: 'A5 Compact Booklet (148 × 210 mm)', priceModifier: 0 },
        { label: 'Square Executive (210 × 210 mm)', priceModifier: 20 },
      ],
      materials: [
        { label: '170 GSM Silk Inner + 300 GSM Artboard Cover', priceModifier: 0 },
        { label: '200 GSM Heavyweight Matte Art Paper Throughout', priceModifier: 35 },
        { label: 'Waterproof Tear-Proof Synthetic Menu Stock', priceModifier: 55 },
      ],
      finishes: [
        { label: 'Saddle-Stitched (Wire Stapled Spine)', priceModifier: 0 },
        { label: 'PUR Perfect-Bound Square Book Spine', priceModifier: 65 },
        { label: 'Velvet Soft-Touch Cover + Spot UV Logo', priceModifier: 50 },
        { label: 'Precision Tri-Fold / Gate-Fold Creasing', priceModifier: 20 },
      ],
      printTech: 'Heidelberg 4-Color Commercial Offset & Automated Horizon Saddle-Stitch / PUR Perfect Binding Line',
      substratesText: '150–200 GSM Silk & Matte Coated Text Pages, 300–350 GSM Heavyweight Cover Boards & Waterproof Synthetic Substrates',
      embellishmentsText: 'Anti-Crack Spine Scoring, Soft-Touch Velvet Cover Lamination, Raised Spot UV & Metallic Foil Stamping',
      whoNeedsIt: 'Corporate company profiles, real estate developers, luxury hospitality menus, product catalogs, and annual reports in the UAE.',
    }
  }

  if (/letterhead|envelope|folder|notebook|ncr|pad|binder|calendar|sticky|stationery/.test(haystack)) {
    return {
      sizes: [
        { label: 'A4 Corporate Standard (210 × 297 mm)', priceModifier: 0 },
        { label: 'DL / C5 / C4 Corporate Envelope Suite', priceModifier: 0 },
        { label: 'A5 Executive Hardcover / Pad Format', priceModifier: 15 },
      ],
      materials: [
        { label: '120 GSM Smooth Laser-Guaranteed Uncoated', priceModifier: 0 },
        { label: '120 GSM Conqueror Watermarked Laid / Wove', priceModifier: 45 },
        { label: '350 GSM Heavyweight Presentation Board', priceModifier: 35 },
        { label: 'Carbonless 2-Ply / 3-Ply NCR Sequential Paper', priceModifier: 25 },
      ],
      finishes: [
        { label: 'High-Resolution Offset CMYK + Pantone', priceModifier: 0 },
        { label: 'Metallic Gold / Silver Hot Foil Stamping', priceModifier: 55 },
        { label: 'Die-Cut Interlocking Pocket + Business Card Slits', priceModifier: 35 },
        { label: 'Sequential Numbering, Perforation & Spine Binding', priceModifier: 25 },
      ],
      printTech: 'Lithographic Pantone Spot-Color Offset Press, Automated Die-Cutting & Foil Stamping Line',
      substratesText: '100–120 GSM Laser-Guaranteed Uncoated Bond, Conqueror Watermarked Paper, 350 GSM Artboard & Carbonless NCR Sets',
      embellishmentsText: 'High-Heat Office Laser Printer Safe Inks, Blind Embossing, Peel-and-Seal Strips & Die-Cut Document Pockets',
      whoNeedsIt: 'Law firms, financial institutions, medical clinics, corporate offices, logistics companies, and government contractors in Dubai.',
    }
  }

  if (/polo|t-shirt|shirt|hoodie|uniform|vest|cap|tote|bag|lanyard|gift|pen|usb|power-bank|mouse|keychain|award|trophy|coaster|wristband|ribbon/.test(haystack)) {
    return {
      sizes: [
        { label: 'Standard Corporate Sizing / Assorted Mix', priceModifier: 0 },
        { label: 'Executive Gift Box Presentation', priceModifier: 25 },
        { label: 'Custom Branded Specification', priceModifier: 15 },
      ],
      materials: [
        { label: 'Premium Executive Commercial Grade', priceModifier: 0 },
        { label: 'Heavyweight 220 GSM Cotton / Eco Canvas', priceModifier: 15 },
        { label: 'Brushed Metal / PU Leather / Optical Crystal', priceModifier: 30 },
      ],
      finishes: [
        { label: 'Full-Color UV / DTF Brand Logo Print', priceModifier: 0 },
        { label: 'High-Density Multi-Thread Embroidery', priceModifier: 20 },
        { label: 'Precision Fiber Laser Engraving / Debossing', priceModifier: 20 },
      ],
      printTech: 'Multi-Head Industrial Tajima Embroidery, Direct-to-Film (DTF) Heat Press & UV LED Object Customization',
      substratesText: 'Combed Ring-Spun Cotton Pique, Heavyweight Organic Canvas, Anodized Aluminum, PU Leather & K9 Optical Crystal',
      embellishmentsText: 'Colorfast Stitch Embroidery, Engraved Metal Nameplates, Custom Die-Cut Foam Gift Boxes & Individual Polybagging',
      whoNeedsIt: 'Corporate events, staff uniforms, VIP client appreciation gifts, exhibitions, and brand activations across Dubai and the UAE.',
    }
  }

  return {
    sizes: CARD_FALLBACK_SIZES,
    materials: CARD_FALLBACK_MATERIALS,
    finishes: CARD_FALLBACK_FINISHES,
    printTech: 'German Heidelberg Speedmaster Offset & HP Indigo HD Digital Press',
    substratesText: '350 GSM Silk Artboard, 400 GSM Matte, 450 GSM Velvet Soft-Touch, 600–700 GSM Archival Italian Cotton',
    embellishmentsText: '24K Gold & Silver Hot Foil, Raised 3D Spot UV, Blind Debossing, Gilded Painted Edges',
    whoNeedsIt: 'Executives, founders, luxury real estate consultants, hospitality brands, and corporate teams across Dubai and the UAE.',
  }
}

function OptionGroup({ label, options, selected, onSelect }) {
  if (!options?.length) return null
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-primary">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              selected?.label === option.label
                ? 'border-accent bg-accent-soft text-accent shadow-xs'
                : 'border-border bg-surface text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')

  const [activeImage, setActiveImage] = useState(0)
  const [viewMode, setViewMode] = useState('360') // '360' | 'photo'
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState(null)
  const [material, setMaterial] = useState(null)
  const [finish, setFinish] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeCategoryTab, setActiveCategoryTab] = useState(0)
  const [categoryLightbox, setCategoryLightbox] = useState(null)

  const isSticker = useMemo(() => {
    if (!product) return false
    return /sticker|label|decal|packaging/i.test(
      `${product.name || ''} ${product.slug || ''} ${product.category?.name || ''} ${product.category?.slug || ''}`
    )
  }, [product])

  const isCardOrPrint = useMemo(() => {
    if (!product) return false
    return /card|visiting|stationery|print|luxury|cotton|foil|uv|brochure|flyer/i.test(
      `${product.name || ''} ${product.slug || ''} ${product.category?.name || ''}`
    )
  }, [product])

  const categorySpecProfile = useMemo(() => getCategorySpecProfile(product), [product])

  const resolvedSizes = useMemo(() => {
    if (product?.specifications?.sizes?.length) return product.specifications.sizes
    return categorySpecProfile.sizes
  }, [product, categorySpecProfile])

  const resolvedMaterials = useMemo(() => {
    if (product?.specifications?.materials?.length) return product.specifications.materials
    return categorySpecProfile.materials
  }, [product, categorySpecProfile])

  const resolvedFinishes = useMemo(() => {
    if (product?.specifications?.finishes?.length) return product.specifications.finishes
    return categorySpecProfile.finishes
  }, [product, categorySpecProfile])

  useEffect(() => {
    setStatus('loading')
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data)
        setQuantity(data.minimumQuantity || 1)
        const profile = getCategorySpecProfile(data)
        const initSizes = data.specifications?.sizes?.length ? data.specifications.sizes : profile.sizes
        const initMaterials = data.specifications?.materials?.length ? data.specifications.materials : profile.materials
        const initFinishes = data.specifications?.finishes?.length ? data.specifications.finishes : profile.finishes

        setSize(initSizes[0] || null)
        setMaterial(initMaterials[0] || null)
        setFinish(initFinishes[0] || null)
        setActiveImage(0)
        setStatus('ready')

        trackViewProduct({
          product_name: data.name,
          product_id: data._id || data.slug,
          category_name: data.category?.name || 'General Printing',
        })

        // Fetch related products from same category or catalog for internal link architecture
        const catKey = data.category?.slug || data.category?._id || data.category?.id || data.category
        getProducts({ category: catKey || undefined, pageSize: 6 })
          .then((res) => {
            const list = res?.data || res || []
            const filtered = list.filter((p) => (p.slug || p._id) !== (data.slug || data._id)).slice(0, 3)
            setRelatedProducts(filtered)
          })
          .catch(() => {})
      })
      .catch(() => setStatus('error'))
  }, [slug])

  // Volume tier discounts
  const volumeDiscountPct = useMemo(() => {
    if (quantity >= 5000) return 35
    if (quantity >= 2500) return 25
    if (quantity >= 1000) return 20
    if (quantity >= 500) return 12
    if (quantity >= 250) return 6
    return 0
  }, [quantity])

  const pricingBreakdown = useMemo(() => {
    if (!product || product.price == null) return null
    const baseBatch = Number(product.price) || 50
    const minQty = Number(product.minimumQuantity) || 100
    const rawUnit = baseBatch / minQty

    const discMultiplier = 1 - volumeDiscountPct / 100
    const sizeMod = Number(size?.priceModifier || 0)
    const matMod = Number(material?.priceModifier || 0)
    const finMod = Number(finish?.priceModifier || 0)

    const unitWithStock = (rawUnit * discMultiplier) + (sizeMod / minQty) + (matMod / minQty)
    let subtotal = Math.round(((unitWithStock * quantity) + finMod) * 100) / 100
    subtotal = Math.max(subtotal, 40)

    const vatRate = 0.05
    const vatAmount = Math.round(subtotal * vatRate * 100) / 100
    const totalAmount = Math.round((subtotal + vatAmount) * 100) / 100
    const unitPrice = Math.round((subtotal / quantity) * 100) / 100

    return {
      subtotal,
      vatAmount,
      totalAmount,
      unitPrice,
      volumeDiscountPct,
    }
  }, [product, size, material, finish, quantity, volumeDiscountPct])

  const estimatedPrice = useMemo(() => {
    return pricingBreakdown?.totalAmount || null
  }, [pricingBreakdown])

  const enrichedCategories = useMemo(() => getProductCategoriesWithImages(product), [product])
  const allCategoryImagesFlat = useMemo(() => getAllProductCategoryImages(product), [product])

  if (status === 'loading') {
    return (
      <Container className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/3] rounded-3xl bg-black/6" />
          <div className="space-y-4">
            <div className="h-4 w-1/4 rounded-full bg-black/6" />
            <div className="h-8 w-3/4 rounded-full bg-black/8" />
            <div className="h-4 w-full rounded-full bg-black/5" />
            <div className="h-4 w-2/3 rounded-full bg-black/5" />
            <div className="mt-8 h-12 w-1/2 rounded-xl bg-black/6" />
          </div>
        </div>
      </Container>
    )
  }
  if (status === 'error' || !product) {
    return (
      <Container className="py-24">
        <EmptyState title="Product not found" note="It may have been removed or catalog updated." />
        <div className="mt-6 text-center">
          <Button to="/products" variant="outline" icon={false}>
            ← Back to Products Catalog
          </Button>
        </div>
      </Container>
    )
  }

  function handleRequestQuote() {
    trackGetQuoteClick({
      source_page: 'product_detail',
      product_name: product.name,
      category_name: product.category?.name,
      button_location: 'product_detail_request_quote',
    })

    navigate('/get-a-quote', {
      state: {
        product: product.name,
        slug: product.slug,
        quantity,
        size: size?.label,
        material: material?.label,
        finish: finish?.label,
        deliveryLocation: deliveryLocation || undefined,
        notes,
        estimatedPrice,
      },
    })
  }

  const categoryUrl = product.category?.slug
    ? `/categories/${product.category.slug}`
    : product.category?._id
    ? `/products?category=${product.category._id}`
    : '/products'

  
  const isStamp = Boolean(
    product &&
    (product.category?.slug === 'stamps-printing-dubai' ||
      product.category?.slug === 'custom-stamps-seals' ||
      (product.slug && (product.slug.includes('stamp') || product.slug.includes('seal') || product.slug.includes('dater'))))
  )

  const breadcrumbsList = [
    { name: 'Products', url: '/products' },
    ...(product.category ? [{ name: product.category.name, url: categoryUrl }] : []),
    { name: product.name, url: `/products/${product.slug}` },
  ]

  const stampCustomFaqs = [
    {
      question: `What documents are required to make ${product.name} in Dubai, UAE?`,
      answer: `In accordance with UAE regulations, official company stamps require a valid UAE Trade License copy (DED mainland or UAE Freezone) and an authorization letter signed by the authorized manager (or manager's Emirates ID copy). Personal name and doctor stamps do not require a trade license.`,
    },
    {
      question: `How fast can I get ${product.name} delivered in Dubai?`,
      answer: `We provide 2-Hour rush collection at our Al Quoz atelier and same-day delivery across Dubai for orders approved by 2:00 PM. Next-day tracked delivery is provided across Abu Dhabi, Sharjah, and all UAE Emirates.`,
    },
    {
      question: `What ink colors are available for ${product.name}?`,
      answer: `We offer official document-proof blue ink (certified to ISO 14145-2 anti-fraud standard, recommended by UAE banks), classic black, security red, forest green, and royal violet.`,
    },
    {
      question: `Do you verify artwork and Arabic/English spelling before manufacturing?`,
      answer: `Yes, every order includes a complimentary prepress inspection and a digital vector PDF proof sent via WhatsApp before laser engraving to guarantee correct typography and trade license compliance.`,
    },
    {
      question: `What is the lifespan of the internal ink pad for ${product.name}?`,
      answer: `Each Austrian Trodat or Colop casing provides 8,000 to 12,000 crisp impressions before needing an ink pad replacement, which snaps in cleanly without inking your fingers.`,
    },
  ]

  const productFaqs = isStamp ? stampCustomFaqs : [
    {
      question: `What is the minimum order quantity for ${product.name}?`,
      answer: `The minimum order quantity for ${product.name} is ${product.minimumQuantity || 1} units. Volume tier pricing is automatically applied when you increase the order quantity.`,
    },
    {
      question: `What materials, sizes, and finishes are available for ${product.name}?`,
      answer: `We offer customizable dimensions, premium paper and material stocks, and specialty finishes including matte or velvet soft-touch lamination, raised 3D spot UV, and metallic foil stamping where applicable. Select your preferred options above or message us on WhatsApp for custom specifications.`,
    },
    {
      question: `How can I get an exact price or place an order for ${product.name} on WhatsApp?`,
      answer: `Simply select your desired quantity, size, material, and finish on this page, then click "Get Price on WhatsApp" or "Order on WhatsApp". Your selected specifications and the product page link will be pre-filled in your WhatsApp message to our print team.`,
    },
    {
      question: `Do you check artwork files before printing ${product.name}?`,
      answer: `Yes. Every order includes a complimentary prepress artwork inspection (checking 300 DPI resolution, CMYK color mode, and bleed margins) and a digital proof before production begins.`,
    },
    {
      question: `What are the turnaround and delivery options for ${product.name}?`,
      answer: `Standard production takes 24–48 business hours after digital proof approval, with express same-day printing available for urgent corporate requirements and tracked courier delivery to your doorstep.`,
    },
  ]

  return (
    <div className="py-16 sm:py-24">
      {/* Dynamic SEOHead & Product Schema */}
      <SEOHead
        title={product.seoTitle || `${product.name} | Custom Commercial Printing | ONPRINT`}
        description={product.seoDescription || product.description || product.shortDescription}
        keywords={product.seoKeywords || `${product.name.toLowerCase()}, custom ${product.name.toLowerCase()} printing, printing prices and quotations, business card printing, visiting card printing`}
        canonicalPath={`/products/${product.slug}`}
        product={product}
        breadcrumbs={breadcrumbsList}
        faqList={productFaqs}
      />

      <Container className="max-w-6xl">
        <Breadcrumbs
          items={[
            { name: 'Products', path: '/products' },
            ...(product.category ? [{ name: product.category.name, path: categoryUrl }] : []),
            { name: product.name },
          ]}
        />

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Gallery & 360 Viewer */}
          <div className="lg:col-span-6">
            {/* Mode Toggle Switch */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('360')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === '360'
                      ? 'bg-[#D4AF65] text-[#101D35] shadow-xs'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>360° Interactive View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === 'photo'
                      ? 'bg-[#D4AF65] text-[#101D35] shadow-xs'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Static Photo</span>
                </button>
              </div>

              {product.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF65] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </span>
              )}
            </div>

            {/* Viewer Stage */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
              {viewMode === '360' ? (
                <Product360Viewer
                  product={product}
                  autoSpin={true}
                  height="aspect-[4/3]"
                />
              ) : (
                <div className="aspect-[4/3] overflow-hidden bg-accent-soft/40">
                  <img
                    src={product.images?.[activeImage] || getProductImage(product)}
                    alt={product.imageAlt || `${product.name} printing Dubai`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = getProductImage(product)
                    }}
                  />
                </div>
              )}
            </div>

            {viewMode === 'photo' && product.images?.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`aspect-square w-20 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                      activeImage === index ? 'border-accent shadow-xs scale-105' : 'border-border hover:border-primary'
                    }`}
                  >
                    <img
                      src={image || getProductImage(product)}
                      alt={`${product.name} angle ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = getProductImage(product)
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quality & Delivery Assurance */}
            <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-border/80 bg-surface p-6 sm:grid-cols-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-secondary">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                <span>Prepress Proof Included</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-secondary">
                <Truck className="h-5 w-5 text-accent shrink-0" />
                <span>UAE Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-secondary">
                <RotateCcw className="h-5 w-5 text-accent shrink-0" />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Details & Configurator */}
          <div className="lg:col-span-6">
            {product.category?.name && (
              <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                {product.category.name}
              </span>
            )}
            <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {product.seoHeading || product.name}
            </h1>
            {isStamp && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Official Dubai Pressroom:</strong> 2-Hour Express Rush &bull; UAE Trade License Compliant &bull; Trodat &amp; Colop Austrian Casings
                </span>
              </div>
            )}
            <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
              {product.description || product.shortDescription}
            </p>

            {/* Quote & MOQ */}
            <div className="mt-6 flex items-baseline gap-4 border-y border-border/60 py-4">
              <div>
                <span className="text-xs font-semibold text-secondary">Pricing</span>
                <p className="font-display text-xl font-black text-primary">
                  Custom Quote
                </p>
              </div>
              <div className="border-l border-border/60 pl-4">
                <span className="text-xs font-semibold text-secondary">Minimum Order</span>
                <p className="text-sm font-bold text-primary">{product.minimumQuantity || 1} Units</p>
              </div>
            </div>

            {/* Specification Option Selectors */}
            <div className="mt-6 space-y-6">
              {resolvedSizes.length > 0 && (
                <OptionGroup
                  label="Available Sizes / Dimensions"
                  options={resolvedSizes}
                  selected={size}
                  onSelect={setSize}
                />
              )}
              {resolvedMaterials.length > 0 && (
                <OptionGroup
                  label="Paper & Material Stocks"
                  options={resolvedMaterials}
                  selected={material}
                  onSelect={setMaterial}
                />
              )}
              {resolvedFinishes.length > 0 && (
                <OptionGroup
                  label="Specialty Coatings & Finishes"
                  options={resolvedFinishes}
                  selected={finish}
                  onSelect={setFinish}
                />
              )}

              {/* Quantity, Optional Customer Name & Delivery Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-xs font-bold uppercase tracking-wider text-primary">
                    Quantity (Units)
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min={product.minimumQuantity || 1}
                    step={1}
                    value={quantity}
                    onFocus={() =>
                      trackContactFormStart({
                        form_name: 'product_quick_inquiry',
                        product_name: product.name,
                        button_location: 'product_detail_quantity',
                      })
                    }
                    onChange={(e) => setQuantity(Math.max(product.minimumQuantity || 1, parseInt(e.target.value, 10) || 1))}
                    className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-bold text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="customerName" className="block text-xs font-bold uppercase tracking-wider text-primary">
                    Your Name (Optional)
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onFocus={() =>
                      trackContactFormStart({
                        form_name: 'product_quick_inquiry',
                        product_name: product.name,
                        button_location: 'product_detail_name',
                      })
                    }
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ahmed / Sarah"
                    className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="deliveryLocation" className="block text-xs font-bold uppercase tracking-wider text-primary">
                    Delivery Location (Optional)
                  </label>
                  <input
                    id="deliveryLocation"
                    type="text"
                    value={deliveryLocation}
                    onFocus={() =>
                      trackContactFormStart({
                        form_name: 'product_quick_inquiry',
                        product_name: product.name,
                        button_location: 'product_detail_location',
                      })
                    }
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Dubai / Abu Dhabi / Sharjah"
                    className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-primary">
                  Custom Specifications / Pantone Codes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onFocus={() =>
                    trackContactFormStart({
                      form_name: 'product_quick_inquiry',
                      product_name: product.name,
                      button_location: 'product_detail_notes',
                    })
                  }
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention custom sizes, single/double-sided print, embossing, or deadline urgency…"
                  className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              {/* Volume Tiers Quick Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Volume Tier Quantity Presets
                  </p>
                  {volumeDiscountPct > 0 && (
                    <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2.5 py-0.5 shadow-2xs">
                      🎉 {volumeDiscountPct}% Volume Discount Applied
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { qty: 100, label: '100', discount: 0 },
                    { qty: 250, label: '250', discount: 6 },
                    { qty: 500, label: '500', discount: 12 },
                    { qty: 1000, label: '1,000', discount: 20 },
                    { qty: 2500, label: '2,500', discount: 25 },
                    { qty: 5000, label: '5,000', discount: 35 },
                  ].map((tier) => (
                    <button
                      key={tier.qty}
                      type="button"
                      onClick={() => setQuantity(tier.qty)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all cursor-pointer ${
                        quantity === tier.qty
                          ? 'border-[#D4AF65] bg-[#D4AF65] text-[#101D35] font-black shadow-xs ring-1 ring-[#D4AF65]'
                          : 'border-[#203357] bg-[#101D35] text-[#B0BECE] hover:border-[#D4AF65] hover:text-[#F5F2EB] font-semibold shadow-2xs'
                      }`}
                    >
                      <span className="text-xs">{tier.label}</span>
                      {tier.discount > 0 && (
                        <span className={`text-[10px] font-bold ${quantity === tier.qty ? 'text-[#101D35]/80' : 'text-emerald-600'}`}>-{tier.discount}%</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Estimate Summary */}
              <div className="rounded-2xl border border-border/80 bg-surface/90 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                      Turnaround
                    </span>
                    <p className="text-sm font-bold text-primary">
                      Same-Day / 24h Express
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                      Pre-Press QC
                    </span>
                    <p className="text-xs font-bold text-emerald-600">
                      Included Free
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Selected Quantity
                    </span>
                    <p className="text-[11px] text-secondary">
                      {quantity} units • Free digital proof included
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-lg font-black text-[#D4AF65]">
                      Instant Quote
                    </span>
                  </div>
                </div>
              </div>


              {/* High-Converting Multi-Channel Conversion CTAs */}
              <div className="mt-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={getServiceWhatsAppUrl(product.category?.slug || product.slug, {
                      productName: product.name,
                      slug: product.slug,
                      pageUrl: `https://www.0nprint.com/products/${product.slug}`,
                      customerName: customerName.trim() || undefined,
                      quantity,
                      size: size?.label,
                      material: material?.label,
                      finish: finish?.label,
                      deliveryLocation: deliveryLocation.trim() || undefined,
                      notes: notes.trim() || undefined,
                      intent: 'price',
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackWhatsAppClick({
                        source_page: `/products/${product.slug}`,
                        product_name: product.name,
                        service_name: product.category?.name || product.name,
                        button_location: 'product_detail_get_price',
                        product_id: product.slug || product._id,
                        label: `product_get_price_${product.slug}`,
                      })
                      trackProductInquiry({
                        source_page: `/products/${product.slug}`,
                        product_name: product.name,
                        service_name: product.category?.name,
                        button_location: 'product_detail_get_price',
                      })
                      trackProductInquiryClick({
                        source_page: `/products/${product.slug}`,
                        product_name: product.name,
                        category_name: product.category?.name,
                        button_location: 'product_detail_get_price',
                        label: `product_inquiry_price_${product.slug}`,
                      })
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-5 py-3.5 text-xs sm:text-sm font-black text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 cursor-pointer w-full"
                  >
                    <WhatsAppIcon className="h-4.5 w-4.5 fill-white shrink-0" />
                    <span>{getProductInquiryButtonLabel(product.category?.slug || product.slug)}</span>
                  </a>

                  <a
                    href={getServiceWhatsAppUrl(product.category?.slug || product.slug, {
                      productName: product.name,
                      slug: product.slug,
                      pageUrl: `https://www.0nprint.com/products/${product.slug}`,
                      customerName: customerName.trim() || undefined,
                      quantity,
                      size: size?.label,
                      material: material?.label,
                      finish: finish?.label,
                      deliveryLocation: deliveryLocation.trim() || undefined,
                      notes: notes.trim() || undefined,
                      intent: 'order',
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackWhatsAppClick({
                        source_page: `/products/${product.slug}`,
                        product_name: product.name,
                        service_name: product.category?.name || product.name,
                        button_location: 'product_detail_order_whatsapp',
                        product_id: product.slug || product._id,
                        label: `product_order_whatsapp_${product.slug}`,
                      })
                      trackProductInquiry({
                        source_page: `/products/${product.slug}`,
                        product_name: product.name,
                        service_name: product.category?.name,
                        button_location: 'product_detail_order_whatsapp',
                      })
                      trackProductInquiryClick({
                        source_page: `/products/${product.slug}`,
                        product_name: product.name,
                        category_name: product.category?.name,
                        button_location: 'product_detail_order_whatsapp',
                        label: `product_inquiry_order_${product.slug}`,
                      })
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white px-5 py-3.5 text-xs sm:text-sm font-black transition-all hover:-translate-y-0.5 cursor-pointer w-full"
                  >
                    <WhatsAppIcon className="h-4.5 w-4.5 fill-current shrink-0" />
                    <span>Discuss Your Printing Requirements</span>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button onClick={handleRequestQuote} variant="accent" size="lg" className="w-full justify-center sm:flex-1 font-bold">
                    Request Official Quote Form
                  </Button>

                  <Button
                    to="/contact"
                    variant="secondary"
                    size="lg"
                    className="w-full justify-center sm:w-auto"
                    onClick={() =>
                      trackProductInquiry({
                        source_page: `/products/${product.slug}`,
                        product_name: product.name,
                        button_location: 'product_detail_contact_studio',
                      })
                    }
                  >
                    Contact Studio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Gallery Showcase */}
        {enrichedCategories.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
              <Layers className="h-4 w-4" />
              <span>Category Applications &amp; Contexts</span>
            </div>
            <h2 className="font-display text-2xl font-black tracking-tight text-primary mb-2">
              Available in {enrichedCategories.length} Print Categories
            </h2>
            <p className="text-sm text-secondary mb-8 max-w-2xl">
              Explore how {product.name} is crafted and applied across different print disciplines, each captured in three dedicated views — hero presentation, close-up finish detail, and real-world office usage.
            </p>

            {/* Category Tab Switcher */}
            <div className="flex flex-wrap gap-2 mb-8">
              {enrichedCategories.map((cat, idx) => (
                <button
                  key={cat.slug || idx}
                  type="button"
                  onClick={() => { setActiveCategoryTab(idx); setCategoryLightbox(null) }}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategoryTab === idx
                      ? 'border-[#D4AF65] bg-[#D4AF65] text-[#101D35] shadow-xs'
                      : 'border-border bg-surface text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat.name}
                  {cat.images?.length > 0 && (
                    <span className={`ml-2 inline-flex items-center justify-center h-4 min-w-[1rem] rounded-full px-1 text-[10px] ${
                      activeCategoryTab === idx ? 'bg-white/20' : 'bg-black/5'
                    }`}>
                      {cat.images.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Active Category Image Grid */}
            {enrichedCategories[activeCategoryTab] && (
              <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-primary">
                      {enrichedCategories[activeCategoryTab]?.name}
                    </h3>
                    <p className="text-xs text-secondary mt-1">
                      {['Hero Front Presentation', 'Macro Finish &amp; Texture Detail', 'Lifestyle Office Usage'][0]} — {['Hero Front Presentation', 'Macro Finish &amp; Texture Detail', 'Lifestyle Office Usage'][1]} — {['Hero Front Presentation', 'Macro Finish &amp; Texture Detail', 'Lifestyle Office Usage'][2]}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {['Hero Shot', 'Detail Close-up', 'Lifestyle Usage'].map((label, imgIdx) => {
                    const cat = enrichedCategories[activeCategoryTab]
                    const imgUrl = cat?.images?.[imgIdx]
                    if (!imgUrl) return null
                    return (
                      <button
                        key={imgIdx}
                        type="button"
                        onClick={() => setCategoryLightbox({ cat, imgIdx, label })}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-accent-soft/30 transition-all hover:shadow-xl cursor-pointer card-hover-lift hover-shimmer"
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.name} — ${cat.name} — ${label}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">{label}</p>
                            <p className="text-xs font-bold text-white mt-0.5">{cat.name}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#D4AF65] shadow-xs">
                            <ZoomIn className="h-3 w-3" />
                            View
                          </span>
                        </div>
                        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[#D4AF65]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                          {imgIdx === 0 ? '01 / Hero' : imgIdx === 1 ? '02 / Detail' : '03 / Usage'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category Image Lightbox */}
        {categoryLightbox && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8 backdrop-blur-sm"
            onClick={() => setCategoryLightbox(null)}
          >
            <div
              className="relative w-full max-w-5xl rounded-3xl bg-surface p-4 sm:p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setCategoryLightbox(null)}
                className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF65] text-white shadow-lg hover:bg-[#D4AF65] transition-colors cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-accent-soft/30">
                    <img
                      src={categoryLightbox.cat?.images?.[categoryLightbox.imgIdx]}
                      alt={`${product.name} — ${categoryLightbox.cat?.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-accent">
                    {categoryLightbox.label}
                  </p>
                  <h3 className="font-display text-2xl font-black text-primary mt-2">
                    {categoryLightbox.cat?.name}
                  </h3>
                  <p className="text-sm text-secondary mt-4 leading-relaxed">
                    {categoryLightbox.imgIdx === 0 && `Hero studio presentation of ${product.name} crafted for the ${categoryLightbox.cat?.name} division. Shot eye-level on a clean seamless backdrop with premium soft-box studio lighting to showcase print quality and material finish.`}
                    {categoryLightbox.imgIdx === 1 && `Macro close-up detail revealing the texture, coating, and ink fidelity of ${product.name} within the ${categoryLightbox.cat?.name} line. Every fibre, laminate surface, and emboss is rendered in crisp 4K detail for print quality inspection.`}
                    {categoryLightbox.imgIdx === 2 && `Lifestyle composition capturing ${product.name} in a modern Dubai corporate office. Natural window light illuminates how the finished piece performs in real-world brand presentation and client-facing scenarios.`}
                  </p>
                  <div className="mt-8 flex gap-3">
                    {categoryLightbox.cat?.images?.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCategoryLightbox({ ...categoryLightbox, imgIdx: i })}
                        className={`aspect-square w-16 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                          categoryLightbox.imgIdx === i
                            ? 'border-[#D4AF65] ring-2 ring-[#D4AF65]/30 scale-105'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <img
                          src={categoryLightbox.cat?.images?.[i]}
                          alt={`Thumbnail ${i + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Structured Technical Specifications Table + GEO Answer Block */}
        <div className="mt-16 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF65] mb-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Engineering &amp; Production Standards</span>
          </div>
          <h2 className="font-display text-2xl font-black tracking-tight text-primary mb-2">
            {product.name} — Technical Specifications &amp; Commercial Standards
          </h2>
          <p className="text-sm text-secondary mb-6 leading-relaxed">
            <strong>Who uses this product:</strong> {categorySpecProfile.whoNeedsIt}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary w-1/3 sm:w-1/4">Print &amp; Production Technology</td>
                  <td className="py-3.5 text-secondary">{categorySpecProfile.printTech}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">Color &amp; Alignment Calibration</td>
                  <td className="py-3.5 text-secondary">ISO 12647-2 Certified CMYK with Solid Pantone Spot Color Matching &amp; Vector Precision</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">Substrates &amp; Materials Available</td>
                  <td className="py-3.5 text-secondary">{categorySpecProfile.substratesText}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">Signature Finishes &amp; Options</td>
                  <td className="py-3.5 text-secondary">{categorySpecProfile.embellishmentsText}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">Minimum Order Quantity (MOQ)</td>
                  <td className="py-3.5 text-secondary">{product.minimumQuantity || 1} {product.unit || 'units'} (Bulk corporate volume discounts available)</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">Artwork Pre-Flight Check</td>
                  <td className="py-3.5 text-secondary">Complimentary 300 DPI vector audit, bleed margin verification, and digital proof before production</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">Turnaround &amp; UAE Delivery</td>
                  <td className="py-3.5 text-secondary">Express Al Quoz, Dubai production with insured courier delivery across Dubai, Abu Dhabi, Sharjah &amp; all UAE Emirates</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3-Step Ordering Guide + Contextual Internal Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-6">
            <div className="rounded-2xl border border-border bg-white/[0.02] p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent">Step 1 · Select Specs</span>
              <p className="mt-1 text-xs text-secondary leading-relaxed">
                Choose your preferred size, substrate, finish, and quantity above or request custom dimensions.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white/[0.02] p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent">Step 2 · Share Artwork</span>
              <p className="mt-1 text-xs text-secondary leading-relaxed">
                Send your logo or print-ready PDF/AI file via WhatsApp (+44 7344 546056) or upload on our quotation page.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white/[0.02] p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent">Step 3 · Proof &amp; Dispatch</span>
              <p className="mt-1 text-xs text-secondary leading-relaxed">
                Approve your digital proof and receive fast doorstep delivery across Dubai and all 7 UAE Emirates.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="text-secondary">Helpful Links:</span>
            {product.category?.slug && (
              <Link to={`/categories/${product.category.slug}`} className="text-accent hover:underline">
                Explore All {product.category.name} →
              </Link>
            )}
            <Link to={`/get-a-quote?product=${encodeURIComponent(product.name)}`} className="text-accent hover:underline">
              Online Quotation Form →
            </Link>
            <Link to="/blog" className="text-accent hover:underline">
              UAE Printing Buying Guides →
            </Link>
          </div>
        </div>

        {/* Customer Reviews & Ratings with Schema.org AggregateRating */}
        <ProductReviewsSection product={product} categorySlug={product.category?.slug} />

        {/* Product FAQs */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>Product Questions &amp; Specifications</span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-primary">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6 divide-y divide-border/60">
            {productFaqs.map((faq, index) => (
              <div key={index} className={index > 0 ? 'pt-6' : ''}>
                <h3 className="font-display text-base font-bold text-primary">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Printing Products & Internal Links */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Related Print Disciplines</span>
                <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-primary">
                  Complementary Printing Solutions
                </h2>
              </div>
              {product.category?.slug && (
                <Link
                  to={`/categories/${product.category.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
                >
                  <span>Explore all {product.category.name}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProd, idx) => (
                <ProductCard key={relProd._id || relProd.slug} product={relProd} index={idx} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
